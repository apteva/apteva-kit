import Link from 'next/link';
import { ReactNode } from 'react';

interface ExampleLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  controls: ReactNode;
}

export function ExampleLayout({ title, description, children, controls }: ExampleLayoutProps) {
  return (
    <div className="h-screen flex flex-col bg-neutral-100 dark:bg-black">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 bg-white dark:bg-neutral-900">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">{title}</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-500">{description}</p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            ← Back to Examples
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex gap-6 p-6 overflow-hidden">
        {/* Component Preview */}
        <div className="flex-1 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          {children}
        </div>

        {/* Controls */}
        <div className="w-80 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 overflow-y-auto">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">Configuration</h2>
          {controls}
        </div>
      </div>
    </div>
  );
}
