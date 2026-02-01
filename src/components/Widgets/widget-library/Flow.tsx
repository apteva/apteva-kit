import { FlowWidget, FlowStep } from '../../../types/widgets';
import { ActionEvent } from '../../../types/actions';

interface FlowProps {
  widget: FlowWidget;
  onAction?: (action: ActionEvent) => void;
}

// Icon components for different step types
function StepIcon({ type, status }: { type?: string; status?: FlowStep['status'] }) {
  // Status-based icons (for execution tracking)
  if (status === 'completed') {
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
    );
  }
  if (status === 'error') {
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  }
  if (status === 'active') {
    return (
      <div className="w-3.5 h-3.5 rounded-full bg-current animate-pulse" />
    );
  }

  // Type-based icons
  const iconClass = "w-4 h-4";

  if (type === 'time' || type === 'schedule' || type === 'clock') {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }
  if (type === 'recurring' || type === 'repeat') {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    );
  }
  if (type === 'agent' || type?.startsWith('@')) {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    );
  }
  if (type === 'email' || type === 'mail') {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    );
  }
  if (type === 'slack' || type === 'message' || type === 'chat') {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    );
  }
  if (type === 'webhook' || type === 'api') {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    );
  }
  if (type === 'build' || type === 'compile' || type === 'package') {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    );
  }
  if (type === 'test' || type === 'check' || type === 'verify') {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    );
  }
  if (type === 'deploy' || type === 'rocket' || type === 'launch') {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    );
  }
  if (type === 'push' || type === 'upload' || type === 'cloud') {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    );
  }
  if (type === 'generate' || type === 'create' || type === 'document' || type === 'file') {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  }
  if (type === 'review' || type === 'inspect' || type === 'eye') {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    );
  }
  if (type === 'analyze' || type === 'research' || type === 'chart') {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    );
  }
  if (type === 'scrape' || type === 'crawl' || type === 'spider') {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    );
  }
  if (type === 'data' || type === 'database' || type === 'storage') {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    );
  }
  if (type === 'notification' || type === 'bell' || type === 'alert') {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    );
  }
  if (type === 'transform' || type === 'process' || type === 'convert') {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    );
  }

  // Default circle icon
  return (
    <div className="w-2 h-2 rounded-full bg-current opacity-50" />
  );
}

// Header icon based on flow type
function HeaderIcon({ icon }: { icon?: string }) {
  const baseClass = "w-6 h-6";

  if (icon === 'research' || icon === 'multi-agent' || icon === 'agents') {
    return (
      <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
        <svg className={`${baseClass} text-purple-600 dark:text-purple-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
    );
  }
  if (icon === 'schedule' || icon === 'report' || icon === 'calendar') {
    return (
      <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center">
        <svg className={`${baseClass} text-amber-600 dark:text-amber-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }
  if (icon === 'recurring' || icon === 'repeat' || icon === 'sync') {
    return (
      <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center">
        <svg className={`${baseClass} text-cyan-600 dark:text-cyan-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </div>
    );
  }
  if (icon === 'analyze' || icon === 'analysis' || icon === 'chart') {
    return (
      <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center">
        <svg className={`${baseClass} text-cyan-600 dark:text-cyan-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
    );
  }
  if (icon === 'deploy' || icon === 'rocket' || icon === 'launch') {
    return (
      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
        <svg className={`${baseClass} text-blue-600 dark:text-blue-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
    );
  }
  if (icon === 'automation' || icon === 'workflow' || icon === 'process') {
    return (
      <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center">
        <svg className={`${baseClass} text-indigo-600 dark:text-indigo-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      </div>
    );
  }
  if (icon === 'data' || icon === 'pipeline' || icon === 'etl') {
    return (
      <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
        <svg className={`${baseClass} text-emerald-600 dark:text-emerald-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
        </svg>
      </div>
    );
  }

  // Default task/workflow icon
  return (
    <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
      <svg className={`${baseClass} text-neutral-600 dark:text-neutral-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    </div>
  );
}

function Chevron() {
  return (
    <svg className="w-4 h-4 text-neutral-400 dark:text-neutral-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

// Step color styles - using static Tailwind classes
type StepColor = 'blue' | 'purple' | 'cyan' | 'amber' | 'emerald' | 'rose' | 'indigo' | 'orange' | 'neutral';

const STEP_COLOR_CLASSES: Record<StepColor, string> = {
  blue: 'bg-blue-100 dark:bg-blue-900/40 !text-blue-700 dark:!text-blue-300 border-blue-300 dark:border-blue-500',
  purple: 'bg-purple-100 dark:bg-purple-900/40 !text-purple-700 dark:!text-purple-300 border-purple-300 dark:border-purple-500',
  cyan: 'bg-cyan-100 dark:bg-cyan-900/40 !text-cyan-700 dark:!text-cyan-300 border-cyan-300 dark:border-cyan-500',
  amber: 'bg-amber-100 dark:bg-amber-900/40 !text-amber-700 dark:!text-amber-300 border-amber-300 dark:border-amber-500',
  emerald: 'bg-emerald-100 dark:bg-emerald-900/40 !text-emerald-700 dark:!text-emerald-300 border-emerald-300 dark:border-emerald-500',
  rose: 'bg-rose-100 dark:bg-rose-900/40 !text-rose-700 dark:!text-rose-300 border-rose-300 dark:border-rose-500',
  indigo: 'bg-indigo-100 dark:bg-indigo-900/40 !text-indigo-700 dark:!text-indigo-300 border-indigo-300 dark:border-indigo-500',
  orange: 'bg-orange-100 dark:bg-orange-900/40 !text-orange-700 dark:!text-orange-300 border-orange-300 dark:border-orange-500',
  neutral: 'bg-neutral-100 dark:bg-neutral-800 !text-neutral-600 dark:!text-neutral-300 border-neutral-300 dark:border-neutral-600',
};

// Get color based on step type
function getStepColorClass(step: FlowStep, stepType?: string): string {
  // If step has explicit color
  if (step.color && STEP_COLOR_CLASSES[step.color as StepColor]) {
    return STEP_COLOR_CLASSES[step.color as StepColor];
  }

  // Auto-assign colors based on step type
  if (stepType === 'time' || stepType === 'schedule' || stepType === 'clock') {
    return STEP_COLOR_CLASSES.blue;
  }
  if (stepType === 'agent' || stepType?.startsWith('@')) {
    return STEP_COLOR_CLASSES.purple;
  }
  if (stepType === 'email' || stepType === 'slack' || stepType === 'message' || stepType === 'notification') {
    return STEP_COLOR_CLASSES.cyan;
  }
  if (stepType === 'generate' || stepType === 'document' || stepType === 'create') {
    return STEP_COLOR_CLASSES.amber;
  }
  if (stepType === 'deploy' || stepType === 'rocket' || stepType === 'launch') {
    return STEP_COLOR_CLASSES.rose;
  }
  if (stepType === 'build' || stepType === 'compile' || stepType === 'package') {
    return STEP_COLOR_CLASSES.indigo;
  }
  if (stepType === 'test' || stepType === 'check' || stepType === 'verify') {
    return STEP_COLOR_CLASSES.emerald;
  }
  if (stepType === 'data' || stepType === 'database' || stepType === 'storage') {
    return STEP_COLOR_CLASSES.orange;
  }

  // Default blue
  return STEP_COLOR_CLASSES.blue;
}

export function Flow({ widget }: FlowProps) {
  const { title, subtitle, icon, steps } = widget.props as any;

  return (
    <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-4 flex items-center gap-4">
        <HeaderIcon icon={icon} />

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base text-neutral-900 dark:text-white truncate">{title}</h3>
          {subtitle && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Steps - Horizontal pill flow */}
      <div className="px-4 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {steps.map((step: FlowStep, index: number) => {
            const isLast = index === steps.length - 1;
            const isActive = step.status === 'active';
            const isCompleted = step.status === 'completed';
            const isError = step.status === 'error';
            const isSkipped = step.status === 'skipped';

            // Determine step type from label or explicit type
            const label = step.label;
            let stepType = step.type;
            if (!stepType) {
              // Auto-detect type from label
              if (label.startsWith('@')) stepType = 'agent';
              else if (/^\d+[ap]m$/i.test(label) || /^(mon|tue|wed|thu|fri|sat|sun)/i.test(label)) stepType = 'time';
              else {
                const lowerLabel = label.toLowerCase();
                const typeMap: Record<string, string> = {
                  'test': 'test', 'build': 'build', 'push': 'push', 'deploy': 'deploy',
                  'email': 'email', 'slack': 'slack', 'generate': 'generate', 'review': 'review',
                  'analyze': 'analyze', 'scrape': 'scrape', 'transform': 'transform',
                  'notify': 'notification', 'alert': 'notification', 'webhook': 'webhook',
                  'api': 'api', 'data': 'data', 'process': 'process'
                };
                stepType = typeMap[lowerLabel];
              }
            }

            // Get classes based on status or step type
            let pillClasses: string;
            let extraClasses = '';

            if (isActive) {
              pillClasses = 'bg-blue-100 dark:bg-blue-900/40 !text-blue-700 dark:!text-blue-300 border-blue-400 dark:border-blue-400 ring-2 ring-blue-400';
            } else if (isCompleted) {
              pillClasses = 'bg-emerald-100 dark:bg-emerald-900/40 !text-emerald-700 dark:!text-emerald-300 border-emerald-400 dark:border-emerald-400';
            } else if (isError) {
              pillClasses = 'bg-red-100 dark:bg-red-900/40 !text-red-700 dark:!text-red-300 border-red-400 dark:border-red-400';
            } else if (isSkipped) {
              pillClasses = 'bg-neutral-100 dark:bg-neutral-800 !text-neutral-400 dark:!text-neutral-500 border-neutral-300 dark:border-neutral-600';
              extraClasses = 'line-through';
            } else {
              // Proposal mode - use colorful pills based on type
              pillClasses = getStepColorClass(step, stepType);
            }

            return (
              <div key={step.id} className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${pillClasses} ${extraClasses}`}>
                  <StepIcon type={stepType} status={step.status} />
                  {label}
                </span>
                {!isLast && <Chevron />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
