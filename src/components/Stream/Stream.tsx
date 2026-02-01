import { useState, useEffect } from 'react';
import { StreamProps } from '../../types/components';
import { cn, generateMockStreamingResponse } from '../../utils';
import { aptevaClient } from '../../lib/apteva-client';

export function Stream({
  agentId,
  prompt,
  context,
  autoStart = false,
  useMock = true,
  onStart,
  onChunk,
  onComplete,
  onError,
  variant = 'prose',
  showCursor = true,
  typingSpeed = 30,
  className,
}: StreamProps) {
  const [text, setText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (autoStart && !isStreaming && !isComplete) {
      startStreaming();
    }
  }, [autoStart]);

  const startStreaming = async () => {
    setIsStreaming(true);
    onStart?.();

    try {
      if (useMock) {
        // MOCK MODE
        const mockText =
          'This is a simulated streaming response from the AI agent. ' +
          'In a real implementation, this would stream data from your backend API. ' +
          'The text appears word by word to simulate the streaming effect. ' +
          'You can customize the typing speed and styling based on your needs.';

        await generateMockStreamingResponse(
          mockText,
          (chunk) => {
            setText((prev) => prev + chunk);
            onChunk?.(chunk);
          },
          typingSpeed
        );

        setIsComplete(true);
        setIsStreaming(false);
        onComplete?.(text + mockText);
      } else {
        // REAL API MODE
        let accumulatedText = '';

        await aptevaClient.chatStream(
          {
            agent_id: agentId,
            message: prompt,
            stream: true,
          },
          (chunk) => {
            if (chunk.type === 'token' && chunk.content) {
              accumulatedText += chunk.content;
              setText(accumulatedText);
              onChunk?.(chunk.content);
            }
          },
          () => {
            // On complete
            setIsComplete(true);
            setIsStreaming(false);
            onComplete?.(accumulatedText);
          },
          (error) => {
            // On error
            const err = error instanceof Error ? error : new Error('Streaming error');
            onError?.(err);
            setIsStreaming(false);
          }
        );
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Streaming error');
      onError?.(err);
      setIsStreaming(false);
    }
  };

  const variantClasses = {
    prose: 'prose prose-sm max-w-none dark:prose-invert',
    code: 'font-mono text-sm bg-neutral-900 text-green-400 p-4 rounded-lg',
    plain: 'text-neutral-900 dark:text-neutral-100',
  };

  if (!isStreaming && !isComplete) {
    return (
      <div className={cn('p-4', className)}>
        <button
          onClick={startStreaming}
          className="px-6 py-3 bg-apteva-500 text-white rounded-lg hover:bg-apteva-600 transition-colors font-medium"
        >
          Start Streaming
        </button>
      </div>
    );
  }

  return (
    <div className={cn(variantClasses[variant], className)}>
      {text}
      {isStreaming && showCursor && <span className="apteva-stream-cursor" />}
    </div>
  );
}
