export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Sends a message to the backend and yields text deltas via the callback.
 * Uses SSE (Server-Sent Events) over a POST fetch with a readable stream.
 */
export async function sendMessage(
  message: string,
  history: Message[],
  onDelta: (delta: string) => void,
  onError: (err: string) => void
): Promise<void> {
  const API_BASE = import.meta.env.VITE_API_URL ?? '';
  const response = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  });

  if (!response.ok || !response.body) {
    onError(`Server error: ${response.status}`);
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const payload = line.slice(6).trim();
      if (payload === '[DONE]') return;

      try {
        const parsed = JSON.parse(payload) as { delta?: string; error?: string };
        if (parsed.error) {
          onError(parsed.error);
          return;
        }
        if (parsed.delta) {
          onDelta(parsed.delta);
        }
      } catch {
        // malformed chunk — skip
      }
    }
  }
}
