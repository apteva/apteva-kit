import { Message, Thread, SendMessageParams } from './messages';
import { Widget } from './widgets';
import { Action, ActionEvent } from './actions';
import { WidgetType } from '../utils/widget-context';

// Suggested prompt for welcome screen
export interface SuggestedPrompt {
  text: string;
  icon?: React.ReactNode;
  description?: string;
}

// Chat Component
export interface ChatProps {
  agentId: string;
  threadId?: string | null;
  initialMessages?: Message[];
  context?: string;

  // API configuration
  apiUrl?: string;
  apiKey?: string;

  // Mock mode
  useMock?: boolean;

  // Mode switching (chat vs command)
  initialMode?: 'chat' | 'command';
  showModeToggle?: boolean;
  onModeChange?: (mode: 'chat' | 'command') => void;

  // Command mode options
  commandVariant?: 'default' | 'compact';
  planMode?: boolean;
  onPlanModeChange?: (enabled: boolean) => void;
  enableStreaming?: boolean;
  showProgress?: boolean;
  loadingText?: string;

  // Welcome screen
  welcomeTitle?: string;
  welcomeSubtitle?: string;
  welcomeIcon?: React.ReactNode;
  suggestedPrompts?: (string | SuggestedPrompt)[];
  welcomeVariant?: 'centered' | 'minimal';

  // Events
  onThreadChange?: (threadId: string) => void;
  onMessageSent?: (message: Message) => void;
  onAction?: (action: ActionEvent) => void;
  onFileUpload?: (files: FileList) => void;
  onComplete?: (result: CommandResult) => void;
  onError?: (error: Error) => void;
  onToolCall?: (toolName: string, toolId: string) => void;
  onToolResult?: (toolName: string, result?: any) => void;

  // UI
  variant?: 'default' | 'minimal' | 'terminal';
  theme?: 'light' | 'dark' | 'auto';
  placeholder?: string;
  showHeader?: boolean;
  headerTitle?: string;

  // Features
  enableFileUpload?: boolean;
  enableMarkdown?: boolean;

  // Text-based widget detection
  enableWidgets?: boolean;
  availableWidgets?: WidgetType[];
  compactWidgetContext?: boolean;
  onWidgetRender?: (widget: Widget) => void;

  className?: string;
}

// Command Component
export interface CommandProps {
  agentId: string;
  command?: string;
  context?: string;
  autoExecute?: boolean;

  // Input mode (default: true)
  allowInput?: boolean;
  placeholder?: string;
  submitButtonText?: string;

  // Variant
  variant?: 'default' | 'compact';

  // Mock mode
  useMock?: boolean;

  // Plan mode
  planMode?: boolean;
  onPlanModeChange?: (enabled: boolean) => void;

  // File upload
  enableFileUpload?: boolean;

  onStart?: () => void;
  onProgress?: (progress: number) => void;
  onChunk?: (chunk: string) => void;
  onComplete?: (result: CommandResult) => void;
  onError?: (error: Error) => void;
  onFileUpload?: (files: FileList) => void;
  onAction?: (action: ActionEvent) => void;
  onToolResult?: (toolName: string, result?: any) => void;

  loadingText?: string;
  showProgress?: boolean;
  enableStreaming?: boolean;
  resultRenderer?: (result: any) => React.ReactNode;

  className?: string;
}

export interface CommandResult {
  success: boolean;
  data: any;
  widgets?: Widget[];
  message?: string;
}

// Prompt Component
export interface PromptProps {
  agentId: string;
  placeholder?: string;
  initialValue?: string;

  // Mock mode
  useMock?: boolean;

  submitOn?: 'enter' | 'button' | 'blur';
  debounceMs?: number;
  minLength?: number;
  maxLength?: number;

  onSubmit?: (prompt: string) => void;
  onResult?: (result: string) => void;
  onChange?: (value: string) => void;

  variant?: 'inline' | 'floating';
  showSuggestions?: boolean;

  className?: string;
}

// Stream Component
export interface StreamProps {
  agentId: string;
  prompt: string;
  context?: Record<string, any>;
  autoStart?: boolean;

  // Mock mode
  useMock?: boolean;

  onStart?: () => void;
  onChunk?: (chunk: string) => void;
  onComplete?: (fullText: string) => void;
  onError?: (error: Error) => void;

  variant?: 'prose' | 'code' | 'plain';
  showCursor?: boolean;
  typingSpeed?: number;

  className?: string;
}

// Widgets Component
export interface WidgetsProps {
  widgets: Widget[];

  onAction?: (action: ActionEvent) => void;
  onWidgetMount?: (widgetId: string) => void;

  layout?: 'stack' | 'grid' | 'masonry';
  spacing?: 'tight' | 'normal' | 'loose';
  columns?: number;

  className?: string;
}

// Threads Component
export interface ThreadsProps {
  threads: Thread[];
  currentThreadId?: string;

  onThreadSelect?: (threadId: string) => void;
  onThreadDelete?: (threadId: string) => void;
  onNewThread?: () => void;

  variant?: 'sidebar' | 'dropdown' | 'tabs';
  showSearch?: boolean;
  showNewButton?: boolean;
  groupBy?: 'date' | 'agent' | 'none';

  className?: string;
}

// Hook return types
export interface AptevaKitControl {
  setThreadId: (threadId: string | null) => Promise<void>;
  createThread: (metadata?: object) => Promise<string>;
  sendMessage: (params: SendMessageParams) => Promise<void>;
  setComposerValue: (text: string) => Promise<void>;
  sendAction: (action: Action) => Promise<void>;
  refresh: () => Promise<void>;
  focusComposer: () => Promise<void>;
  scrollToBottom: () => void;
}

export interface UseAptevaKitReturn {
  control: AptevaKitControl;
  threadId: string | null;
  isLoading: boolean;
  error: Error | null;
}
