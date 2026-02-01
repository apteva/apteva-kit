# Apteva-Kit

AI-powered component library for React. Build conversational interfaces with specialized components for different AI interaction patterns.

## 🚀 Quick Start

### Run the Example App (Port 3060)

```bash
cd example
npm install
npm run dev
```

Then visit [http://localhost:3060](http://localhost:3060)

### Installation

```bash
npm install @apteva/apteva-kit
# or
yarn add @apteva/apteva-kit
# or
bun add @apteva/apteva-kit
```

### Required: Import Styles

Add this import to your app's root layout or entry point:

```tsx
import '@apteva/apteva-kit/styles.css';
```

For Next.js, add it to `app/layout.tsx`:
```tsx
import '@apteva/apteva-kit/styles.css';
import './globals.css'; // your app's styles
```

## Components

### `<Chat>` - Full Chat Interface
Complete chat experience with message history, streaming, and widgets.

```tsx
import { Chat } from '@apteva/apteva-kit';

<Chat
  agentId="agent_support"
  headerTitle="Customer Support"
  onAction={(action) => {
    console.log('Action:', action);
  }}
/>
```

### `<Command>` - Single Command Execution
Execute a command, show loading, display result.

```tsx
import { Command } from '@apteva/apteva-kit';

<Command
  agentId="agent_analyst"
  command="Analyze Q4 sales data"
  autoExecute
  onComplete={(result) => {
    console.log('Result:', result);
  }}
/>
```

### `<Prompt>` - Inline AI Input
Single input field with AI completion.

```tsx
import { Prompt } from '@apteva/apteva-kit';

<Prompt
  agentId="agent_writer"
  placeholder="Describe your product..."
  onResult={(text) => {
    setDescription(text);
  }}
/>
```

### `<Stream>` - Streaming Text Display
Display streaming AI text without input UI.

```tsx
import { Stream } from '@apteva/apteva-kit';

<Stream
  agentId="agent_narrator"
  prompt="Describe this dashboard"
  autoStart
  showCursor
/>
```

### `<Widgets>` - Widget Renderer
Render AI-generated interactive widgets.

```tsx
import { Widgets } from '@apteva/apteva-kit';

<Widgets
  widgets={aiGeneratedWidgets}
  layout="grid"
  columns={3}
  onAction={(action) => {
    console.log('Widget action:', action);
  }}
/>
```

### `<Threads>` - Thread Management
Manage conversation threads.

```tsx
import { Threads } from '@apteva/apteva-kit';

<Threads
  threads={conversations}
  currentThreadId={activeThread}
  onThreadSelect={setActiveThread}
  variant="sidebar"
  showSearch
/>
```

## Features

- **Mock Data Built-in** - All components work with mock data out of the box
- **TypeScript Native** - Full type safety and autocompletion
- **Tailwind CSS** - Styled with Tailwind v4
- **Customizable** - Theme and style everything
- **Widget System** - Rich interactive widgets (cards, lists, forms, charts, maps)
- **Action Handling** - Client-side and server-side actions

## Development

```bash
# Install dependencies
npm install

# Build package
npm run build

# Watch mode
npm run dev

# Type check
npm run type-check
```

## Configuration

Before using the components with a live API, configure the client:

```tsx
import { aptevaClient } from '@apteva/apteva-kit';

aptevaClient.configure({
  apiUrl: 'https://your-api-url.com/agents',
  apiKey: 'your-api-key'
});
```

All components also support a `useMock` prop for development without an API.

## License

This project is licensed under the [Apteva Source Available License](LICENSE).

You are free to use this software in your applications, but modification and redistribution of the source code is not permitted. See the [LICENSE](LICENSE) file for details.
