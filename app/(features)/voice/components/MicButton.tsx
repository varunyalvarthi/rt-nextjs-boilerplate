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
      'fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full shadow-xl': variant === 'floating'
    },
    className
  );

  const activeStyles = cn({
    'bg-red-500/10 text-red-400 hover:bg-red-500/20': variant === 'default' && isListening,
    'bg-red-500 text-white hover:bg-red-600': variant === 'floating' && isListening,
    'bg-white/5 text-white/60 hover:text-white/90': !isListening,
  });

  const glowStyles = isListening ? 'animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]' : '';
  const containerStyles = variant === 'floating' ? 'p-3 md:px-4' : '';
  
  return (
    <button 
      onClick={onClick}
      className={cn(baseStyles, activeStyles, glowStyles, containerStyles)}
    >
      <div className="flex items-center gap-2">
        <Mic className={cn(
          "h-4 w-4",
          { "animate-pulse": isListening }
        )} />
        {variant === 'floating' && isListening && (
          <span className="hidden md:inline text-sm font-medium">
            Stop Recording
          </span>
        )}
      </div>
    </button>
  );
};
