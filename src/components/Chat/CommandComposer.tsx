import { useState, useRef, KeyboardEvent } from 'react';
import { cn, validateFile, formatFileSize } from '../../utils';

type CommandState = 'idle' | 'loading' | 'success' | 'error' | 'plan-pending';

interface PendingFile {
  file: File;
  preview?: string;
}

interface CommandComposerProps {
  onExecute: (command: string, files?: File[]) => void;
  state: CommandState;
  response?: string;
  error?: string;
  plan?: string;
  streamedContent?: string;
  toolName?: string | null;
  onApprove?: () => void;
  onReject?: () => void;
  onReset?: () => void;
  onStop?: () => void;
  onExpand?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export function CommandComposer({
  onExecute,
  state,
  response,
  error,
  plan,
  streamedContent,
  toolName,
  onApprove,
  onReject,
  onReset,
  onStop,
  onExpand,
  placeholder = 'Enter your command...',
  disabled = false,
}: CommandComposerProps) {
  const [input, setInput] = useState('');
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = () => {
    const hasText = input.trim();
    const hasFiles = pendingFiles.length > 0;

    if ((hasText || hasFiles) && !disabled && state === 'idle') {
      const filesToSend = pendingFiles.map(pf => pf.file);
      onExecute(input.trim(), filesToSend.length > 0 ? filesToSend : undefined);
      setInput('');
      setPendingFiles([]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleNewCommand = () => {
    onReset?.();
    inputRef.current?.focus();
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const validFiles: PendingFile[] = [];
      const errors: string[] = [];

      files.forEach(file => {
        const validation = validateFile(file);
        if (validation.valid) {
          const pending: PendingFile = { file };
          if (file.type.startsWith('image/')) {
            pending.preview = URL.createObjectURL(file);
          }
          validFiles.push(pending);
        } else {
          errors.push(validation.error || 'Invalid file');
        }
      });

      if (validFiles.length > 0) {
        setPendingFiles(prev => [...prev, ...validFiles]);
      }

      if (errors.length > 0) {
        setFileError(errors.join(', '));
        setTimeout(() => setFileError(null), 5000);
      }

      setShowMenu(false);
      e.target.value = '';
    }
  };

  const removeFile = (index: number) => {
    setPendingFiles(prev => {
      const file = prev[index];
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    }
    if (mimeType === 'application/pdf') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  };

  // Get display content based on state - show ONE thing at a time, replacing previous
  const getDisplayContent = (): { text: string; isToolCall: boolean } => {
    if (state === 'loading') {
      // Priority: tool call > streamed content > processing message
      if (toolName) {
        return { text: toolName, isToolCall: true };
      }
      // Only show streamed content if we have it (and no active tool)
      if (streamedContent) {
        return { text: streamedContent, isToolCall: false };
      }
      return { text: 'Processing...', isToolCall: false };
    }
    if (state === 'success' && response) {
      return { text: response, isToolCall: false };
    }
    if (state === 'error' && error) {
      return { text: error, isToolCall: false };
    }
    if (state === 'plan-pending' && plan) {
      return { text: plan, isToolCall: false };
    }
    return { text: '', isToolCall: false };
  };

  const isShowingResult = state !== 'idle';
  const { text: displayContent, isToolCall } = getDisplayContent();

  return (
    <div className="w-full relative">
      {/* File Error Toast */}
      {fileError && (
        <div className="apteva-file-error" style={{ top: '-3rem', bottom: 'auto' }}>
          <div className="apteva-file-error-content">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{fileError}</span>
          </div>
        </div>
      )}

      {/* Single input/output box */}
      <div
        className={cn(
          'apteva-composer flex items-center gap-2 px-3 py-2 border-2 bg-white dark:bg-neutral-900 transition-all duration-200',
          state === 'idle' && 'border-neutral-200 dark:border-neutral-700',
          state === 'loading' && 'border-blue-400 dark:border-blue-500',
          state === 'plan-pending' && 'border-amber-400 dark:border-amber-500',
          state === 'success' && 'border-green-400 dark:border-green-500',
          state === 'error' && 'border-red-400 dark:border-red-500'
        )}
      >
        {/* Left side indicator area - fixed width to prevent layout shift */}
        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
          {/* Add file button - only in idle state */}
          {state === 'idle' && (
            <div className="relative">
              <button
                ref={menuButtonRef}
                onClick={() => setShowMenu(!showMenu)}
                className="apteva-composer-menu-btn w-8 h-8 rounded-lg flex items-center justify-center transition-all !text-neutral-500 dark:!text-neutral-400 hover:!text-neutral-700 dark:hover:!text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                title="More options"
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 5v10M5 10h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Menu Popup - fixed positioning to escape overflow:hidden */}
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-[9998]" onClick={() => setShowMenu(false)} />
                  <div
                    className="apteva-composer-menu fixed bg-neutral-800 dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden z-[9999] min-w-[200px]"
                    style={{
                      left: menuButtonRef.current?.getBoundingClientRect().left ?? 0,
                      top: (menuButtonRef.current?.getBoundingClientRect().bottom ?? 0) + 8,
                    }}
                  >
                    <button
                      onClick={() => {
                        fileInputRef.current?.click();
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-700 dark:hover:bg-neutral-700 transition-colors !text-white text-left"
                    >
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.5 3.5L5.5 8.5C4.67157 9.32843 4.67157 10.6716 5.5 11.5C6.32843 12.3284 7.67157 12.3284 8.5 11.5L14.5 5.5C15.8807 4.11929 15.8807 1.88071 14.5 0.5C13.1193 -0.880711 10.8807 -0.880711 9.5 0.5L3.5 6.5C1.56846 8.43154 1.56846 11.5685 3.5 13.5C5.43154 15.4315 8.56846 15.4315 10.5 13.5L15.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform="translate(2, 3)"/>
                      </svg>
                      <span className="!text-sm font-medium">Add photos & files</span>
                    </button>
                    {onExpand && (
                      <button
                        onClick={() => {
                          onExpand();
                          setShowMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-700 dark:hover:bg-neutral-700 transition-colors !text-white text-left border-t border-neutral-700 dark:border-neutral-700"
                      >
                        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="!text-sm font-medium">Expand to chat</span>
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Loading spinner - show when loading without tool */}
          {state === 'loading' && !toolName && (
            <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
          )}

          {/* Tool indicator - blinking dot like in chat mode */}
          {state === 'loading' && toolName && (
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          )}
        </div>

        {/* Inline file badges - compact display */}
        {pendingFiles.length > 0 && state === 'idle' && (
          <div className="apteva-file-badges">
            {pendingFiles.map((pf, index) => (
              <div key={index} className="apteva-file-badge" title={pf.file.name}>
                {pf.preview ? (
                  <img src={pf.preview} alt={pf.file.name} className="apteva-file-badge-img" />
                ) : (
                  <span className="apteva-file-badge-icon">
                    {getFileIcon(pf.file.type)}
                  </span>
                )}
                <button
                  onClick={() => removeFile(index)}
                  className="apteva-file-badge-remove"
                  title="Remove"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Content area - input OR result */}
        {state === 'idle' ? (
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={pendingFiles.length > 0 ? 'Add a message...' : placeholder}
            disabled={disabled}
            rows={1}
            className={cn(
              'flex-1 resize-none bg-transparent border-none focus:outline-none',
              '!text-neutral-900 dark:!text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500',
              'text-sm leading-relaxed py-1',
              'disabled:opacity-50'
            )}
            style={{ minHeight: '24px', maxHeight: '120px' }}
          />
        ) : (
          <div
            className={cn(
              'flex-1 text-sm py-1 truncate flex items-center gap-2',
              state === 'loading' && !isToolCall && '!text-neutral-600 dark:!text-neutral-400',
              state === 'loading' && isToolCall && '!text-blue-600 dark:!text-blue-400',
              state === 'success' && '!text-neutral-900 dark:!text-neutral-100',
              state === 'error' && '!text-red-600 dark:!text-red-400',
              state === 'plan-pending' && '!text-amber-700 dark:!text-amber-300'
            )}
          >
            {isToolCall ? (
              <>
                <span className="font-mono">{displayContent}</span>
                <span className="text-neutral-400 dark:text-neutral-500">Running...</span>
              </>
            ) : (
              displayContent
            )}
          </div>
        )}

        {/* Action buttons - fixed width container to prevent layout shift */}
        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
          {/* Plan mode buttons - these expand, so handle separately */}
          {state === 'plan-pending' ? (
            <div className="flex items-center gap-1">
              <button
                onClick={onApprove}
                className="px-2 py-1 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-xs font-medium"
              >
                Approve
              </button>
              <button
                onClick={onReject}
                className="px-2 py-1 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors text-xs font-medium"
              >
                Modify
              </button>
            </div>
          ) : (
            <>
              {/* Stop button - during loading */}
              {state === 'loading' && onStop && (
                <button
                  onClick={onStop}
                  className="apteva-composer-stop-btn"
                  title="Stop generation"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="2" width="10" height="10" rx="1" fill="currentColor"/>
                  </svg>
                </button>
              )}

              {/* Clear/New command button - after result */}
              {(state === 'success' || state === 'error') && (
                <button
                  onClick={handleNewCommand}
                  className="w-8 h-8 rounded-lg flex items-center justify-center !text-neutral-400 hover:!text-neutral-600 dark:hover:!text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  title="New command"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}

              {/* Send button - only in idle state */}
              {state === 'idle' && (
                <button
                  onClick={handleSubmit}
                  disabled={(!input.trim() && pendingFiles.length === 0) || disabled}
                  className={cn(
                    'apteva-composer-send-btn w-8 h-8 rounded-lg flex items-center justify-center transition-all',
                    'border border-neutral-200 dark:border-neutral-700',
                    'disabled:opacity-30 disabled:cursor-not-allowed',
                    (input.trim() || pendingFiles.length > 0)
                      ? 'bg-neutral-900 dark:bg-white !text-white dark:!text-neutral-900 border-neutral-900 dark:border-white'
                      : 'bg-white dark:bg-neutral-800 !text-neutral-400'
                  )}
                  title="Execute command"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*,application/pdf,.doc,.docx,.txt"
      />
    </div>
  );
}
