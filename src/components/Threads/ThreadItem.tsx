// No direct imports needed 'react';
import { Thread } from '../../types/messages';
import { cn } from '../../utils';

interface ThreadItemProps {
  thread: Thread;
  isActive?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
}

export function ThreadItem({ thread, isActive = false, onSelect, onDelete }: ThreadItemProps) {
  return (
    <div
      className={cn('apteva-thread-item', {
        'apteva-thread-item-active': isActive,
      })}
      onClick={onSelect}
    >
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-neutral-900 dark:text-white truncate">{thread.title}</h4>
        {thread.preview && <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate">{thread.preview}</p>}
        <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
          <span>{thread.messageCount} messages</span>
          <span>•</span>
          <span>{formatRelativeTime(thread.updatedAt)}</span>
        </div>
      </div>

      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
          title="Delete thread"
        >
          🗑️
        </button>
      )}
    </div>
  );
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}
