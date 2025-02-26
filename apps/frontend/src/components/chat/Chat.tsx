import { FC, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message as MessageComponent } from './Message';
import { ChatInput } from './ChatInput';
import { Message, ChatState } from '../../types/chat';
import { createChatStream } from '../../services/api/chat';

const DEFAULT_MODEL = 'gpt-4-turbo-preview';

export const Chat: FC = () => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  const handleSend = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      content,
      isUser: true,
      timestamp: new Date(),
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: undefined,
    }));

    // Create assistant message placeholder
    const assistantMessageId = uuidv4();
    const assistantMessage: Message = {
      id: assistantMessageId,
      content: '',
      isUser: false,
      timestamp: new Date(),
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, assistantMessage],
    }));

    // Set up streaming
    const cleanup = createChatStream(
      {
        message: content,
        model: DEFAULT_MODEL,
      },
      (chunk) => {
        // Update assistant message content
        setState((prev) => ({
          ...prev,
          messages: prev.messages.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: msg.content + chunk }
              : msg
          ),
        }));
      },
      (error) => {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error,
        }));
      },
      () => {
        setState((prev) => ({
          ...prev,
          isLoading: false,
        }));
      }
    );

    // Cleanup on component unmount or when starting a new stream
    return cleanup;
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {state.messages.map((message) => (
          <MessageComponent key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      {state.error && (
        <div className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100">
          {state.error}
        </div>
      )}
      <ChatInput onSend={handleSend} disabled={state.isLoading} />
    </div>
  );
}; 