import { cn } from '../../utils/cn';

interface WidgetSkeletonProps {
  type: string;
  className?: string;
}

export function WidgetSkeleton({ type, className }: WidgetSkeletonProps) {
  // Render different skeletons based on widget type
  // Using neutral colors for true black/white theme
  switch (type) {
    case 'card':
      return (
        <div className={cn('apteva-widget-skeleton animate-pulse rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden', className)}>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
            <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
            <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-5/6"></div>
          </div>
        </div>
      );

    case 'list':
      return (
        <div className={cn('apteva-widget-skeleton animate-pulse space-y-2', className)}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-full flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"></div>
                <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      );

    case 'button_group':
      return (
        <div className={cn('apteva-widget-skeleton animate-pulse flex gap-2', className)}>
          <div className="h-9 bg-neutral-200 dark:bg-neutral-700 rounded-lg w-20"></div>
          <div className="h-9 bg-neutral-200 dark:bg-neutral-700 rounded-lg w-20"></div>
          <div className="h-9 bg-neutral-200 dark:bg-neutral-700 rounded-lg w-20"></div>
        </div>
      );

    case 'form':
      return (
        <div className={cn('apteva-widget-skeleton animate-pulse rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 space-y-4', className)}>
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3"></div>
          <div className="space-y-3">
            <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
            <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
          </div>
          <div className="h-9 bg-neutral-200 dark:bg-neutral-700 rounded w-24"></div>
        </div>
      );

    case 'chart':
      return (
        <div className={cn('apteva-widget-skeleton animate-pulse rounded-lg border border-neutral-200 dark:border-neutral-800 p-4', className)}>
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4 mb-4"></div>
          <div className="flex items-end gap-2 h-32">
            <div className="flex-1 bg-neutral-200 dark:bg-neutral-700 rounded-t h-1/2"></div>
            <div className="flex-1 bg-neutral-200 dark:bg-neutral-700 rounded-t h-3/4"></div>
            <div className="flex-1 bg-neutral-200 dark:bg-neutral-700 rounded-t h-1/3"></div>
            <div className="flex-1 bg-neutral-200 dark:bg-neutral-700 rounded-t h-full"></div>
            <div className="flex-1 bg-neutral-200 dark:bg-neutral-700 rounded-t h-2/3"></div>
          </div>
        </div>
      );

    case 'image':
      return (
        <div className={cn('apteva-widget-skeleton animate-pulse', className)}>
          <div className="aspect-video bg-neutral-200 dark:bg-neutral-700 rounded-lg"></div>
        </div>
      );

    case 'gallery':
      return (
        <div className={cn('apteva-widget-skeleton animate-pulse grid grid-cols-3 gap-2', className)}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-square bg-neutral-200 dark:bg-neutral-700 rounded-lg"></div>
          ))}
        </div>
      );

    case 'map':
      return (
        <div className={cn('apteva-widget-skeleton animate-pulse', className)}>
          <div className="h-48 bg-neutral-200 dark:bg-neutral-700 rounded-lg flex items-center justify-center">
            <svg className="w-8 h-8 text-neutral-400 dark:text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
      );

    case 'table':
      return (
        <div className={cn('apteva-widget-skeleton animate-pulse rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden', className)}>
          {/* Header */}
          <div className="flex bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
            <div className="flex-1 px-4 py-3">
              <div className="h-3 bg-neutral-300 dark:bg-neutral-600 rounded w-16"></div>
            </div>
            <div className="flex-1 px-4 py-3">
              <div className="h-3 bg-neutral-300 dark:bg-neutral-600 rounded w-20"></div>
            </div>
            <div className="flex-1 px-4 py-3">
              <div className="h-3 bg-neutral-300 dark:bg-neutral-600 rounded w-14"></div>
            </div>
          </div>
          {/* Rows */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex border-b border-neutral-200 dark:border-neutral-800 last:border-b-0">
              <div className="flex-1 px-4 py-3">
                <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-24"></div>
              </div>
              <div className="flex-1 px-4 py-3">
                <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-16"></div>
              </div>
              <div className="flex-1 px-4 py-3">
                <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      );

    default:
      // Generic skeleton for unknown widget types
      return (
        <div className={cn('apteva-widget-skeleton animate-pulse rounded-lg border border-neutral-200 dark:border-neutral-800 p-4', className)}>
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
        </div>
      );
  }
}
