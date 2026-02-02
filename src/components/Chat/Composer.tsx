import { useState, KeyboardEvent, useRef } from 'react';
import { validateFile, formatFileSize } from '../../utils';

interface ComposerProps {
  onSendMessage: (text: string, files?: File[]) => void;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  onStop?: () => void;
  onFileUpload?: (files: FileList) => void;
  onSwitchMode?: () => void;
}

interface PendingFile {
  file: File;
  preview?: string;
}

export function Composer({ onSendMessage, placeholder = 'Type a message...', disabled = false, isLoading = false, onStop, onFileUpload, onSwitchMode }: ComposerProps) {
  const [text, setText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isMultiLine, setIsMultiLine] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const hasText = text.trim();
    const hasFiles = pendingFiles.length > 0;

    if ((hasText || hasFiles) && !disabled) {
      const filesToSend = pendingFiles.map(pf => pf.file);
      onSendMessage(text.trim(), filesToSend.length > 0 ? filesToSend : undefined);
      setText('');
      setPendingFiles([]);
      setFileError(null);
      setIsMultiLine(false);
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);

    // Reset height to measure true content height
    e.target.style.height = 'auto';
    const scrollHeight = e.target.scrollHeight;
    e.target.style.height = `${scrollHeight}px`;

    const hasNewline = e.target.value.includes('\n');

    // Single line height ≈ line-height + vertical padding (~36px)
    const singleLineHeight = 36;
    const isOverflowing = scrollHeight > singleLineHeight;

    // Switch TO multi-line when:
    // 1. User explicitly added newline (Shift+Enter), OR
    // 2. Content actually overflows to second line
    if (!isMultiLine && (hasNewline || isOverflowing)) {
      setIsMultiLine(true);
    }
    // Switch BACK to single-line when:
    // 1. No newlines, AND
    // 2. Content fits in single line, AND
    // 3. Text is short (hysteresis to prevent flicker)
    else if (isMultiLine && !hasNewline && !isOverflowing && e.target.value.length < 20) {
      setIsMultiLine(false);
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
          // Create preview for images
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

      // Also call the legacy callback if provided
      onFileUpload?.(e.target.files);
      setShowMenu(false);

      // Reset input so same file can be selected again
      e.target.value = '';
    }
  };

  const removeFile = (index: number) => {
    setPendingFiles(prev => {
      const file = prev[index];
      // Revoke object URL to prevent memory leak
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

  return (
    <div className="px-4 py-3 relative">
      {/* File Error Toast */}
      {fileError && (
        <div className="apteva-file-error">
          <div className="apteva-file-error-content">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{fileError}</span>
          </div>
        </div>
      )}

      {/* Pending Files Preview */}
      {pendingFiles.length > 0 && (
        <div className="apteva-file-preview">
          {pendingFiles.map((pf, index) => (
            <div key={index} className="apteva-file-item">
              {pf.preview ? (
                <img src={pf.preview} alt={pf.file.name} className="apteva-file-thumb" />
              ) : (
                <div className="apteva-file-icon">
                  {getFileIcon(pf.file.type)}
                </div>
              )}
              <div className="apteva-file-info">
                <span className="apteva-file-name">{pf.file.name}</span>
                <span className="apteva-file-size">{formatFileSize(pf.file.size)}</span>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="apteva-file-remove"
                title="Remove file"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        className="apteva-composer"
        style={{
          gridTemplateColumns: 'auto 1fr auto',
          gridTemplateAreas: isMultiLine
            ? '"textarea textarea textarea" "plus . send"'
            : '"plus textarea send"',
          alignItems: 'end'
        }}
      >
        {/* Menu button */}
        <div className="relative flex-shrink-0 self-end" style={{ gridArea: 'plus' }}>
          <button
            ref={menuButtonRef}
            onClick={() => setShowMenu(!showMenu)}
            className="apteva-composer-menu-btn w-8 h-8 rounded-lg flex items-center justify-center transition-all !text-neutral-700 dark:!text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            title="More options"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                  bottom: window.innerHeight - (menuButtonRef.current?.getBoundingClientRect().top ?? 0) + 8,
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
                {onSwitchMode && (
                  <button
                    onClick={() => {
                      onSwitchMode();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-700 dark:hover:bg-neutral-700 transition-colors !text-white text-left border-t border-neutral-700 dark:border-neutral-700"
                  >
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="!text-sm font-medium">Switch to command mode</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="apteva-composer-textarea resize-none bg-transparent border-none focus:outline-none !text-neutral-900 dark:!text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 py-1 disabled:opacity-50 disabled:cursor-not-allowed overflow-y-auto max-h-[200px]"
          style={{ gridArea: 'textarea' }}
          rows={1}
        />

        {/* Send/Stop button */}
        <div className="self-end" style={{ gridArea: 'send' }}>
          {isLoading && onStop ? (
            <button
              onClick={onStop}
              className="apteva-composer-stop-btn"
              title="Stop generation"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="10" height="10" rx="1" fill="currentColor"/>
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={(!text.trim() && pendingFiles.length === 0) || disabled}
              className="apteva-composer-send-btn w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-all flex-shrink-0 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 !text-neutral-700 dark:!text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed !text-lg"
              title="Send message"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3L8 13M8 3L4 7M8 3L12 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
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
