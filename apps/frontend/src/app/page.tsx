'use client';

import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
          Welcome to AI Chat
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Chat with our advanced AI models using GPT-4-turbo
        </p>
        <button 
          onClick={() => router.push('/chat')}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium 
                   hover:bg-blue-700 transition-colors duration-200 
                   transform hover:scale-105"
        >
          Enter Chat
        </button>
      </div>
    </div>
  );
}
