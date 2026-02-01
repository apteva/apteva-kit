import { SuggestedPrompt } from '../../types/components';
import { cn } from '../../utils';

interface WelcomeScreenProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  prompts?: (string | SuggestedPrompt)[];
  variant?: 'centered' | 'minimal';
  chatVariant?: 'default' | 'minimal' | 'terminal';
  onPromptClick: (prompt: string) => void;
}

// Default icon - chat bubble
const DefaultIcon = () => (
  <svg className="w-12 h-12 sm:w-16 sm:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);


// Default prompt icons
const ArrowIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

export function WelcomeScreen({
  title,
  subtitle,
  icon,
  prompts,
  variant = 'centered',
  chatVariant = 'default',
  onPromptClick,
}: WelcomeScreenProps) {
  // Normalize prompts to SuggestedPrompt format
  const normalizedPrompts: SuggestedPrompt[] = (prompts || []).map((p) =>
    typeof p === 'string' ? { text: p } : p
  );

  const hasPrompts = normalizedPrompts.length > 0;
  const hasHeader = title || subtitle || icon;

  // If nothing to show, render default empty state
  if (!hasHeader && !hasPrompts) {
    return (
      <div className="flex items-center justify-center h-full !text-neutral-500 dark:!text-neutral-400">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <DefaultIcon />
          </div>
          <p className="text-sm">No messages yet. Start a conversation!</p>
        </div>
      </div>
    );
  }

  // Minimal variant - just prompts as a list (good for mobile/embedded)
  if (variant === 'minimal') {
    return (
      <div className="flex flex-col h-full px-4 py-4">
        {hasHeader && (
          <div className="mb-4">
            {title && (
              <h2 className="text-lg font-semibold !text-neutral-900 dark:!text-white">{title}</h2>
            )}
            {subtitle && (
              <p className="text-sm !text-neutral-500 dark:!text-neutral-400 mt-1">{subtitle}</p>
            )}
          </div>
        )}
        {hasPrompts && (
          <div className="flex-1 space-y-2">
            {normalizedPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => onPromptClick(prompt.text)}
                className={cn(
                  'w-full text-left px-4 py-3 rounded-xl',
                  'bg-neutral-50 dark:bg-neutral-800/50',
                  'border border-neutral-200 dark:border-neutral-700',
                  'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                  'hover:border-neutral-300 dark:hover:border-neutral-600',
                  'transition-all duration-200',
                  'group'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 !text-neutral-400 dark:!text-neutral-500 group-hover:!text-blue-500 dark:group-hover:!text-blue-400 transition-colors">
                    {prompt.icon || <ArrowIcon />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium !text-neutral-900 dark:!text-white truncate">
                      {prompt.text}
                    </p>
                    {prompt.description && (
                      <p className="text-xs !text-neutral-500 dark:!text-neutral-400 mt-0.5 truncate">
                        {prompt.description}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Centered variant - hero style with grid of prompts (default)
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-6 sm:py-8">
      {/* Header Section */}
      <div className="text-center mb-6 sm:mb-8 max-w-md">
        {/* Icon */}
        <div className="mb-4 !text-neutral-400 dark:!text-neutral-500 flex justify-center">
          {icon || <DefaultIcon />}
        </div>

        {/* Title */}
        {title && (
          <h1 className="text-xl sm:text-2xl font-semibold !text-neutral-900 dark:!text-white mb-2">
            {title}
          </h1>
        )}

        {/* Subtitle */}
        {subtitle && (
          <p className="text-sm sm:text-base !text-neutral-500 dark:!text-neutral-400">{subtitle}</p>
        )}
      </div>

      {/* Prompts Section */}
      {hasPrompts && (
        <div className="w-full max-w-2xl">
          {/* Mobile: Vertical list */}
          <div className="sm:hidden space-y-2">
            {normalizedPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => onPromptClick(prompt.text)}
                className={cn(
                  'w-full text-left px-4 py-3 rounded-xl',
                  'bg-white dark:bg-neutral-800',
                  'border border-neutral-200 dark:border-neutral-700',
                  'hover:bg-neutral-50 dark:hover:bg-neutral-700',
                  'hover:border-blue-300 dark:hover:border-blue-600',
                  'active:scale-[0.98]',
                  'transition-all duration-200',
                  'shadow-sm hover:shadow',
                  'group'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center !text-neutral-500 dark:!text-neutral-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:!text-blue-600 dark:group-hover:!text-blue-400 transition-colors">
                    {prompt.icon || <ArrowIcon />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium !text-neutral-900 dark:!text-white">
                      {prompt.text}
                    </p>
                    {prompt.description && (
                      <p className="text-xs !text-neutral-500 dark:!text-neutral-400 mt-0.5 line-clamp-1">
                        {prompt.description}
                      </p>
                    )}
                  </div>
                  <svg
                    className="w-4 h-4 !text-neutral-400 group-hover:!text-blue-500 transition-colors flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>
            ))}
          </div>

          {/* Desktop: Grid layout */}
          <div className="hidden sm:grid sm:grid-cols-2 gap-3">
            {normalizedPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => onPromptClick(prompt.text)}
                className={cn(
                  'text-left p-4 rounded-xl',
                  'bg-white dark:bg-neutral-800',
                  'border border-neutral-200 dark:border-neutral-700',
                  'hover:bg-neutral-50 dark:hover:bg-neutral-700',
                  'hover:border-blue-300 dark:hover:border-blue-600',
                  'hover:shadow-md',
                  'active:scale-[0.98]',
                  'transition-all duration-200',
                  'group'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center !text-neutral-500 dark:!text-neutral-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:!text-blue-600 dark:group-hover:!text-blue-400 transition-colors">
                    {prompt.icon || <ArrowIcon />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium !text-neutral-900 dark:!text-white leading-snug">
                      {prompt.text}
                    </p>
                    {prompt.description && (
                      <p className="text-xs !text-neutral-500 dark:!text-neutral-400 mt-1 line-clamp-2">
                        {prompt.description}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
