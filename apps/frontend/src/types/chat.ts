export interface ChatRequest {
  chatId?: string;
  message: string;
  model: string;
}

export interface ChatResponse {
  message?: string;
  error?: string;
}

export interface ToolCallData {
  id?: string;
  type?: string;
  function?: {
    name: string;
    arguments: string;
  };
}

export interface StreamResponse {
  type: 'message' | 'error' | 'done' | 'tool';
  content?: string;
  error?: string;
  data?: ToolCallData;
}

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error?: string;
} 