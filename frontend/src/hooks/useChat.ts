import { useState, useCallback, useRef } from 'react';
import { sendMessage, type Message } from '../services/api';

export interface ChatMessage extends Message {
  id: string;
  isStreaming?: boolean;
  error?: boolean;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<boolean>(false);

  const send = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text.trim(),
    };

    const assistantId = crypto.randomUUID();
    const assistantMsg: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setIsLoading(true);
    abortRef.current = false;

    const history = messages.map(({ role, content }) => ({ role, content }));

    try {
      await sendMessage(
        text.trim(),
        history,
        (delta) => {
          if (abortRef.current) return;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: m.content + delta }
                : m
            )
          );
        },
        (err) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: `Error: ${err}`, isStreaming: false, error: true }
                : m
            )
          );
          setIsLoading(false);
        }
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Network error';
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: `Error: ${msg}`, isStreaming: false, error: true }
            : m
        )
      );
    }

    setMessages((prev) =>
      prev.map((m) =>
        m.id === assistantId ? { ...m, isStreaming: false } : m
      )
    );
    setIsLoading(false);
  }, [messages, isLoading]);

  const clear = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, isLoading, send, clear };
}
