// No direct imports needed 'react';
import { ThreadsProps } from '../../types/components';
import { ThreadList } from './ThreadList';
import { cn } from '../../utils';

export function Threads({
  threads,
  currentThreadId,
  onThreadSelect,
  onThreadDelete,
  onNewThread,
  variant = 'sidebar',
  showSearch = false,
  showNewButton = true,
  groupBy = 'none',
  className,
}: ThreadsProps) {
  const variantClasses = {
    sidebar: 'h-full border-r border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900',
    dropdown: 'absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 max-h-96 overflow-hidden',
    tabs: 'flex gap-2 border-b border-neutral-200 dark:border-neutral-700 overflow-x-auto',
  };

  if (variant === 'tabs') {
    return (
      <div className={cn(variantClasses[variant], className)}>
        {threads.slice(0, 5).map((thread) => (
          <button
            key={thread.id}
            onClick={() => onThreadSelect?.(thread.id)}
            className={cn(
              'px-4 py-2 whitespace-nowrap font-medium transition-colors',
              thread.id === currentThreadId
                ? 'border-b-2 border-apteva-500 text-apteva-500'
                : 'text-neutral-600 hover:text-neutral-900'
            )}
          >
            {thread.title}
          </button>
        ))}
        {showNewButton && onNewThread && (
          <button
            onClick={onNewThread}
            className="px-4 py-2 text-neutral-600 hover:text-apteva-500 transition-colors font-medium"
          >
            + New
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={cn(variantClasses[variant], 'flex flex-col', className)}>
      {showNewButton && onNewThread && (
        <div className="p-3 border-b border-neutral-200 dark:border-neutral-700">
          <button
            onClick={onNewThread}
            className="w-full px-4 py-2 bg-apteva-500 text-white rounded-lg hover:bg-apteva-600 transition-colors font-medium"
          >
            + New Conversation
          </button>
        </div>
      )}

      <ThreadList
        threads={threads}
        currentThreadId={currentThreadId}
        onThreadSelect={onThreadSelect}
        onThreadDelete={onThreadDelete}
        showSearch={showSearch}
        groupBy={groupBy}
      />
    </div>
  );
}
