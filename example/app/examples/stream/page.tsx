'use client';

import { useState } from 'react';
import { Stream } from '@apteva/apteva-kit';
import { ExampleLayout } from '../../../components/ExampleLayout';
import { MockToggle } from '../../../components/MockToggle';

export default function StreamExample() {
  const [streamKey, setStreamKey] = useState(0);
  const [variant, setVariant] = useState<'prose' | 'code' | 'plain'>('prose');
  const [showCursor, setShowCursor] = useState(true);
  const [typingSpeed, setTypingSpeed] = useState(30);
  const [useMock, setUseMock] = useState(true);

  return (
    <ExampleLayout
      title="Stream Component"
      description="Display streaming AI text with typing effect"
      controls={
        <div className="space-y-6">
          {/* Mock Mode Toggle */}
          <MockToggle useMock={useMock} onChange={setUseMock} />

          {/* Variant Select */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Variant
            </label>
            <select
              value={variant}
              onChange={(e) => setVariant(e.target.value as any)}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="prose">Prose</option>
              <option value="code">Code</option>
              <option value="plain">Plain</option>
            </select>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Text styling variant</p>
          </div>

          {/* Show Cursor Toggle */}
          <div>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Show Cursor</span>
              <button
                onClick={() => setShowCursor(!showCursor)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  showCursor ? 'bg-blue-600' : 'bg-neutral-300 dark:bg-neutral-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    showCursor ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Toggle blinking cursor</p>
          </div>

          {/* Typing Speed */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Typing Speed: {typingSpeed}ms
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={typingSpeed}
              onChange={(e) => setTypingSpeed(Number(e.target.value))}
              className="w-full"
            />
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Delay between characters</p>
          </div>

          {/* Restart Button */}
          <button
            onClick={() => setStreamKey((prev) => prev + 1)}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Restart Stream
          </button>

          {/* Props Reference */}
          <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">Props</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">agentId</span>
                <span className="font-mono text-neutral-900 dark:text-white">string</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">variant</span>
                <span className="font-mono text-neutral-900 dark:text-white">prose | code | plain</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">showCursor</span>
                <span className="font-mono text-neutral-900 dark:text-white">boolean</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">typingSpeed</span>
                <span className="font-mono text-neutral-900 dark:text-white">number</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">autoStart</span>
                <span className="font-mono text-neutral-900 dark:text-white">boolean</span>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className="h-full flex flex-col items-center justify-center p-8">
        <div className="max-w-2xl w-full p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-neutral-800 dark:to-neutral-900 rounded-xl">
          <Stream
            key={streamKey}
            agentId="your-agent-id"
            prompt="Write an engaging introduction about AI and machine learning"
            useMock={useMock}
            autoStart
            variant={variant}
            showCursor={showCursor}
            typingSpeed={typingSpeed}
          />
        </div>
      </div>
    </ExampleLayout>
  );
}
