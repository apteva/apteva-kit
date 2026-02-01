'use client';

import { useState } from 'react';
import { Chat, type Message, type Widget } from '@apteva/apteva-kit';
import Link from 'next/link';

// Mock coding conversation with file edits and deployments
const codingMessages: Message[] = [
  {
    id: 'msg-1',
    role: 'user',
    content: 'Create a new React component for user authentication',
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: 'msg-2',
    role: 'assistant',
    content: "I'll create an authentication component for you. Let me set up the file structure and implement the login form.",
    timestamp: new Date(Date.now() - 290000),
  },
  {
    id: 'msg-3',
    role: 'assistant',
    content: 'Created `src/components/Auth/LoginForm.tsx` with email/password fields, validation, and submit handling.',
    timestamp: new Date(Date.now() - 280000),
    widgets: [
      {
        type: 'list',
        id: 'files-created',
        props: {
          items: [
            { id: '1', title: 'LoginForm.tsx', subtitle: 'src/components/Auth/' },
            { id: '2', title: 'useAuth.ts', subtitle: 'src/hooks/' },
            { id: '3', title: 'auth.types.ts', subtitle: 'src/types/' },
          ]
        }
      } as Widget
    ]
  },
  {
    id: 'msg-4',
    role: 'user',
    content: 'Add a registration form too',
    timestamp: new Date(Date.now() - 200000),
  },
  {
    id: 'msg-5',
    role: 'assistant',
    content: "I've added a registration form with name, email, password confirmation, and terms acceptance.",
    timestamp: new Date(Date.now() - 190000),
    widgets: [
      {
        type: 'button_group',
        id: 'file-actions',
        props: {
          layout: 'horizontal',
          buttons: [
            { id: 'view', label: 'View Changes', variant: 'primary' },
            { id: 'revert', label: 'Revert', variant: 'outline' },
          ]
        },
        actions: [
          { type: 'view_changes', label: 'View', handler: 'client', payload: { buttonId: 'view' } },
          { type: 'revert_changes', label: 'Revert', handler: 'client', payload: { buttonId: 'revert' } },
        ]
      } as Widget
    ]
  },
];

// Sample code files
const codeFiles: Record<string, { name: string; language: string; content: string }> = {
  'LoginForm.tsx': {
    name: 'LoginForm.tsx',
    language: 'typescript',
    content: `import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function LoginForm({ onSuccess, onError }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      onSuccess?.();
    } catch (err) {
      onError?.(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border p-2"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}`
  },
  'RegisterForm.tsx': {
    name: 'RegisterForm.tsx',
    language: 'typescript',
    content: `import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    await register(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Full Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.acceptTerms}
          onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
        />
        <span className="text-sm">I accept the terms and conditions</span>
      </label>
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
        Create Account
      </button>
    </form>
  );
}`
  },
  'useAuth.ts': {
    name: 'useAuth.ts',
    language: 'typescript',
    content: `import { useState, useCallback, createContext, useContext } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}`
  }
};

// Deployment status
interface Deployment {
  id: string;
  env: 'production' | 'staging' | 'preview';
  status: 'building' | 'deploying' | 'ready' | 'failed';
  url: string;
  commit: string;
  timestamp: Date;
}

const deployments: Deployment[] = [
  { id: 'd1', env: 'production', status: 'ready', url: 'https://myapp.com', commit: 'a1b2c3d', timestamp: new Date(Date.now() - 3600000) },
  { id: 'd2', env: 'staging', status: 'ready', url: 'https://staging.myapp.com', commit: 'e4f5g6h', timestamp: new Date(Date.now() - 1800000) },
  { id: 'd3', env: 'preview', status: 'building', url: 'https://preview-123.myapp.com', commit: 'i7j8k9l', timestamp: new Date() },
];

// Dev server status
interface DevServer {
  id: string;
  name: string;
  port: number;
  status: 'running' | 'stopped' | 'error';
  uptime?: string;
}

const devServers: DevServer[] = [
  { id: 's1', name: 'Frontend', port: 3000, status: 'running', uptime: '2h 34m' },
  { id: 's2', name: 'API Server', port: 8080, status: 'running', uptime: '2h 34m' },
  { id: 's3', name: 'Database', port: 5432, status: 'running', uptime: '2h 34m' },
  { id: 's4', name: 'Redis', port: 6379, status: 'stopped' },
];

export default function CodingAppPage() {
  const [activeFile, setActiveFile] = useState<string>('LoginForm.tsx');
  const [activeTab, setActiveTab] = useState<'code' | 'deployments' | 'servers'>('code');
  const [messages, setMessages] = useState<Message[]>(codingMessages);
  const [localDeployments, setLocalDeployments] = useState(deployments);
  const [localServers, setLocalServers] = useState(devServers);

  const handleAction = (action: { type: string; payload?: any }) => {
    console.log('Action received:', action);

    if (action.type === 'view_changes') {
      setActiveTab('code');
    } else if (action.type === 'deploy') {
      // Add a new deployment
      const newDeployment: Deployment = {
        id: `d${Date.now()}`,
        env: 'preview',
        status: 'building',
        url: `https://preview-${Date.now()}.myapp.com`,
        commit: 'latest',
        timestamp: new Date(),
      };
      setLocalDeployments([newDeployment, ...localDeployments]);
      setActiveTab('deployments');
    } else if (action.type === 'start_server') {
      const serverId = action.payload?.serverId;
      setLocalServers(servers =>
        servers.map(s => s.id === serverId ? { ...s, status: 'running', uptime: '0m' } : s)
      );
    } else if (action.type === 'stop_server') {
      const serverId = action.payload?.serverId;
      setLocalServers(servers =>
        servers.map(s => s.id === serverId ? { ...s, status: 'stopped', uptime: undefined } : s)
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
      case 'running':
        return 'bg-green-500';
      case 'building':
      case 'deploying':
        return 'bg-yellow-500 animate-pulse';
      case 'failed':
      case 'error':
        return 'bg-red-500';
      case 'stopped':
        return 'bg-neutral-400';
      default:
        return 'bg-neutral-400';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-neutral-950 text-neutral-100">
      {/* Top Bar */}
      <div className="h-12 border-b border-neutral-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-neutral-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <span className="font-semibold text-white">CodeAssist</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-500">my-project</span>
          <div className="flex items-center gap-1.5 text-xs">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-neutral-400">3 servers running</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Chat */}
        <div className="w-[400px] border-r border-neutral-800 flex flex-col">
          <div className="h-10 border-b border-neutral-800 flex items-center px-4">
            <span className="text-sm font-medium text-neutral-300">AI Assistant</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <Chat
              agentId="coding-assistant"
              initialMessages={messages}
              useMock={true}
              showHeader={false}
              placeholder="Ask me to write code..."
              onAction={handleAction}
              className="h-full"
            />
          </div>
        </div>

        {/* Right Panel - Code/Deployments/Servers */}
        <div className="flex-1 flex flex-col">
          {/* Tab Bar */}
          <div className="h-10 border-b border-neutral-800 flex items-center px-2 gap-1">
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                activeTab === 'code'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Code
              </span>
            </button>
            <button
              onClick={() => setActiveTab('deployments')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                activeTab === 'deployments'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Deployments
              </span>
            </button>
            <button
              onClick={() => setActiveTab('servers')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                activeTab === 'servers'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                </svg>
                Servers
              </span>
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'code' && (
              <div className="h-full flex">
                {/* File Explorer */}
                <div className="w-48 border-r border-neutral-800 p-2">
                  <div className="text-xs text-neutral-500 uppercase tracking-wider mb-2 px-2">Files</div>
                  {Object.keys(codeFiles).map((fileName) => (
                    <button
                      key={fileName}
                      onClick={() => setActiveFile(fileName)}
                      className={`w-full text-left px-2 py-1.5 text-sm rounded-md flex items-center gap-2 ${
                        activeFile === fileName
                          ? 'bg-neutral-800 text-white'
                          : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                      }`}
                    >
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {fileName}
                    </button>
                  ))}
                </div>

                {/* Code Editor */}
                <div className="flex-1 flex flex-col">
                  <div className="h-8 border-b border-neutral-800 flex items-center px-3 text-sm text-neutral-400">
                    <span className="text-blue-400">src/components/Auth/</span>
                    <span className="text-white">{activeFile}</span>
                  </div>
                  <div className="flex-1 overflow-auto bg-neutral-900 p-4">
                    <pre className="text-sm font-mono">
                      <code className="text-neutral-300">
                        {codeFiles[activeFile]?.content || '// No file selected'}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'deployments' && (
              <div className="h-full p-4 overflow-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">Deployments</h2>
                  <button
                    onClick={() => handleAction({ type: 'deploy' })}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Deploy
                  </button>
                </div>
                <div className="space-y-3">
                  {localDeployments.map((deployment) => (
                    <div key={deployment.id} className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(deployment.status)}`} />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-white capitalize">{deployment.env}</span>
                              <span className="text-xs text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded">{deployment.commit}</span>
                            </div>
                            <a href={deployment.url} className="text-sm text-blue-400 hover:underline">{deployment.url}</a>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-neutral-400 capitalize">{deployment.status}</div>
                          <div className="text-xs text-neutral-500">{deployment.timestamp.toLocaleTimeString()}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'servers' && (
              <div className="h-full p-4 overflow-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">Dev Servers</h2>
                  <button className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Server
                  </button>
                </div>
                <div className="space-y-3">
                  {localServers.map((server) => (
                    <div key={server.id} className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(server.status)}`} />
                          <div>
                            <div className="font-medium text-white">{server.name}</div>
                            <div className="text-sm text-neutral-400">localhost:{server.port}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {server.uptime && (
                            <span className="text-xs text-neutral-500">Uptime: {server.uptime}</span>
                          )}
                          {server.status === 'running' ? (
                            <button
                              onClick={() => handleAction({ type: 'stop_server', payload: { serverId: server.id } })}
                              className="px-2 py-1 text-xs bg-red-600/20 text-red-400 rounded hover:bg-red-600/30"
                            >
                              Stop
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAction({ type: 'start_server', payload: { serverId: server.id } })}
                              className="px-2 py-1 text-xs bg-green-600/20 text-green-400 rounded hover:bg-green-600/30"
                            >
                              Start
                            </button>
                          )}
                          <button className="px-2 py-1 text-xs bg-neutral-700 text-neutral-300 rounded hover:bg-neutral-600">
                            Logs
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Terminal Preview */}
                <div className="mt-6">
                  <div className="text-sm font-medium text-neutral-300 mb-2">Terminal</div>
                  <div className="bg-black border border-neutral-800 rounded-lg p-3 font-mono text-xs">
                    <div className="text-green-400">$ npm run dev</div>
                    <div className="text-neutral-400 mt-1">ready - started server on 0.0.0.0:3000, url: http://localhost:3000</div>
                    <div className="text-neutral-400">event - compiled client and server successfully in 234 ms</div>
                    <div className="text-blue-400">wait  - compiling /api/auth...</div>
                    <div className="text-green-400">event - compiled successfully in 89 ms</div>
                    <div className="text-neutral-500 animate-pulse">|</div>
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
