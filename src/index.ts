// Main exports
export { Chat } from './components/Chat';
export type { ChatHandle } from './components/Chat/Chat';
export { Command } from './components/Command';
export { Prompt } from './components/Prompt';
export { Stream } from './components/Stream';
export { Widgets } from './components/Widgets';
export { Threads } from './components/Threads';

// Widget components (for custom rendering)
export { Card, List, Button } from './components/Widgets/widget-library';

// Theme (optional - for preventing flash on load)
export { getThemeScript } from './utils/theme-script';

// API Client
export { aptevaClient, AptevaClient } from './lib/apteva-client';
export type { AptevaClientConfig, ChatRequest, ChatResponse, StreamChunk, ChatMessage } from './lib/apteva-client';

// Types
export type * from './types';

// Utilities
export { cn, mockMessages, mockThreads, mockWidgets } from './utils';
