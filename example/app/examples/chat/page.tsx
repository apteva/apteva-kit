'use client';

import { useState } from 'react';
import { Chat, type Message, type Widget } from '@apteva/apteva-kit';
import Link from 'next/link';

// Icon components for welcome screen prompts
const WriteIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const CodeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const LightbulbIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

// Pre-populated message examples
const tripPlannerMessages: Message[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    content: 'Hello! I\'m your AI travel assistant. How can I help you plan your trip today?',
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: 'msg-2',
    role: 'user',
    content: 'I want to plan a trip to Europe',
    timestamp: new Date(Date.now() - 3500000),
  },
  {
    id: 'msg-3',
    role: 'assistant',
    content: 'Great choice! Europe has amazing destinations. What\'s your budget and how many days do you have?',
    timestamp: new Date(Date.now() - 3400000),
  },
  {
    id: 'msg-4',
    role: 'user',
    content: 'Around $2000 for 5 days',
    timestamp: new Date(Date.now() - 3300000),
  },
  {
    id: 'msg-5',
    role: 'assistant',
    content: 'Perfect! I found some great destinations that fit your budget:',
    widgets: [
      {
        type: 'list',
        id: 'destinations-1',
        props: {
          items: [
            {
              id: 'paris',
              title: 'Paris, France',
              subtitle: '5 days • $1,850',
              description: 'The City of Light with iconic landmarks',
              metadata: { city: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, price: 1850, days: 5 },
            },
            {
              id: 'rome',
              title: 'Rome, Italy',
              subtitle: '5 days • $1,650',
              description: 'Ancient history meets modern culture',
              metadata: { city: 'Rome', country: 'Italy', lat: 41.9028, lng: 12.4964, price: 1650, days: 5 },
            },
            {
              id: 'barcelona',
              title: 'Barcelona, Spain',
              subtitle: '5 days • $1,450',
              description: 'Beautiful beaches and Gaudí architecture',
              metadata: { city: 'Barcelona', country: 'Spain', lat: 41.3851, lng: 2.1734, price: 1450, days: 5 },
            },
          ],
        },
        actions: [
          {
            type: 'select_destination',
            label: 'Select',
            handler: 'client',
            payload: {},
          },
          {
            type: 'view_details',
            label: 'Details',
            handler: 'server',
            payload: {},
          },
        ],
      },
    ],
    timestamp: new Date(Date.now() - 3200000),
  },
];

const customerSupportMessages: Message[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    content: 'Hi! I\'m here to help. What can I assist you with today?',
    timestamp: new Date(Date.now() - 1800000),
  },
  {
    id: 'msg-2',
    role: 'user',
    content: 'I need help with my recent order',
    timestamp: new Date(Date.now() - 1700000),
  },
  {
    id: 'msg-3',
    role: 'assistant',
    content: 'I\'d be happy to help! Let me pull up your recent orders:',
    widgets: [
      {
        type: 'list',
        id: 'orders-1',
        props: {
          items: [
            {
              id: 'order-1',
              title: 'Order #12345',
              subtitle: 'Delivered • Nov 15, 2024',
              description: '2 items • Total: $89.99',
              backgroundColor: 'rgba(34, 197, 94, 0.15)',
            },
            {
              id: 'order-2',
              title: 'Order #12344',
              subtitle: 'In Transit • Nov 20, 2024',
              description: '1 item • Total: $45.00',
              backgroundColor: 'rgba(234, 179, 8, 0.15)',
            },
          ],
        },
        actions: [
          {
            type: 'view_order',
            label: 'View',
            handler: 'client',
            payload: {},
          },
          {
            type: 'track_order',
            label: 'Track',
            handler: 'client',
            payload: {},
          },
        ],
      },
    ],
    timestamp: new Date(Date.now() - 1600000),
  },
];

const analyticsMessages: Message[] = [
  {
    id: 'msg-1',
    role: 'user',
    content: 'Show me this month\'s analytics',
    timestamp: new Date(Date.now() - 900000),
  },
  {
    id: 'msg-2',
    role: 'assistant',
    content: 'Here\'s your analytics overview for this month:',
    widgets: [
      {
        type: 'list',
        id: 'metrics-1',
        props: {
          items: [
            {
              id: 'metric-1',
              title: 'Total Revenue',
              subtitle: '$45,230',
              description: '+18% from last month',
              backgroundColor: 'rgba(34, 197, 94, 0.15)',
            },
            {
              id: 'metric-2',
              title: 'Active Users',
              subtitle: '1,847',
              description: '+12% from last month',
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
            },
            {
              id: 'metric-3',
              title: 'Conversion Rate',
              subtitle: '3.4%',
              description: '+0.8% from last month',
              backgroundColor: 'rgba(168, 85, 247, 0.15)',
            },
          ],
        },
      },
    ],
    timestamp: new Date(Date.now() - 800000),
  },
];

// Text-based widget detection example - widgets embedded in text using @ui:type[{props}] syntax
const textWidgetMessages: Message[] = [
  {
    id: 'msg-1',
    role: 'user',
    content: 'Show me a summary of the project status',
    timestamp: new Date(Date.now() - 500000),
  },
  {
    id: 'msg-2',
    role: 'assistant',
    content: `Here's the current project status:

@ui:card[{"title": "Project Alpha", "description": "Web application redesign with new UI components and improved performance", "footer": "Due: Dec 15, 2024"}]

The team has made great progress this sprint. Here are the key metrics:

@ui:list[{"items": [{"id": "1", "title": "Tasks Completed", "subtitle": "24 of 30"}, {"id": "2", "title": "Open Issues", "subtitle": "6 remaining"}, {"id": "3", "title": "Team Velocity", "subtitle": "32 story points"}], "meta": {"items": [{"id": "1", "title": "Tasks Completed", "subtitle": "24 of 30", "description": "80% completion rate", "completedTasks": 24, "totalTasks": 30, "assignees": ["Alice", "Bob"], "dueDate": "2024-12-20"}, {"id": "2", "title": "Open Issues", "subtitle": "6 remaining", "description": "2 critical, 4 minor", "critical": 2, "minor": 4, "blockers": ["API integration", "Auth flow"]}, {"id": "3", "title": "Team Velocity", "subtitle": "32 story points", "description": "+15% from last sprint", "currentVelocity": 32, "previousVelocity": 28, "trend": "up"}], "projectId": "alpha-001", "lastUpdated": "2024-12-15T10:30:00Z"}}]

Would you like to take any action?

@ui:button_group[{"buttons": [{"id": "view-tasks", "label": "View All Tasks", "variant": "primary"}, {"id": "add-task", "label": "Add Task"}, {"id": "export", "label": "Export Report", "variant": "outline"}]}]`,
    timestamp: new Date(Date.now() - 400000),
  },
  {
    id: 'msg-3',
    role: 'user',
    content: 'Show me more examples of what widgets you can render',
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: 'msg-4',
    role: 'assistant',
    content: `I can render various UI widgets inline! Here are some examples:

**Cards** are great for highlighting key information:

@ui:card[{"title": "Quick Stats", "description": "Revenue is up 23% this quarter. Customer satisfaction at 4.8/5 stars."}]

**Lists** work well for multiple items:

@ui:list[{"items": [{"id": "a", "title": "Design Review", "subtitle": "Tomorrow 2pm", "description": "Review new mockups with team"}, {"id": "b", "title": "Code Review", "subtitle": "Wednesday", "description": "PR #142 - Auth refactor"}]}]

**Button groups** let users take action:

@ui:button_group[{"buttons": [{"id": "yes", "label": "Yes", "variant": "primary"}, {"id": "no", "label": "No"}, {"id": "maybe", "label": "Maybe", "variant": "outline"}]}]

All widgets are interactive - try clicking the buttons!`,
    timestamp: new Date(Date.now() - 200000),
  },
];

// Plan approval example - showing a list of actions with approve/reject buttons
const planApprovalMessages: Message[] = [
  {
    id: 'msg-1',
    role: 'user',
    content: 'Delete all inactive users from the database',
    timestamp: new Date(Date.now() - 600000),
  },
  {
    id: 'msg-2',
    role: 'assistant',
    content: 'I\'ve created a plan to delete inactive users. Please review the steps below:',
    widgets: [
      {
        type: 'list',
        id: 'plan-steps',
        props: {
          items: [
            {
              id: 'step-1',
              title: '1. Query inactive users',
              subtitle: 'Find users with last_login > 90 days',
              description: 'SELECT * FROM users WHERE last_login < NOW() - INTERVAL 90 DAY',
            },
            {
              id: 'step-2',
              title: '2. Backup user data',
              subtitle: 'Create backup before deletion',
              description: 'Export 847 user records to backup_users_2024.csv',
            },
            {
              id: 'step-3',
              title: '3. Delete related records',
              subtitle: 'Remove orphaned data',
              description: 'Delete sessions, preferences, and activity logs',
            },
            {
              id: 'step-4',
              title: '4. Delete user accounts',
              subtitle: 'Remove 847 inactive accounts',
              description: 'DELETE FROM users WHERE id IN (SELECT id FROM inactive_users)',
            },
          ],
        },
      },
      {
        type: 'button_group',
        id: 'plan-actions',
        props: {
          layout: 'horizontal',
          buttons: [
            { id: 'approve', label: 'Approve Plan', variant: 'primary' },
            { id: 'reject', label: 'Reject', variant: 'secondary' },
          ],
        },
        actions: [
          {
            type: 'approve_plan',
            label: 'Approve',
            handler: 'server',
            payload: { planId: 'delete-inactive-users', buttonId: 'approve' },
          },
          {
            type: 'reject_plan',
            label: 'Reject',
            handler: 'server',
            payload: { planId: 'delete-inactive-users', buttonId: 'reject' },
          },
        ],
      },
    ],
    timestamp: new Date(Date.now() - 500000),
  },
];

// Welcome screen prompt configurations
const welcomeConfigs = {
  basic: {
    title: 'How can I help you today?',
    subtitle: 'Ask me anything or try one of these suggestions',
    prompts: [
      'Write an email to my team',
      'Help me brainstorm ideas',
      'Explain how something works',
      'Help me solve a problem',
    ],
  },
  support: {
    title: 'Welcome to Support',
    subtitle: 'How can we assist you today?',
    prompts: [
      { text: 'Track my order', description: 'Get status updates on your recent orders' },
      { text: 'Return or exchange', description: 'Start a return or exchange request' },
      { text: 'Update my account', description: 'Change email, password, or preferences' },
      { text: 'Talk to a human', description: 'Connect with a support specialist' },
    ],
  },
  coding: {
    title: 'AI Coding Assistant',
    subtitle: 'I can help you write, debug, and explain code',
    prompts: [
      { text: 'Help me write a function', icon: <CodeIcon />, description: 'Generate code for a specific task' },
      { text: 'Debug my code', icon: <SearchIcon />, description: 'Find and fix issues in your code' },
      { text: 'Explain this code', icon: <LightbulbIcon />, description: 'Understand how code works' },
      { text: 'Refactor my code', icon: <WriteIcon />, description: 'Improve code quality and structure' },
    ],
  },
};

export default function ChatExample() {
  const [activeTab, setActiveTab] = useState<'live' | 'welcome' | 'hybrid' | 'trip' | 'support' | 'analytics' | 'plan' | 'textwidgets' | 'widgetcapture' | 'widget' | 'modal' | 'embedded'>('live');
  const [welcomeStyle, setWelcomeStyle] = useState<'basic' | 'support' | 'coding'>('basic');
  const [welcomeVariant, setWelcomeVariant] = useState<'centered' | 'minimal'>('centered');
  // Hybrid mode state
  const [hybridMode, setHybridMode] = useState<'chat' | 'command'>('chat');
  const [commandVariant, setCommandVariant] = useState<'default' | 'compact'>('default');
  const [planMode, setPlanMode] = useState(false);
  const [agentId, setAgentId] = useState('your-agent-id');
  const [showHeader, setShowHeader] = useState(true);
  const [headerTitle, setHeaderTitle] = useState('AI Assistant');
  const [placeholder, setPlaceholder] = useState('Type your message...');
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastAction, setLastAction] = useState<{ type: string; payload: any; time: string } | null>(null);
  const [capturedWidgets, setCapturedWidgets] = useState<Widget[]>([]);
  const [useMock, setUseMock] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [chatVariant, setChatVariant] = useState<'default' | 'minimal' | 'terminal'>('default');

  // Code examples for each tab
  const codeExamples: Record<string, string> = {
    live: `import { Chat } from '@apteva/apteva-kit';

// Basic Chat
<div className="bg-white rounded-2xl border shadow-xl overflow-hidden">
  <Chat
    agentId="your-agent-id"
    showHeader={true}
    headerTitle="AI Assistant"
    placeholder="Type your message..."
    onMessageSent={(msg) => console.log('Sent:', msg)}
    onAction={(action) => console.log('Action:', action)}
    className="h-[600px]"
  />
</div>`,
    welcome: `import { Chat } from '@apteva/apteva-kit';

// Chat with Welcome Screen & Suggested Prompts
<Chat
  agentId="your-agent-id"
  welcomeTitle="How can I help you today?"
  welcomeSubtitle="Ask me anything or try a suggestion"
  welcomeVariant="centered" // or "minimal" for mobile
  suggestedPrompts={[
    // Simple strings
    "Write an email to my team",
    "Help me brainstorm ideas",
    // Or objects with icons & descriptions
    {
      text: "Debug my code",
      icon: <CodeIcon />,
      description: "Find and fix issues"
    }
  ]}
  className="h-full"
/>`,
    hybrid: `import { Chat } from '@apteva/apteva-kit';

// Chat Mode - Full conversation
<Chat
  agentId="your-agent-id"
  initialMode="chat"
  showHeader={true}
/>

// Command Mode - Self-contained input
// Just a single input box with inline response
<Chat
  agentId="your-agent-id"
  initialMode="command"
  showHeader={false}  // No header needed
/>

// The response appears directly in the input area`,
    trip: `import { Chat } from '@apteva/apteva-kit';

// Chat with pre-populated messages
const messages = [
  { id: '1', role: 'assistant', content: 'Hello!', timestamp: new Date() },
  { id: '2', role: 'user', content: 'Hi there', timestamp: new Date() },
];

<Chat
  agentId="your-agent-id"
  initialMessages={messages}
  headerTitle="Trip Planner AI"
  placeholder="Ask about destinations..."
  className="h-full"
/>`,
    support: `import { Chat } from '@apteva/apteva-kit';

// Customer Support Chat with widgets
<Chat
  agentId="support-agent-id"
  headerTitle="Customer Support"
  placeholder="How can we help?"
  onAction={(action) => {
    // Handle widget actions
    if (action.type === 'view_order') {
      openOrderDetails(action.payload.id);
    }
  }}
/>`,
    analytics: `import { Chat } from '@apteva/apteva-kit';

// Analytics Chat
<Chat
  agentId="analytics-agent-id"
  headerTitle="Analytics Assistant"
  placeholder="Ask about your metrics..."
  onAction={(action) => {
    console.log('Widget action:', action);
  }}
/>`,
    textwidgets: `import { Chat } from '@apteva/apteva-kit';

// Enable text-based widget detection
// Agent can render widgets using @ui:type[{props}] syntax
<Chat
  agentId="your-agent-id"
  enableWidgets={true}  // Parse @ui:widget[{props}] from text
  availableWidgets={['card', 'list', 'button_group']}  // Optional: limit widgets
  headerTitle="Widget-Enabled Chat"
  onAction={(action) => {
    // Handle widget interactions (button clicks, etc.)
    console.log('Widget action:', action);
  }}
/>

// The agent receives context about available widgets
// and can respond with inline widget syntax like:
//
// Here's the project status:
// @ui:card[{"title": "Project Alpha", "description": "On track"}]
//
// @ui:button_group[{"buttons": [{"id": "yes", "label": "Approve"}]}]`,
    widgetcapture: `import { useState } from 'react';
import { Chat, Widget } from '@apteva/apteva-kit';

// Capture widget data and display in a sidebar
function ChatWithSidebar() {
  const [capturedWidgets, setCapturedWidgets] = useState<Widget[]>([]);

  return (
    <div className="flex h-screen">
      {/* Chat */}
      <div className="flex-1">
        <Chat
          agentId="your-agent-id"
          enableWidgets={true}
          onWidgetRender={(widget) => {
            // Capture each widget as it streams in
            setCapturedWidgets(prev => [...prev, widget]);
          }}
          onAction={(action) => {
            console.log('Widget action:', action);
          }}
        />
      </div>

      {/* Sidebar - shows captured widget data */}
      <div className="w-80 border-l p-4 overflow-auto">
        <h3 className="font-bold mb-4">Captured Widgets</h3>
        {capturedWidgets.map((widget, i) => (
          <div key={i} className="mb-4 p-3 bg-neutral-100 rounded">
            <div className="font-medium">{widget.type}</div>
            <pre className="text-xs mt-2 overflow-auto">
              {JSON.stringify(widget.props, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}`,
    widget: `import { useState } from 'react';
import { Chat } from '@apteva/apteva-kit';

function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-[400px] h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between p-4 bg-blue-600 text-white">
            <h3>AI Assistant</h3>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>
          <Chat
            agentId="your-agent-id"
            showHeader={false}
            className="h-[calc(100%-60px)]"
          />
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg"
        >
          💬
        </button>
      )}
    </div>
  );
}`,
    modal: `import { useState } from 'react';
import { Chat } from '@apteva/apteva-kit';

function ChatModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Open Chat
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-md h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3>AI Assistant</h3>
              <button onClick={() => setIsOpen(false)}>✕</button>
            </div>
            <div className="h-[calc(100%-57px)]">
              <Chat
                agentId="your-agent-id"
                showHeader={false}
                className="h-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}`,
  };

  // Styling options
  const [bgColor, setBgColor] = useState<'white' | 'dark' | 'gray' | 'transparent'>('white');
  const [borderRadius, setBorderRadius] = useState<'none' | 'md' | 'xl' | '2xl' | '3xl'>('2xl');
  const [shadow, setShadow] = useState<'none' | 'md' | 'xl' | '2xl'>('xl');
  const [showBorder, setShowBorder] = useState(true);
  const [chatWidth, setChatWidth] = useState<'sm' | 'md' | 'lg' | 'xl' | 'full'>('md');

  // Generate container classes based on styling options
  const getContainerClasses = () => {
    const classes = ['w-full', 'h-full', 'max-h-[700px]', 'overflow-hidden'];

    // Width
    switch (chatWidth) {
      case 'sm': classes.push('max-w-sm'); break;
      case 'md': classes.push('max-w-md'); break;
      case 'lg': classes.push('max-w-lg'); break;
      case 'xl': classes.push('max-w-xl'); break;
      case 'full': break; // no max-width constraint
    }

    // Background
    switch (bgColor) {
      case 'white': classes.push('bg-white', 'dark:bg-neutral-900'); break;
      case 'dark': classes.push('bg-neutral-900'); break;
      case 'gray': classes.push('bg-neutral-100', 'dark:bg-neutral-800'); break;
      case 'transparent': classes.push('bg-transparent'); break;
    }

    // Border radius
    switch (borderRadius) {
      case 'none': break;
      case 'md': classes.push('rounded-md'); break;
      case 'xl': classes.push('rounded-xl'); break;
      case '2xl': classes.push('rounded-2xl'); break;
      case '3xl': classes.push('rounded-3xl'); break;
    }

    // Shadow
    switch (shadow) {
      case 'none': break;
      case 'md': classes.push('shadow-md'); break;
      case 'xl': classes.push('shadow-xl'); break;
      case '2xl': classes.push('shadow-2xl'); break;
    }

    // Border
    if (showBorder) {
      classes.push('border', 'border-neutral-200', 'dark:border-neutral-800');
    }

    return classes.join(' ');
  };

  // Get CSS variable style for composer border radius
  const getContainerStyle = (): React.CSSProperties => {
    const radiusMap: Record<string, string> = {
      'none': '0',
      'md': '0.375rem',
      'xl': '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
    };
    return {
      '--apteva-border-radius': radiusMap[borderRadius] || '0.75rem',
    } as React.CSSProperties;
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 px-6 py-3 bg-white dark:bg-neutral-900">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-neutral-900 dark:text-white">Chat Component</h1>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Full conversation interface with message history</p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            ← Back
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Controls */}
        <div className="w-80 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-y-auto">
          <div className="p-6 space-y-6">
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

            {/* Variant Selector */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Variant
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['default', 'minimal', 'terminal'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setChatVariant(v)}
                    className={`px-2 py-1.5 text-xs rounded-md border transition-colors ${
                      chatVariant === v
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Visual theme for the chat</p>
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
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">The agent to send messages to</p>
            </div>

            {/* Show Header Toggle */}
            <div>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Show Header</span>
                <button
                  onClick={() => setShowHeader(!showHeader)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    showHeader ? 'bg-blue-600' : 'bg-neutral-300 dark:bg-neutral-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      showHeader ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Toggle the chat header visibility</p>
            </div>

            {/* Header Title */}
            {showHeader && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Header Title
                </label>
                <input
                  type="text"
                  value={headerTitle}
                  onChange={(e) => setHeaderTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Customize the header title</p>
              </div>
            )}

            {/* Placeholder */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Placeholder
              </label>
              <input
                type="text"
                value={placeholder}
                onChange={(e) => setPlaceholder(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Input field placeholder text</p>
            </div>

            {/* Styling Section */}
            <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">Container Styling</h3>

              {/* Width */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Width
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {(['sm', 'md', 'lg', 'xl', 'full'] as const).map((w) => (
                    <button
                      key={w}
                      onClick={() => setChatWidth(w)}
                      className={`px-2 py-1.5 text-xs rounded-md border transition-colors ${
                        chatWidth === w
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : 'border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Color */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Background
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['white', 'dark', 'gray', 'transparent'] as const).map((color) => (
                    <button
                      key={color}
                      onClick={() => setBgColor(color)}
                      className={`px-2 py-1.5 text-xs rounded-md border transition-colors ${
                        bgColor === color
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : 'border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Border Radius */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Border Radius
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {(['none', 'md', 'xl', '2xl', '3xl'] as const).map((radius) => (
                    <button
                      key={radius}
                      onClick={() => setBorderRadius(radius)}
                      className={`px-2 py-1.5 text-xs rounded-md border transition-colors ${
                        borderRadius === radius
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : 'border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                      }`}
                    >
                      {radius}
                    </button>
                  ))}
                </div>
              </div>

              {/* Shadow */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Shadow
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['none', 'md', 'xl', '2xl'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setShadow(s)}
                      className={`px-2 py-1.5 text-xs rounded-md border transition-colors ${
                        shadow === s
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : 'border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Show Border Toggle */}
              <div>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Show Border</span>
                  <button
                    onClick={() => setShowBorder(!showBorder)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      showBorder ? 'bg-blue-600' : 'bg-neutral-300 dark:bg-neutral-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        showBorder ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>
              </div>
            </div>

            {/* Props Reference */}
            <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">Key Props</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">agentId</span>
                  <span className="font-mono text-neutral-900 dark:text-white">string</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">initialMessages</span>
                  <span className="font-mono text-neutral-900 dark:text-white">Message[]</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">useMock</span>
                  <span className="font-mono text-neutral-900 dark:text-white">boolean</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">showHeader</span>
                  <span className="font-mono text-neutral-900 dark:text-white">boolean</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">headerTitle</span>
                  <span className="font-mono text-neutral-900 dark:text-white">string</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">placeholder</span>
                  <span className="font-mono text-neutral-900 dark:text-white">string</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">onAction</span>
                  <span className="font-mono text-neutral-900 dark:text-white">function</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">onMessageSent</span>
                  <span className="font-mono text-neutral-900 dark:text-white">function</span>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">Examples:</h3>
              <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
                <li>• <strong>Live Chat:</strong> Empty chat for testing real interactions</li>
                <li>• <strong>Welcome Screen:</strong> Start screen with suggested prompts (responsive)</li>
                <li>• <strong>Hybrid Mode:</strong> Switch between Chat and Command modes</li>
                <li>• <strong>Trip Planner:</strong> Pre-populated travel conversation with widgets</li>
                <li>• <strong>Customer Support:</strong> Support chat with order tracking widgets</li>
                <li>• <strong>Analytics:</strong> Business metrics conversation with data widgets</li>
                <li>• <strong>Widget Mode:</strong> Floating chat widget for website integration</li>
                <li>• <strong>Modal:</strong> Chat opened in a modal dialog from a button</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <div className="flex gap-1 px-4">
              <button
                onClick={() => setActiveTab('live')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'live'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Live Chat
              </button>
              <button
                onClick={() => setActiveTab('welcome')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'welcome'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Welcome Screen
              </button>
              <button
                onClick={() => setActiveTab('hybrid')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'hybrid'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Hybrid Mode
              </button>
              <button
                onClick={() => setActiveTab('trip')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'trip'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Trip Planner
              </button>
              <button
                onClick={() => setActiveTab('support')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'support'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Customer Support
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'analytics'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('plan')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'plan'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Plan Approval
              </button>
              <button
                onClick={() => setActiveTab('textwidgets')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'textwidgets'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Text Widgets
              </button>
              <button
                onClick={() => setActiveTab('widgetcapture')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'widgetcapture'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Widget Capture
              </button>
              <button
                onClick={() => setActiveTab('widget')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'widget'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Widget Mode
              </button>
              <button
                onClick={() => setActiveTab('modal')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'modal'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Modal
              </button>
              <button
                onClick={() => setActiveTab('embedded')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'embedded'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Embedded
              </button>

              {/* View Code Button */}
              <div className="ml-auto flex items-center">
                <button
                  onClick={() => setShowCode(!showCode)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                    showCode
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  {showCode ? 'Hide Code' : 'View Code'}
                </button>
              </div>
            </div>
          </div>

          {/* Action Feedback Display */}
          {lastAction && activeTab !== 'widget' && (
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border-b border-purple-200 dark:border-purple-800">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-purple-800 dark:text-purple-300 mb-1">
                      Widget Action: {lastAction.type}
                    </h3>
                    <p className="text-xs text-purple-600 dark:text-purple-400 mb-2">{lastAction.time}</p>
                    <div className="text-sm text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/40 rounded p-2 font-mono text-xs overflow-auto max-h-32">
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

          {/* Code Panel */}
          {showCode && (
            <div className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-900 dark:bg-black">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Example
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(codeExamples[activeTab]);
                    }}
                    className="px-2 py-1 text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <pre className="text-sm text-neutral-300 overflow-x-auto max-h-64 overflow-y-auto">
                  <code>{codeExamples[activeTab]}</code>
                </pre>
              </div>
            </div>
          )}

          {/* Chat Content */}
          <div className="flex-1 overflow-hidden bg-neutral-100 dark:bg-black flex items-center justify-center p-6">
            {activeTab === 'live' && (
              <div className={getContainerClasses()} style={getContainerStyle()}>
                <Chat
                  key="live-chat"
                  agentId={agentId}
                  variant={chatVariant}
                  initialMessages={[]}
                  useMock={useMock}
                  showHeader={showHeader}
                  headerTitle={headerTitle}
                  placeholder={placeholder}
                  onAction={(action) => {
                    console.log('Action received:', action);
                    setLastAction({
                      type: action.type,
                      payload: action.payload,
                      time: new Date().toLocaleTimeString()
                    });
                  }}
                  onMessageSent={(message) => {
                    console.log('Message sent:', message);
                  }}
                  className="h-full"
                />
              </div>
            )}

            {activeTab === 'welcome' && (
              <div className="w-full h-full flex gap-6">
                {/* Welcome Style Selector */}
                <div className="w-48 flex-shrink-0 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 h-fit">
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">Prompt Style</h3>
                  <div className="space-y-2">
                    {(['basic', 'support', 'coding'] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => setWelcomeStyle(style)}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                          welcomeStyle === style
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                        }`}
                      >
                        {style === 'basic' ? 'Basic' : style === 'support' ? 'Customer Support' : 'Coding Assistant'}
                      </button>
                    ))}
                  </div>

                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mt-6 mb-3">Layout Variant</h3>
                  <div className="space-y-2">
                    {(['centered', 'minimal'] as const).map((v) => (
                      <button
                        key={v}
                        onClick={() => setWelcomeVariant(v)}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                          welcomeVariant === v
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                        }`}
                      >
                        {v === 'centered' ? 'Centered (Desktop)' : 'Minimal (Mobile)'}
                      </button>
                    ))}
                  </div>

                  <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
                    Click a prompt to send it automatically
                  </p>
                </div>

                {/* Chat Preview */}
                <div className={`flex-1 max-w-md h-full max-h-[700px] bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden`} style={getContainerStyle()}>
                  <Chat
                    key={`welcome-${welcomeStyle}-${welcomeVariant}`}
                    agentId={agentId}
                    variant={chatVariant}
                    useMock={useMock}
                    showHeader={showHeader}
                    headerTitle={headerTitle}
                    welcomeTitle={welcomeConfigs[welcomeStyle].title}
                    welcomeSubtitle={welcomeConfigs[welcomeStyle].subtitle}
                    suggestedPrompts={welcomeConfigs[welcomeStyle].prompts}
                    welcomeVariant={welcomeVariant}
                    onAction={(action) => {
                      console.log('Action received:', action);
                      setLastAction({
                        type: action.type,
                        payload: action.payload,
                        time: new Date().toLocaleTimeString()
                      });
                    }}
                    className="h-full"
                  />
                </div>
              </div>
            )}

            {activeTab === 'hybrid' && (
              <div className="w-full h-full flex flex-col gap-6">
                {/* Mode selector */}
                <div className="flex items-center justify-center gap-4">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">Mode:</span>
                  <div className="flex items-center bg-white dark:bg-neutral-800 rounded-lg p-1 border border-neutral-200 dark:border-neutral-800">
                    <button
                      onClick={() => setHybridMode('chat')}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                        hybridMode === 'chat'
                          ? 'bg-blue-600 text-white'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      Chat
                    </button>
                    <button
                      onClick={() => setHybridMode('command')}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                        hybridMode === 'command'
                          ? 'bg-blue-600 text-white'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      Command
                    </button>
                  </div>
                </div>

                {/* Chat/Command Preview */}
                <div className="flex-1 flex items-center justify-center">
                  <div className={`${hybridMode === 'chat' ? 'max-w-md w-full h-full max-h-[600px]' : 'max-w-2xl w-full'} bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800`} style={getContainerStyle()}>
                    <Chat
                      key={`hybrid-${hybridMode}`}
                      agentId={agentId}
                      variant={chatVariant}
                      useMock={useMock}
                      showHeader={hybridMode === 'chat' ? showHeader : false}
                      headerTitle={headerTitle}
                      showModeToggle={true}
                      initialMode={hybridMode}
                      onModeChange={(mode) => setHybridMode(mode)}
                      onAction={(action) => {
                        console.log('Action received:', action);
                        setLastAction({
                          type: action.type,
                          payload: action.payload,
                          time: new Date().toLocaleTimeString()
                        });
                      }}
                      onComplete={(result) => {
                        console.log('Command completed:', result);
                      }}
                      className="h-full"
                    />
                  </div>
                </div>

                {/* Info text */}
                <div className="text-center text-sm text-neutral-500 dark:text-neutral-400">
                  Use the + menu to switch between chat and command modes
                </div>
              </div>
            )}

            {activeTab === 'trip' && (
              <div className={getContainerClasses()} style={getContainerStyle()}>
                <Chat
                  key="trip-chat"
                  agentId={agentId}
                  variant={chatVariant}
                  initialMessages={tripPlannerMessages}
                  useMock={useMock}
                  showHeader={showHeader}
                  headerTitle="Trip Planner AI"
                  placeholder="Ask about travel destinations..."
                  onAction={(action) => {
                    console.log('Action received:', action);
                    setLastAction({
                      type: action.type,
                      payload: action.payload,
                      time: new Date().toLocaleTimeString()
                    });
                  }}
                  className="h-full"
                />
              </div>
            )}

            {activeTab === 'support' && (
              <div className={getContainerClasses()} style={getContainerStyle()}>
                <Chat
                  key="support-chat"
                  agentId={agentId}
                  variant={chatVariant}
                  initialMessages={customerSupportMessages}
                  useMock={useMock}
                  showHeader={showHeader}
                  headerTitle="Customer Support"
                  placeholder="How can we help you?"
                  onAction={(action) => {
                    console.log('Action received:', action);
                    setLastAction({
                      type: action.type,
                      payload: action.payload,
                      time: new Date().toLocaleTimeString()
                    });
                  }}
                  className="h-full"
                />
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className={getContainerClasses()} style={getContainerStyle()}>
                <Chat
                  key="analytics-chat"
                  agentId={agentId}
                  variant={chatVariant}
                  initialMessages={analyticsMessages}
                  useMock={useMock}
                  showHeader={showHeader}
                  headerTitle="Analytics Assistant"
                  placeholder="Ask about your metrics..."
                  onAction={(action) => {
                    console.log('Action received:', action);
                    setLastAction({
                      type: action.type,
                      payload: action.payload,
                      time: new Date().toLocaleTimeString()
                    });
                  }}
                  className="h-full"
                />
              </div>
            )}

            {activeTab === 'plan' && (
              <div className={getContainerClasses()} style={getContainerStyle()}>
                <Chat
                  key="plan-chat"
                  agentId={agentId}
                  variant={chatVariant}
                  initialMessages={planApprovalMessages}
                  useMock={useMock}
                  showHeader={showHeader}
                  headerTitle="Plan Approval"
                  placeholder="Describe a task that needs approval..."
                  onAction={(action) => {
                    console.log('Plan action received:', action);
                    setLastAction({
                      type: action.type,
                      payload: action.payload,
                      time: new Date().toLocaleTimeString()
                    });
                    // Handle approve/reject actions
                    if (action.type === 'approve_plan') {
                      alert('Plan approved! Executing...');
                    } else if (action.type === 'reject_plan') {
                      alert('Plan rejected.');
                    }
                  }}
                  className="h-full"
                />
              </div>
            )}

            {activeTab === 'textwidgets' && (
              <div className={getContainerClasses()} style={getContainerStyle()}>
                <Chat
                  key="textwidgets-chat"
                  agentId={agentId}
                  variant={chatVariant}
                  initialMessages={[]}
                  useMock={useMock}
                  showHeader={showHeader}
                  headerTitle="Widget-Enabled Chat"
                  placeholder="Ask the agent to show widgets..."
                  enableWidgets={true}
                  onAction={(action) => {
                    console.log('Text widget action received:', action);
                    setLastAction({
                      type: action.type,
                      payload: action.payload,
                      time: new Date().toLocaleTimeString()
                    });
                  }}
                  className="h-full"
                />
              </div>
            )}

            {activeTab === 'widgetcapture' && (
              <div className="h-full flex">
                {/* Chat side */}
                <div className="flex-1" style={getContainerStyle()}>
                  <div className={`${getContainerClasses()} h-full`}>
                    <Chat
                      key="widgetcapture-chat"
                      agentId={agentId}
                      variant={chatVariant}
                      initialMessages={[]}
                      useMock={useMock}
                      showHeader={showHeader}
                      headerTitle="Widget Capture Demo"
                      placeholder="Ask for a list or table..."
                      enableWidgets={true}
                      onWidgetRender={(widget) => {
                        console.log('Widget captured:', widget);
                        setCapturedWidgets(prev => [...prev, widget]);
                      }}
                      onAction={(action) => {
                        console.log('Widget action:', action);
                        setLastAction({
                          type: action.type,
                          payload: action.payload,
                          time: new Date().toLocaleTimeString()
                        });
                      }}
                      className="h-full"
                    />
                  </div>
                </div>

                {/* Sidebar - captured widgets */}
                <div className="w-80 border-l border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 p-4 overflow-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-neutral-900 dark:text-white">Captured Widgets</h3>
                    {capturedWidgets.length > 0 && (
                      <button
                        onClick={() => setCapturedWidgets([])}
                        className="text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  {capturedWidgets.length === 0 ? (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Widgets will appear here as they stream in via <code className="bg-neutral-200 dark:bg-neutral-700 px-1 rounded">onWidgetRender</code>
                    </p>
                  ) : (
                    capturedWidgets.map((widget, i) => (
                      <div key={i} className="mb-4 p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium rounded">
                            {widget.type}
                          </span>
                          <span className="text-xs text-neutral-500">{widget.id}</span>
                        </div>
                        <div className="text-xs text-neutral-500 mb-1">props:</div>
                        <pre className="text-xs text-neutral-700 dark:text-neutral-300 overflow-auto max-h-32 bg-neutral-50 dark:bg-neutral-800 p-2 rounded mb-2">
                          {JSON.stringify(widget.props, null, 2)}
                        </pre>
                        {widget.meta && (
                          <>
                            <div className="text-xs text-purple-600 dark:text-purple-400 mb-1">meta (full data):</div>
                            <pre className="text-xs text-purple-700 dark:text-purple-300 overflow-auto max-h-40 bg-purple-50 dark:bg-purple-900/30 p-2 rounded border border-purple-200 dark:border-purple-800">
                              {JSON.stringify(widget.meta, null, 2)}
                            </pre>
                          </>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'widget' && (
              <div className="h-full flex items-center justify-center p-8">
                <div className="max-w-2xl text-center">
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                    Live Chat Widget Demo
                  </h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    Click the chat button in the bottom-right corner to open the live chat widget.
                    This simulates how the chat would appear on a real website.
                  </p>
                  <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-blue-900 dark:text-blue-300">
                      This is perfect for customer support, help desks, or any scenario where you want
                      a floating chat interface that doesn't take up the full page.
                    </p>
                  </div>
                </div>

                {/* Floating Chat Widget */}
                <div className="fixed bottom-6 right-6 z-50">
                  {isWidgetOpen ? (
                    <div className="flex flex-col bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden"
                         style={{ width: '400px', height: '600px', ...getContainerStyle() }}>
                      <div className="flex items-center justify-between p-4 bg-blue-600 text-white">
                        <h3 className="font-semibold">{headerTitle}</h3>
                        <button
                          onClick={() => setIsWidgetOpen(false)}
                          className="text-white hover:bg-blue-700 rounded-lg p-1 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex-1 overflow-hidden flex flex-col">
                        {lastAction && (
                          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border-b border-purple-200 dark:border-purple-800">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-purple-800 dark:text-purple-300 truncate">
                                  Action: {lastAction.type}
                                </p>
                                <p className="text-xs text-purple-600 dark:text-purple-400">{lastAction.time}</p>
                              </div>
                              <button
                                onClick={() => setLastAction(null)}
                                className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        )}

                        <Chat
                          agentId={agentId}
                          variant={chatVariant}
                          initialMessages={[]}
                          useMock={useMock}
                          showHeader={false}
                          placeholder={placeholder}
                          onAction={(action) => {
                            console.log('Action received:', action);
                            setLastAction({
                              type: action.type,
                              payload: action.payload,
                              time: new Date().toLocaleTimeString()
                            });
                          }}
                          onMessageSent={(message) => {
                            console.log('Message sent:', message);
                          }}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsWidgetOpen(true)}
                      className="flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'modal' && (
              <div className="h-full flex items-center justify-center p-8">
                <div className="max-w-2xl text-center">
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                    Modal Chat Demo
                  </h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    Click the button below to open the chat in a modal dialog.
                    This is useful for support buttons, help systems, or any scenario where you want
                    the chat to overlay the current content.
                  </p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                  >
                    Open Chat
                  </button>
                  <div className="mt-6 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-left">
                    <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">Use Cases:</h3>
                    <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                      <li>• Help/Support buttons in navigation</li>
                      <li>• Contact forms with AI assistance</li>
                      <li>• In-app AI assistants</li>
                      <li>• FAQ chatbots</li>
                    </ul>
                  </div>
                </div>

                {/* Modal Overlay */}
                {isModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                      className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                      onClick={() => setIsModalOpen(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative w-full max-w-md h-[600px] bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200" style={getContainerStyle()}>
                      {/* Modal Header */}
                      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
                        <h3 className="font-semibold text-neutral-900 dark:text-white">{headerTitle}</h3>
                        <button
                          onClick={() => setIsModalOpen(false)}
                          className="p-1.5 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      {/* Chat Content */}
                      <div className="h-[calc(100%-57px)]">
                        <Chat
                          agentId={agentId}
                          variant={chatVariant}
                          initialMessages={[]}
                          useMock={useMock}
                          showHeader={false}
                          placeholder={placeholder}
                          onAction={(action) => {
                            console.log('Action received:', action);
                            setLastAction({
                              type: action.type,
                              payload: action.payload,
                              time: new Date().toLocaleTimeString()
                            });
                          }}
                          onMessageSent={(message) => {
                            console.log('Message sent:', message);
                          }}
                          className="h-full"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'embedded' && (
              <div className="h-full p-8 overflow-auto">
                {/* Simulated App Layout */}
                <div className="max-w-4xl mx-auto space-y-6">
                  {/* Header */}
                  <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 shadow-sm border border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center justify-between">
                      <h1 className="text-xl font-bold text-neutral-900 dark:text-white">My Dashboard</h1>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">Welcome, User</span>
                        <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 shadow-sm border border-neutral-200 dark:border-neutral-800">
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Total Sales</p>
                      <p className="text-2xl font-bold text-neutral-900 dark:text-white">$12,450</p>
                    </div>
                    <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 shadow-sm border border-neutral-200 dark:border-neutral-800">
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Active Users</p>
                      <p className="text-2xl font-bold text-neutral-900 dark:text-white">1,234</p>
                    </div>
                    <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 shadow-sm border border-neutral-200 dark:border-neutral-800">
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Conversion</p>
                      <p className="text-2xl font-bold text-neutral-900 dark:text-white">3.2%</p>
                    </div>
                  </div>

                  {/* AI Assistant - Command Mode Embedded */}
                  <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 shadow-sm border border-neutral-200 dark:border-neutral-800" style={getContainerStyle()}>
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">AI Assistant</h2>
                    </div>
                    <Chat
                      agentId={agentId}
                      variant={chatVariant}
                      useMock={useMock}
                      initialMode="command"
                      showModeToggle={true}
                      onModeChange={(mode) => console.log('Mode changed:', mode)}
                      placeholder="Ask me anything about your data..."
                    />
                  </div>

                  {/* Content Section */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 shadow-sm border border-neutral-200 dark:border-neutral-800">
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">Recent Activity</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Order #1234 completed</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>New user signup</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span>Payment pending</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 shadow-sm border border-neutral-200 dark:border-neutral-800">
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">Quick Actions</h3>
                      <div className="space-y-2">
                        <button className="w-full text-left px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md transition-colors">
                          Create new order
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md transition-colors">
                          View reports
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md transition-colors">
                          Manage settings
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      <strong>Note:</strong> The AI Assistant above uses <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">initialMode="command"</code> to
                      start in command mode. It takes full width with no extra margins - the parent container controls the layout.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
