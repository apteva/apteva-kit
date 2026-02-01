import { Widget } from './widgets';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  widgets?: Widget[];
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface Thread {
  id: string;
  title: string;
  preview?: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
  metadata?: Record<string, any>;
}

export interface SendMessageParams {
  text: string;
  attachments?: File[];
  metadata?: Record<string, any>;
}
