'use client';

import { Chat } from '../../components/chat/Chat';

export default function ChatPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8">
      <div className="w-full max-w-4xl h-[80vh] bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <Chat />
      </div>
    </main>
  );
} 