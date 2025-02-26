import { ChatRequest, ChatResponse, StreamResponse } from '../../types/chat';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export function createChatStream(
  request: ChatRequest,
  onMessage: (content: string) => void,
  onError: (error: string) => void,
  onComplete: () => void
): () => void {
  fetch(`${API_BASE_URL}/api/chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  }).then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    
    if (!reader) {
      throw new Error('Stream not supported');
    }

    // Create a scoped reader that TypeScript knows is not undefined
    const streamReader = reader;
    
    function processStream(): Promise<void> {
      return streamReader.read().then(({done, value}) => {
        if (done) {
          onComplete();
          return;
        }

        const chunk = decoder.decode(value, {stream: true});
        const lines = chunk.split('\n\n');
        
        lines.forEach(line => {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6)) as StreamResponse;
              switch (data.type) {
                case 'message':
                  if (data.content) {
                    onMessage(data.content);
                  }
                  break;
                case 'error':
                  if (data.error) {
                    onError(data.error);
                    return;
                  }
                  break;
                case 'done':
                  onComplete();
                  return;
              }
            } catch {
              // Ignore parse errors for incomplete chunks
            }
          }
        });

        return processStream();
      });
    }

    processStream().catch(error => {
      onError(error.message);
    });
  }).catch(error => {
    onError(error.message);
  });

  // Return cleanup function
  return () => {
    // The fetch API doesn't provide a way to abort SSE directly
    // In a production app, you might want to use AbortController
  };
} 