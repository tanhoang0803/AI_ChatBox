import { useChat } from './hooks/useChat';
import { ChatWindow } from './components/ChatWindow';
import { InputBar } from './components/InputBar';

export default function App() {
  const { messages, isLoading, send, clear } = useChat();

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm select-none">
            AI
          </div>
          <div>
            <h1 className="text-base font-semibold text-gray-900">AI Chatbox</h1>
            <p className="text-xs text-gray-500">Powered by Claude</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clear}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
          >
            Clear chat
          </button>
        )}
      </header>

      {/* Chat area */}
      <ChatWindow messages={messages} />

      {/* Input area */}
      <div className="flex-shrink-0 px-4 pb-4 pt-2 bg-gray-50 border-t border-gray-100">
        <InputBar onSend={send} disabled={isLoading} />
        <p className="text-center text-xs text-gray-400 mt-2 select-none">
          AI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}
