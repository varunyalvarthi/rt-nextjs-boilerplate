import { useStore } from '@/lib/store/useStore';
import { MicButton } from './MicButton';

interface ChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isListening: boolean;
  transcript: string;
  error: string | null;
  onStartListening: () => void;
  onStopListening: () => void;
}

export const ChatDialog = ({
  isOpen,
  onClose,
  isListening,
  transcript,
  error,
  onStartListening,
  onStopListening
}: ChatDialogProps) => {
  const {
    activeChatTask,
    chatMessages,
    setActiveChatTask
  } = useStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 z-20">
      <div className="bg-zinc-900/90 w-full max-w-2xl rounded-t-lg sm:rounded-lg shadow-xl flex flex-col max-h-[85vh] backdrop-blur-sm">
        {/* Dialog Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            DeepKaam Assistant
            {activeChatTask && (
              <span className="text-sm text-white/40">
                • Task #{activeChatTask}
              </span>
            )}
          </h2>
          <button
            onClick={() => {
              setActiveChatTask(null);
              onClose();
            }}
            className="text-white/60 hover:text-white/90"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  message.sender === 'user'
                    ? 'bg-purple-500/20 text-purple-200'
                    : 'bg-white/10 text-white/90'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          {transcript && (
            <div className="flex justify-end">
              <div className="rounded-lg px-4 py-2 max-w-[80%] bg-purple-500/10 text-purple-200 animate-pulse">
                {transcript}
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-500/20 border-t border-red-500/30">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Voice Controls */}
        <div className="p-4 border-t border-white/10 flex justify-between items-center">
          <p className="text-sm text-white/40">
            {isListening ? 'Listening...' : 'Click the mic to start speaking'}
          </p>
          <MicButton
            isListening={isListening}
            onClick={isListening ? onStopListening : onStartListening}
          />
        </div>
      </div>
    </div>
  );
};
