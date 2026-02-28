import Anthropic from '@anthropic-ai/sdk';
import { Request, Response } from 'express';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function handleChat(req: Request, res: Response): Promise<void> {
  const { message, history = [] }: { message: string; history: Message[] } = req.body;

  if (!message || typeof message !== 'string' || message.trim() === '') {
    res.status(400).json({ error: 'Message is required.' });
    return;
  }

  const messages: Message[] = [
    ...history,
    { role: 'user', content: message.trim() },
  ];

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    const stream = client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: 'You are a helpful, friendly AI assistant. Respond clearly and concisely.',
      messages,
    });

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        res.write(`data: ${JSON.stringify({ delta: event.delta.text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
    res.end();
  }
}
