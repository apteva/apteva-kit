import { useEffect, useRef, useState } from 'react';
import { TableWidget } from '../../../types/widgets';
import { ActionEvent } from '../../../types/actions';
import { cn } from '../../../utils/cn';

interface TableProps {
  widget: TableWidget & { isStreaming?: boolean };
  onAction?: (action: ActionEvent) => void;
}

export function Table({ widget, onAction }: TableProps) {
  const { columns, rows, caption, compact = false, striped = false } = widget.props;
  const isStreaming = widget.isStreaming ?? false;

  // Track seen row IDs to detect new rows
  const seenRowsRef = useRef<Set<string>>(new Set());
  const [newRowIds, setNewRowIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const newIds = new Set<string>();

    // Find rows we haven't seen before
    rows.forEach((row, index) => {
      const rowId = row.id || `row-${index}`;
      if (!seenRowsRef.current.has(rowId)) {
        newIds.add(rowId);
      }
    });

    // Update seen rows
    rows.forEach((row, index) => {
      const rowId = row.id || `row-${index}`;
      seenRowsRef.current.add(rowId);
    });

    // Mark new rows for animation
    if (newIds.size > 0) {
      setNewRowIds(newIds);

      // Clear animation class after animation completes
      const timer = setTimeout(() => {
        setNewRowIds(new Set());
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [rows]);

  const getAlignment = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-left';
    }
  };

  return (
    <div className="border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          {caption && (
            <caption className="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 text-left bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
              {caption}
            </caption>
          )}
          <thead>
            <tr className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'font-semibold text-neutral-900 dark:text-white',
                    compact ? 'px-3 py-2 text-xs' : 'px-4 py-3 text-sm',
                    getAlignment(column.align)
                  )}
                  style={column.width ? { width: column.width } : undefined}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => {
              const rowId = row.id || `row-${rowIndex}`;
              const isNew = newRowIds.has(rowId);

              return (
                <tr
                  key={rowId}
                  className={cn(
                    'apteva-table-row border-b border-neutral-200 dark:border-neutral-700 last:border-b-0',
                    'transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800',
                    striped && rowIndex % 2 === 1 && 'bg-neutral-50/50 dark:bg-neutral-800/50',
                    isNew && 'apteva-table-row-new'
                  )}
                  onClick={() => {
                    if (widget.actions && widget.actions.length > 0) {
                      onAction?.({
                        type: widget.actions[0].type,
                        payload: row,
                        widgetId: widget.id,
                        timestamp: new Date(),
                      });
                    }
                  }}
                  style={{ cursor: widget.actions?.length ? 'pointer' : 'default' }}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        'text-neutral-700 dark:text-neutral-300',
                        compact ? 'px-3 py-2 text-xs' : 'px-4 py-3 text-sm',
                        getAlignment(column.align)
                      )}
                    >
                      {row[column.key] ?? '—'}
                    </td>
                  ))}
                </tr>
              );
            })}
            {rows.length === 0 && !isStreaming && (
              <tr>
                <td
                  colSpan={columns.length || 1}
                  className="px-4 py-8 text-center text-sm text-neutral-500 dark:text-neutral-400"
                >
                  No data available
                </td>
              </tr>
            )}
            {/* Streaming indicator row */}
            {isStreaming && (
              <tr className="apteva-table-streaming">
                <td
                  colSpan={columns.length || 1}
                  className="px-4 py-3 text-center"
                >
                  <div className="flex items-center justify-center gap-3 text-neutral-500 dark:text-neutral-400">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-sm">Loading more...</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
