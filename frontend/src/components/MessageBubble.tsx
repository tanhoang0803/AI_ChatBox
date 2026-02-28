import type { ChatMessage } from '../hooks/useChat';

interface Props {
  message: ChatMessage;
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Avatar — assistant only */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center mr-2 mt-1 text-white text-sm font-bold select-none">
          AI
        </div>
      )}

      <div
        className={`
          max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words
          ${isUser
            ? 'bg-indigo-600 text-white rounded-tr-sm'
            : message.error
              ? 'bg-red-50 text-red-700 border border-red-200 rounded-tl-sm'
              : 'bg-white text-gray-800 border border-gray-200 shadow-sm rounded-tl-sm'
          }
          ${message.isStreaming ? 'cursor-blink' : ''}
        `}
      >
        {message.content || (message.isStreaming ? '' : '…')}
      </div>

      {/* Avatar — user only */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center ml-2 mt-1 text-gray-700 text-sm font-bold select-none">
          You
        </div>
      )}
    </div>
  );
}
