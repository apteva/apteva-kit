import { useEffect, useRef, useMemo } from 'react';
import { Message as MessageType } from '../../types/messages';
import { Widget } from '../../types/widgets';
import { cn, parseWidgetsFromText, formatFileSize } from '../../utils';
import { Widgets } from '../Widgets';
import { ActionEvent } from '../../types/actions';
import { MarkdownContent } from './MarkdownContent';
import { ToolCall } from './ToolCall';
import { WidgetRenderer } from '../Widgets/WidgetRenderer';
import { WidgetSkeleton } from '../Widgets/WidgetSkeleton';

interface Attachment {
  name: string;
  type: string;
  size: number;
  preview?: string;
}

type ContentSegment =
  | { type: 'text'; content: string }
  | { type: 'tool'; id: string; name: string; status?: 'preparing' | 'running' | 'completed' | 'error'; isReceiving?: boolean; inputLength?: number; result?: any; streamOutput?: string };

interface MessageProps {
  message: MessageType;
  onAction?: (action: ActionEvent) => void;
  enableWidgets?: boolean;
  onWidgetRender?: (widget: Widget) => void;
}

export function Message({ message, onAction, enableWidgets, onWidgetRender }: MessageProps) {
  const isUser = message.role === 'user';
  const contentSegments = message.metadata?.content_segments as ContentSegment[] | undefined;
  const isStreaming = message.metadata?.isStreaming === true;
  const hasContent = message.content || (contentSegments && contentSegments.length > 0);

  // Track which widgets we've already reported to avoid duplicates
  const reportedWidgetsRef = useRef<Set<string>>(new Set());

  // Parse widgets from content (memoized to avoid reparsing on every render)
  const parsedWidgets = useMemo(() => {
    if (!enableWidgets || isUser || !message.content) {
      return [];
    }
    const parsed = parseWidgetsFromText(message.content);
    return parsed.segments
      .filter((seg): seg is { type: 'widget'; widget: Widget } => seg.type === 'widget' && !!seg.widget)
      .map(seg => seg.widget);
  }, [enableWidgets, isUser, message.content]);

  // Report message.widgets when they change
  useEffect(() => {
    if (onWidgetRender && message.widgets) {
      for (const widget of message.widgets) {
        if (!reportedWidgetsRef.current.has(widget.id)) {
          reportedWidgetsRef.current.add(widget.id);
          onWidgetRender(widget);
        }
      }
    }
  }, [message.widgets, onWidgetRender]);

  // Report parsed widgets from text content (after render)
  useEffect(() => {
    if (onWidgetRender && parsedWidgets.length > 0) {
      for (const widget of parsedWidgets) {
        if (!reportedWidgetsRef.current.has(widget.id)) {
          reportedWidgetsRef.current.add(widget.id);
          onWidgetRender(widget);
        }
      }
    }
  }, [parsedWidgets, onWidgetRender]);

  // Render text content (markdown only, no widgets - widgets rendered separately)
  const renderTextContent = (text: string) => {
    if (!enableWidgets || isUser) {
      return <MarkdownContent content={text} />;
    }

    // Parse to get cleaned text (strips @ui: patterns)
    const parsed = parseWidgetsFromText(text);

    // Combine all text segments
    const cleanedText = parsed.segments
      .filter(seg => seg.type === 'text' && seg.content)
      .map(seg => seg.content)
      .join('');

    if (!cleanedText.trim()) {
      return null;
    }

    return <MarkdownContent content={cleanedText} />;
  };

  // Render content with widgets as separate elements (like tool calls)
  const renderContentWithWidgets = () => {
    if (!enableWidgets || isUser || !message.content) {
      return null;
    }

    const parsed = parseWidgetsFromText(message.content);
    const elements: React.ReactNode[] = [];
    let textBuffer = '';

    parsed.segments.forEach((segment, index) => {
      if (segment.type === 'text' && segment.content) {
        textBuffer += segment.content;
      } else if (segment.type === 'widget' && segment.widget) {
        // Flush text buffer as a bubble
        if (textBuffer.trim()) {
          elements.push(
            <div key={`text-${index}`} className="apteva-message-bubble apteva-message-assistant">
              <div className="apteva-message-content-assistant">
                <MarkdownContent content={textBuffer} />
              </div>
            </div>
          );
          textBuffer = '';
        }
        // Render widget standalone
        elements.push(
          <div key={`widget-${index}`} className="apteva-widget-standalone">
            <WidgetRenderer widget={segment.widget} onAction={onAction} />
          </div>
        );
      } else if (segment.type === 'widget_pending' && segment.pendingType) {
        // Flush text buffer as a bubble
        if (textBuffer.trim()) {
          elements.push(
            <div key={`text-${index}`} className="apteva-message-bubble apteva-message-assistant">
              <div className="apteva-message-content-assistant">
                <MarkdownContent content={textBuffer} />
              </div>
            </div>
          );
          textBuffer = '';
        }
        // Render skeleton standalone
        elements.push(
          <div key={`pending-${index}`} className="apteva-widget-standalone">
            <WidgetSkeleton type={segment.pendingType} />
          </div>
        );
      }
    });

    // Flush remaining text
    if (textBuffer.trim()) {
      elements.push(
        <div key="text-final" className="apteva-message-bubble apteva-message-assistant">
          <div className="apteva-message-content-assistant">
            <MarkdownContent content={textBuffer} />
          </div>
        </div>
      );
    }

    return elements.length > 0 ? elements : null;
  };

  // Get attachments from metadata
  const attachments = (message.metadata?.attachments as Attachment[] | undefined) || [];
  const hasAttachments = attachments.length > 0;

  // Render attachments for user messages
  const renderAttachments = () => {
    if (!hasAttachments) return null;

    return (
      <div className="apteva-message-attachments flex flex-wrap gap-2 mb-2 justify-end">
        {attachments.map((att, index) => {
          const isImage = att.type.startsWith('image/');
          const isPdf = att.type === 'application/pdf';

          if (isImage && att.preview) {
            return (
              <div key={index} className="apteva-attachment-image relative rounded-lg overflow-hidden shadow-sm">
                <img
                  src={att.preview}
                  alt={att.name}
                  className="max-w-[150px] max-h-[150px] object-cover"
                />
              </div>
            );
          }

          // PDF and other documents
          return (
            <div
              key={index}
              className="apteva-attachment-doc flex items-center gap-3 px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-sm"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
                {isPdf ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate max-w-[180px]">
                  {att.name}
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {isPdf ? 'PDF' : 'Document'} · {formatFileSize(att.size)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render content with inline tool calls
  const renderContent = () => {
    if (isUser) {
      return <div className="apteva-message-text">{message.content}</div>;
    }

    // Show typing indicator for streaming messages without content
    if (isStreaming && !hasContent) {
      return (
        <div className="apteva-typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      );
    }

    // If we have content segments, render them in order
    // This is handled differently - returns array of elements for split bubbles
    if (contentSegments && contentSegments.length > 0) {
      return null; // Handled by renderSegmentedContent
    }

    // Fallback to just content
    return renderTextContent(message.content);
  };

  // Render text segment with widgets separated out
  const renderTextSegmentWithWidgets = (text: string, keyPrefix: string) => {
    if (!enableWidgets) {
      return (
        <div key={keyPrefix} className="apteva-message-bubble apteva-message-assistant">
          <div className="apteva-message-content-assistant">
            <MarkdownContent content={text} />
          </div>
        </div>
      );
    }

    const parsed = parseWidgetsFromText(text);
    const elements: React.ReactNode[] = [];
    let textBuffer = '';

    parsed.segments.forEach((seg, idx) => {
      if (seg.type === 'text' && seg.content) {
        textBuffer += seg.content;
      } else if (seg.type === 'widget' && seg.widget) {
        if (textBuffer.trim()) {
          elements.push(
            <div key={`${keyPrefix}-text-${idx}`} className="apteva-message-bubble apteva-message-assistant">
              <div className="apteva-message-content-assistant">
                <MarkdownContent content={textBuffer} />
              </div>
            </div>
          );
          textBuffer = '';
        }
        elements.push(
          <div key={`${keyPrefix}-widget-${idx}`} className="apteva-widget-standalone">
            <WidgetRenderer widget={seg.widget} onAction={onAction} />
          </div>
        );
      } else if (seg.type === 'widget_pending' && seg.pendingType) {
        if (textBuffer.trim()) {
          elements.push(
            <div key={`${keyPrefix}-text-${idx}`} className="apteva-message-bubble apteva-message-assistant">
              <div className="apteva-message-content-assistant">
                <MarkdownContent content={textBuffer} />
              </div>
            </div>
          );
          textBuffer = '';
        }
        elements.push(
          <div key={`${keyPrefix}-pending-${idx}`} className="apteva-widget-standalone">
            <WidgetSkeleton type={seg.pendingType} />
          </div>
        );
      }
    });

    if (textBuffer.trim()) {
      elements.push(
        <div key={`${keyPrefix}-text-final`} className="apteva-message-bubble apteva-message-assistant">
          <div className="apteva-message-content-assistant">
            <MarkdownContent content={textBuffer} />
          </div>
        </div>
      );
    }

    return elements;
  };

  // Render segmented content with separate bubbles for text and tool calls outside bubbles
  const renderSegmentedContent = () => {
    if (!contentSegments || contentSegments.length === 0) {
      return null;
    }

    const elements: React.ReactNode[] = [];

    contentSegments.forEach((segment, index) => {
      if (segment.type === 'text' && segment.content) {
        const textElements = renderTextSegmentWithWidgets(segment.content, `seg-${index}`);
        if (Array.isArray(textElements)) {
          elements.push(...textElements);
        } else {
          elements.push(textElements);
        }
      } else if (segment.type === 'tool') {
        elements.push(
          <div key={segment.id} className="apteva-tool-call-standalone">
            <ToolCall
              name={segment.name}
              status={segment.status || (segment.result !== undefined ? 'completed' : 'running')}
              isReceiving={segment.isReceiving}
              inputLength={segment.inputLength}
              streamOutput={segment.streamOutput}
            />
          </div>
        );
      }
    });

    return elements;
  };

  // For assistant messages with content segments (tool calls) or streaming, render as separate bubbles
  // Using segmented layout during streaming prevents layout jump when tool calls appear
  if (!isUser && (contentSegments && contentSegments.length > 0)) {
    return (
      <div className="apteva-message-segmented">
        {renderSegmentedContent()}

        {message.widgets && message.widgets.length > 0 && (
          <div className="apteva-widget-standalone">
            <Widgets widgets={message.widgets} onAction={onAction} layout="stack" />
          </div>
        )}

        <div className="apteva-message-timestamp apteva-message-timestamp-assistant" suppressHydrationWarning>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    );
  }

  // For assistant messages with widgets in content, render with separate bubbles
  const widgetContent = renderContentWithWidgets();
  if (!isUser && enableWidgets && widgetContent) {
    return (
      <div className="apteva-message-segmented">
        {widgetContent}

        {message.widgets && message.widgets.length > 0 && (
          <div className="apteva-widget-standalone">
            <Widgets widgets={message.widgets} onAction={onAction} layout="stack" />
          </div>
        )}

        <div className="apteva-message-timestamp apteva-message-timestamp-assistant" suppressHydrationWarning>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    );
  }

  // For user messages with attachments, render attachments outside bubble (like Claude/ChatGPT)
  if (isUser && hasAttachments) {
    return (
      <div className="apteva-message-segmented apteva-message-user-with-attachments flex flex-col items-end">
        {renderAttachments()}

        {message.content && (
          <div className="apteva-message-bubble apteva-message-user">
            <div className="apteva-message-content-user">
              <div className="apteva-message-text">{message.content}</div>
            </div>
          </div>
        )}

        <div className="apteva-message-timestamp apteva-message-timestamp-user" suppressHydrationWarning>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'apteva-message-bubble',
        isUser ? 'apteva-message-user' : 'apteva-message-assistant'
      )}
    >
      <div className={isUser ? 'apteva-message-content-user' : 'apteva-message-content-assistant'}>
        {renderContent()}
      </div>

      {message.widgets && message.widgets.length > 0 && (
        <div className="apteva-widget-standalone">
          <Widgets widgets={message.widgets} onAction={onAction} layout="stack" />
        </div>
      )}

      <div className={cn('apteva-message-timestamp', isUser ? 'apteva-message-timestamp-user' : 'apteva-message-timestamp-assistant')} suppressHydrationWarning>
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
}
