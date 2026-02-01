'use client';

import { useState } from 'react';
import { Chat } from '@apteva/apteva-kit';
import Link from 'next/link';

const sampleMessages = [
  {
    id: 'msg-1',
    role: 'assistant' as const,
    content: 'Hello! I\'m here to help. What can I assist you with today?',
    timestamp: new Date(Date.now() - 60000),
  },
  {
    id: 'msg-2',
    role: 'user' as const,
    content: 'Can you help me understand the different chat variants?',
    timestamp: new Date(Date.now() - 30000),
  },
  {
    id: 'msg-3',
    role: 'assistant' as const,
    content: 'Of course! There are three variants available:\n\n**Default** - Standard chat appearance with subtle styling\n\n**Minimal** - Clean, borderless design for seamless embedding\n\n**Terminal** - Hacker/developer aesthetic with monospace fonts',
    timestamp: new Date(),
  },
];

export default function VariantsExample() {
  const [useMock, setUseMock] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<'default' | 'minimal' | 'terminal'>('default');

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 px-6 py-3 bg-white dark:bg-neutral-900">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-neutral-900 dark:text-white">Chat Variants</h1>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Different visual themes for the Chat component</p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            ← Back
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-y-auto p-6">
          {/* Mock Toggle */}
          <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
                {useMock ? 'Mock Mode' : 'Live API'}
              </span>
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

          {/* Variant Selector */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">Select Variant</h3>
            <div className="space-y-2">
              {(['default', 'minimal', 'terminal'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setSelectedVariant(v)}
                  className={`w-full text-left px-4 py-3 text-sm rounded-lg transition-colors ${
                    selectedVariant === v
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-transparent'
                  }`}
                >
                  <div className="font-medium capitalize">{v}</div>
                  <div className="text-xs mt-0.5 opacity-70">
                    {v === 'default' && 'Standard styling'}
                    {v === 'minimal' && 'Clean, borderless'}
                    {v === 'terminal' && 'Monospace, dark'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Code Example */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">Usage</h3>
            <pre className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs overflow-x-auto">
              <code className="text-neutral-700 dark:text-neutral-300">{`<Chat
  agentId="..."
  variant="${selectedVariant}"
/>`}</code>
            </pre>
          </div>

          {/* Description */}
          <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
              {selectedVariant === 'default' && 'Default Variant'}
              {selectedVariant === 'minimal' && 'Minimal Variant'}
              {selectedVariant === 'terminal' && 'Terminal Variant'}
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              {selectedVariant === 'default' && 'The standard appearance with neutral colors and subtle styling. Works well in most contexts.'}
              {selectedVariant === 'minimal' && 'A clean, borderless design that blends seamlessly into any interface. Great for embedded experiences.'}
              {selectedVariant === 'terminal' && 'A hacker/developer aesthetic with monospace fonts, dark background, and orange accents. Inspired by terminal interfaces.'}
            </p>
          </div>
        </div>

        {/* Main Preview Area */}
        <div className={`flex-1 flex items-center justify-center p-8 ${
          selectedVariant === 'terminal' ? 'bg-[#050505]' : 'bg-neutral-100 dark:bg-neutral-950'
        }`}>
          <div className={`w-full max-w-md h-[600px] overflow-hidden ${
            selectedVariant === 'default' ? 'bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800' : ''
          }${
            selectedVariant === 'minimal' ? 'bg-white dark:bg-neutral-900 rounded-xl' : ''
          }${
            selectedVariant === 'terminal' ? 'rounded-lg border border-[#1a1a1a]' : ''
          }`}>
            <Chat
              key={`variant-${selectedVariant}`}
              agentId="demo-agent"
              variant={selectedVariant}
              initialMessages={sampleMessages}
              useMock={useMock}
              showHeader={true}
              headerTitle={
                selectedVariant === 'default' ? 'AI Assistant' :
                selectedVariant === 'minimal' ? 'Assistant' :
                'terminal_chat'
              }
              placeholder={
                selectedVariant === 'terminal' ? '> enter command...' : 'Type a message...'
              }
              className="h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
