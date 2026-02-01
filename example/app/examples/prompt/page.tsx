'use client';

import { Prompt } from '@apteva/apteva-kit';
import Link from 'next/link';
import { useState } from 'react';
import { MockToggle } from '../../../components/MockToggle';

export default function PromptExample() {
  const [generatedText, setGeneratedText] = useState('');
  const [useMock, setUseMock] = useState(true);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 bg-white dark:bg-neutral-900 dark:bg-neutral-900">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Prompt Component</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Inline AI input with auto-completion</p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            ← Back to Examples
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-8 space-y-6">
          {/* Mock Mode Toggle */}
          <MockToggle useMock={useMock} onChange={setUseMock} />

          <div>
            <h2 className="text-xl font-semibold mb-4">Product Description Generator</h2>
            <p className="text-neutral-600 mb-6">
              Describe your product in a few words, and AI will generate a compelling description.
            </p>

            <Prompt
              agentId="your-agent-id"
              useMock={useMock}
              placeholder="e.g., 'wireless bluetooth headphones with noise cancellation'"
              showSuggestions
              submitOn="button"
              onResult={(result) => {
                setGeneratedText(result);
              }}
              className="w-full"
            />
          </div>

          {generatedText && (
            <div className="pt-6 border-t border-neutral-200">
              <h3 className="text-lg font-semibold mb-3">Generated Description:</h3>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-neutral-800">{generatedText}</p>
              </div>
              <button
                onClick={() => setGeneratedText('')}
                className="mt-4 px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Examples */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white dark:bg-neutral-900 rounded-lg shadow">
            <h4 className="font-semibold text-sm mb-2">Use Case: Forms</h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Enhance form fields with AI-powered suggestions and auto-completion
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-neutral-900 rounded-lg shadow">
            <h4 className="font-semibold text-sm mb-2">Use Case: Content</h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Generate headlines, descriptions, and copy for your content
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-neutral-900 rounded-lg shadow">
            <h4 className="font-semibold text-sm mb-2">Use Case: Search</h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              AI-powered search with natural language understanding
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
