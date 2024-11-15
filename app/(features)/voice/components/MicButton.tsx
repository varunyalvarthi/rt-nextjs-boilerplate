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
      'fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full py-3 px-4 shadow-2xl backdrop-blur-sm': variant === 'floating'
    },
    className
  );

  if (variant === 'floating') {
    return (
      <button
        onClick={onClick}
        className={cn(
          baseStyles,
          'group border border-white/10',
          isListening
            ? 'bg-black/80 text-white hover:bg-black/70'
            : 'bg-black/60 text-emerald-400/90 hover:bg-black/50'
        )}
        title={isListening ? 'Stop Recording' : 'Start Recording'}
      >
        <div className="relative flex items-center gap-3">
          <div className={cn(
            "relative flex h-6 w-6 items-center justify-center",
            isListening && "after:absolute after:inset-0 after:animate-ping after:rounded-full after:bg-red-500/50 after:duration-1000"
          )}>
            <Mic className={cn(
              "h-5 w-5 transition-colors duration-300",
              isListening ? "text-red-500" : "text-emerald-400 group-hover:text-emerald-300"
            )} />
          </div>

          {/* Sound Wave Animation */}
          {isListening && (
            <div className="flex items-center gap-0.5 pr-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 w-0.5 rounded-full bg-red-500"
                  style={{
                    animation: `soundWave 1s ease-in-out infinite`,
                    animationDelay: `${i * 0.15}s`
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </button>
    );
  }

  // Default inline variant
  return (
    <button
      onClick={onClick}
      className={cn(
        baseStyles,
        isListening 
          ? 'text-red-400' 
          : 'text-white/60'
      )}
    >
      <Mic className="h-4 w-4" />
    </button>
  );
};
