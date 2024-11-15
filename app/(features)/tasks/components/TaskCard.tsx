import { Task, TaskPriority, TaskStatus, TaskType } from '@/app/types/task';
import { useStore } from '@/lib/store/useStore';
import { Mic, Clock, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  todo: Task;
  projectName?: string;
  isListening: boolean;
  onVoiceCommand: (taskId: number) => void;
  activeChatTaskId: number | null;
}

const priorityColors: Record<TaskPriority, { bg: string; text: string; icon: string }> = {
  low: { bg: 'bg-blue-500/10', text: 'text-blue-200', icon: '🔽' },
  medium: { bg: 'bg-yellow-500/10', text: 'text-yellow-200', icon: '➡️' },
  high: { bg: 'bg-orange-500/10', text: 'text-orange-200', icon: '🔼' },
  urgent: { bg: 'bg-red-500/10', text: 'text-red-200', icon: '⚡' }
};

const statusColors: Record<TaskStatus, { bg: string; text: string }> = {
  backlog: { bg: 'bg-gray-500/10', text: 'text-gray-200' },
  todo: { bg: 'bg-blue-500/10', text: 'text-blue-200' },
  in_progress: { bg: 'bg-yellow-500/10', text: 'text-yellow-200' },
  in_review: { bg: 'bg-purple-500/10', text: 'text-purple-200' },
  done: { bg: 'bg-green-500/10', text: 'text-green-200' }
};

const typeIcons: Record<TaskType, string> = {
  feature: '✨',
  bug: '🐛',
  task: '📋',
  story: '📖'
};

export function TaskCard({ todo, projectName, isListening, onVoiceCommand, activeChatTaskId }: TaskCardProps) {
  const members = useStore(state => state.members) || [];
  const assignee = todo.assigneeId ? members.find(m => m.id === todo.assigneeId) : null;
  
  const priorityStyle = priorityColors[todo.priority] || priorityColors.medium;
  const statusStyle = statusColors[todo.status] || statusColors.todo;
  const typeIcon = typeIcons[todo.type] || typeIcons.task;

  const isActiveTask = activeChatTaskId === todo.id;
  const isMicActive = isListening && isActiveTask;

  return (
    <div className="group relative rounded-xl border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/10">
      {/* Task Header */}
      <div className="mb-2 flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-white/60">{typeIcon}</span>
            <h3 className="font-medium text-white/90">{todo.title}</h3>
          </div>
          {projectName && (
            <p className="mt-1 text-sm text-white/40">{projectName}</p>
          )}
        </div>
        <button
          onClick={() => onVoiceCommand(todo.id)}
          className={cn(
            'group/mic flex items-center gap-2 rounded-full border border-white/10 py-2 px-3 transition-all duration-300',
            isMicActive
              ? 'bg-black/80 text-white hover:bg-black/70'
              : 'bg-black/60 text-white/60 hover:bg-black/50'
          )}
          title={isMicActive ? 'Stop Recording' : 'Start Recording'}
        >
          <div className="relative flex items-center gap-2">
            <div className={cn(
              "relative flex h-5 w-5 items-center justify-center",
              isMicActive && "after:absolute after:inset-0 after:animate-ping after:rounded-full after:bg-red-500/50 after:duration-1000"
            )}>
              <Mic className={cn(
                "h-4 w-4 transition-colors duration-300",
                isMicActive ? "text-red-500" : "text-white/60 group-hover/mic:text-white"
              )} />
            </div>

            {/* Sound Wave Animation */}
            {isMicActive && (
              <div className="flex items-center gap-0.5">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-3 w-0.5 rounded-full bg-red-500"
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
      </div>

      {/* Task Metadata */}
      <div className="space-y-2">
        <p className="text-sm text-white/60">{todo.description}</p>
        
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {/* Status */}
          <span className={`rounded-full px-2 py-0.5 ${statusStyle.bg} ${statusStyle.text}`}>
            {todo.status.replace('_', ' ')}
          </span>
          
          {/* Priority */}
          <span className={`rounded-full px-2 py-0.5 ${priorityStyle.bg} ${priorityStyle.text} flex items-center gap-1`}>
            <span>{priorityStyle.icon}</span>
            {todo.priority}
          </span>

          {/* Assignee */}
          {assignee && (
            <span className="flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-white/60">
              <User className="h-3 w-3" />
              {assignee.name}
            </span>
          )}

          {/* Time Estimates */}
          {todo.estimate && (
            <span className="flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-white/60">
              <Clock className="h-3 w-3" />
              {todo.estimate}h
              {todo.timeSpent && ` / ${todo.timeSpent}h`}
            </span>
          )}
        </div>

        {/* Labels */}
        {todo.labels && todo.labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {todo.labels.map(label => (
              <span
                key={label}
                className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-white/40"
              >
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Timestamps */}
        {todo.createdAt && (
          <div className="flex items-center gap-4 text-xs text-white/40">
            <span>Created {formatDistanceToNow(new Date(todo.createdAt))} ago</span>
            {todo.updatedAt && todo.updatedAt > todo.createdAt && (
              <span>• Updated {formatDistanceToNow(new Date(todo.updatedAt))} ago</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
