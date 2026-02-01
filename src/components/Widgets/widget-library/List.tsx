import { useEffect, useRef, useState } from 'react';
import { ListWidget } from '../../../types/widgets';
import { ActionEvent } from '../../../types/actions';

interface ListProps {
  widget: ListWidget & { isStreaming?: boolean };
  onAction?: (action: ActionEvent) => void;
}

export function List({ widget, onAction }: ListProps) {
  const { items } = widget.props;
  const isStreaming = widget.isStreaming ?? false;

  // Track seen item IDs to detect new items
  const seenItemsRef = useRef<Set<string>>(new Set());
  const [newItemIds, setNewItemIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const currentIds = new Set(items.map(item => item.id));
    const newIds = new Set<string>();

    // Find items we haven't seen before
    items.forEach(item => {
      if (!seenItemsRef.current.has(item.id)) {
        newIds.add(item.id);
      }
    });

    // Update seen items
    items.forEach(item => seenItemsRef.current.add(item.id));

    // Mark new items for animation
    if (newIds.size > 0) {
      setNewItemIds(newIds);

      // Clear animation class after animation completes
      const timer = setTimeout(() => {
        setNewItemIds(new Set());
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [items]);

  return (
    <div className="border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 overflow-hidden">
      {items.map((item, index) => {
        const isNew = newItemIds.has(item.id);
        const isLast = index === items.length - 1;

        return (
          <div
            key={item.id}
            className={`apteva-list-item flex items-center p-4 transition-colors ${
              !isLast || isStreaming ? 'border-b border-neutral-200 dark:border-neutral-700' : ''
            } ${!item.backgroundColor ? 'hover:bg-neutral-50 dark:hover:bg-neutral-800' : ''} ${
              isNew ? 'apteva-list-item-new' : ''
            }`}
            style={item.backgroundColor ? { backgroundColor: item.backgroundColor } : undefined}
          >
            {item.image && <img src={item.image} alt={item.title} className="w-16 h-16 rounded object-cover" />}

            <div className={`flex-1 ${item.image ? 'ml-4' : ''}`}>
              <h4 className="font-semibold !text-neutral-900 dark:!text-white">{item.title}</h4>
              {item.subtitle && <p className="!text-sm !text-neutral-600 dark:!text-neutral-400">{item.subtitle}</p>}
              {item.description && (
                <p className="!text-xs !text-neutral-500 dark:!text-neutral-500 mt-1">{item.description}</p>
              )}
            </div>

            {widget.actions && widget.actions.length > 0 && (
              <div className="flex gap-2">
                {widget.actions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      onAction?.({
                        type: action.type,
                        payload: item.metadata || item,
                        widgetId: widget.id,
                        timestamp: new Date(),
                      })
                    }
                    className="px-3 py-1.5 !text-sm rounded-lg font-medium transition-colors bg-blue-500 !text-white hover:bg-blue-600"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Streaming indicator */}
      {isStreaming && (
        <div className="apteva-list-streaming flex items-center gap-3 p-4 text-neutral-500 dark:text-neutral-400">
          <div className="apteva-streaming-dots flex gap-1">
            <span className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-sm">Loading more...</span>
        </div>
      )}
    </div>
  );
}
