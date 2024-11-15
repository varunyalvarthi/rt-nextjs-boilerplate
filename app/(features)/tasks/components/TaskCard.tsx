import { Todo } from '@/app/types/task';
import { Trash2, Clock } from 'lucide-react';
import { useStore } from '@/lib/store/useStore';
import { MicButton } from '../../voice/components/MicButton';

interface TaskCardProps {
  todo: Todo;
  projectName?: string;
  isListening: boolean;
  onVoiceCommand: (taskId?: number) => void;
}

export const TaskCard = ({ 
  todo, 
  projectName,
  isListening,
  onVoiceCommand 
}: TaskCardProps) => {
  const { updateTodoStatus, deleteTodo, setActiveChatTask } = useStore();

  const statusConfig = {
    pending: {
      color: 'from-red-500/20 to-red-500/10',
      text: 'text-red-300',
      ring: 'ring-red-500/30',
      bg: 'bg-red-500'
    },
    in_progress: {
      color: 'from-yellow-500/20 to-yellow-500/10',
      text: 'text-yellow-300',
      ring: 'ring-yellow-500/30',
      bg: 'bg-yellow-500'
    },
    completed: {
      color: 'from-green-500/20 to-green-500/10',
      text: 'text-green-300',
      ring: 'ring-green-500/30',
      bg: 'bg-green-500'
    }
  };

  const handleMicClick = () => {
    setActiveChatTask(todo.id);
    onVoiceCommand(todo.id);
  };

  const createdAt = new Date(todo.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-4 hover:border-white/20 transition-colors duration-300">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-[200%] group-hover:animate-[shimmer_2s_ease-in-out]" />
      
      <div className="relative flex items-start gap-4">
        <button
          onClick={() => updateTodoStatus(todo.id)}
          className={`mt-1 h-4 w-4 rounded-full ring-2 transition-all duration-300 ${statusConfig[todo.status].ring} ${statusConfig[todo.status].bg}`}
          title={todo.status.replace('_', ' ')}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-white/90 line-clamp-2">
                {todo.text}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5">
                  <Clock className="h-3 w-3 text-white/40" />
                  <span className="text-xs text-white/40">{createdAt}</span>
                </div>
                {projectName && (
                  <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-300">
                    {projectName}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className={`text-xs ${statusConfig[todo.status].text}`}>
                {todo.status.replace('_', ' ').charAt(0).toUpperCase() + todo.status.slice(1)}
              </div>
              <div className="flex items-center gap-2">
                <MicButton
                  isListening={isListening}
                  onClick={handleMicClick}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 text-white/60 hover:text-red-400 transition-all duration-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
