import React, { useState, useEffect } from 'react';
import { CommandProps, CommandResult } from '../../types/components';
import { cn, generateMockCommandWithWidgets, generateMockCommandStream, generateMockPlan } from '../../utils';
import { aptevaClient } from '../../lib/apteva-client';
import { WidgetRenderer } from '../Widgets/WidgetRenderer';

export function Command({
  agentId,
  command: initialCommand,
  context,
  autoExecute = false,
  allowInput = true,
  placeholder = 'Enter your command...',
  submitButtonText = 'Execute',
  variant = 'default',
  useMock = false,
  planMode = false,
  onPlanModeChange,
  enableFileUpload = true,
  onStart,
  onProgress,
  onChunk,
  onComplete,
  onError,
  onFileUpload,
  onAction,
  loadingText = 'Processing...',
  showProgress = true,
  enableStreaming = false,
  resultRenderer,
  className,
}: CommandProps) {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error' | 'plan-pending'>('idle');
  const [result, setResult] = useState<CommandResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState(0);
  const [command, setCommand] = useState(initialCommand || '');
  const [streamedContent, setStreamedContent] = useState('');
  const [plan, setPlan] = useState<string>('');
  const [pendingCommand, setPendingCommand] = useState<string>('');
  const [showPlanDetails, setShowPlanDetails] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ type: 'image' | 'document'; data: string; mediaType: string; preview?: string; name: string }>>([]);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [internalPlanMode, setInternalPlanMode] = useState(planMode);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoExecute && state === 'idle' && command) {
      executeCommand();
    }
  }, [autoExecute]);

  // Sync internal plan mode with prop when prop changes
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

  const executeCommand = async (commandOverride?: string) => {
    const currentCommand = commandOverride || command;

    if (!currentCommand.trim()) {
      setError(new Error('Please enter a command'));
      setState('error');
      return;
    }

    // Plan mode: show plan first
    if (internalPlanMode && state !== 'plan-pending') {
      setState('loading');
      setError(null);
      setCommand(''); // Clear input

      // Generate plan (mock or real)
      if (useMock) {
        setTimeout(() => {
          const mockPlan = generateMockPlan(currentCommand);
          setPlan(mockPlan);
          setPendingCommand(currentCommand);
          setState('plan-pending');
        }, 800);
      } else {
        // Real API plan generation
        try {
          // Build message - multi-part if files are uploaded
          let messageContent: any;

          if (uploadedFiles.length > 0) {
            messageContent = [
              {
                type: 'text',
                text: currentCommand,
              },
              ...uploadedFiles.map(file => ({
                type: file.type,
                source: {
                  type: 'base64',
                  media_type: file.mediaType,
                  data: file.data,
                },
              })),
            ];
          } else {
            messageContent = currentCommand;
          }

          // System instruction for planning only
          let systemMessage = context || '';
          const planningInstruction = `CRITICAL PLANNING MODE - READ CAREFULLY:

You are ONLY creating a plan. You are NOT executing anything.

YOUR TASK: Write a numbered list of steps describing what WOULD be done.
DO NOT: Execute any actions, make API calls, access databases, modify data, or perform any operations.
DO NOT: Ask questions or clarifications. Make reasonable assumptions.
DO: Describe the steps as "Step 1: Would search database...", "Step 2: Would analyze results...", etc.
DO: Use default values or best practices if details are missing.

FORMAT REQUIRED:
1. [First action that would be taken]
2. [Second action that would be taken]
3. [Third action that would be taken]
...

IMPORTANT: This is COMMAND MODE - figure things out yourself. Make intelligent assumptions based on context. ONLY ask questions if something is absolutely impossible to proceed without (e.g., missing required credentials). Otherwise, use sensible defaults and proceed with the plan.

REMEMBER: This is ONLY a plan. The user will approve it, THEN it will be executed. Right now you are just describing what would happen - NOT doing it.`;


          systemMessage = systemMessage
            ? `${systemMessage}\n\n${planningInstruction}`
            : planningInstruction;

          aptevaClient.chat({
            agent_id: agentId,
            message: messageContent,
            stream: false,
            system: systemMessage,
          }).then((response) => {
            setPlan(response.message);
            setPendingCommand(currentCommand);
            setState('plan-pending');
          }).catch((err) => {
            const error = err instanceof Error ? err : new Error('Failed to generate plan');
            setError(error);
            setState('error');
            onError?.(error);
          });
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Failed to generate plan');
          setError(error);
          setState('error');
          onError?.(error);
        }
      }
      return;
    }

    setState('loading');
    setError(null);
    setProgress(0);
    setStreamedContent('');
    setCommand(''); // Clear input for next command
    setUploadedFiles([]); // Clear uploaded files after sending
    onStart?.();

    try {
      if (useMock) {
        // MOCK MODE
        if (enableStreaming) {
          // Mock streaming
          let accumulatedContent = '';

          generateMockCommandStream(
            currentCommand,
            (chunk) => {
              if (chunk.type === 'token' && chunk.content) {
                accumulatedContent += chunk.content;
                setStreamedContent(accumulatedContent);
                onChunk?.(chunk.content);

                // Estimate progress based on content length
                const estimatedProgress = Math.min(Math.round(accumulatedContent.length / 10), 90);
                setProgress(estimatedProgress);
                onProgress?.(estimatedProgress);
              } else if (chunk.type === 'widget' && chunk.widget) {
                // Handle widgets in streamed response
                const widget = chunk.widget;
                setResult((prev) => ({
                  success: true,
                  data: prev?.data || {},
                  widgets: [...(prev?.widgets || []), widget],
                  message: accumulatedContent || 'Command executed successfully',
                }));
              }
            },
            (threadId) => {
              // On complete
              const result: CommandResult = {
                success: true,
                data: {
                  summary: accumulatedContent,
                  thread_id: threadId,
                  agentId,
                  context,
                  timestamp: new Date().toISOString(),
                },
                message: accumulatedContent || 'Command executed successfully',
              };

              setResult(result);
              setState('success');
              setProgress(100);
              onComplete?.(result);
            },
            (error) => {
              // On error
              setError(error);
              setState('error');
              onError?.(error);
            }
          );
        } else {
          // Mock non-streaming
          const progressInterval = setInterval(() => {
            setProgress((prev) => {
              const next = Math.min(prev + 10, 90);
              onProgress?.(next);
              return next;
            });
          }, 200);

          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 1500));

          clearInterval(progressInterval);

          const mockResponse = generateMockCommandWithWidgets(currentCommand);

          const result: CommandResult = {
            success: true,
            data: {
              summary: mockResponse.message,
              thread_id: `mock_thread_${Date.now()}`,
              agentId,
              context,
              timestamp: new Date().toISOString(),
              action: mockResponse.action, // Include agent action intent
            },
            widgets: mockResponse.widgets,
            message: mockResponse.message,
          };

          setResult(result);
          setState('success');
          setProgress(100);
          onComplete?.(result);
        }
      } else {
        // REAL API MODE
        if (enableStreaming) {
          // Real streaming API call
          let accumulatedContent = '';

          // Build message - multi-part if files are uploaded
          let messageContent: any;

          if (uploadedFiles.length > 0) {
            // Multi-part message with text and images
            messageContent = [
              {
                type: 'text',
                text: currentCommand,
              },
              ...uploadedFiles.map(file => ({
                type: file.type, // 'image' or 'document'
                source: {
                  type: 'base64',
                  media_type: file.mediaType,
                  data: file.data,
                },
              })),
            ];
          } else {
            // Simple text message
            messageContent = currentCommand;
          }

          // Build system message - add command execution instruction
          let systemMessage = context || '';

          // Always include command mode instruction for brevity
          let commandInstruction: string;
          if (isCompact) {
            // Compact mode - extremely terse
            commandInstruction = 'CRITICAL COMMAND MODE: Maximum 10 words per response. Execute immediately, make intelligent assumptions, use defaults when needed. NO questions unless absolutely critical (missing required credentials). State action or result ONLY. Examples: "Searching database for matching records..." or "Found 3 user records in database" or "Task completed successfully". NO greetings, NO explanations, NO clarification requests. Just execute and report.';
          } else {
            // Default mode - still very brief
            commandInstruction = 'CRITICAL COMMAND MODE: Maximum 10 words per response. Execute the command immediately. Make reasonable assumptions based on context. Use sensible defaults for missing details. DO NOT ask questions unless something is truly impossible without user input (e.g., missing required password). State what you\'re doing or the result. Examples: "Analyzing customer data from last quarter..." or "Created 5 new database entries successfully" or "Search complete: found 12 matching results". NO greetings, NO filler words, NO clarification requests. Action/result only.';
          }

          systemMessage = systemMessage
            ? `${systemMessage}\n\n${commandInstruction}`
            : commandInstruction;

          await aptevaClient.chatStream(
            {
              agent_id: agentId,
              message: messageContent,
              stream: true,
              ...(systemMessage && { system: systemMessage }),
            },
            (chunk) => {
              if (chunk.type === 'token' && chunk.content) {
                accumulatedContent += chunk.content;
                setStreamedContent(accumulatedContent);
                onChunk?.(chunk.content);

                // Estimate progress based on content length (rough approximation)
                const estimatedProgress = Math.min(Math.round(accumulatedContent.length / 10), 90);
                setProgress(estimatedProgress);
                onProgress?.(estimatedProgress);
              } else if (chunk.type === 'widget' && chunk.widget) {
                // Handle widgets in streamed response
                const widget = chunk.widget;
                setResult((prev) => ({
                  success: true,
                  data: prev?.data || {},
                  widgets: [...(prev?.widgets || []), widget],
                  message: accumulatedContent || 'Command executed successfully',
                }));
              }
            },
            (threadId) => {
              // On complete
              const result: CommandResult = {
                success: true,
                data: {
                  summary: accumulatedContent,
                  thread_id: threadId,
                  agentId,
                  context,
                  timestamp: new Date().toISOString(),
                },
                message: accumulatedContent || 'Command executed successfully',
              };

              setResult(result);
              setState('success');
              setProgress(100);
              onComplete?.(result);
            },
            (error) => {
              // On error
              const err = error instanceof Error ? error : new Error('Unknown error');
              setError(err);
              setState('error');
              onError?.(err);
            }
          );
        } else {
          // Non-streaming API call
          const progressInterval = setInterval(() => {
            setProgress((prev) => {
              const next = Math.min(prev + 10, 90);
              onProgress?.(next);
              return next;
            });
          }, 200);

          // Build message - multi-part if files are uploaded
          let messageContent: any;

          if (uploadedFiles.length > 0) {
            // Multi-part message with text and images
            messageContent = [
              {
                type: 'text',
                text: currentCommand,
              },
              ...uploadedFiles.map(file => ({
                type: file.type, // 'image' or 'document'
                source: {
                  type: 'base64',
                  media_type: file.mediaType,
                  data: file.data,
                },
              })),
            ];
          } else {
            // Simple text message
            messageContent = currentCommand;
          }

          // Build system message - add command execution instruction
          let systemMessage = context || '';

          // Always include command mode instruction for brevity
          let commandInstruction: string;
          if (isCompact) {
            // Compact mode - extremely terse
            commandInstruction = 'CRITICAL COMMAND MODE: Maximum 10 words per response. Execute immediately, make intelligent assumptions, use defaults when needed. NO questions unless absolutely critical (missing required credentials). State action or result ONLY. Examples: "Searching database for matching records..." or "Found 3 user records in database" or "Task completed successfully". NO greetings, NO explanations, NO clarification requests. Just execute and report.';
          } else {
            // Default mode - still very brief
            commandInstruction = 'CRITICAL COMMAND MODE: Maximum 10 words per response. Execute the command immediately. Make reasonable assumptions based on context. Use sensible defaults for missing details. DO NOT ask questions unless something is truly impossible without user input (e.g., missing required password). State what you\'re doing or the result. Examples: "Analyzing customer data from last quarter..." or "Created 5 new database entries successfully" or "Search complete: found 12 matching results". NO greetings, NO filler words, NO clarification requests. Action/result only.';
          }

          systemMessage = systemMessage
            ? `${systemMessage}\n\n${commandInstruction}`
            : commandInstruction;

          const response = await aptevaClient.chat({
            agent_id: agentId,
            message: messageContent,
            stream: false,
            ...(systemMessage && { system: systemMessage }),
          });

          clearInterval(progressInterval);

          const result: CommandResult = {
            success: true,
            data: {
              summary: response.message,
              thread_id: response.thread_id,
              agentId,
              context,
              timestamp: new Date().toISOString(),
            },
            widgets: response.widgets,
            message: response.message,
          };

          setResult(result);
          setState('success');
          setProgress(100);
          onComplete?.(result);
        }
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      setState('error');
      onError?.(error);
    }
  };

  const resetCommand = () => {
    setState('idle');
    setResult(null);
    setError(null);
    setProgress(0);
    setCommand('');
    setPlan('');
    setPendingCommand('');
    setShowPlanDetails(false);
    setUploadedFiles([]);
  };

  const approvePlan = () => {
    // Execute the plan after approval
    // Send the plan to the agent with "execute this now" instruction
    setShowPlanDetails(false);
    const planToExecute = plan;
    setPlan('');
    setPendingCommand('');

    // Execute with the plan as the command
    const executionMessage = `Execute this plan now:\n\n${planToExecute}`;
    executeCommand(executionMessage);
  };

  const rejectPlan = () => {
    // Reset to idle and restore the command for editing
    setCommand(pendingCommand);
    setPlan('');
    setPendingCommand('');
    setShowPlanDetails(false);
    setState('idle');
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload?.(e.target.files);

      // Convert files to base64 for API
      const files: Array<{ type: 'image' | 'document'; data: string; mediaType: string; preview?: string; name: string }> = [];

      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];

        const reader = new FileReader();

        await new Promise<void>((resolve) => {
          reader.onload = (event) => {
            if (event.target?.result) {
              const fullDataUrl = event.target.result as string;
              const base64Data = fullDataUrl.split(',')[1]; // Remove data:...;base64, prefix

              if (file.type.startsWith('image/')) {
                // Images with preview
                files.push({
                  type: 'image',
                  data: base64Data,
                  mediaType: file.type,
                  preview: fullDataUrl, // Keep full data URL for preview
                  name: file.name,
                });
              } else if (file.type === 'application/pdf' || file.type.startsWith('application/')) {
                // Documents (PDF, etc.) without preview
                files.push({
                  type: 'document',
                  data: base64Data,
                  mediaType: file.type,
                  name: file.name,
                });
              }
            }
            resolve();
          };
          reader.readAsDataURL(file);
        });
      }

      setUploadedFiles(prev => [...prev, ...files]); // Append to existing files
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const isCompact = variant === 'compact';

  return (
    <div
      className={cn(
        'relative border-2 rounded-xl bg-white dark:bg-neutral-900 transition-all duration-300 flex flex-col',
        state === 'loading' && 'animate-pulse-border',
        state === 'idle' && 'border-neutral-300 dark:border-neutral-700',
        state === 'loading' && 'border-blue-500',
        state === 'plan-pending' && 'border-blue-400',
        state === 'success' && 'border-green-500',
        state === 'error' && 'border-red-500',
        className
      )}
      style={{ minHeight: isCompact ? 'auto' : '180px' }}
    >
      {/* Input/Display Area */}
      <div className={cn('flex-1 flex', isCompact ? 'flex-row items-center p-3 gap-3' : 'flex-col p-4')}>
        {state === 'idle' && allowInput && !isCompact && (
          <>
            <textarea
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  executeCommand();
                }
              }}
              placeholder={placeholder}
              className="flex-1 w-full resize-none bg-transparent border-none focus:outline-none !text-neutral-900 dark:!text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500"
              rows={6}
            />
            {/* File Previews - Non-Compact */}
            {uploadedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    {file.type === 'image' ? (
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-20 h-20 object-cover rounded-lg border-2 border-neutral-300 dark:border-neutral-600"
                      />
                    ) : (
                      <div className="w-20 h-20 flex flex-col items-center justify-center rounded-lg border-2 border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800">
                        <svg className="w-8 h-8 text-neutral-500 dark:text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                        <span className="text-[8px] text-neutral-500 dark:text-neutral-400 mt-1 px-1 truncate max-w-full">
                          {file.name.length > 12 ? file.name.slice(0, 12) + '...' : file.name}
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      title={`Remove ${file.type}`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {state === 'idle' && allowInput && isCompact && (
          <>
            <div className="flex items-center gap-0.5 flex-shrink-0">
              {enableFileUpload && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all flex-shrink-0 !text-neutral-500 dark:!text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  title="Attach file"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.4 2.8L4.4 6.8C3.736 7.464 3.736 8.536 4.4 9.2C5.064 9.864 6.136 9.864 6.8 9.2L11.6 4.4C12.704 3.296 12.704 1.504 11.6 0.4C10.496 -0.704 8.704 -0.704 7.6 0.4L2.8 5.2C1.256 6.744 1.256 9.256 2.8 10.8C4.344 12.344 6.856 12.344 8.4 10.8L12.4 6.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" transform="translate(1.6, 2.4)"/>
                  </svg>
                </button>
              )}
              {planMode && (
                <div className="relative settings-menu-container">
                  <button
                    onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-all flex-shrink-0 hover:bg-neutral-100 dark:hover:bg-neutral-800",
                      internalPlanMode ? "!text-blue-600 dark:!text-blue-400" : "!text-neutral-500 dark:!text-neutral-500"
                    )}
                    title="Settings"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="4" y1="21" x2="4" y2="14"></line>
                      <line x1="4" y1="10" x2="4" y2="3"></line>
                      <line x1="12" y1="21" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12" y2="3"></line>
                      <line x1="20" y1="21" x2="20" y2="16"></line>
                      <line x1="20" y1="12" x2="20" y2="3"></line>
                      <line x1="1" y1="14" x2="7" y2="14"></line>
                      <line x1="9" y1="8" x2="15" y2="8"></line>
                      <line x1="17" y1="16" x2="23" y2="16"></line>
                    </svg>
                  </button>
                  {showSettingsMenu && (
                    <div className="absolute top-10 left-0 z-50 w-56 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg p-2.5 settings-menu-container">
                    <label className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        <div>
                          <div className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Plan Mode</div>
                          <div className="text-[10px] text-neutral-500 dark:text-neutral-400">Review first</div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setInternalPlanMode(!internalPlanMode);
                        }}
                        className={cn(
                          "relative inline-flex h-4 w-8 items-center rounded-full transition-colors",
                          internalPlanMode ? "bg-blue-600" : "bg-neutral-300 dark:bg-neutral-600"
                        )}
                        type="button"
                      >
                        <span
                          className={cn(
                            "inline-block h-3 w-3 transform rounded-full bg-white transition-transform",
                            internalPlanMode ? "translate-x-4.5" : "translate-x-0.5"
                          )}
                        />
                      </button>
                    </label>
                  </div>
                )}
                </div>
              )}
            </div>
            {/* File Previews - Compact */}
            {uploadedFiles.length > 0 && (
              <div className="flex gap-1 flex-shrink-0">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    {file.type === 'image' ? (
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-8 h-8 object-cover rounded border border-neutral-300 dark:border-neutral-600"
                      />
                    ) : (
                      <div className="w-8 h-8 flex items-center justify-center rounded border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800" title={file.name}>
                        <svg className="w-4 h-4 text-neutral-500 dark:text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove"
                    >
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  executeCommand();
                }
              }}
              placeholder={placeholder}
              className="flex-1 bg-transparent border-none focus:outline-none !text-neutral-900 dark:!text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 py-1"
            />
            <button
              onClick={() => executeCommand()}
              disabled={!command.trim()}
              className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-all flex-shrink-0',
                'border border-neutral-300 dark:border-neutral-600',
                'bg-white dark:bg-neutral-800',
                '!text-neutral-700 dark:!text-neutral-300',
                'hover:bg-neutral-50 dark:hover:bg-neutral-700',
                'disabled:opacity-30 disabled:cursor-not-allowed',
                '!text-lg',
                !command.trim() && 'border-neutral-200 dark:border-neutral-700 !text-neutral-400 dark:!text-neutral-600'
              )}
              title="Execute"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3L8 13M8 3L4 7M8 3L12 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </>
        )}

        {state === 'loading' && !isCompact && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-8">
            <div className="w-6 h-6 border-2 border-neutral-300 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="text-neutral-600 dark:text-neutral-400 text-sm text-center max-w-md">
              {enableStreaming && streamedContent ? streamedContent : loadingText}
            </div>
            {showProgress && (
              <div className="w-full max-w-sm">
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-1.5">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-neutral-500 mt-2 text-center">{progress}%</p>
              </div>
            )}
          </div>
        )}

        {state === 'loading' && isCompact && (
          <>
            <div className="flex-1 flex items-center gap-3 py-1">
              <div className="w-4 h-4 border-2 border-neutral-300 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="text-neutral-600 dark:text-neutral-400 text-sm truncate">
                {enableStreaming && streamedContent ? streamedContent : loadingText}
              </div>
            </div>
            <button
              disabled
              className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-all flex-shrink-0',
                'border border-neutral-200 dark:border-neutral-700',
                'bg-white dark:bg-neutral-800',
                '!text-neutral-400 dark:!text-neutral-600',
                '!text-lg',
                'opacity-30 cursor-not-allowed'
              )}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3L8 13M8 3L4 7M8 3L12 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </>
        )}

        {state === 'plan-pending' && !isCompact && (
          <div className="flex-1 flex flex-col">
            <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start gap-2 mb-3">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">Proposed Plan</h3>
                  <div className="text-blue-700 dark:text-blue-300 text-sm whitespace-pre-line leading-relaxed">
                    {plan}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={approvePlan}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Approve & Execute
                </button>
                <button
                  onClick={rejectPlan}
                  className="flex-1 px-4 py-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors text-sm font-medium"
                >
                  Modify
                </button>
              </div>
            </div>
          </div>
        )}

        {state === 'plan-pending' && isCompact && (
          <>
            <button
              onClick={() => setShowPlanDetails(true)}
              className="flex-1 flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300 truncate flex-1">View Execution Plan</span>
            </button>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={approvePlan}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
              >
                Approve
              </button>
              <button
                onClick={rejectPlan}
                className="px-3 py-1.5 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors text-xs font-medium"
              >
                Modify
              </button>
            </div>
          </>
        )}

        {state === 'error' && (
          <div className="flex-1 flex flex-col">
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-sm font-semibold text-red-800 dark:text-red-400">Error</h3>
                  <p className="text-red-700 dark:text-red-300 text-sm mt-1">{error?.message}</p>
                </div>
              </div>
            </div>
            {allowInput && (
              <textarea
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    executeCommand();
                  }
                }}
                placeholder={placeholder}
                className="flex-1 w-full resize-none bg-transparent border-none focus:outline-none text-neutral-900 dark:text-white placeholder-neutral-400"
                rows={4}
              />
            )}
          </div>
        )}

        {state === 'success' && result && !isCompact && (
          <div className="flex-1 overflow-auto">
            {resultRenderer ? (
              resultRenderer(result.data)
            ) : (
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-green-800 dark:text-green-400 mb-1">Success</h3>
                    <p className="text-green-700 dark:text-green-300 text-sm">Command executed successfully</p>
                  </div>
                </div>
                {result.data?.summary && (
                  <div className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed whitespace-pre-line">
                    {result.data.summary}
                  </div>
                )}
                {result.widgets && result.widgets.length > 0 && (
                  <div className="space-y-3">
                    {result.widgets.map((widget) => (
                      <WidgetRenderer
                        key={widget.id}
                        widget={widget}
                        onAction={onAction}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {state === 'success' && result && isCompact && (
          <>
            <div
              className="flex-1 flex items-center gap-2 py-1 cursor-text min-w-0"
              onClick={() => {
                setState('idle');
                setResult(null);
              }}
            >
              <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-green-700 dark:text-green-300 text-sm truncate flex-1 min-w-0">
                {resultRenderer ? resultRenderer(result.data) : (result.message || 'Command executed successfully')}
              </div>
            </div>
            <button
              onClick={() => {
                setState('idle');
                setResult(null);
              }}
              className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-all flex-shrink-0',
                'border border-neutral-300 dark:border-neutral-600',
                'bg-white dark:bg-neutral-800',
                '!text-neutral-700 dark:!text-neutral-300',
                'hover:bg-neutral-50 dark:hover:bg-neutral-700',
                '!text-lg'
              )}
              title="New command"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3L8 13M8 3L4 7M8 3L12 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Bottom Action Bar - Only show for default variant when not in compact mode */}
      {!isCompact && (
        <div className="p-3 flex items-center justify-between gap-2">
          {/* Left side - Attachment and Settings buttons */}
          <div className="flex items-center gap-1">
            {state === 'idle' && allowInput && (
              <>
                {enableFileUpload && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all flex-shrink-0 !text-neutral-500 dark:!text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    title="Attach file"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.4 2.8L4.4 6.8C3.736 7.464 3.736 8.536 4.4 9.2C5.064 9.864 6.136 9.864 6.8 9.2L11.6 4.4C12.704 3.296 12.704 1.504 11.6 0.4C10.496 -0.704 8.704 -0.704 7.6 0.4L2.8 5.2C1.256 6.744 1.256 9.256 2.8 10.8C4.344 12.344 6.856 12.344 8.4 10.8L12.4 6.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" transform="translate(1.6, 2.4)"/>
                    </svg>
                  </button>
                )}
                {planMode && (
                  <div className="relative settings-menu-container">
                    <button
                      onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center transition-all flex-shrink-0 hover:bg-neutral-100 dark:hover:bg-neutral-800",
                        internalPlanMode ? "!text-blue-600 dark:!text-blue-400" : "!text-neutral-500 dark:!text-neutral-500"
                      )}
                      title="Settings"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="4" y1="21" x2="4" y2="14"></line>
                        <line x1="4" y1="10" x2="4" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12" y2="3"></line>
                        <line x1="20" y1="21" x2="20" y2="16"></line>
                        <line x1="20" y1="12" x2="20" y2="3"></line>
                        <line x1="1" y1="14" x2="7" y2="14"></line>
                        <line x1="9" y1="8" x2="15" y2="8"></line>
                        <line x1="17" y1="16" x2="23" y2="16"></line>
                      </svg>
                    </button>
                    {showSettingsMenu && (
                      <div className="absolute top-10 left-0 z-50 w-64 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg p-3 settings-menu-container">
                        <label className="flex items-center justify-between cursor-pointer group">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-neutral-500 dark:text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            <div>
                              <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Plan Mode</div>
                              <div className="text-xs text-neutral-500 dark:text-neutral-400">Review before executing</div>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setInternalPlanMode(!internalPlanMode);
                            }}
                            className={cn(
                              "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                              internalPlanMode ? "bg-blue-600" : "bg-neutral-300 dark:bg-neutral-600"
                            )}
                            type="button"
                          >
                            <span
                              className={cn(
                                "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform",
                                internalPlanMode ? "translate-x-5" : "translate-x-0.5"
                              )}
                            />
                          </button>
                        </label>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Spacer when no attachment button */}
          {!(state === 'idle' && allowInput) && <div />}

          {/* Right side - Action buttons */}
          <div className="flex items-center gap-2">
            {(state === 'success' || state === 'error') && allowInput && (
              <button
                onClick={resetCommand}
                className="px-3 py-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                Reset
              </button>
            )}

            {(state === 'idle' || state === 'error') && (
              <button
                onClick={() => executeCommand()}
                disabled={!command.trim()}
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-all',
                  'border border-neutral-300 dark:border-neutral-600',
                  'bg-white dark:bg-neutral-800',
                  '!text-neutral-700 dark:!text-neutral-300',
                  'hover:bg-neutral-50 dark:hover:bg-neutral-700',
                  'disabled:opacity-30 disabled:cursor-not-allowed',
                  '!text-lg',
                  !command.trim() && 'border-neutral-200 dark:border-neutral-700 !text-neutral-400 dark:!text-neutral-600'
                )}
                title={state === 'error' ? 'Retry' : 'Execute'}
              >
                {state === 'error' ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 8C13 10.7614 10.7614 13 8 13C5.23858 13 3 10.7614 3 8C3 5.23858 5.23858 3 8 3C9.65685 3 11.1257 3.82818 12 5.09091M12 3V5.09091M12 5.09091H9.81818" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 3L8 13M8 3L4 7M8 3L12 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Plan Modal - Only for compact mode */}
      {showPlanDetails && isCompact && state === 'plan-pending' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowPlanDetails(false)}>
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Proposed Execution Plan</h2>
              </div>
              <button
                onClick={() => setShowPlanDetails(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-180px)]">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div className="text-neutral-700 dark:text-neutral-300 whitespace-pre-line leading-relaxed">
                  {plan}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50">
              <button
                onClick={rejectPlan}
                className="px-6 py-2.5 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors font-medium"
              >
                Modify Command
              </button>
              <button
                onClick={approvePlan}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Approve & Execute
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*,application/pdf,.doc,.docx,.txt"
      />

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes pulse-border {
            0%, 100% {
              border-color: rgb(59, 130, 246);
            }
            50% {
              border-color: rgb(147, 197, 253);
            }
          }
          .animate-pulse-border {
            animation: pulse-border 2s ease-in-out infinite;
          }
        `
      }} />
    </div>
  );
}
