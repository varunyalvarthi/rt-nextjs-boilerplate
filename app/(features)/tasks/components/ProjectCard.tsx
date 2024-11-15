import { Project } from '@/app/types/task';
import { 
  ChevronDown, 
  ChevronRight, 
  Folder, 
  MoreVertical, 
  Plus, 
  Trash2,
  Users,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '@/app/lib/store';
import { TaskCard } from './TaskCard';
import { MicButton } from '../../voice/components/MicButton';
import { useState } from 'react';
import { AddTaskDialog } from './AddTaskDialog';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  isListening: boolean;
  onVoiceCommand: () => void;
}

export const ProjectCard = ({ 
  project,
  isListening,
  onVoiceCommand 
}: ProjectCardProps) => {
  const todos = useStore(state => state.todos);
  const deleteProject = useStore(state => state.deleteProject);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  const projectTodos = todos.filter(todo => todo.projectId === project.id);
  const completedTodos = projectTodos.filter(todo => todo.status === 'done').length;

  return (
    <>
      <div className="group/project relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02]">
        <div className="relative">
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-[200%] group-hover/project:animate-[shimmer_2s_ease-in-out]" />
          
          <div className="relative flex items-center gap-4 p-4">
            {/* Expand/Collapse */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-white/40 hover:text-white/90 transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </button>

            {/* Project Icon */}
            <div className={cn(
              "rounded-xl p-2.5",
              project.color === 'emerald' && "bg-emerald-500/20 text-emerald-300",
              project.color === 'purple' && "bg-purple-500/20 text-purple-300",
              project.color === 'blue' && "bg-blue-500/20 text-blue-300",
              project.color === 'orange' && "bg-orange-500/20 text-orange-300"
            )}>
              <Folder className="h-5 w-5" />
            </div>

            {/* Project Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-medium text-white/90">{project.name}</h2>
                  <div className="mt-1 flex items-center gap-4 text-sm text-white/40">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      <span>{project.members.length} members</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{completedTodos} of {projectTodos.length} tasks completed</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {/* Add Task */}
                  <button
                    onClick={() => setShowAddTaskDialog(true)}
                    className="rounded-lg border border-white/10 bg-white/5 p-2 text-white/40 hover:bg-white/10 hover:text-white/90 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>

                  {/* Voice Command */}
                  <MicButton
                    isListening={isListening}
                    onClick={onVoiceCommand}
                    variant="project"
                  />

                  {/* More Actions */}
                  <div className="relative">
                    <button
                      onClick={() => setShowDeletePopup(!showDeletePopup)}
                      className="rounded-lg border border-white/10 bg-white/5 p-2 text-white/40 hover:bg-white/10 hover:text-white/90 transition-colors"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    {/* Delete Popup */}
                    {showDeletePopup && (
                      <div className="absolute right-0 top-full z-10 mt-2 w-48 rounded-lg border border-white/10 bg-zinc-900/90 p-1 shadow-xl backdrop-blur-sm">
                        <button
                          onClick={() => {
                            deleteProject(project.id);
                            setShowDeletePopup(false);
                          }}
                          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-red-400 hover:bg-white/5"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete Project
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tasks */}
          {isExpanded && (
            <div className="space-y-2 p-4 pt-0">
              {projectTodos.length === 0 ? (
                <div className="rounded-lg border border-white/5 bg-white/5 p-8 text-center backdrop-blur-sm">
                  <p className="text-white/40">No tasks yet. Start by adding one!</p>
                </div>
              ) : (
                projectTodos.map(todo => (
                  <TaskCard
                    key={todo.id}
                    todo={todo}
                    isListening={isListening}
                    onVoiceCommand={onVoiceCommand}
                    activeChatTaskId={null}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Task Dialog */}
      <AddTaskDialog
        projectId={project.id}
        isOpen={showAddTaskDialog}
        onClose={() => setShowAddTaskDialog(false)}
      />
    </>
  );
};
