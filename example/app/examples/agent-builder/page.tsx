'use client';

import { useState } from 'react';
import { Chat, type Message } from '@apteva/apteva-kit';
import Link from 'next/link';

// Types
interface Agent {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'draft' | 'testing' | 'deploying' | 'paused';
  description: string;
  capabilities: string[];
  usage: number;
  lastModified: Date;
  version: string;
}

interface TestResult {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'running' | 'pending';
  duration?: number;
  error?: string;
}

// Mock existing agents
const existingAgents: Agent[] = [
  {
    id: 'agent-1',
    name: 'Customer Support Bot',
    type: 'Support',
    status: 'active',
    description: 'Handles general customer inquiries and FAQ responses',
    capabilities: ['FAQ Response', 'Ticket Creation', 'Live Handoff'],
    usage: 12450,
    lastModified: new Date(Date.now() - 86400000 * 3),
    version: '2.1.0',
  },
  {
    id: 'agent-2',
    name: 'Sales Assistant',
    type: 'Sales',
    status: 'active',
    description: 'Helps qualify leads and schedule demos',
    capabilities: ['Lead Qualification', 'Demo Scheduling', 'Product Info'],
    usage: 5230,
    lastModified: new Date(Date.now() - 86400000 * 7),
    version: '1.3.2',
  },
  {
    id: 'agent-3',
    name: 'Onboarding Guide',
    type: 'Onboarding',
    status: 'paused',
    description: 'Guides new users through product setup',
    capabilities: ['Tutorial Walkthrough', 'Feature Explanation', 'Setup Help'],
    usage: 890,
    lastModified: new Date(Date.now() - 86400000 * 14),
    version: '1.0.5',
  },
  {
    id: 'agent-4',
    name: 'Code Review Bot',
    type: 'Development',
    status: 'testing',
    description: 'Reviews pull requests and suggests improvements',
    capabilities: ['Code Analysis', 'Style Check', 'Security Scan'],
    usage: 0,
    lastModified: new Date(Date.now() - 86400000),
    version: '0.9.0',
  },
];

// Pre-populated messages showing the full agent builder flow with multiple agents
const agentBuilderMessages: Message[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    content: `Welcome to the Agent Builder! I help you create and configure AI agents for your platform.

I can see you have **4 agents** in your system. What would you like to build?

@ui:button_group[{"buttons": [{"id": "create-new", "label": "Create New Agents", "variant": "primary"}, {"id": "modify-existing", "label": "Modify Existing"}, {"id": "view-analytics", "label": "View Analytics", "variant": "outline"}]}]`,
    timestamp: new Date(Date.now() - 700000),
  },
  {
    id: 'msg-2',
    role: 'user',
    content: 'I want to build a complete e-commerce support system - handling orders, returns, and product questions',
    timestamp: new Date(Date.now() - 600000),
  },
  {
    id: 'msg-3',
    role: 'assistant',
    content: `Great! For a complete e-commerce support system, I recommend creating **3 specialized agents** that work together. This modular approach gives you better control and easier maintenance.

**Proposed Agent Architecture:**

@ui:table[{"columns": [{"key": "agent", "label": "Agent"}, {"key": "purpose", "label": "Purpose"}, {"key": "integrations", "label": "Integrations"}], "rows": [{"agent": "Order Tracker", "purpose": "Track orders, shipping status, delivery updates", "integrations": "Order DB, Shipping APIs"}, {"agent": "Returns Handler", "purpose": "Process returns, refunds, exchanges", "integrations": "Order DB, Payment Gateway"}, {"agent": "Product Expert", "purpose": "Answer product questions, recommendations", "integrations": "Product Catalog, Reviews DB"}], "striped": true}]

Plus a **Router Agent** that directs customers to the right specialist:

@ui:card[{"title": "Support Router (Orchestrator)", "description": "Intelligently routes incoming queries to the appropriate specialist agent based on intent detection. Handles handoffs between agents when needed.", "footer": "Coordinates all 3 specialist agents"}]

@ui:button_group[{"buttons": [{"id": "create-all", "label": "Create All 4 Agents", "variant": "primary"}, {"id": "customize", "label": "Customize First"}, {"id": "create-one", "label": "Start with One", "variant": "outline"}]}]`,
    timestamp: new Date(Date.now() - 500000),
  },
  {
    id: 'msg-4',
    role: 'user',
    content: 'Create all 4 agents',
    timestamp: new Date(Date.now() - 400000),
  },
  {
    id: 'msg-5',
    role: 'assistant',
    content: `Creating your e-commerce support system...

**Agent Creation Progress:**

@ui:table[{"columns": [{"key": "agent", "label": "Agent"}, {"key": "status", "label": "Status", "align": "center"}, {"key": "capabilities", "label": "Capabilities"}], "rows": [{"agent": "Support Router", "status": "Created", "capabilities": "Intent detection, Agent routing, Context handoff"}, {"agent": "Order Tracker", "status": "Created", "capabilities": "Order lookup, Shipping status, Delivery tracking"}, {"agent": "Returns Handler", "status": "Created", "capabilities": "Return eligibility, Refund processing, Exchange flow"}, {"agent": "Product Expert", "status": "Created", "capabilities": "Product search, Recommendations, Specs lookup"}], "striped": true, "caption": "4 of 4 agents created successfully"}]

@ui:card[{"title": "All Agents Created!", "description": "Your 4-agent e-commerce support system is ready. Before deployment, let's run validation tests on each agent.", "footer": "Next: Run test suites"}]

**Pre-deployment Status:**

@ui:list[{"items": [{"id": "router", "title": "Support Router", "subtitle": "Ready for testing", "description": "Intent classification accuracy test, routing logic validation"}, {"id": "orders", "title": "Order Tracker", "subtitle": "Ready for testing", "description": "Order lookup tests, shipping API integration tests"}, {"id": "returns", "title": "Returns Handler", "subtitle": "Ready for testing", "description": "Return flow tests, refund calculation tests"}, {"id": "products", "title": "Product Expert", "subtitle": "Ready for testing", "description": "Product search tests, recommendation accuracy tests"}]}]

@ui:button_group[{"buttons": [{"id": "run-all-tests", "label": "Run All Tests", "variant": "primary"}, {"id": "test-individually", "label": "Test Individually"}, {"id": "skip-to-deploy", "label": "Skip Tests", "variant": "outline"}]}]`,
    timestamp: new Date(Date.now() - 350000),
  },
  {
    id: 'msg-6',
    role: 'user',
    content: 'Run all tests',
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: 'msg-7',
    role: 'assistant',
    content: `Running test suites for all 4 agents...

**Test Results Summary:**

@ui:table[{"columns": [{"key": "agent", "label": "Agent"}, {"key": "tests", "label": "Tests", "align": "center"}, {"key": "passed", "label": "Passed", "align": "center"}, {"key": "failed", "label": "Failed", "align": "center"}, {"key": "duration", "label": "Duration", "align": "right"}], "rows": [{"agent": "Support Router", "tests": "12", "passed": "12", "failed": "0", "duration": "1.2s"}, {"agent": "Order Tracker", "tests": "18", "passed": "18", "failed": "0", "duration": "2.4s"}, {"agent": "Returns Handler", "tests": "15", "passed": "15", "failed": "0", "duration": "1.8s"}, {"agent": "Product Expert", "tests": "20", "passed": "20", "failed": "0", "duration": "2.1s"}], "striped": true, "caption": "65 of 65 tests passed across all agents"}]

@ui:card[{"title": "All Tests Passed!", "description": "Your complete e-commerce support system passed all 65 validation tests. All 4 agents are ready for deployment.", "footer": "Total Test Duration: 7.5s"}]

**Deployment Strategy:**

@ui:list[{"items": [{"id": "staged", "title": "Staged Rollout (Recommended)", "subtitle": "Deploy agents sequentially", "description": "Deploy Router first, then add specialist agents one by one. Safer, easier to debug."}, {"id": "all-at-once", "title": "Full Deployment", "subtitle": "Deploy all agents together", "description": "Deploy entire system at once. Faster but harder to isolate issues."}, {"id": "canary", "title": "Canary with 10% Traffic", "subtitle": "Gradual rollout", "description": "Route 10% of support traffic to new system, monitor, then expand."}]}]

@ui:button_group[{"buttons": [{"id": "deploy-staged", "label": "Staged Rollout", "variant": "primary"}, {"id": "deploy-all", "label": "Deploy All Now"}, {"id": "deploy-canary", "label": "Canary Deploy", "variant": "outline"}]}]`,
    timestamp: new Date(Date.now() - 250000),
  },
  {
    id: 'msg-8',
    role: 'user',
    content: 'Do the staged rollout',
    timestamp: new Date(Date.now() - 200000),
  },
  {
    id: 'msg-9',
    role: 'assistant',
    content: `Starting staged rollout to staging environment...

**Deployment Progress:**

@ui:table[{"columns": [{"key": "agent", "label": "Agent"}, {"key": "status", "label": "Status", "align": "center"}, {"key": "endpoint", "label": "Endpoint"}, {"key": "version", "label": "Version", "align": "center"}], "rows": [{"agent": "Support Router", "status": "Live", "endpoint": "/agents/support-router", "version": "1.0.0"}, {"agent": "Order Tracker", "status": "Live", "endpoint": "/agents/order-tracker", "version": "1.0.0"}, {"agent": "Returns Handler", "status": "Live", "endpoint": "/agents/returns-handler", "version": "1.0.0"}, {"agent": "Product Expert", "status": "Live", "endpoint": "/agents/product-expert", "version": "1.0.0"}], "striped": true, "caption": "All agents deployed to staging"}]

@ui:card[{"title": "Staged Rollout Complete!", "description": "All 4 agents are now live in staging. The Support Router is configured to orchestrate the specialist agents automatically.", "footer": "Environment: Staging | 4 Agents Active"}]

**System Architecture (Active):**

@ui:list[{"items": [{"id": "entry", "title": "Entry Point: Support Router", "subtitle": "staging.api.example.com/support", "description": "All customer queries enter here and get routed to specialists"}, {"id": "flow", "title": "Automatic Routing Active", "subtitle": "Intent-based distribution", "description": "Orders → Order Tracker | Returns → Returns Handler | Products → Product Expert"}, {"id": "handoff", "title": "Cross-Agent Handoffs Enabled", "subtitle": "Seamless transitions", "description": "Agents can transfer conversations when topics change"}]}]

**Next Steps:**

@ui:button_group[{"buttons": [{"id": "test-system", "label": "Test Full System", "variant": "primary"}, {"id": "view-metrics", "label": "View Metrics"}, {"id": "promote-prod", "label": "Promote to Production", "variant": "outline"}]}]`,
    timestamp: new Date(Date.now() - 150000),
  },
];

// Live chat messages (empty for testing)
const emptyMessages: Message[] = [];

export default function AgentBuilderExample() {
  const [agents, setAgents] = useState<Agent[]>(existingAgents);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'testing' | 'deployment' | 'logs'>('details');
  const [chatMode, setChatMode] = useState<'demo' | 'live'>('demo');
  const [useMock, setUseMock] = useState(true);
  const [lastAction, setLastAction] = useState<{ type: string; payload: any; time: string } | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'deploying' | 'deployed'>('idle');

  // System context for the agent builder
  const agentBuilderContext = `You are an Agent Builder assistant. Your role is to help users create, configure, and manage AI agents for their platform.

When users describe what they need, you should:
1. Analyze their requirements and propose agent configurations
2. Use widgets to present information clearly
3. Guide them through: Configuration → Testing → Deployment

Always use these widgets:
- @ui:card for agent summaries and status
- @ui:table for capabilities, test results, and configurations
- @ui:list for sub-agents and deployment options
- @ui:button_group for action choices

Flow: Create/Modify → Confirm → Test → Validate → Deploy`;

  const handleAction = (action: { type: string; payload?: any }) => {
    console.log('Action received:', action);
    setLastAction({
      type: action.type,
      payload: action.payload,
      time: new Date().toLocaleTimeString()
    });

    // Handle specific actions
    const buttonId = action.payload?.buttonId;

    if (buttonId === 'run-tests') {
      runTests();
    } else if (buttonId === 'deploy-staging' || buttonId === 'deploy-production') {
      deployAgent(buttonId === 'deploy-production' ? 'production' : 'staging');
    } else if (buttonId === 'create-agent') {
      setActiveTab('details');
    }
  };

  const runTests = () => {
    setActiveTab('testing');
    setIsRunningTests(true);
    setTestResults([
      { id: '1', name: 'Order lookup by ID', status: 'running' },
      { id: '2', name: 'Order lookup by email', status: 'pending' },
      { id: '3', name: 'Return initiation flow', status: 'pending' },
      { id: '4', name: 'Shipping status query', status: 'pending' },
      { id: '5', name: 'Edge case handling', status: 'pending' },
    ]);

    // Simulate test progression
    let currentTest = 0;
    const interval = setInterval(() => {
      setTestResults(prev => {
        const updated = [...prev];
        if (currentTest < updated.length) {
          updated[currentTest] = {
            ...updated[currentTest],
            status: 'passed',
            duration: Math.floor(Math.random() * 500) + 100
          };
          if (currentTest + 1 < updated.length) {
            updated[currentTest + 1] = { ...updated[currentTest + 1], status: 'running' };
          }
        }
        return updated;
      });
      currentTest++;
      if (currentTest >= 5) {
        clearInterval(interval);
        setIsRunningTests(false);
      }
    }, 800);
  };

  const deployAgent = (env: 'staging' | 'production') => {
    setActiveTab('deployment');
    setDeploymentStatus('deploying');
    setTimeout(() => {
      setDeploymentStatus('deployed');
    }, 2000);
  };

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'draft': return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400';
      case 'testing': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'deploying': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'paused': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  const getTestStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
      case 'failed':
        return <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
      case 'running':
        return <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      default:
        return <div className="w-5 h-5 border-2 border-neutral-300 rounded-full" />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-neutral-50 dark:bg-black">
      {/* Header */}
      <div className="h-14 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-neutral-900 dark:text-white">Agent Builder</h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Create and manage AI agents</p>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-neutral-500 dark:text-neutral-400">Total Agents</div>
            <div className="text-sm font-semibold text-neutral-900 dark:text-white">{agents.length} agents</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-neutral-500 dark:text-neutral-400">Active</div>
            <div className="text-sm font-semibold text-green-600">{agents.filter(a => a.status === 'active').length}</div>
          </div>
          <button className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors">
            + New Agent
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left - Chat */}
        <div className="w-[580px] border-r border-neutral-200 dark:border-neutral-800 flex flex-col bg-white dark:bg-neutral-900">
          {/* Chat Mode Toggle */}
          <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800">
              <button
                onClick={() => setChatMode('demo')}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  chatMode === 'demo'
                    ? 'bg-purple-600 text-white'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                Demo Flow
              </button>
              <button
                onClick={() => setChatMode('live')}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  chatMode === 'live'
                    ? 'bg-purple-600 text-white'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                Live Chat
              </button>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">Mock</span>
              <button
                onClick={() => setUseMock(!useMock)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  useMock ? 'bg-purple-600' : 'bg-neutral-300 dark:bg-neutral-600'
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                    useMock ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>
          </div>
          <Chat
            key={`agent-builder-${chatMode}`}
            agentId="agent-builder"
            initialMessages={chatMode === 'demo' ? agentBuilderMessages : emptyMessages}
            useMock={useMock}
            showHeader={false}
            placeholder="Describe the agent you want to create..."
            enableWidgets={true}
            context={agentBuilderContext}
            onAction={handleAction}
            className="flex-1"
          />
        </div>

        {/* Right - Details Panel with Agents on top */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Agents Bar - Horizontal list at top */}
          <div className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-3">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mr-2 flex-shrink-0">Agents:</span>
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => {
                    setSelectedAgent(agent);
                    setActiveTab('details');
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ${
                    selectedAgent?.id === agent.id
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 ring-1 ring-purple-300 dark:ring-purple-700'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    agent.status === 'active' ? 'bg-green-500' :
                    agent.status === 'testing' ? 'bg-blue-500' :
                    agent.status === 'paused' ? 'bg-orange-500' : 'bg-neutral-400'
                  }`} />
                  <span className="truncate max-w-[120px]">{agent.name}</span>
                </button>
              ))}
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New
              </button>
            </div>
          </div>

          {/* Details/Testing/Deployment Panel */}
          <div className="flex-1 flex flex-col">
          {/* Tab Bar */}
          <div className="h-12 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center px-4 gap-2">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'details'
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Details
            </button>
            <button
              onClick={() => setActiveTab('testing')}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'testing'
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Testing
              {testResults.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-green-600 text-white text-xs rounded-full">
                  {testResults.filter(t => t.status === 'passed').length}/{testResults.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('deployment')}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'deployment'
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Deployment
              {deploymentStatus === 'deployed' && (
                <span className="w-2 h-2 bg-green-500 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'logs'
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Logs
            </button>
          </div>

          {/* Action Feedback */}
          {lastAction && (
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border-b border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-sm font-medium text-purple-800 dark:text-purple-300">
                    Action: {lastAction.payload?.buttonId || lastAction.type}
                  </span>
                  <span className="text-xs text-purple-600 dark:text-purple-400">{lastAction.time}</span>
                </div>
                <button onClick={() => setLastAction(null)} className="text-purple-600 dark:text-purple-400 hover:text-purple-800">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto bg-neutral-50 dark:bg-black p-6">
            {/* Details Tab */}
            {activeTab === 'details' && (
              <div className="max-w-2xl mx-auto space-y-6">
                {selectedAgent ? (
                  <>
                    {/* Agent Header */}
                    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">{selectedAgent.name}</h2>
                          <p className="text-neutral-500 dark:text-neutral-400 mt-1">{selectedAgent.description}</p>
                        </div>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedAgent.status)}`}>
                          {selectedAgent.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-6">
                        <div className="text-center p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                          <div className="text-2xl font-bold text-neutral-900 dark:text-white">{selectedAgent.usage.toLocaleString()}</div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">Total Queries</div>
                        </div>
                        <div className="text-center p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                          <div className="text-2xl font-bold text-neutral-900 dark:text-white">v{selectedAgent.version}</div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">Version</div>
                        </div>
                        <div className="text-center p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                          <div className="text-2xl font-bold text-neutral-900 dark:text-white">{selectedAgent.capabilities.length}</div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">Capabilities</div>
                        </div>
                      </div>
                    </div>

                    {/* Capabilities */}
                    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Capabilities</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedAgent.capabilities.map((cap) => (
                          <span key={cap} className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm rounded-lg">
                            {cap}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button className="flex-1 py-2 px-4 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors">
                        Edit Configuration
                      </button>
                      <button className="flex-1 py-2 px-4 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                        View Logs
                      </button>
                      <button className="py-2 px-4 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        Delete
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Select an Agent</h3>
                      <p className="text-neutral-500 dark:text-neutral-400 max-w-sm">
                        Choose an agent from the sidebar or create a new one using the chat
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Testing Tab */}
            {activeTab === 'testing' && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Test Suite</h3>
                    <button
                      onClick={runTests}
                      disabled={isRunningTests}
                      className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                      {isRunningTests ? 'Running...' : 'Run Tests'}
                    </button>
                  </div>

                  {testResults.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                      </div>
                      <p className="text-neutral-500 dark:text-neutral-400">No tests run yet</p>
                      <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1">Click "Run Tests" to validate your agent</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {testResults.map((test) => (
                        <div
                          key={test.id}
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            test.status === 'passed'
                              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                              : test.status === 'failed'
                              ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                              : test.status === 'running'
                              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                              : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {getTestStatusIcon(test.status)}
                            <span className="font-medium text-neutral-900 dark:text-white">{test.name}</span>
                          </div>
                          {test.duration && (
                            <span className="text-sm text-neutral-500 dark:text-neutral-400">{test.duration}ms</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Test Summary */}
                  {testResults.length > 0 && !isRunningTests && (
                    <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold">All tests passed!</span>
                      </div>
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        Your agent is ready for deployment
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Deployment Tab */}
            {activeTab === 'deployment' && (
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Deployment Status */}
                {deploymentStatus === 'deploying' && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <div>
                        <h3 className="font-semibold text-blue-900 dark:text-blue-200">Deploying Agent...</h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300">This may take a few moments</p>
                      </div>
                    </div>
                  </div>
                )}

                {deploymentStatus === 'deployed' && (
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-900 dark:text-green-200">Deployment Successful!</h3>
                        <p className="text-sm text-green-700 dark:text-green-300">Your agent is now live in staging</p>
                      </div>
                    </div>

                    {/* Deployment Info */}
                    <div className="mt-6 p-4 bg-white dark:bg-neutral-900 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-neutral-500 dark:text-neutral-400">Environment</div>
                          <div className="font-medium text-neutral-900 dark:text-white">Staging</div>
                        </div>
                        <div>
                          <div className="text-neutral-500 dark:text-neutral-400">Version</div>
                          <div className="font-medium text-neutral-900 dark:text-white">1.0.0</div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-neutral-500 dark:text-neutral-400">Endpoint</div>
                          <code className="font-mono text-purple-600 dark:text-purple-400 text-xs">
                            staging.api.example.com/agents/order-support
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Environment Options */}
                <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Environments</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                        <div>
                          <div className="font-medium text-neutral-900 dark:text-white">Staging</div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">staging.api.example.com</div>
                        </div>
                      </div>
                      <button
                        onClick={() => deployAgent('staging')}
                        className="px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-sm font-medium rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors"
                      >
                        Deploy
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <div>
                          <div className="font-medium text-neutral-900 dark:text-white">Production</div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">api.example.com</div>
                        </div>
                      </div>
                      <button
                        onClick={() => deployAgent('production')}
                        className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                      >
                        Deploy
                      </button>
                    </div>
                  </div>
                </div>

                {/* Deployment History */}
                <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Deployment History</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded">
                          staging
                        </span>
                        <span className="text-sm text-neutral-900 dark:text-white">v1.0.0</span>
                      </div>
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">Just now</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400 text-xs rounded">
                          staging
                        </span>
                        <span className="text-sm text-neutral-900 dark:text-white">v0.9.0</span>
                      </div>
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">2 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Logs Tab */}
            {activeTab === 'logs' && (
              <div className="max-w-3xl mx-auto">
                <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
                  <div className="px-4 py-2 border-b border-neutral-800 flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-300">Agent Logs</span>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs text-neutral-500">Live</span>
                    </div>
                  </div>
                  <div className="p-4 font-mono text-xs text-neutral-300 h-96 overflow-y-auto">
                    <div className="text-green-400">[12:45:32] Agent started</div>
                    <div className="text-neutral-500">[12:45:33] Loading configuration...</div>
                    <div className="text-neutral-500">[12:45:33] Connecting to order database...</div>
                    <div className="text-green-400">[12:45:34] Database connected</div>
                    <div className="text-neutral-500">[12:45:35] Loading response templates...</div>
                    <div className="text-green-400">[12:45:36] Agent ready</div>
                    <div className="text-blue-400">[12:46:12] Incoming query: "Where is my order?"</div>
                    <div className="text-neutral-500">[12:46:12] Processing intent: order_tracking</div>
                    <div className="text-neutral-500">[12:46:13] Fetching order #12345...</div>
                    <div className="text-green-400">[12:46:13] Response sent (234ms)</div>
                    <div className="text-blue-400">[12:47:45] Incoming query: "I want to return my item"</div>
                    <div className="text-neutral-500">[12:47:45] Processing intent: return_request</div>
                    <div className="text-neutral-500">[12:47:46] Checking return eligibility...</div>
                    <div className="text-green-400">[12:47:47] Response sent (1.2s)</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
