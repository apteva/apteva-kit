'use client';

import { useState } from 'react';
import { Command } from '@apteva/apteva-kit';
import { ExampleLayout } from '../../../components/ExampleLayout';

export default function CommandExample() {
  const [executeKey, setExecuteKey] = useState(0);
  const [agentId, setAgentId] = useState('your-agent-id');
  const [context, setContext] = useState('You are a helpful assistant. Today is Q4 2024.');
  const [loadingText, setLoadingText] = useState('Analyzing your data...');
  const [showProgress, setShowProgress] = useState(true);
  const [useMock, setUseMock] = useState(false);
  const [planMode, setPlanMode] = useState(false);
  const [enableStreaming, setEnableStreaming] = useState(false);
  const [enableFileUpload, setEnableFileUpload] = useState(true);
  const [lastAction, setLastAction] = useState<{ type: string; payload: any; time: string } | null>(null);
  const [agentAction, setAgentAction] = useState<{ type: string; payload: any; time: string } | null>(null);

  return (
    <ExampleLayout
      title="Command Component"
      description="Type and execute commands with loading states"
      controls={
        <div className="space-y-6">
          {/* Mock Mode Toggle */}
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
                  {useMock ? '🎭 Mock Mode' : '🌐 Live API'}
                </span>
                <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                  {useMock ? 'Using simulated responses' : 'Connecting to real API'}
                </p>
              </div>
              <button
                onClick={() => setUseMock(!useMock)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  useMock ? 'bg-blue-600' : 'bg-neutral-300 dark:bg-neutral-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    useMock ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>
          </div>

          {/* Agent ID */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Agent ID
            </label>
            <input
              type="text"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
            />
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">The agent to send commands to</p>
          </div>

          {/* Context (System Prompt) */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Context (System Prompt)
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="System instructions for the agent..."
            />
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Passed as 'system' parameter to the API</p>
          </div>

          {/* Loading Text */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Loading Text
            </label>
            <input
              type="text"
              value={loadingText}
              onChange={(e) => setLoadingText(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Text shown during execution</p>
          </div>

          {/* Show Progress Toggle */}
          <div>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Show Progress</span>
              <button
                onClick={() => setShowProgress(!showProgress)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  showProgress ? 'bg-blue-600' : 'bg-neutral-300 dark:bg-neutral-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    showProgress ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Display progress indicator</p>
          </div>

          {/* Plan Mode Toggle */}
          <div>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Plan Mode</span>
              <button
                onClick={() => setPlanMode(!planMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  planMode ? 'bg-blue-600' : 'bg-neutral-300 dark:bg-neutral-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    planMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Agent proposes plan before executing</p>
          </div>

          {/* Enable Streaming Toggle */}
          <div>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Enable Streaming</span>
              <button
                onClick={() => setEnableStreaming(!enableStreaming)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  enableStreaming ? 'bg-blue-600' : 'bg-neutral-300 dark:bg-neutral-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    enableStreaming ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Stream response word-by-word</p>
          </div>

          {/* Enable File Upload Toggle */}
          <div>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Enable File Upload</span>
              <button
                onClick={() => setEnableFileUpload(!enableFileUpload)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  enableFileUpload ? 'bg-blue-600' : 'bg-neutral-300 dark:bg-neutral-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    enableFileUpload ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Show/hide file upload button</p>
          </div>

          {/* Reset Button */}
          <button
            onClick={() => setExecuteKey((prev) => prev + 1)}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Reset Component
          </button>

          {/* Props Reference */}
          <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">Key Props</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">agentId</span>
                <span className="font-mono text-neutral-900 dark:text-white">string</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">context</span>
                <span className="font-mono text-neutral-900 dark:text-white">string</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">variant</span>
                <span className="font-mono text-neutral-900 dark:text-white">default | compact</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">useMock</span>
                <span className="font-mono text-neutral-900 dark:text-white">boolean</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">planMode</span>
                <span className="font-mono text-neutral-900 dark:text-white">boolean</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">enableStreaming</span>
                <span className="font-mono text-neutral-900 dark:text-white">boolean</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">enableFileUpload</span>
                <span className="font-mono text-neutral-900 dark:text-white">boolean</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">showProgress</span>
                <span className="font-mono text-neutral-900 dark:text-white">boolean</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">onComplete</span>
                <span className="font-mono text-neutral-900 dark:text-white">function</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">onAction</span>
                <span className="font-mono text-neutral-900 dark:text-white">function</span>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className="h-full flex flex-col p-8">
        <div className="max-w-3xl w-full mx-auto space-y-8">
          {/* Widget Action Feedback Display (User-triggered) */}
          {lastAction && (
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-purple-800 dark:text-purple-300 mb-1">
                      Widget Action (User Clicked): {lastAction.type}
                    </h3>
                    <p className="text-xs text-purple-600 dark:text-purple-400 mb-2">{lastAction.time}</p>
                    <div className="text-sm text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/40 rounded p-2 font-mono text-xs overflow-auto">
                      {JSON.stringify(lastAction.payload, null, 2)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setLastAction(null)}
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Agent Action Feedback Display (Agent-triggered) */}
          {agentAction && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-1">
                      Agent Action (Executed via onComplete): {agentAction.type}
                    </h3>
                    <p className="text-xs text-green-600 dark:text-green-400 mb-2">{agentAction.time}</p>
                    <div className="text-sm text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/40 rounded p-2 font-mono text-xs overflow-auto">
                      {JSON.stringify(agentAction.payload, null, 2)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setAgentAction(null)}
                  className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Default Variant */}
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-3">Default (Multi-line)</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              Try: "Show me the tasks you completed today"
            </p>
            <Command
              key={executeKey}
              agentId={agentId}
              useMock={useMock}
              planMode={planMode}
              onPlanModeChange={setPlanMode}
              enableStreaming={enableStreaming}
              enableFileUpload={enableFileUpload}
              placeholder="Enter a command to execute (e.g., 'Show me the tasks you completed today')"
              submitButtonText="Execute"
              context={context}
              loadingText={loadingText}
              showProgress={showProgress}
              onStart={() => {
                console.log('Command started');
              }}
              onChunk={(chunk) => {
                console.log('Chunk received:', chunk);
              }}
              onComplete={(result) => {
                console.log('Command completed:', result);
                console.log('Widgets returned:', result.widgets);

                // Check if agent returned an action intent
                if (result.data?.action) {
                  const { type, payload } = result.data.action;
                  console.log('Agent action detected:', type, payload);

                  // Execute the agent's action
                  setAgentAction({
                    type,
                    payload,
                    time: new Date().toLocaleTimeString()
                  });

                  // Here you would execute actual logic based on action type
                  if (type === 'update_database') {
                    console.log('Executing: Update database with', payload);
                  } else if (type === 'send_notification') {
                    console.log('Executing: Send notification', payload);
                  }
                }
              }}
              onError={(error) => {
                console.error('Command error:', error);
              }}
              onAction={(action) => {
                console.log('Widget action triggered:', action);
                setLastAction({
                  type: action.type,
                  payload: action.payload,
                  time: new Date().toLocaleTimeString()
                });
              }}
            />
          </div>

          {/* Compact Variant */}
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-3">Compact (Single-line)</h2>
            <Command
              key={`compact-${executeKey}`}
              agentId={agentId}
              useMock={useMock}
              planMode={planMode}
              onPlanModeChange={setPlanMode}
              enableStreaming={enableStreaming}
              enableFileUpload={enableFileUpload}
              variant="compact"
              placeholder="Quick command..."
              context={context}
              loadingText={loadingText}
              showProgress={showProgress}
              onStart={() => {
                console.log('Compact command started');
              }}
              onChunk={(chunk) => {
                console.log('Chunk received:', chunk);
              }}
              onComplete={(result) => {
                console.log('Compact command completed:', result);
              }}
              onError={(error) => {
                console.error('Compact command error:', error);
              }}
            />
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-50 dark:bg-neutral-800 border border-blue-200 dark:border-neutral-800 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">How it works:</h3>
            <ul className="text-xs text-blue-800 dark:text-neutral-300 space-y-1">
              <li>• <strong>Mock Mode:</strong> Toggle between simulated and real API responses</li>
              <li>• <strong>Enable Streaming:</strong> Stream response word-by-word (works with both variants)</li>
              <li>• <strong>Plan Mode:</strong> Agent proposes execution plan before running command</li>
              <li>• <strong>Enable File Upload:</strong> Show/hide the file upload button</li>
              <li>• <strong>Widget Support:</strong> Commands can return interactive widgets (mock mode only)</li>
              <li>• <strong>Default:</strong> Multi-line textarea for longer commands</li>
              <li>• <strong>Compact:</strong> Single-line input for quick commands</li>
              <li>• Shows loading state with optional progress indicator</li>
              <li>• After completion, you can run another command</li>
              <li>• <strong>Try:</strong> "Show me the tasks you completed today" (returns task list widget)</li>
              <li>• <strong>Try:</strong> "Analyze sales data" or "Show customer metrics" (returns data widgets)</li>
            </ul>
          </div>
        </div>
      </div>
    </ExampleLayout>
  );
}
