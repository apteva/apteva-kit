import { useState, useEffect, useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import { ChatProps, CommandResult } from '../../types/components';
import { Message as MessageType } from '../../types/messages';
import { MessageList } from './MessageList';
import { Composer } from './Composer';
import { CommandComposer } from './CommandComposer';
import { cn, generateMockResponse, generateMockCommandStream, buildMessageWithAttachments, ContentBlock, generateWidgetContext, generateCompactWidgetContext } from '../../utils';
import { aptevaClient } from '../../lib/apteva-client';
import { Widget } from '../../types/widgets';
import { WidgetRenderer } from '../Widgets/WidgetRenderer';
import { MarkdownContent } from './MarkdownContent';

export interface ChatHandle {
  /** Send a message programmatically (as if the user typed it) */
  sendMessage: (text: string) => Promise<void>;
  /** Send a system/background message (not shown as user message, just triggers agent) */
  sendSystemMessage: (text: string) => Promise<void>;
  /** Get current messages */
  getMessages: () => MessageType[];
  /** Clear all messages */
  clearMessages: () => void;
}

export const Chat = forwardRef<ChatHandle, ChatProps>(function Chat({
  agentId,
  threadId,
  initialMessages = [],
  context,
  apiUrl,
  apiKey,
  useMock = false,
  // Mode switching
  initialMode = 'chat',
  showModeToggle = false,
  onModeChange,
  // Command mode options
  commandVariant = 'default',
  planMode = false,
  onPlanModeChange,
  enableStreaming = true,
  showProgress = true,
  loadingText = 'Processing...',
  // Welcome screen
  welcomeTitle,
  welcomeSubtitle,
  welcomeIcon,
  suggestedPrompts,
  welcomeVariant,
  // Events
  onThreadChange,
  onMessageSent,
  onAction,
  onFileUpload,
  onComplete,
  onError,
  onToolCall,
  onToolResult,
  // UI
  variant = 'default',
  placeholder,
  showHeader = true,
  headerTitle = 'Chat',

  // Widget detection
  enableWidgets = false,
  availableWidgets,
  compactWidgetContext = false,
  onWidgetRender,

  className,
}: ChatProps, ref: React.ForwardedRef<ChatHandle>) {
  const [messages, setMessages] = useState<MessageType[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(threadId || null);
  const [mode, setMode] = useState<'chat' | 'command'>(initialMode);
  const [chatToolName, setChatToolName] = useState<string | null>(null); // Track tool name for chat mode header

  // Command mode state
  const [commandState, setCommandState] = useState<'idle' | 'loading' | 'success' | 'error' | 'plan-pending'>('idle');
  const [commandResult, setCommandResult] = useState<CommandResult | null>(null);
  const [commandError, setCommandError] = useState<Error | null>(null);
  const [progress, setProgress] = useState(0);
  const [commandInput, setCommandInput] = useState('');
  const [streamedContent, setStreamedContent] = useState('');
  const [currentToolName, setCurrentToolName] = useState<string | null>(null);
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);
  const [plan, setPlan] = useState<string>('');
  const [pendingCommand, setPendingCommand] = useState<string>('');
  const [internalPlanMode, setInternalPlanMode] = useState(planMode);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Store handleSendMessage ref so we can call it from useImperativeHandle
  const handleSendMessageRef = useRef<((text: string, files?: File[], isSystem?: boolean) => Promise<void>) | null>(null);

  // Expose imperative methods via ref
  useImperativeHandle(ref, () => ({
    sendMessage: async (text: string) => {
      if (handleSendMessageRef.current) {
        await handleSendMessageRef.current(text);
      }
    },
    sendSystemMessage: async (text: string) => {
      if (handleSendMessageRef.current) {
        await handleSendMessageRef.current(text, undefined, true);
      }
    },
    getMessages: () => messages,
    clearMessages: () => setMessages([]),
  }), [messages]);

  // Generate effective context with widget definitions if enabled
  const effectiveContext = useMemo(() => {
    if (!enableWidgets) return context;
    const widgetContext = compactWidgetContext
      ? generateCompactWidgetContext(availableWidgets)
      : generateWidgetContext(availableWidgets);
    return context ? `${context}\n${widgetContext}` : widgetContext;
  }, [context, enableWidgets, availableWidgets, compactWidgetContext]);

  // Configure API client if props provided
  useEffect(() => {
    if (apiUrl || apiKey) {
      aptevaClient.configure({
        ...(apiUrl && { apiUrl }),
        ...(apiKey && { apiKey }),
      });
    }
  }, [apiUrl, apiKey]);

  useEffect(() => {
    if (threadId) {
      onThreadChange?.(threadId);
    }
  }, [threadId, onThreadChange]);

  // Sync internal plan mode with prop
  useEffect(() => {
    setInternalPlanMode(planMode);
  }, [planMode]);

  // Close settings menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showSettingsMenu && !target.closest('.settings-menu-container')) {
        setShowSettingsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSettingsMenu]);

  const handleModeChange = (newMode: 'chat' | 'command') => {
    setMode(newMode);
    onModeChange?.(newMode);
    // Reset command state when switching modes
    if (newMode === 'command') {
      setCommandState('idle');
      setCommandResult(null);
      setCommandError(null);
    }
  };

  const defaultPlaceholder = mode === 'chat' ? 'Type a message...' : 'Enter your command...';

  // ==================== CHAT MODE LOGIC ====================
  const handleSendMessage = async (text: string, files?: File[], isSystem?: boolean) => {
    // Build display content for user message
    const hasFiles = files && files.length > 0;

    // Create attachment objects with previews for display
    const attachments = hasFiles ? files.map(f => ({
      name: f.name,
      type: f.type,
      size: f.size,
      preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined,
    })) : [];

    // Only add user message to UI if not a system message
    if (!isSystem) {
      const userMessage: MessageType = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: text,
        timestamp: new Date(),
        metadata: hasFiles ? { attachments } : undefined,
      };

      setMessages((prev) => [...prev, userMessage]);
      onMessageSent?.(userMessage);
    }
    setIsLoading(true);

    try {
      // Build structured message with attachments
      const messagePayload = await buildMessageWithAttachments(text, files);

      if (useMock) {
        const response = await generateMockResponse(1000);
        setMessages((prev) => [...prev, response]);
      } else {
        let contentSegments: Array<{ type: 'text'; content: string } | { type: 'tool'; id: string; name: string; status: 'preparing' | 'running' | 'completed' | 'error'; isReceiving?: boolean; inputLength?: number; result?: any; streamOutput?: string }> = [];
        let currentTextBuffer = '';
        let accumulatedWidgets: Widget[] = [];
        let responseThreadId = currentThreadId;
        const toolInputBuffers: Record<string, string> = {}; // Per-tool input buffers
        const receivingTimeouts: Record<string, ReturnType<typeof setTimeout>> = {};
        const streamingMessageId = `msg-${Date.now()}`; // Stable ID for entire stream

        const updateMessage = () => {
          const segments = [...contentSegments];
          if (currentTextBuffer) {
            const lastSegment = segments[segments.length - 1];
            if (lastSegment && lastSegment.type === 'text') {
              lastSegment.content = currentTextBuffer;
            } else {
              segments.push({ type: 'text', content: currentTextBuffer });
            }
          }

          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage && lastMessage.role === 'assistant') {
              return [
                ...prev.slice(0, -1),
                {
                  ...lastMessage,
                  content: currentTextBuffer,
                  widgets: accumulatedWidgets.length > 0 ? accumulatedWidgets : undefined,
                  metadata: { ...lastMessage.metadata, content_segments: segments, isStreaming: true },
                }
              ];
            } else {
              return [
                ...prev,
                {
                  id: streamingMessageId,
                  role: 'assistant' as const,
                  content: currentTextBuffer,
                  widgets: accumulatedWidgets.length > 0 ? accumulatedWidgets : undefined,
                  timestamp: new Date(),
                  metadata: { content_segments: segments, isStreaming: true },
                }
              ];
            }
          });
        };

        await aptevaClient.chatStream(
          {
            agent_id: agentId,
            message: messagePayload,
            stream: true,
            ...(currentThreadId && { thread_id: currentThreadId }),
            ...(effectiveContext && { system: effectiveContext }),
          },
          (chunk) => {
            switch (chunk.type) {
              case 'thread_id':
                if (chunk.thread_id) {
                  responseThreadId = chunk.thread_id;
                  if (!currentThreadId) {
                    setCurrentThreadId(chunk.thread_id);
                    onThreadChange?.(chunk.thread_id);
                  }
                }
                break;
              case 'request_id':
                if (chunk.request_id) {
                  setCurrentRequestId(chunk.request_id);
                }
                break;
              case 'content':
              case 'token':
                if (chunk.content) {
                  currentTextBuffer += chunk.content;
                  updateMessage();
                }
                break;
              case 'tool_call':
                if (chunk.tool_id && chunk.tool_name) {
                  const displayName = chunk.tool_display_name || chunk.tool_name;
                  if (currentTextBuffer) {
                    contentSegments.push({ type: 'text', content: currentTextBuffer });
                    currentTextBuffer = '';
                  }
                  contentSegments.push({ type: 'tool', id: chunk.tool_id, name: displayName, status: 'preparing' });
                  toolInputBuffers[chunk.tool_id] = ''; // Initialize per-tool buffer
                  setChatToolName(displayName); // Show tool name in header
                  onToolCall?.(chunk.tool_name, chunk.tool_id);
                  updateMessage();
                }
                break;
              case 'tool_input_delta':
                if (chunk.tool_id && chunk.content) {
                  const toolId = chunk.tool_id;
                  // Initialize buffer if not exists (in case we missed tool_call)
                  if (toolInputBuffers[toolId] === undefined) {
                    toolInputBuffers[toolId] = '';
                  }
                  toolInputBuffers[toolId] += chunk.content;

                  // Set isReceiving to true and update inputLength
                  const toolSegment = contentSegments.find((s) => s.type === 'tool' && s.id === toolId) as { type: 'tool'; id: string; name: string; status: 'preparing' | 'running' | 'completed' | 'error'; isReceiving?: boolean; inputLength?: number; result?: any } | undefined;
                  if (toolSegment) {
                    toolSegment.isReceiving = true;
                    toolSegment.inputLength = toolInputBuffers[toolId].length;
                    updateMessage();
                    // Clear isReceiving after a short delay if no more chunks
                    if (receivingTimeouts[toolId]) clearTimeout(receivingTimeouts[toolId]);
                    receivingTimeouts[toolId] = setTimeout(() => {
                      if (toolSegment.status === 'preparing') {
                        toolSegment.isReceiving = false;
                        updateMessage();
                      }
                    }, 150);
                  }
                }
                break;
              case 'tool_use':
                // Tool input complete, now executing
                if (chunk.tool_id) {
                  const toolSegment = contentSegments.find((s) => s.type === 'tool' && s.id === chunk.tool_id) as { type: 'tool'; id: string; name: string; status: 'preparing' | 'running' | 'completed' | 'error'; isReceiving?: boolean; result?: any; streamOutput?: string } | undefined;
                  if (toolSegment && toolSegment.status === 'preparing') {
                    toolSegment.status = 'running';
                    toolSegment.isReceiving = false;
                    updateMessage();
                  }
                }
                break;
              case 'tool_stream':
                // Handle streaming output from tool execution
                // Chunks accumulate within a group. Log/progress events mark reset for next group.
                if (chunk.tool_id) {
                  const toolSegment = contentSegments.find((s) => s.type === 'tool' && s.id === chunk.tool_id) as { type: 'tool'; id: string; name: string; status: 'preparing' | 'running' | 'completed' | 'error'; streamOutput?: string; pendingReset?: boolean } | undefined;
                  if (toolSegment) {
                    if (chunk.event === 'chunk' && chunk.content) {
                      // If pending reset, clear before accumulating new group
                      if (toolSegment.pendingReset) {
                        toolSegment.streamOutput = '';
                        toolSegment.pendingReset = false;
                      }
                      // Accumulate chunk content
                      toolSegment.streamOutput = (toolSegment.streamOutput || '') + chunk.content;
                      updateMessage();
                    } else if (chunk.event === 'log' || chunk.event === 'progress') {
                      // Mark for reset on next chunk (keeps current output visible until then)
                      toolSegment.pendingReset = true;
                    }
                  }
                }
                break;
              case 'tool_result':
                if (chunk.tool_id) {
                  const toolSegment = contentSegments.find((s) => s.type === 'tool' && s.id === chunk.tool_id) as { type: 'tool'; id: string; name: string; status: 'preparing' | 'running' | 'completed' | 'error'; isReceiving?: boolean; result?: any } | undefined;
                  if (toolSegment) {
                    toolSegment.result = chunk.content;
                    toolSegment.status = 'completed';
                    toolSegment.isReceiving = false;
                    onToolResult?.(toolSegment.name, chunk.content);
                  }
                  setChatToolName(null); // Clear tool name from header
                  updateMessage();
                }
                break;
              case 'widget':
                if (chunk.widget) {
                  accumulatedWidgets.push(chunk.widget);
                  // Widget reporting happens in Message.tsx to avoid duplicates
                  updateMessage();
                }
                break;
              case 'error':
                throw new Error(chunk.message || 'Stream error');
            }
          },
          (threadId) => {
            if (currentTextBuffer) {
              const lastSegment = contentSegments[contentSegments.length - 1];
              if (lastSegment && lastSegment.type === 'text') {
                lastSegment.content = currentTextBuffer;
              } else {
                contentSegments.push({ type: 'text', content: currentTextBuffer });
              }
            }
            setMessages((prev) => {
              const lastMessage = prev[prev.length - 1];
              if (lastMessage && lastMessage.role === 'assistant') {
                return [
                  ...prev.slice(0, -1),
                  {
                    ...lastMessage,
                    // Keep the same ID to avoid React remounting the component
                    content: currentTextBuffer || 'Response received',
                    widgets: accumulatedWidgets.length > 0 ? accumulatedWidgets : undefined,
                    metadata: { thread_id: threadId, content_segments: contentSegments, isStreaming: false },
                  }
                ];
              }
              return prev;
            });
            if (threadId && threadId !== currentThreadId) {
              setCurrentThreadId(threadId);
              onThreadChange?.(threadId);
            }
            setIsLoading(false);
            setCurrentRequestId(null);
            setChatToolName(null);
          },
          (error) => {
            const errorMessage: MessageType = {
              id: `msg-${Date.now()}-error`,
              role: 'assistant',
              content: `Error: ${error.message}`,
              timestamp: new Date(),
              metadata: { error: true },
            };
            setMessages((prev) => {
              const lastMessage = prev[prev.length - 1];
              if (lastMessage && lastMessage.id.includes('streaming')) {
                return [...prev.slice(0, -1), errorMessage];
              }
              return [...prev, errorMessage];
            });
            setIsLoading(false);
            setCurrentRequestId(null);
            setChatToolName(null);
            onError?.(error);
          }
        );
      }
    } catch (error) {
      const errorMessage: MessageType = {
        id: `msg-${Date.now()}-error`,
        role: 'assistant',
        content: error instanceof Error ? `Error: ${error.message}` : 'An error occurred',
        timestamp: new Date(),
        metadata: { error: true },
      };
      setMessages((prev) => [...prev, errorMessage]);
      onError?.(error instanceof Error ? error : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  // Assign to ref so useImperativeHandle can call it
  handleSendMessageRef.current = handleSendMessage;

  // ==================== COMMAND MODE LOGIC ====================
  const executeCommand = async (commandOverride?: string, files?: File[]) => {
    const currentCommand = commandOverride || commandInput;
    if (!currentCommand.trim() && (!files || files.length === 0)) {
      setCommandError(new Error('Please enter a command'));
      setCommandState('error');
      return;
    }

    // Plan mode: show plan first
    if (internalPlanMode && commandState !== 'plan-pending') {
      setCommandState('loading');
      setCommandError(null);
      setCommandInput('');

      if (useMock) {
        setTimeout(() => {
          const mockPlan = `1. Analyze the request: "${currentCommand}"\n2. Process the data\n3. Generate response\n4. Return results`;
          setPlan(mockPlan);
          setPendingCommand(currentCommand);
          setCommandState('plan-pending');
        }, 800);
      } else {
        try {
          const planningInstruction = `CRITICAL PLANNING MODE: You are ONLY creating a plan. Write a numbered list of steps describing what WOULD be done. DO NOT execute anything.`;
          const systemMessage = effectiveContext ? `${effectiveContext}\n\n${planningInstruction}` : planningInstruction;

          const response = await aptevaClient.chat({
            agent_id: agentId,
            message: currentCommand,
            stream: false,
            system: systemMessage,
          });
          setPlan(response.message);
          setPendingCommand(currentCommand);
          setCommandState('plan-pending');
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Failed to generate plan');
          setCommandError(error);
          setCommandState('error');
          onError?.(error);
        }
      }
      return;
    }

    setCommandState('loading');
    setCommandError(null);
    setProgress(0);
    setStreamedContent('');
    setCommandInput('');

    try {
      if (useMock) {
        if (enableStreaming) {
          let accumulatedContent = '';
          generateMockCommandStream(
            currentCommand,
            (chunk) => {
              if (chunk.type === 'token' && chunk.content) {
                accumulatedContent += chunk.content;
                setStreamedContent(accumulatedContent);
                const estimatedProgress = Math.min(Math.round(accumulatedContent.length / 10), 90);
                setProgress(estimatedProgress);
              }
            },
            (threadId) => {
              const result: CommandResult = {
                success: true,
                data: { summary: accumulatedContent, thread_id: threadId },
                message: accumulatedContent || 'Command executed successfully',
              };
              setCommandResult(result);
              setCommandState('success');
              setProgress(100);
              onComplete?.(result);
            },
            (error) => {
              setCommandError(error);
              setCommandState('error');
              onError?.(error);
            }
          );
        } else {
          await new Promise(resolve => setTimeout(resolve, 1500));
          const result: CommandResult = {
            success: true,
            data: { summary: `Executed: ${currentCommand}` },
            message: `Command executed successfully`,
          };
          setCommandResult(result);
          setCommandState('success');
          setProgress(100);
          onComplete?.(result);
        }
      } else {
        // Real API
        const commandInstruction = 'CRITICAL COMMAND MODE: Maximum 10 words per response. Execute the command immediately. Make reasonable assumptions based on context. Use sensible defaults for missing details. DO NOT ask questions unless something is truly impossible without user input (e.g., missing required password). State what you\'re doing or the result. Examples: "Analyzing customer data from last quarter..." or "Created 5 new database entries successfully" or "Search complete: found 12 matching results". NO greetings, NO filler words, NO clarification requests. Action/result only.';
        const systemMessage = effectiveContext ? `${effectiveContext}\n\n${commandInstruction}` : commandInstruction;

        // Build message with attachments if files provided
        const messagePayload = files && files.length > 0
          ? await buildMessageWithAttachments(currentCommand, files)
          : currentCommand;

        if (enableStreaming) {
          let accumulatedContent = '';
          let lastToolName = '';
          await aptevaClient.chatStream(
            {
              agent_id: agentId,
              message: messagePayload,
              stream: true,
              ...(currentThreadId && { thread_id: currentThreadId }),
              system: systemMessage,
            },
            (chunk) => {
              if ((chunk.type === 'token' || chunk.type === 'content') && chunk.content) {
                accumulatedContent += chunk.content;
                setStreamedContent(accumulatedContent);
                setCurrentToolName(null); // Clear tool name when we get content
                const estimatedProgress = Math.min(Math.round(accumulatedContent.length / 10), 90);
                setProgress(estimatedProgress);
              } else if (chunk.type === 'tool_call' && chunk.tool_name) {
                const displayName = chunk.tool_display_name || chunk.tool_name;
                lastToolName = chunk.tool_name;
                setCurrentToolName(displayName);
                onToolCall?.(chunk.tool_name, chunk.tool_id || '');
                // Reset for display - show only tool, not accumulated text
                accumulatedContent = '';
                setStreamedContent('');
              } else if (chunk.type === 'tool_result') {
                onToolResult?.(lastToolName, chunk.content);
                setCurrentToolName(null); // Tool finished, will show next content
              } else if (chunk.type === 'thread_id' && chunk.thread_id) {
                if (!currentThreadId) {
                  setCurrentThreadId(chunk.thread_id);
                  onThreadChange?.(chunk.thread_id);
                }
              } else if (chunk.type === 'request_id' && chunk.request_id) {
                setCurrentRequestId(chunk.request_id);
              }
            },
            (threadId) => {
              const result: CommandResult = {
                success: true,
                data: { summary: accumulatedContent, thread_id: threadId },
                message: accumulatedContent || 'Command executed successfully',
              };
              setCommandResult(result);
              setCommandState('success');
              setProgress(100);
              setCurrentRequestId(null);
              onComplete?.(result);
            },
            (error) => {
              setCommandError(error);
              setCommandState('error');
              setCurrentRequestId(null);
              onError?.(error);
            }
          );
        } else {
          const response = await aptevaClient.chat({
            agent_id: agentId,
            message: messagePayload,
            stream: false,
            ...(currentThreadId && { thread_id: currentThreadId }),
            system: systemMessage,
          });
          const result: CommandResult = {
            success: true,
            data: { summary: response.message, thread_id: response.thread_id },
            widgets: response.widgets,
            message: response.message,
          };
          setCommandResult(result);
          setCommandState('success');
          setProgress(100);
          onComplete?.(result);
        }
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setCommandError(error);
      setCommandState('error');
      onError?.(error);
    }
  };

  const resetCommand = () => {
    setCommandState('idle');
    setCommandResult(null);
    setCommandError(null);
    setProgress(0);
    setCommandInput('');
    setPlan('');
    setPendingCommand('');
    setStreamedContent('');
    setCurrentToolName(null);
  };

  const approvePlan = () => {
    const planToExecute = plan;
    setPlan('');
    setPendingCommand('');
    const executionMessage = `Execute this plan now:\n\n${planToExecute}`;
    executeCommand(executionMessage);
  };

  const rejectPlan = () => {
    setCommandInput(pendingCommand);
    setPlan('');
    setPendingCommand('');
    setCommandState('idle');
  };

  // Stop generation handler
  const handleStop = async () => {
    // Call cancel API if we have a request ID
    if (currentRequestId && agentId) {
      try {
        await aptevaClient.cancelRequest(agentId, currentRequestId);
      } catch (error) {
        console.error('Failed to cancel request:', error);
      }
    }

    // For chat mode
    setIsLoading(false);
    // For command mode
    if (commandState === 'loading') {
      setCommandState('idle');
      setStreamedContent('');
      setCurrentToolName(null);
      setProgress(0);
    }
    // Clear request ID
    setCurrentRequestId(null);
  };

  const isCompact = commandVariant === 'compact';

  // ==================== RENDER ====================
  return (
    <div className={cn('apteva-chat flex flex-col h-full', variant !== 'default' && `apteva-chat-${variant}`, className)}>
      {/* Header - only show in chat mode when showHeader is true */}
      {showHeader && mode === 'chat' && (
        <div className="apteva-chat-header px-4 py-3 flex items-center justify-between">
          <div>
            <div className="apteva-chat-title">{headerTitle}</div>
            <div className={cn(
              "apteva-chat-status",
              isLoading
                ? chatToolName
                  ? "apteva-chat-status-tool"
                  : "apteva-chat-status-thinking"
                : "apteva-chat-status-ready"
            )}>
              {isLoading
                ? chatToolName
                  ? `Using ${chatToolName}...`
                  : 'Thinking...'
                : 'Ready'}
            </div>
          </div>
        </div>
      )}

      {/* CHAT MODE */}
      {mode === 'chat' && (
        <>
          <MessageList
            messages={messages}
            onAction={onAction}
            welcomeTitle={welcomeTitle}
            welcomeSubtitle={welcomeSubtitle}
            welcomeIcon={welcomeIcon}
            suggestedPrompts={suggestedPrompts}
            welcomeVariant={welcomeVariant}
            chatVariant={variant}
            onPromptClick={(prompt) => handleSendMessage(prompt)}
            enableWidgets={enableWidgets}
            onWidgetRender={onWidgetRender}
          />
          <Composer
            onSendMessage={handleSendMessage}
            placeholder={placeholder || defaultPlaceholder}
            disabled={isLoading}
            isLoading={isLoading}
            onStop={handleStop}
            onFileUpload={onFileUpload}
            onSwitchMode={showModeToggle ? () => handleModeChange('command') : undefined}
          />
        </>
      )}

      {/* COMMAND MODE - Self-contained composer with inline response */}
      {mode === 'command' && (
        <div className="w-full">
          <CommandComposer
              onExecute={(text, files) => {
                setCommandInput(text);
                executeCommand(text, files);
              }}
              state={commandState}
              response={commandResult?.data?.summary || commandResult?.message}
              error={commandError?.message}
              plan={plan}
              streamedContent={streamedContent}
              toolName={currentToolName}
              onApprove={approvePlan}
              onReject={rejectPlan}
              onReset={resetCommand}
              onStop={handleStop}
              onExpand={showModeToggle ? () => handleModeChange('chat') : undefined}
              placeholder={placeholder || 'Enter your command...'}
            />
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes pulse-border {
            0%, 100% { border-color: rgb(59, 130, 246); }
            50% { border-color: rgb(147, 197, 253); }
          }
          .animate-pulse-border {
            animation: pulse-border 2s ease-in-out infinite;
          }
          .apteva-composer {
            border-radius: var(--apteva-border-radius, 1rem) !important;
          }
        `
      }} />
    </div>
  );
});
