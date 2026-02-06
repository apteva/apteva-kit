# Streaming & Chat API

How apteva-kit calls the chat API, processes stream chunks, builds messages with tool calls, and continues threads.

## Table of Contents

- [Chat API Request](#chat-api-request)
- [Stream Transport](#stream-transport)
- [Chunk Types](#chunk-types)
- [Building Messages from Chunks](#building-messages-from-chunks)
- [Tool Call Lifecycle](#tool-call-lifecycle)
- [Thread Continuation](#thread-continuation)
- [Using the `<Chat>` Component](#using-the-chat-component)
- [Using `aptevaClient` Directly](#using-aptevaclient-directly)
- [Content Segments Model](#content-segments-model)

---

## Chat API Request

All chat requests go through `aptevaClient.chatStream()` (or `aptevaClient.chat()` for non-streaming). The endpoint is `POST {apiUrl}/chat`.

### Request body (`ChatRequest`)

```typescript
{
  agent_id: string;          // Which agent to talk to
  message: string | Array<{  // Text or multimodal (text + images/documents)
    type: 'text' | 'image' | 'document';
    text?: string;
    source?: { type: 'base64'; media_type: string; data: string };
  }>;
  thread_id?: string;        // Omit for new conversation, include to continue
  stream?: boolean;          // true for SSE streaming
  system?: string;           // System prompt / context injection
}
```

### Request headers

```
Content-Type: application/json
Accept: text/event-stream        (for streaming)
X-API-Key: <your-api-key>
```

---

## Stream Transport

The API returns an **SSE (Server-Sent Events)** stream. Each line is prefixed with `data: ` followed by a JSON object. The stream ends with `data: [DONE]`.

```
data: {"type":"thread_id","thread_id":"thr_abc123"}
data: {"type":"content","content":"Hello"}
data: {"type":"content","content":" there!"}
data: {"type":"tool_call","tool_id":"tool_1","tool_name":"web_search","tool_display_name":"Web Search"}
data: {"type":"tool_input_delta","tool_id":"tool_1","content":"{\"query\":\"wea"}
data: {"type":"tool_input_delta","tool_id":"tool_1","content":"ther today\"}"}
data: {"type":"tool_use","tool_id":"tool_1"}
data: {"type":"tool_stream","tool_id":"tool_1","event":"chunk","content":"Searching..."}
data: {"type":"tool_result","tool_id":"tool_1","content":"72F and sunny"}
data: {"type":"content","content":"The weather is 72F and sunny."}
data: [DONE]
```

### Parsing logic (`apteva-client.ts`)

```
HTTP Response → ReadableStream → TextDecoder →
Line buffer (split on \n, keep incomplete last line) →
Strip "data: " prefix → JSON.parse → onChunk callback
```

The line-buffering handles chunks that split across network packets — the last incomplete line is kept in a buffer and prepended to the next chunk.

---

## Chunk Types

Every chunk has a `type` field. Here is the complete set:

| Type | Fields | Description |
|------|--------|-------------|
| `thread_id` | `thread_id` | Thread ID for this conversation (sent early) |
| `request_id` | `request_id` | Unique request ID (used for cancellation) |
| `content` | `content` | Text token from the assistant |
| `token` | `content` | Alias for `content` (legacy) |
| `tool_call` | `tool_id`, `tool_name`, `tool_display_name?` | A tool call is starting |
| `tool_input_delta` | `tool_id`, `content` | Streamed fragment of the tool's input JSON |
| `tool_use` | `tool_id` | Tool input is complete, execution is starting |
| `tool_stream` | `tool_id`, `event`, `content?`, `progress?` | Live output from tool execution (`event`: `chunk`, `log`, or `progress`) |
| `tool_result` | `tool_id`, `content` | Tool execution finished, here's the result |
| `widget` | `widget` | A structured widget object to render |
| `start` | — | Stream started |
| `stop` | — | Model stopped generating |
| `complete` | — | Stream fully complete |
| `done` | — | Alias for complete |
| `error` | `message`, `error?` | An error occurred |

### `StreamChunk` type definition

```typescript
interface StreamChunk {
  type: 'start' | 'thread_id' | 'request_id' | 'content' | 'token'
      | 'tool_call' | 'tool_input_delta' | 'tool_use' | 'tool_result'
      | 'tool_stream' | 'stop' | 'widget' | 'complete' | 'done' | 'error';
  content?: string;
  widget?: any;
  thread_id?: string;
  request_id?: string;
  tool_id?: string;
  tool_name?: string;
  tool_display_name?: string;
  error?: string;
  message?: string;
  event?: 'chunk' | 'log' | 'progress';
  progress?: number;
}
```

---

## Building Messages from Chunks

The `<Chat>` component accumulates stream chunks into a single assistant `Message` that updates in real-time. Here's how each chunk type maps to message state:

### Text accumulation

```
chunk.type === 'content' or 'token'
  → append chunk.content to currentTextBuffer
  → update message.content = currentTextBuffer
```

### Tool call tracking (content segments)

The Chat component uses a **content segments** array to interleave text and tool calls in order:

```typescript
type ContentSegment =
  | { type: 'text'; content: string }
  | { type: 'tool'; id: string; name: string; status: 'preparing' | 'running' | 'completed' | 'error';
      isReceiving?: boolean; inputLength?: number; result?: any; streamOutput?: string };
```

When a `tool_call` chunk arrives, any buffered text is pushed as a text segment, then a new tool segment is added. When text resumes after a tool result, it starts a new text segment. This preserves the interleaved order:

```
[text] → [tool: web_search] → [text] → [tool: calculator] → [text]
```

### Message metadata

The streaming message carries metadata for the UI:

```typescript
message.metadata = {
  content_segments: ContentSegment[];  // Ordered text + tool segments
  isStreaming: boolean;                // true while stream is active
  thread_id?: string;                  // Thread ID from the stream
}
```

When the stream completes (`onComplete` callback), `isStreaming` is set to `false`.

---

## Tool Call Lifecycle

A tool call goes through these stages, each triggered by a specific chunk type:

```
tool_call          → segment created, status: 'preparing'
tool_input_delta   → input JSON streaming in, isReceiving: true
tool_use           → input complete, status: 'running'
tool_stream        → live execution output (optional, streamed in chunks)
tool_result        → execution done, status: 'completed', result stored
```

### Visual states

| Status | What the user sees |
|--------|-------------------|
| `preparing` | Tool name shown, input being received (pulsing indicator) |
| `running` | Tool is executing (spinner), may show `streamOutput` |
| `completed` | Tool finished, result available |
| `error` | Tool failed |

### `tool_stream` subevents

Tool stream chunks have an `event` field:

- **`chunk`** — Append `content` to `streamOutput` (live execution output)
- **`log`** / **`progress`** — Mark the current output for reset on the next `chunk` (shows fresh output for each phase)

---

## Thread Continuation

Threads allow multi-turn conversations. The thread ID is the key to continuing a conversation.

### How threads work

1. **First message (no thread):** Omit `thread_id` from the request. The server creates a new thread and sends it back as a `thread_id` chunk early in the stream.

2. **Subsequent messages (continue thread):** Include `thread_id` in the request. The server loads the conversation history and continues from where it left off.

### Extracting the thread ID from the stream

The `thread_id` chunk arrives near the start of the stream:

```typescript
// In your onChunk handler:
case 'thread_id':
  if (chunk.thread_id) {
    savedThreadId = chunk.thread_id;
  }
  break;
```

The `onComplete` callback also receives the thread ID:

```typescript
await aptevaClient.chatStream(
  request,
  onChunk,
  (threadId) => {
    // threadId is available here — save it for the next message
    savedThreadId = threadId;
  }
);
```

### Continuing a thread

Pass the saved thread ID in subsequent requests:

```typescript
await aptevaClient.chatStream({
  agent_id: 'my-agent',
  message: 'Follow-up question',
  thread_id: savedThreadId,  // <-- continues the conversation
  stream: true,
});
```

### Loading thread history

To show previous messages when resuming a thread:

```typescript
const messages = await aptevaClient.getThreadMessages(threadId);
// Returns ChatMessage[] with role and content
```

### Thread continuation in the `<Chat>` component

The `<Chat>` component handles this automatically:

1. On first message, it sends without `thread_id`
2. It captures the `thread_id` chunk and stores it in state
3. All subsequent messages include the stored `thread_id`
4. When the thread changes, `onThreadChange` fires with the new ID

```tsx
<Chat
  agentId="my-agent"
  threadId={existingThreadId}       // Pass to resume an existing thread
  onThreadChange={(id) => {         // Called when thread ID is assigned/changed
    saveThreadId(id);
  }}
/>
```

---

## Using the `<Chat>` Component

The simplest way to use streaming — everything is handled internally:

```tsx
import { Chat } from '@apteva/apteva-kit';
import '@apteva/apteva-kit/dist/styles.css';

function MyApp() {
  return (
    <Chat
      agentId="my-agent"
      apiUrl="https://api.example.com"
      apiKey="your-key"
      onThreadChange={(threadId) => console.log('Thread:', threadId)}
      onToolCall={(name, id) => console.log('Tool started:', name)}
      onToolResult={(name, result) => console.log('Tool done:', name)}
      onError={(err) => console.error(err)}
    />
  );
}
```

### Programmatic control via ref

```tsx
const chatRef = useRef<ChatHandle>(null);

// Send a message as if the user typed it
await chatRef.current?.sendMessage('Hello');

// Send a background message (not shown as user message)
await chatRef.current?.sendSystemMessage('Summarize the above');

<Chat ref={chatRef} agentId="my-agent" apiUrl="..." apiKey="..." />
```

---

## Using `aptevaClient` Directly

For full control over stream processing without the `<Chat>` component:

```typescript
import { aptevaClient } from '@apteva/apteva-kit';

// Configure once
aptevaClient.configure({
  apiUrl: 'https://api.example.com',
  apiKey: 'your-key',
});

// Track state
let fullText = '';
let threadId: string | null = null;
let tools: Array<{ id: string; name: string; result?: any }> = [];

await aptevaClient.chatStream(
  {
    agent_id: 'my-agent',
    message: 'What is the weather?',
    stream: true,
    // thread_id: threadId,  // Uncomment to continue a thread
  },
  // onChunk — called for every SSE event
  (chunk) => {
    switch (chunk.type) {
      case 'thread_id':
        threadId = chunk.thread_id!;
        break;
      case 'content':
      case 'token':
        fullText += chunk.content || '';
        // Update your UI with fullText
        break;
      case 'tool_call':
        tools.push({ id: chunk.tool_id!, name: chunk.tool_display_name || chunk.tool_name! });
        break;
      case 'tool_result':
        const tool = tools.find(t => t.id === chunk.tool_id);
        if (tool) tool.result = chunk.content;
        break;
      case 'error':
        console.error('Stream error:', chunk.message);
        break;
    }
  },
  // onComplete — stream finished
  (completedThreadId) => {
    console.log('Done. Thread:', completedThreadId);
    console.log('Full response:', fullText);
    console.log('Tools used:', tools);
    // Save threadId for next message
  },
  // onError — connection/parse error
  (error) => {
    console.error('Failed:', error);
  }
);
```

---

## Content Segments Model

The `<Chat>` component represents a streaming message as an ordered array of **content segments**. This is how text and tool calls are interleaved and rendered in order.

### Example: message with two tool calls

Given this stream sequence:
```
content "Let me check..." → tool_call(web_search) → tool_result → content "Based on..." → tool_call(calculator) → tool_result → content "The answer is 42."
```

The resulting `content_segments` array:
```typescript
[
  { type: 'text', content: 'Let me check...' },
  { type: 'tool', id: 'tool_1', name: 'Web Search', status: 'completed', result: '...' },
  { type: 'text', content: 'Based on...' },
  { type: 'tool', id: 'tool_2', name: 'Calculator', status: 'completed', result: '42' },
  { type: 'text', content: 'The answer is 42.' },
]
```

This array is stored in `message.metadata.content_segments` and used by the `<Message>` and `<ToolCall>` components to render the interleaved content.

---

## Source Files

| File | Purpose |
|------|---------|
| `src/lib/apteva-client.ts` | API client, SSE parsing, `chatStream()` / `chat()` |
| `src/components/Chat/Chat.tsx` | Full chat component with stream → message assembly |
| `src/components/Stream/Stream.tsx` | Simple single-prompt streaming component |
| `src/types/components.ts` | Props for Chat, Stream, Command |
| `src/types/messages.ts` | Message, Thread types |
