import { Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MicButtonProps {
  isListening: boolean;
  onClick: () => void;
  variant?: 'default' | 'floating';
  className?: string;
}

export const MicButton = ({ 
  isListening, 
  onClick,
  variant = 'default',
  className 
}: MicButtonProps) => {
  const baseStyles = cn(
    'transition-all duration-300',
    {
      'rounded-full p-2 hover:bg-white/10': variant === 'default',
      'fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full shadow-2xl': variant === 'floating'
    },
    className
  );

  if (variant === 'floating') {
    return (
      <button
        onClick={onClick}
        className={cn(
          baseStyles,
          'p-4 md:px-6 backdrop-blur-sm',
          isListening
            ? 'bg-red-900 text-white hover:bg-red-800 shadow-[0_0_30px_rgba(239,68,68,0.3)]'
            : 'bg-indigo-500 text-white hover:bg-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.3)]'
        )}
      >
        <div className="flex items-center gap-3">
          <Mic className="h-5 w-5" />
          {isListening && (
            <span className="hidden md:inline text-sm font-medium whitespace-nowrap">
              Stop Recording
            </span>
          )}
        </div>
      </button>
    );
  }

  // Default inline variant
  const inlineActiveStyles = cn({
    'bg-red-500/10 text-red-400 hover:bg-red-500/20': isListening,
    'bg-white/5 text-white/60 hover:text-white/90': !isListening,
  });
  
  return (
    <button 
      onClick={onClick}
      className={cn(baseStyles, inlineActiveStyles)}
    >
      <Mic className={cn(
        "h-4 w-4",
        { "animate-pulse": isListening }
      )} />
    </button>
  );
};
