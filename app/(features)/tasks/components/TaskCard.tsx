import { Task, TaskPriority, TaskStatus, TaskType } from '@/app/types/task';
import { useStore } from '@/app/lib/store';
import { 
  Mic, 
  Clock, 
  User, 
  Sparkles, 
  Bug, 
  ClipboardList, 
  BookOpen,
  AlertTriangle,
  ArrowRight,
  ArrowUp,
  Zap
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  todo: Task;
  projectName?: string;
  isListening: boolean;
  onVoiceCommand: (taskId: number) => void;
  activeChatTaskId: number | null;
}

const priorityColors: Record<TaskPriority, { bg: string; text: string; icon: typeof ArrowRight }> = {
  low: { bg: 'bg-blue-500/10', text: 'text-blue-300', icon: ArrowRight },
  medium: { bg: 'bg-yellow-500/10', text: 'text-yellow-300', icon: ArrowUp },
  high: { bg: 'bg-orange-500/10', text: 'text-orange-300', icon: AlertTriangle },
  urgent: { bg: 'bg-red-500/10', text: 'text-red-300', icon: Zap }
};

const statusColors: Record<TaskStatus, { bg: string; text: string; border: string }> = {
  todo: { bg: 'bg-blue-500/10', text: 'text-blue-300', border: 'border-blue-500/20' },
  in_progress: { bg: 'bg-yellow-500/10', text: 'text-yellow-300', border: 'border-yellow-500/20' },
  review: { bg: 'bg-purple-500/10', text: 'text-purple-300', border: 'border-purple-500/20' },
  done: { bg: 'bg-green-500/10', text: 'text-green-300', border: 'border-green-500/20' }
};

const typeIcons: Record<TaskType, { icon: typeof Sparkles; color: string }> = {
  feature: { icon: Sparkles, color: 'text-purple-300' },
  bug: { icon: Bug, color: 'text-red-300' },
  task: { icon: ClipboardList, color: 'text-blue-300' },
  improvement: { icon: BookOpen, color: 'text-green-300' }
};

export function TaskCard({ todo, projectName, isListening, onVoiceCommand, activeChatTaskId }: TaskCardProps) {
  const members = useStore(state => state.members) || [];
  const assignee = todo.assigneeId ? members.find(m => m.id === todo.assigneeId) : null;
  
  const priorityStyle = priorityColors[todo.priority] || priorityColors.medium;
  const statusStyle = statusColors[todo.status] || statusColors.todo;
  const typeInfo = typeIcons[todo.type] || typeIcons.task;
  const TypeIcon = typeInfo.icon;

  const isActiveTask = activeChatTaskId === todo.id;
  const isMicActive = isListening && isActiveTask;

  const PriorityIcon = priorityStyle.icon;

  return (
    <div className={cn(
      "group relative rounded-xl border bg-white/5 p-4 transition-all hover:bg-white/10",
      statusStyle.border
    )}>
      {/* Task Header */}
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          {/* Type Icon */}
          <div className={cn("rounded-lg p-2 bg-white/5", typeInfo.color)}>
            <TypeIcon className="h-4 w-4" />
          </div>

          {/* Title and Project */}
          <div className="min-w-0">
            <h3 className="font-medium text-white/90 truncate">{todo.title}</h3>
            {projectName && (
              <p className="mt-0.5 text-sm text-white/40">{projectName}</p>
            )}
          </div>
        </div>

        {/* Priority and Mic */}
        <div className="flex items-center gap-2">
          <div className={cn("rounded-md px-2 py-1 text-xs font-medium flex items-center gap-1.5", priorityStyle.bg, priorityStyle.text)}>
            <PriorityIcon className="h-3.5 w-3.5" />
            <span className="capitalize">{todo.priority}</span>
          </div>

          <button
            onClick={() => onVoiceCommand(todo.id)}
            className={cn(
              "rounded-full p-2 transition-colors",
              isActiveTask
                ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                : "text-white/40 hover:bg-white/5 hover:text-white/90"
            )}
          >
            <Mic className={cn("h-4 w-4", isMicActive && "animate-pulse")} />
          </button>
        </div>
      </div>

      {/* Task Details */}
      <div className="flex items-center gap-4 text-sm">
        {/* Status */}
        <div className={cn("rounded-md px-2 py-1 text-xs font-medium", statusStyle.bg, statusStyle.text)}>
          <span className="capitalize">{todo.status.replace('_', ' ')}</span>
        </div>

        {/* Time */}
        {(todo.estimate || todo.timeSpent) && (
          <div className="flex items-center gap-1.5 text-white/40">
            <Clock className="h-3.5 w-3.5" />
            <span>{todo.timeSpent || 0}h / {todo.estimate || 0}h</span>
          </div>
        )}

        {/* Assignee */}
        {assignee && (
          <div className="flex items-center gap-1.5 text-white/40">
            <User className="h-3.5 w-3.5" />
            <span>{assignee.name}</span>
          </div>
        )}
      </div>

      {/* Description Preview */}
      {todo.description && (
        <p className="mt-3 text-sm text-white/60 line-clamp-2">{todo.description}</p>
      )}
    </div>
  );
}
