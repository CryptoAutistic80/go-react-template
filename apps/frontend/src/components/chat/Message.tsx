import { Message as MessageType } from '../../types/chat';
import { FC } from 'react';

interface MessageProps {
  message: MessageType;
}

export const Message: FC<MessageProps> = ({ message }) => {
  const { content, isUser } = message;

  return (
    <div
      className={`flex ${
        isUser ? 'justify-end' : 'justify-start'
      } mb-4`}
    >
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 dark:bg-gray-700 dark:text-white'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
      </div>
    </div>
  );
}; 