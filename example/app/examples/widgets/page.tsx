'use client';

import { Widgets, mockWidgets } from '@apteva/apteva-kit';
import Link from 'next/link';

// Basic Card Widget
const basicCardWidget = {
  type: 'card',
  id: 'card-basic',
  props: {
    title: 'Simple Card',
    description: 'This is a basic card widget with just title and description.',
  }
};

// Advanced Card Widget
const advancedCardWidget = {
  type: 'card',
  id: 'card-advanced',
  props: {
    title: 'Paris, France',
    description: '5-day adventure in the City of Light. Visit the Eiffel Tower, Louvre, and more!',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400',
    footer: 'Total: $1,850 for 5 days'
  },
  actions: [
    {
      type: 'book_trip',
      label: 'Book Now',
      handler: 'client' as const,
      payload: { destination: 'paris', price: 1850 }
    },
    {
      type: 'view_details',
      label: 'Details',
      handler: 'client' as const,
      payload: { destination: 'paris' }
    }
  ]
};

// Basic List Widget
const basicListWidget = {
  type: 'list',
  id: 'list-basic',
  props: {
    items: [
      {
        id: 'item-1',
        title: 'First Item',
        subtitle: 'Simple subtitle'
      },
      {
        id: 'item-2',
        title: 'Second Item',
        subtitle: 'Another subtitle'
      },
      {
        id: 'item-3',
        title: 'Third Item',
        subtitle: 'One more subtitle'
      }
    ]
  }
};

// Basic Form Widget
const basicFormWidget = {
  type: 'form',
  id: 'form-basic',
  props: {
    title: 'Contact Form',
    fields: [
      { name: 'name', type: 'text', label: 'Name', placeholder: 'Enter your name', required: true },
      { name: 'email', type: 'text', label: 'Email', placeholder: 'you@example.com', required: true },
      { name: 'message', type: 'textarea', label: 'Message', placeholder: 'Your message...' }
    ]
  },
  actions: [{ type: 'submit', label: 'Send Message' }]
};

// API Key Form Widget
const apiKeyFormWidget = {
  type: 'form',
  id: 'form-api-key',
  props: {
    title: 'API Configuration',
    fields: [
      { name: 'apiKey', type: 'password', label: 'API Key', placeholder: 'Enter your API key', required: true },
      { name: 'environment', type: 'select', label: 'Environment', options: [
        { label: 'Production', value: 'production' },
        { label: 'Staging', value: 'staging' },
        { label: 'Development', value: 'development' }
      ]},
      { name: 'enableLogging', type: 'checkbox', label: 'Enable debug logging' }
    ]
  },
  actions: [{ type: 'submit', label: 'Save Configuration' }]
};

// Flow Widget - Multi-Agent Research
const multiAgentFlowWidget = {
  type: 'flow',
  id: 'flow-multi-agent',
  props: {
    title: 'Multi-Agent Research',
    icon: 'research',
    steps: [
      { id: '1', label: '@researcher' },
      { id: '2', label: '@analyst' },
      { id: '3', label: '@writer' },
      { id: '4', label: 'Review' }
    ]
  },
  actions: [{ type: 'run', label: 'Run' }]
};

// Flow Widget - Schedule Report
const scheduleFlowWidget = {
  type: 'flow',
  id: 'flow-schedule',
  props: {
    title: 'Schedule Report',
    subtitle: 'Tomorrow 9:00 AM',
    icon: 'schedule',
    steps: [
      { id: '1', label: '9am', type: 'time' },
      { id: '2', label: '@data-agent' },
      { id: '3', label: 'Generate' },
      { id: '4', label: 'Email' }
    ]
  },
  actions: [{ type: 'schedule', label: 'Schedule' }]
};

// Flow Widget - Weekly Analysis
const weeklyAnalysisFlowWidget = {
  type: 'flow',
  id: 'flow-weekly',
  props: {
    title: 'Weekly Competitor Analysis',
    subtitle: 'Every Monday',
    icon: 'analyze',
    steps: [
      { id: '1', label: 'Mon', type: 'time' },
      { id: '2', label: '@scraper' },
      { id: '3', label: '@analyst' },
      { id: '4', label: 'Slack' }
    ]
  },
  actions: [{ type: 'schedule', label: 'Schedule' }]
};

// Flow Widget - Deploy to Production
const deployFlowWidget = {
  type: 'flow',
  id: 'flow-deploy',
  props: {
    title: 'Deploy to Production',
    icon: 'deploy',
    steps: [
      { id: '1', label: 'Test' },
      { id: '2', label: 'Build' },
      { id: '3', label: 'Push' },
      { id: '4', label: 'Deploy' }
    ]
  },
  actions: [{ type: 'run', label: 'Run' }]
};

// Flow Widget - With Execution Status
const executionFlowWidget = {
  type: 'flow',
  id: 'flow-execution',
  props: {
    title: 'Deployment Progress',
    icon: 'deploy',
    steps: [
      { id: '1', label: 'Test', status: 'completed' as const },
      { id: '2', label: 'Build', status: 'completed' as const },
      { id: '3', label: 'Push', status: 'active' as const },
      { id: '4', label: 'Deploy', status: 'pending' as const }
    ]
  },
  actions: [{ type: 'run', label: 'Run' }]
};

// Flow Widget - With Error
const errorFlowWidget = {
  type: 'flow',
  id: 'flow-error',
  props: {
    title: 'CI/CD Pipeline',
    icon: 'deploy',
    steps: [
      { id: '1', label: 'Build', status: 'completed' as const },
      { id: '2', label: 'Test', status: 'error' as const },
      { id: '3', label: 'Deploy', status: 'pending' as const }
    ]
  },
  actions: [{ type: 'retry', label: 'Retry' }]
};

// Flow Widget - Data Pipeline
const dataPipelineFlowWidget = {
  type: 'flow',
  id: 'flow-data-pipeline',
  props: {
    title: 'Data Sync Pipeline',
    subtitle: 'Daily at 2:00 AM',
    icon: 'data',
    steps: [
      { id: '1', label: '2am', type: 'time' },
      { id: '2', label: 'Scrape' },
      { id: '3', label: 'Transform' },
      { id: '4', label: 'Data' },
      { id: '5', label: 'Webhook' }
    ]
  },
  actions: [{ type: 'schedule', label: 'Schedule' }]
};

// Flow Widget - Automation Workflow
const automationFlowWidget = {
  type: 'flow',
  id: 'flow-automation',
  props: {
    title: 'Content Automation',
    icon: 'automation',
    steps: [
      { id: '1', label: '@researcher' },
      { id: '2', label: 'Generate' },
      { id: '3', label: 'Review' },
      { id: '4', label: 'Email' },
      { id: '5', label: 'Slack' }
    ]
  },
  actions: [{ type: 'run', label: 'Run' }]
};

// Flow Widget - Notification Chain
const notificationFlowWidget = {
  type: 'flow',
  id: 'flow-notification',
  props: {
    title: 'Alert Notification Chain',
    icon: 'recurring',
    steps: [
      { id: '1', label: 'API' },
      { id: '2', label: '@analyst' },
      { id: '3', label: 'Alert' },
      { id: '4', label: 'Slack' },
      { id: '5', label: 'Email' }
    ]
  },
  actions: [{ type: 'configure', label: 'Configure' }]
};

// Advanced List Widget - Task Tracker
const taskListWidget = {
  type: 'list',
  id: 'task-list',
  props: {
    items: [
      {
        id: 'task-1',
        title: 'Implement user authentication',
        subtitle: 'Created just now',
        description: 'Added OAuth 2.0 support with Google and GitHub providers',
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        metadata: {
          status: 'created',
          priority: 'high',
          tags: ['backend', 'security']
        }
      },
      {
        id: 'task-2',
        title: 'Update API documentation',
        subtitle: 'Modified 2 minutes ago',
        description: 'Changed endpoint descriptions and added new examples',
        backgroundColor: 'rgba(234, 179, 8, 0.15)',
        metadata: {
          status: 'modified',
          priority: 'medium',
          tags: ['docs']
        }
      },
      {
        id: 'task-3',
        title: 'Fix login redirect bug',
        subtitle: 'Completed 5 minutes ago',
        description: 'Users now properly redirected after successful login',
        backgroundColor: 'rgba(34, 197, 94, 0.15)',
        metadata: {
          status: 'completed',
          priority: 'urgent',
          tags: ['bugfix', 'auth']
        }
      },
      {
        id: 'task-4',
        title: 'Remove deprecated endpoints',
        subtitle: 'Deleted 10 minutes ago',
        description: 'Cleaned up old v1 API routes',
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        metadata: {
          status: 'deleted',
          priority: 'low',
          tags: ['cleanup', 'api']
        }
      }
    ]
  },
  actions: [
    {
      type: 'view_task',
      label: 'View',
      handler: 'client' as const,
      payload: {}
    },
    {
      type: 'undo',
      label: 'Undo',
      handler: 'server' as const,
      payload: {}
    }
  ]
};

export default function WidgetsExample() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 bg-white dark:bg-neutral-900 dark:bg-neutral-900">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Widgets Component</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Render AI-generated interactive widgets</p>
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
      <div className="max-w-6xl mx-auto p-8 space-y-12">

        {/* CARD WIDGETS */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Card Widgets</h2>
            <p className="text-neutral-600 dark:text-neutral-400">Display content with optional image, title, description, footer, and actions</p>
          </div>

          {/* Basic Card */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-8 mb-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Basic Card</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">Simple card with title and description</p>
            <Widgets
              widgets={[basicCardWidget]}
              layout="stack"
              onAction={(action) => {
                alert(`Action: ${action.type}\nPayload: ${JSON.stringify(action.payload, null, 2)}`);
              }}
            />
          </div>

          {/* Advanced Card */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-8">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Advanced Card</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">Card with image, footer, and action buttons</p>
            <Widgets
              widgets={[advancedCardWidget]}
              layout="stack"
              onAction={(action) => {
                alert(`Action: ${action.type}\nPayload: ${JSON.stringify(action.payload, null, 2)}`);
              }}
            />
          </div>
        </section>

        {/* LIST WIDGETS */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">List Widgets</h2>
            <p className="text-neutral-600 dark:text-neutral-400">Show multiple items with metadata and inline actions</p>
          </div>

          {/* Basic List */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-8 mb-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Basic List</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">Simple list with title and subtitle</p>
            <Widgets
              widgets={[basicListWidget]}
              layout="stack"
              onAction={(action) => {
                alert(`Action: ${action.type}\nPayload: ${JSON.stringify(action.payload, null, 2)}`);
              }}
            />
          </div>

          {/* Advanced List - Task Tracker */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-8">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Advanced List - Task Tracker</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Track agent activities with status emojis, descriptions, metadata, and actions
            </p>
            <Widgets
              widgets={[taskListWidget]}
              layout="stack"
              onAction={(action) => {
                const task = action.payload;
                alert(`Action: ${action.type}\n\nTask: ${task.title}\nStatus: ${task.metadata?.status}\nPriority: ${task.metadata?.priority}\nTags: ${task.metadata?.tags?.join(', ')}`);
              }}
            />
          </div>
        </section>

        {/* FORM WIDGETS */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Form Widgets</h2>
            <p className="text-neutral-600 dark:text-neutral-400">Collect user input with various field types</p>
          </div>

          {/* Basic Form */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-8 mb-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Basic Form</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">Simple contact form with text and textarea fields</p>
            <Widgets
              widgets={[basicFormWidget]}
              layout="stack"
              onAction={(action) => {
                alert(`Action: ${action.type}\nForm Data: ${JSON.stringify(action.payload.formData, null, 2)}`);
              }}
            />
          </div>

          {/* API Key Form */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-8">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">API Configuration Form</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">Form with password field, select dropdown, and checkbox</p>
            <Widgets
              widgets={[apiKeyFormWidget]}
              layout="stack"
              onAction={(action) => {
                alert(`Action: ${action.type}\nForm Data: ${JSON.stringify(action.payload.formData, null, 2)}`);
              }}
            />
          </div>
        </section>

        {/* FLOW WIDGETS */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Flow Widgets</h2>
            <p className="text-neutral-600 dark:text-neutral-400">Show task/process execution flows as horizontal pipelines with action buttons</p>
          </div>

          {/* Multi-Agent Research */}
          <div className="bg-neutral-950 rounded-xl shadow-lg p-8 mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Multi-Agent Workflow</h3>
            <p className="text-sm text-neutral-400 mb-4">Chain multiple agents together with a review step</p>
            <Widgets
              widgets={[multiAgentFlowWidget]}
              layout="stack"
              onAction={(action) => {
                alert(`Action: ${action.type}\nPayload: ${JSON.stringify(action.payload, null, 2)}`);
              }}
            />
          </div>

          {/* Schedule Report */}
          <div className="bg-neutral-950 rounded-xl shadow-lg p-8 mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Scheduled Task</h3>
            <p className="text-sm text-neutral-400 mb-4">Schedule a report with time, agent, and output steps</p>
            <Widgets
              widgets={[scheduleFlowWidget]}
              layout="stack"
              onAction={(action) => {
                alert(`Action: ${action.type}\nPayload: ${JSON.stringify(action.payload, null, 2)}`);
              }}
            />
          </div>

          {/* Weekly Analysis */}
          <div className="bg-neutral-950 rounded-xl shadow-lg p-8 mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Recurring Workflow</h3>
            <p className="text-sm text-neutral-400 mb-4">Weekly analysis with scraper, analyst, and Slack notification</p>
            <Widgets
              widgets={[weeklyAnalysisFlowWidget]}
              layout="stack"
              onAction={(action) => {
                alert(`Action: ${action.type}\nPayload: ${JSON.stringify(action.payload, null, 2)}`);
              }}
            />
          </div>

          {/* Deploy Flow */}
          <div className="bg-neutral-950 rounded-xl shadow-lg p-8 mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Deployment Pipeline</h3>
            <p className="text-sm text-neutral-400 mb-4">CI/CD pipeline: Test, Build, Push, Deploy</p>
            <Widgets
              widgets={[deployFlowWidget]}
              layout="stack"
              onAction={(action) => {
                alert(`Action: ${action.type}\nPayload: ${JSON.stringify(action.payload, null, 2)}`);
              }}
            />
          </div>

          {/* Execution Progress */}
          <div className="bg-neutral-950 rounded-xl shadow-lg p-8 mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Execution Progress</h3>
            <p className="text-sm text-neutral-400 mb-4">Track progress with completed, active, and pending states</p>
            <Widgets
              widgets={[executionFlowWidget]}
              layout="stack"
              onAction={(action) => {
                alert(`Action: ${action.type}\nPayload: ${JSON.stringify(action.payload, null, 2)}`);
              }}
            />
          </div>

          {/* Error State */}
          <div className="bg-neutral-950 rounded-xl shadow-lg p-8 mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Error State</h3>
            <p className="text-sm text-neutral-400 mb-4">Show failed steps in the pipeline</p>
            <Widgets
              widgets={[errorFlowWidget]}
              layout="stack"
              onAction={(action) => {
                alert(`Action: ${action.type}\nPayload: ${JSON.stringify(action.payload, null, 2)}`);
              }}
            />
          </div>

          {/* Data Pipeline */}
          <div className="bg-neutral-950 rounded-xl shadow-lg p-8 mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Data Pipeline</h3>
            <p className="text-sm text-neutral-400 mb-4">Daily data sync with scraping, transformation, and webhook notification</p>
            <Widgets
              widgets={[dataPipelineFlowWidget]}
              layout="stack"
              onAction={(action) => {
                alert(`Action: ${action.type}\nPayload: ${JSON.stringify(action.payload, null, 2)}`);
              }}
            />
          </div>

          {/* Content Automation */}
          <div className="bg-neutral-950 rounded-xl shadow-lg p-8 mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Content Automation</h3>
            <p className="text-sm text-neutral-400 mb-4">Research, generate, review, and distribute content</p>
            <Widgets
              widgets={[automationFlowWidget]}
              layout="stack"
              onAction={(action) => {
                alert(`Action: ${action.type}\nPayload: ${JSON.stringify(action.payload, null, 2)}`);
              }}
            />
          </div>

          {/* Notification Chain */}
          <div className="bg-neutral-950 rounded-xl shadow-lg p-8">
            <h3 className="text-lg font-semibold text-white mb-2">Alert Notification Chain</h3>
            <p className="text-sm text-neutral-400 mb-4">API monitoring with multi-channel notifications</p>
            <Widgets
              widgets={[notificationFlowWidget]}
              layout="stack"
              onAction={(action) => {
                alert(`Action: ${action.type}\nPayload: ${JSON.stringify(action.payload, null, 2)}`);
              }}
            />
          </div>
        </section>

        {/* LAYOUT OPTIONS */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Layout Options</h2>
            <p className="text-neutral-600 dark:text-neutral-400">Different ways to display multiple widgets</p>
          </div>

          {/* Grid Layout */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-8 mb-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Grid Layout</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">Display widgets in a responsive grid</p>
            <Widgets
              widgets={mockWidgets}
              layout="grid"
              columns={2}
              onAction={(action) => {
                alert(`Action: ${action.type}\nPayload: ${JSON.stringify(action.payload, null, 2)}`);
              }}
            />
          </div>

          {/* Stack Layout */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-8">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Stack Layout</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">Display widgets vertically stacked</p>
            <Widgets
              widgets={mockWidgets}
              layout="stack"
              spacing="normal"
              onAction={(action) => {
                console.log('Widget action:', action);
              }}
            />
          </div>
        </section>

        {/* Widget Types Reference */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Widget Reference</h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Complete props reference for all widget types. Use <code className="px-1.5 py-0.5 bg-neutral-200 dark:bg-neutral-700 rounded text-sm">@ui:type[{'{props}'}]</code> syntax in chat with <code className="px-1.5 py-0.5 bg-neutral-200 dark:bg-neutral-700 rounded text-sm">enableWidgets=true</code>
            </p>
          </div>

          <div className="space-y-4">
            {/* Card */}
            <details className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg overflow-hidden group">
              <summary className="px-6 py-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  <h3 className="font-semibold text-neutral-900 dark:text-white">card</h3>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">— Display content with image, title, description</span>
                </div>
                <svg className="w-5 h-5 text-neutral-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Props</h4>
                    <div className="bg-neutral-900 rounded-lg p-3 text-sm font-mono text-neutral-300 overflow-x-auto">
                      <div><span className="text-blue-400">title</span>: <span className="text-green-400">string</span> <span className="text-neutral-500">// Required</span></div>
                      <div><span className="text-blue-400">description</span>?: <span className="text-green-400">string</span></div>
                      <div><span className="text-blue-400">image</span>?: <span className="text-green-400">string</span> <span className="text-neutral-500">// URL</span></div>
                      <div><span className="text-blue-400">footer</span>?: <span className="text-green-400">string</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Text Syntax</h4>
                    <div className="bg-neutral-900 rounded-lg p-3 text-sm font-mono text-neutral-300 overflow-x-auto whitespace-pre">@ui:card[{`{"title": "My Title", "description": "Details here", "footer": "Optional footer"}`}]</div>
                  </div>
                </div>
              </div>
            </details>

            {/* List */}
            <details className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg overflow-hidden group">
              <summary className="px-6 py-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <h3 className="font-semibold text-neutral-900 dark:text-white">list</h3>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">— Display multiple items with metadata</span>
                </div>
                <svg className="w-5 h-5 text-neutral-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Props</h4>
                    <div className="bg-neutral-900 rounded-lg p-3 text-sm font-mono text-neutral-300 overflow-x-auto">
                      <div><span className="text-blue-400">items</span>: <span className="text-yellow-400">Array</span> <span className="text-neutral-500">// Required</span></div>
                      <div className="pl-4"><span className="text-blue-400">id</span>: <span className="text-green-400">string</span> <span className="text-neutral-500">// Required</span></div>
                      <div className="pl-4"><span className="text-blue-400">title</span>: <span className="text-green-400">string</span> <span className="text-neutral-500">// Required</span></div>
                      <div className="pl-4"><span className="text-blue-400">subtitle</span>?: <span className="text-green-400">string</span></div>
                      <div className="pl-4"><span className="text-blue-400">description</span>?: <span className="text-green-400">string</span></div>
                      <div className="pl-4"><span className="text-blue-400">image</span>?: <span className="text-green-400">string</span></div>
                      <div className="pl-4"><span className="text-blue-400">backgroundColor</span>?: <span className="text-green-400">string</span> <span className="text-neutral-500">// CSS color</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Text Syntax</h4>
                    <div className="bg-neutral-900 rounded-lg p-3 text-sm font-mono text-neutral-300 overflow-x-auto whitespace-pre">@ui:list[{`{"items": [{"id": "1", "title": "Item 1", "subtitle": "Details"}]}`}]</div>
                  </div>
                </div>
              </div>
            </details>

            {/* Button Group */}
            <details className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg overflow-hidden group">
              <summary className="px-6 py-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                  <h3 className="font-semibold text-neutral-900 dark:text-white">button_group</h3>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">— Interactive action buttons</span>
                </div>
                <svg className="w-5 h-5 text-neutral-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Props</h4>
                    <div className="bg-neutral-900 rounded-lg p-3 text-sm font-mono text-neutral-300 overflow-x-auto">
                      <div><span className="text-blue-400">buttons</span>: <span className="text-yellow-400">Array</span> <span className="text-neutral-500">// Required</span></div>
                      <div className="pl-4"><span className="text-blue-400">id</span>: <span className="text-green-400">string</span> <span className="text-neutral-500">// Required, returned on click</span></div>
                      <div className="pl-4"><span className="text-blue-400">label</span>: <span className="text-green-400">string</span> <span className="text-neutral-500">// Required</span></div>
                      <div className="pl-4"><span className="text-blue-400">variant</span>?: <span className="text-green-400">"primary" | "secondary" | "outline"</span></div>
                      <div><span className="text-blue-400">layout</span>?: <span className="text-green-400">"horizontal" | "vertical"</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Text Syntax</h4>
                    <div className="bg-neutral-900 rounded-lg p-3 text-sm font-mono text-neutral-300 overflow-x-auto whitespace-pre">@ui:button_group[{`{"buttons": [{"id": "yes", "label": "Yes", "variant": "primary"}, {"id": "no", "label": "No"}]}`}]</div>
                  </div>
                </div>
              </div>
            </details>

            {/* Form */}
            <details className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg overflow-hidden group">
              <summary className="px-6 py-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                  <h3 className="font-semibold text-neutral-900 dark:text-white">form</h3>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">— Collect user input with fields</span>
                </div>
                <svg className="w-5 h-5 text-neutral-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Props</h4>
                    <div className="bg-neutral-900 rounded-lg p-3 text-sm font-mono text-neutral-300 overflow-x-auto">
                      <div><span className="text-blue-400">title</span>?: <span className="text-green-400">string</span></div>
                      <div><span className="text-blue-400">fields</span>: <span className="text-yellow-400">Array</span> <span className="text-neutral-500">// Required</span></div>
                      <div className="pl-4"><span className="text-blue-400">name</span>: <span className="text-green-400">string</span> <span className="text-neutral-500">// Required, field key</span></div>
                      <div className="pl-4"><span className="text-blue-400">type</span>: <span className="text-green-400">"text" | "password" | "number" | "select" | "checkbox" | "textarea" | "date"</span></div>
                      <div className="pl-4"><span className="text-blue-400">label</span>: <span className="text-green-400">string</span> <span className="text-neutral-500">// Required</span></div>
                      <div className="pl-4"><span className="text-blue-400">required</span>?: <span className="text-green-400">boolean</span></div>
                      <div className="pl-4"><span className="text-blue-400">placeholder</span>?: <span className="text-green-400">string</span></div>
                      <div className="pl-4"><span className="text-blue-400">options</span>?: <span className="text-yellow-400">Array</span> <span className="text-neutral-500">// For select type</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Text Syntax</h4>
                    <div className="bg-neutral-900 rounded-lg p-3 text-sm font-mono text-neutral-300 overflow-x-auto whitespace-pre">@ui:form[{`{"title": "Contact", "fields": [{"name": "email", "type": "text", "label": "Email", "required": true}]}`}]</div>
                  </div>
                </div>
              </div>
            </details>

            {/* Image */}
            <details className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg overflow-hidden group">
              <summary className="px-6 py-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  <h3 className="font-semibold text-neutral-900 dark:text-white">image</h3>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">— Display a single image with caption</span>
                </div>
                <svg className="w-5 h-5 text-neutral-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Props</h4>
                    <div className="bg-neutral-900 rounded-lg p-3 text-sm font-mono text-neutral-300 overflow-x-auto">
                      <div><span className="text-blue-400">src</span>: <span className="text-green-400">string</span> <span className="text-neutral-500">// Required, image URL</span></div>
                      <div><span className="text-blue-400">alt</span>: <span className="text-green-400">string</span> <span className="text-neutral-500">// Required</span></div>
                      <div><span className="text-blue-400">caption</span>?: <span className="text-green-400">string</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Text Syntax</h4>
                    <div className="bg-neutral-900 rounded-lg p-3 text-sm font-mono text-neutral-300 overflow-x-auto whitespace-pre">@ui:image[{`{"src": "https://example.com/img.png", "alt": "Description", "caption": "Figure 1"}`}]</div>
                  </div>
                </div>
              </div>
            </details>

            {/* Gallery */}
            <details className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg overflow-hidden group">
              <summary className="px-6 py-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-teal-500"></span>
                  <h3 className="font-semibold text-neutral-900 dark:text-white">gallery</h3>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">— Display multiple images in grid or carousel</span>
                </div>
                <svg className="w-5 h-5 text-neutral-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Props</h4>
                    <div className="bg-neutral-900 rounded-lg p-3 text-sm font-mono text-neutral-300 overflow-x-auto">
                      <div><span className="text-blue-400">images</span>: <span className="text-yellow-400">Array</span> <span className="text-neutral-500">// Required</span></div>
                      <div className="pl-4"><span className="text-blue-400">id</span>: <span className="text-green-400">string</span> <span className="text-neutral-500">// Required</span></div>
                      <div className="pl-4"><span className="text-blue-400">src</span>: <span className="text-green-400">string</span> <span className="text-neutral-500">// Required</span></div>
                      <div className="pl-4"><span className="text-blue-400">alt</span>: <span className="text-green-400">string</span> <span className="text-neutral-500">// Required</span></div>
                      <div className="pl-4"><span className="text-blue-400">caption</span>?: <span className="text-green-400">string</span></div>
                      <div><span className="text-blue-400">layout</span>?: <span className="text-green-400">"grid" | "carousel"</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Text Syntax</h4>
                    <div className="bg-neutral-900 rounded-lg p-3 text-sm font-mono text-neutral-300 overflow-x-auto whitespace-pre">@ui:gallery[{`{"images": [{"id": "1", "src": "...", "alt": "Image 1"}], "layout": "grid"}`}]</div>
                  </div>
                </div>
              </div>
            </details>

            {/* Chart */}
            <details className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg overflow-hidden group">
              <summary className="px-6 py-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-pink-500"></span>
                  <h3 className="font-semibold text-neutral-900 dark:text-white">chart</h3>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">— Data visualization (line, bar, pie, doughnut)</span>
                </div>
                <svg className="w-5 h-5 text-neutral-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Props</h4>
                    <div className="bg-neutral-900 rounded-lg p-3 text-sm font-mono text-neutral-300 overflow-x-auto">
                      <div><span className="text-blue-400">chartType</span>: <span className="text-green-400">"line" | "bar" | "pie" | "doughnut"</span> <span className="text-neutral-500">// Required</span></div>
                      <div><span className="text-blue-400">title</span>?: <span className="text-green-400">string</span></div>
                      <div><span className="text-blue-400">data</span>: <span className="text-yellow-400">Object</span> <span className="text-neutral-500">// Required</span></div>
                      <div className="pl-4"><span className="text-blue-400">labels</span>: <span className="text-green-400">string[]</span></div>
                      <div className="pl-4"><span className="text-blue-400">datasets</span>: <span className="text-yellow-400">Array</span></div>
                      <div className="pl-8"><span className="text-blue-400">label</span>: <span className="text-green-400">string</span></div>
                      <div className="pl-8"><span className="text-blue-400">data</span>: <span className="text-green-400">number[]</span></div>
                      <div className="pl-8"><span className="text-blue-400">backgroundColor</span>?: <span className="text-green-400">string | string[]</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Text Syntax</h4>
                    <div className="bg-neutral-900 rounded-lg p-3 text-sm font-mono text-neutral-300 overflow-x-auto whitespace-pre">@ui:chart[{`{"chartType": "bar", "title": "Sales", "data": {"labels": ["Q1", "Q2"], "datasets": [{"label": "Revenue", "data": [100, 150]}]}}`}]</div>
                  </div>
                </div>
              </div>
            </details>

            {/* Map */}
            <details className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg overflow-hidden group">
              <summary className="px-6 py-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                  <h3 className="font-semibold text-neutral-900 dark:text-white">map</h3>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">— Interactive map with markers</span>
                </div>
                <svg className="w-5 h-5 text-neutral-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Props</h4>
                    <div className="bg-neutral-900 rounded-lg p-3 text-sm font-mono text-neutral-300 overflow-x-auto">
                      <div><span className="text-blue-400">center</span>: <span className="text-yellow-400">Object</span> <span className="text-neutral-500">// Required</span></div>
                      <div className="pl-4"><span className="text-blue-400">lat</span>: <span className="text-green-400">number</span></div>
                      <div className="pl-4"><span className="text-blue-400">lng</span>: <span className="text-green-400">number</span></div>
                      <div><span className="text-blue-400">zoom</span>?: <span className="text-green-400">number</span> <span className="text-neutral-500">// Default: 10</span></div>
                      <div><span className="text-blue-400">markers</span>?: <span className="text-yellow-400">Array</span></div>
                      <div className="pl-4"><span className="text-blue-400">id</span>: <span className="text-green-400">string</span></div>
                      <div className="pl-4"><span className="text-blue-400">position</span>: <span className="text-yellow-400">{'{lat, lng}'}</span></div>
                      <div className="pl-4"><span className="text-blue-400">title</span>: <span className="text-green-400">string</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Text Syntax</h4>
                    <div className="bg-neutral-900 rounded-lg p-3 text-sm font-mono text-neutral-300 overflow-x-auto whitespace-pre">@ui:map[{`{"center": {"lat": 40.7128, "lng": -74.006}, "zoom": 12, "markers": [{"id": "1", "position": {"lat": 40.7128, "lng": -74.006}, "title": "NYC"}]}`}]</div>
                  </div>
                </div>
              </div>
            </details>

            {/* Flow */}
            <details className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg overflow-hidden group">
              <summary className="px-6 py-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <h3 className="font-semibold text-neutral-900 dark:text-white">flow</h3>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">— Horizontal pipeline with action button</span>
                </div>
                <svg className="w-5 h-5 text-neutral-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Props</h4>
                    <div className="bg-neutral-900 rounded-lg p-3 text-sm font-mono text-neutral-300 overflow-x-auto">
                      <div><span className="text-blue-400">title</span>: <span className="text-green-400">string</span> <span className="text-neutral-500">// Required</span></div>
                      <div><span className="text-blue-400">subtitle</span>?: <span className="text-green-400">string</span> <span className="text-neutral-500">// e.g., "Tomorrow 9:00 AM"</span></div>
                      <div><span className="text-blue-400">icon</span>?: <span className="text-green-400">"research" | "schedule" | "analyze" | "deploy"</span></div>
                      <div><span className="text-blue-400">steps</span>: <span className="text-yellow-400">Array</span> <span className="text-neutral-500">// Required</span></div>
                      <div className="pl-4"><span className="text-blue-400">id</span>: <span className="text-green-400">string</span> <span className="text-neutral-500">// Required</span></div>
                      <div className="pl-4"><span className="text-blue-400">label</span>: <span className="text-green-400">string</span> <span className="text-neutral-500">// Use @name for agents</span></div>
                      <div className="pl-4"><span className="text-blue-400">type</span>?: <span className="text-green-400">"time" | "agent" | "email" | "slack" | "build" | "test" | "deploy"</span></div>
                      <div className="pl-4"><span className="text-blue-400">status</span>?: <span className="text-green-400">"pending" | "active" | "completed" | "error"</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Text Syntax</h4>
                    <div className="bg-neutral-900 rounded-lg p-3 text-sm font-mono text-neutral-300 overflow-x-auto whitespace-pre">@ui:flow[{`{"title": "Deploy", "icon": "deploy", "steps": [{"id": "1", "label": "Test"}, {"id": "2", "label": "Build"}, {"id": "3", "label": "Deploy"}], "actions": [{"type": "run", "label": "Run"}]}`}]</div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Usage Note</h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Steps are shown as horizontal pills connected by arrows. Use @label for agent names (auto-detects icon). Add status to show execution progress.</p>
                  </div>
                </div>
              </div>
            </details>

            {/* Table */}
            <details className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg overflow-hidden group">
              <summary className="px-6 py-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-cyan-500"></span>
                  <h3 className="font-semibold text-neutral-900 dark:text-white">table</h3>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">— Structured data in rows and columns</span>
                </div>
                <svg className="w-5 h-5 text-neutral-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Props</h4>
                    <div className="bg-neutral-900 rounded-lg p-3 text-sm font-mono text-neutral-300 overflow-x-auto">
                      <div><span className="text-blue-400">columns</span>: <span className="text-yellow-400">Array</span> <span className="text-neutral-500">// Required</span></div>
                      <div className="pl-4"><span className="text-blue-400">key</span>: <span className="text-green-400">string</span> <span className="text-neutral-500">// Required, maps to row data</span></div>
                      <div className="pl-4"><span className="text-blue-400">label</span>: <span className="text-green-400">string</span> <span className="text-neutral-500">// Required, header text</span></div>
                      <div className="pl-4"><span className="text-blue-400">align</span>?: <span className="text-green-400">"left" | "center" | "right"</span></div>
                      <div className="pl-4"><span className="text-blue-400">width</span>?: <span className="text-green-400">string</span> <span className="text-neutral-500">// CSS width</span></div>
                      <div><span className="text-blue-400">rows</span>: <span className="text-yellow-400">Array</span> <span className="text-neutral-500">// Required, data objects</span></div>
                      <div><span className="text-blue-400">caption</span>?: <span className="text-green-400">string</span> <span className="text-neutral-500">// Table caption</span></div>
                      <div><span className="text-blue-400">compact</span>?: <span className="text-green-400">boolean</span> <span className="text-neutral-500">// Smaller padding</span></div>
                      <div><span className="text-blue-400">striped</span>?: <span className="text-green-400">boolean</span> <span className="text-neutral-500">// Alternating row colors</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Text Syntax</h4>
                    <div className="bg-neutral-900 rounded-lg p-3 text-sm font-mono text-neutral-300 overflow-x-auto whitespace-pre">@ui:table[{`{"columns": [{"key": "name", "label": "Name"}, {"key": "status", "label": "Status"}, {"key": "amount", "label": "Amount", "align": "right"}], "rows": [{"name": "Project A", "status": "Active", "amount": "$1,200"}, {"name": "Project B", "status": "Pending", "amount": "$800"}], "striped": true}`}]</div>
                  </div>
                </div>
              </div>
            </details>
          </div>
        </section>
      </div>
    </div>
  );
}
