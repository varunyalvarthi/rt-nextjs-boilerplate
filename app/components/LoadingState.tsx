interface LoadingStateProps {
  variant?: 'full' | 'card';
}

export const LoadingState = ({ variant = 'card' }: LoadingStateProps) => {
  if (variant === 'full') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="relative mx-auto h-12 w-12">
            <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20" />
            <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500 animate-spin" />
          </div>
          <p className="text-sm text-white/40">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[100px] items-center justify-center rounded-xl border border-white/5 bg-white/5">
      <div className="space-y-3 text-center">
        <div className="relative mx-auto h-8 w-8">
          <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20" />
          <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500 animate-spin" />
        </div>
        <p className="text-xs text-white/40">Loading...</p>
      </div>
    </div>
  );
};
