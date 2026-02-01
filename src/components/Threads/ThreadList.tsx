import { useState } from 'react';
import { Thread } from '../../types/messages';
import { ThreadItem } from './ThreadItem';

interface ThreadListProps {
  threads: Thread[];
  currentThreadId?: string;
  onThreadSelect?: (threadId: string) => void;
  onThreadDelete?: (threadId: string) => void;
  showSearch?: boolean;
  groupBy?: 'date' | 'agent' | 'none';
}

export function ThreadList({
  threads,
  currentThreadId,
  onThreadSelect,
  onThreadDelete,
  showSearch = false,
  groupBy = 'none',
}: ThreadListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredThreads = threads.filter(
    (thread) =>
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.preview?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedThreads = groupBy === 'date' ? groupThreadsByDate(filteredThreads) : { All: filteredThreads };

  return (
    <div className="flex flex-col h-full">
      {showSearch && (
        <div className="p-3 border-b border-neutral-200 dark:border-neutral-700">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-apteva-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-white"
          />
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {Object.entries(groupedThreads).map(([group, groupThreads]) => (
          <div key={group}>
            {groupBy !== 'none' && (
              <div className="px-3 py-2 text-xs font-semibold text-neutral-500 uppercase">{group}</div>
            )}
            {groupThreads.map((thread) => (
              <ThreadItem
                key={thread.id}
                thread={thread}
                isActive={thread.id === currentThreadId}
                onSelect={() => onThreadSelect?.(thread.id)}
                onDelete={() => onThreadDelete?.(thread.id)}
              />
            ))}
          </div>
        ))}

        {filteredThreads.length === 0 && (
          <div className="p-8 text-center text-neutral-500">
            <svg className="w-10 h-10 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p>No conversations found</p>
          </div>
        )}
      </div>
    </div>
  );
}

function groupThreadsByDate(threads: Thread[]): Record<string, Thread[]> {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  return threads.reduce(
    (groups, thread) => {
      const threadDate = new Date(thread.updatedAt);
      let group = 'Older';

      if (threadDate >= today) {
        group = 'Today';
      } else if (threadDate >= yesterday) {
        group = 'Yesterday';
      } else if (threadDate >= lastWeek) {
        group = 'Last 7 Days';
      }

      if (!groups[group]) groups[group] = [];
      groups[group].push(thread);
      return groups;
    },
    {} as Record<string, Thread[]>
  );
}
