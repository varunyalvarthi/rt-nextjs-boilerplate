import { Mic, MicOff } from 'lucide-react';

interface MicButtonProps {
  isListening: boolean;
  onClick: () => void;
  variant?: 'floating' | 'inline';
  className?: string;
}

export const MicButton = ({
  isListening,
  onClick,
  variant = 'inline',
  className = ''
}: MicButtonProps) => {
  if (variant === 'floating') {
    return (
      <button
        onClick={onClick}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg transition-all duration-200 z-10 
          ${isListening 
            ? 'bg-purple-600 hover:bg-purple-700 ring-4 ring-purple-500/50 animate-pulse' 
            : 'bg-purple-500 hover:bg-purple-600 ring-2 ring-purple-400/30'
          } backdrop-blur-sm ${className}`}
      >
        {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`text-white/60 hover:text-purple-400 transition-all p-2 hover:bg-purple-500/10 rounded-lg ${className}`}
    >
      <Mic className="w-4 h-4" />
    </button>
  );
};
