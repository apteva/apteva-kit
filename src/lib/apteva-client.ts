export interface AptevaClientConfig {
  apiUrl?: string;
  apiKey?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatRequest {
  agent_id: string;
  message: string | Array<{
    type: 'text' | 'image' | 'document';
    text?: string;
    source?: {
      type: 'base64';
      media_type: string;
      data: string;
    };
  }>;
  thread_id?: string;
  stream?: boolean;
  system?: string;
}

export interface ChatResponse {
  message: string;
  thread_id: string;
  widgets?: any[];
}

export interface StreamChunk {
  type: 'start' | 'thread_id' | 'request_id' | 'content' | 'token' | 'tool_call' | 'tool_input_delta' | 'tool_use' | 'tool_result' | 'tool_stream' | 'stop' | 'widget' | 'complete' | 'done' | 'error';
  content?: string;
  widget?: any;
  thread_id?: string;
  request_id?: string;
  tool_id?: string;
  tool_name?: string;
  tool_display_name?: string;
  error?: string;
  message?: string;
  event?: 'chunk' | 'log' | 'progress'; // For tool_stream events
  progress?: number; // For tool_stream progress events
}

class AptevaClient {
  private config: AptevaClientConfig;

  constructor(config?: AptevaClientConfig) {
    this.config = {
      apiUrl: config?.apiUrl || '',
      apiKey: config?.apiKey || '',
    };
  }

  /**
   * Update client configuration (optional - users can override defaults)
   */
  configure(config: AptevaClientConfig) {
    if (config.apiUrl) this.config.apiUrl = config.apiUrl;
    if (config.apiKey) this.config.apiKey = config.apiKey;
  }

  /**
   * Get current configuration
   */
  getConfig(): AptevaClientConfig {
    return { ...this.config };
  }

  /**
   * Send a chat message to an agent
   */
  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      console.log('[AptevaClient] Chat request:', {
        agent_id: request.agent_id,
        message: typeof request.message === 'string' ? request.message.substring(0, 100) + '...' : '[multi-part message]',
        system: request.system,
        stream: request.stream,
      });

      const response = await fetch(`${this.config.apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.config.apiKey,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `Request failed with status ${response.status}`);
      }

      const data = await response.json();

      // Map API response format to expected format
      // API returns: { response, thread_id, success, model, trace_id }
      // We expect: { message, thread_id, widgets }
      return {
        message: data.response || data.message || '',
        thread_id: data.thread_id,
        widgets: data.widgets,
      };
    } catch (error) {
      console.error('Chat API error:', error);
      throw error;
    }
  }

  /**
   * Send a chat message with streaming response
   */
  async chatStream(
    request: ChatRequest,
    onChunk: (chunk: StreamChunk) => void,
    onComplete?: (threadId: string) => void,
    onError?: (error: Error) => void
  ): Promise<void> {
    try {
      console.log('[AptevaClient] Chat stream request:', {
        agent_id: request.agent_id,
        message: typeof request.message === 'string' ? request.message.substring(0, 100) + '...' : '[multi-part message]',
        system: request.system,
        stream: request.stream,
      });

      const response = await fetch(`${this.config.apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.config.apiKey,
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
          ...request,
          stream: true,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `Request failed with status ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let threadId = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim() || line.startsWith(':')) continue;

          if (line.startsWith('data: ')) {
            const data = line.slice(6);

            if (data === '[DONE]') {
              onComplete?.(threadId);
              return;
            }

            try {
              const chunk = JSON.parse(data);

              // Store thread_id if present in chunk
              if (chunk.thread_id) {
                threadId = chunk.thread_id;
              }

              // Pass through ALL chunk types to the handler
              onChunk(chunk);

            } catch (e) {
              console.warn('[AptevaClient] Failed to parse SSE data:', data);
            }
          }
        }
      }

      onComplete?.(threadId);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      onError?.(err);
      throw err;
    }
  }

  /**
   * Create a new thread
   */
  async createThread(agentId: string, metadata?: Record<string, any>): Promise<string> {
    const response = await fetch(`${this.config.apiUrl}/agents/${agentId}/threads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.config.apiKey,
      },
      body: JSON.stringify({ metadata }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `Request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.thread_id;
  }

  /**
   * Get thread messages
   */
  async getThreadMessages(threadId: string): Promise<ChatMessage[]> {
    const response = await fetch(`${this.config.apiUrl}/threads/${threadId}/messages`, {
      method: 'GET',
      headers: {
        'X-API-Key': this.config.apiKey,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `Request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.messages;
  }

  /**
   * Cancel an in-progress request
   */
  async cancelRequest(agentId: string, requestId: string): Promise<void> {
    try {
      const response = await fetch(`${this.config.apiUrl}/agents/${agentId}/requests/${requestId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.config.apiKey,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Cancel request failed' }));
        throw new Error(error.error || `Cancel request failed with status ${response.status}`);
      }
    } catch (error) {
      console.error('[AptevaClient] Cancel request error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const aptevaClient = new AptevaClient();

// Export class for custom instances
export { AptevaClient };
