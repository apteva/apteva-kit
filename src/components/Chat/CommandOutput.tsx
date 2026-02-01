import { useState } from 'react';
import { cn } from '../../utils';
import { Widget } from '../../types/widgets';
import { WidgetRenderer } from '../Widgets/WidgetRenderer';
import { MarkdownContent } from './MarkdownContent';
import { ActionEvent } from '../../types/actions';

interface CommandOutputProps {
  state: 'idle' | 'loading' | 'success' | 'error' | 'plan-pending';
  streamedContent?: string;
  loadingText?: string;
  progress?: number;
  showProgress?: boolean;
  plan?: string;
  error?: Error | null;
  result?: {
    success: boolean;
    data: any;
    widgets?: Widget[];
    message?: string;
  } | null;
  onApprove?: () => void;
  onReject?: () => void;
  onReset?: () => void;
  onAction?: (action: ActionEvent) => void;
}

export function CommandOutput({
  state,
  streamedContent,
  loadingText = 'Processing...',
  progress = 0,
  showProgress = true,
  plan,
  error,
  result,
  onApprove,
  onReject,
  onReset,
  onAction,
}: CommandOutputProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Don't render anything in idle state
  if (state === 'idle') {
    return null;
  }

  // Loading state - compact inline indicator
  if (state === 'loading') {
    return (
      <div className="mx-4 mb-3">
        <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-blue-700 dark:text-blue-300 truncate">
              {streamedContent || loadingText}
            </p>
            {showProgress && progress > 0 && (
              <div className="mt-2 w-full bg-blue-200 dark:bg-blue-800 rounded-full h-1">
                <div
                  className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Plan pending state
  if (state === 'plan-pending' && plan) {
    return (
      <div className="mx-4 mb-3">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <div className="flex items-start gap-3 mb-3">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">Proposed Plan</h3>
              <div className="text-blue-700 dark:text-blue-300 text-sm whitespace-pre-line leading-relaxed">
                {plan}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onApprove}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Approve & Execute
            </button>
            <button
              onClick={onReject}
              className="flex-1 px-4 py-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors text-sm font-medium"
            >
              Modify
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (state === 'error' && error) {
    return (
      <div className="mx-4 mb-3">
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800 dark:text-red-400">Error</h3>
              <p className="text-red-700 dark:text-red-300 text-sm mt-1">{error.message}</p>
            </div>
            <button
              onClick={onReset}
              className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
              title="Dismiss"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success state - collapsible
  if (state === 'success' && result) {
    const hasDetailedContent = result.data?.summary || (result.widgets && result.widgets.length > 0);

    return (
      <div className="mx-4 mb-3">
        <div className={cn(
          "border border-green-200 dark:border-green-800 rounded-xl overflow-hidden transition-all duration-200",
          isExpanded ? "bg-white dark:bg-neutral-900" : "bg-green-50 dark:bg-green-900/20"
        )}>
          {/* Collapsed header - always visible */}
          <div
            className={cn(
              "flex items-center gap-3 p-3 cursor-pointer",
              isExpanded && "border-b border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
            )}
            onClick={() => hasDetailedContent && setIsExpanded(!isExpanded)}
          >
            <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-green-700 dark:text-green-300 truncate">
                {result.message || 'Command executed successfully'}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {hasDetailedContent && (
                <button
                  className="p-1.5 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                  title={isExpanded ? "Collapse" : "Expand"}
                >
                  <svg
                    className={cn("w-4 h-4 transition-transform duration-200", isExpanded && "rotate-180")}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReset?.();
                }}
                className="p-1.5 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                title="New command"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Expanded content */}
          {isExpanded && hasDetailedContent && (
            <div className="p-4 space-y-4">
              {result.data?.summary && (
                <div className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed">
                  <MarkdownContent content={result.data.summary} />
                </div>
              )}
              {result.widgets && result.widgets.length > 0 && (
                <div className="space-y-3">
                  {result.widgets.map((widget) => (
                    <WidgetRenderer key={widget.id} widget={widget} onAction={onAction} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
