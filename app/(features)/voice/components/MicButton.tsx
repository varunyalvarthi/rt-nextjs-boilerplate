import { Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MicButtonProps {
  isListening: boolean;
  onClick: () => void;
  variant?: 'default' | 'project' | 'task';
  className?: string;
}

export const MicButton = ({ 
  isListening, 
  onClick,
  variant = 'default',
  className 
}: MicButtonProps) => {
  const baseStyles = cn(
    "relative flex items-center justify-center rounded-full p-2 transition-all duration-300",
    // Default state (green)
    "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30",
    // Active state (red)
    isListening && "bg-red-500/20 text-red-300 hover:bg-red-500/30",
    // Variant-specific styles
    variant === 'project' && "border border-white/10",
    variant === 'task' && "scale-90",
    className
  );

  return (
    <button
      onClick={onClick}
      className={baseStyles}
      title={isListening ? 'Stop Recording' : 'Start Recording'}
    >
      {/* Mic Icon */}
      <Mic className={cn(
        "h-4 w-4 transition-transform duration-300",
        isListening && "scale-110"
      )} />

      {/* Pulse Effect */}
      {isListening && (
        <span className="absolute inset-0 animate-ping rounded-full bg-red-500/20" />
      )}

      {/* Sound Wave Animation */}
      {isListening && (
        <div className="absolute left-full top-1/2 ml-2 flex -translate-y-1/2 items-end gap-0.5">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-2 w-0.5 rounded-full bg-red-300"
              style={{
                animation: 'soundWave 1s ease-in-out infinite',
                animationDelay: `${i * 0.15}s`
              }}
            />
          ))}
        </div>
      )}
    </button>
  );
};
