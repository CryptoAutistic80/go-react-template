import { FC, FormEvent, useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 p-4 border-t dark:border-gray-700">
      <div className="flex-grow">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={disabled}
          className="w-full resize-none rounded-lg border border-gray-300 dark:border-gray-600 
                   bg-white dark:bg-gray-700 p-2 focus:outline-none focus:ring-2 
                   focus:ring-blue-500 dark:text-white min-h-[40px] max-h-[200px]"
          rows={1}
        />
      </div>
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className={`px-4 py-2 rounded-lg ${
          !message.trim() || disabled
            ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white font-medium transition-colors`}
      >
        Send
      </button>
    </form>
  );
}; 