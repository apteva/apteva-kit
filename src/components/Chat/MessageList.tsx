import { useEffect, useRef } from 'react';
import { Message as MessageType } from '../../types/messages';
import { SuggestedPrompt } from '../../types/components';
import { Widget } from '../../types/widgets';
import { Message } from './Message';
import { WelcomeScreen } from './WelcomeScreen';
import { ActionEvent } from '../../types/actions';

interface MessageListProps {
  messages: MessageType[];
  onAction?: (action: ActionEvent) => void;
  // Welcome screen props
  welcomeTitle?: string;
  welcomeSubtitle?: string;
  welcomeIcon?: React.ReactNode;
  suggestedPrompts?: (string | SuggestedPrompt)[];
  welcomeVariant?: 'centered' | 'minimal';
  chatVariant?: 'default' | 'minimal' | 'terminal';
  onPromptClick?: (prompt: string) => void;
  // Widget detection
  enableWidgets?: boolean;
  onWidgetRender?: (widget: Widget) => void;
}

export function MessageList({
  messages,
  onAction,
  welcomeTitle,
  welcomeSubtitle,
  welcomeIcon,
  suggestedPrompts,
  welcomeVariant,
  chatVariant,
  onPromptClick,
  enableWidgets,
  onWidgetRender,
}: MessageListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);
  const lastScrollHeightRef = useRef(0);

  // Track if user is near bottom
  const handleScroll = () => {
    if (listRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      // Consider "near bottom" if within 100px of the bottom
      isNearBottomRef.current = scrollHeight - scrollTop - clientHeight < 100;
    }
  };

  useEffect(() => {
    // Only auto-scroll if user is near bottom
    if (listRef.current && isNearBottomRef.current) {
      const currentScrollHeight = listRef.current.scrollHeight;
      // Only scroll if content height actually changed
      if (currentScrollHeight !== lastScrollHeightRef.current) {
        listRef.current.scrollTop = currentScrollHeight;
        lastScrollHeightRef.current = currentScrollHeight;
      }
    }
  }, [messages]);

  return (
    <div ref={listRef} className="apteva-message-list apteva-scrollbar-hidden" onScroll={handleScroll}>
      {messages.length === 0 ? (
        <WelcomeScreen
          title={welcomeTitle}
          subtitle={welcomeSubtitle}
          icon={welcomeIcon}
          prompts={suggestedPrompts}
          variant={welcomeVariant}
          chatVariant={chatVariant}
          onPromptClick={onPromptClick || (() => {})}
        />
      ) : (
        messages.map((message) => (
          <div key={message.id} className={message.role === 'user' ? 'apteva-message-row-user' : 'apteva-message-row-assistant'}>
            <Message message={message} onAction={onAction} enableWidgets={enableWidgets} onWidgetRender={onWidgetRender} />
          </div>
        ))
      )}
    </div>
  );
}
