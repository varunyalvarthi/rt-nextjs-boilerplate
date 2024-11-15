import { Project } from '@/app/types/task';
import { ChevronDown, ChevronRight, Folder, MoreVertical, Plus, Trash2 } from 'lucide-react';
import { useStore } from '@/lib/store/useStore';
import { TaskCard } from './TaskCard';
import { MicButton } from '../../voice/components/MicButton';
import { useState } from 'react';

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
  const { todos, deleteProject } = useStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const projectTodos = todos.filter(todo => todo.projectId === project.id);
  const completedTodos = projectTodos.filter(todo => todo.status === 'completed').length;

  return (
    <div className="group/project relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02]">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-[200%] group-hover/project:animate-[shimmer_2s_ease-in-out]" />
        
        <div className="relative flex items-center gap-4 p-4">
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

          <div className="rounded-xl bg-gradient-to-br from-indigo-500/20 to-indigo-500/10 p-2">
            <Folder className="h-5 w-5 text-indigo-300" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white/90">
                  {project.name}
                </h3>
                <p className="text-sm text-white/40">
                  {projectTodos.length} tasks • {completedTodos} completed
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button className="rounded-full bg-white/5 p-2 text-white/60 hover:text-white/90 transition-colors">
                  <Plus className="h-4 w-4" />
                </button>
                <MicButton
                  isListening={isListening}
                  onClick={() => onVoiceCommand()}
                />
                <div className="relative">
                  <button 
                    className="rounded-full bg-white/5 p-2 text-white/60 hover:text-white/90 transition-colors"
                    onClick={() => setShowDeletePopup(!showDeletePopup)}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                  {showDeletePopup && (
                    <div 
                      className="fixed z-50"
                      style={{
                        top: 'var(--popup-top)',
                        left: 'var(--popup-left)'
                      }}
                      ref={(el) => {
                        if (el) {
                          const button = el.previousElementSibling as HTMLElement;
                          const rect = button.getBoundingClientRect();
                          el.style.setProperty('--popup-top', `${rect.bottom + 8}px`);
                          el.style.setProperty('--popup-left', `${rect.left - el.offsetWidth + button.offsetWidth}px`);
                        }
                      }}
                    >
                      <div className="w-48 rounded-lg border border-white/10 bg-zinc-900/95 py-1 shadow-xl backdrop-blur-sm">
                        <button
                          onClick={() => {
                            deleteProject(project.id);
                            setShowDeletePopup(false);
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete Project
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isExpanded && projectTodos.length > 0 && (
        <div className="border-t border-white/5 px-4 py-3 space-y-3">
          {projectTodos.map((todo) => (
            <TaskCard
              key={todo.id}
              todo={todo}
              isListening={isListening}
              onVoiceCommand={onVoiceCommand}
            />
          ))}
        </div>
      )}
    </div>
  );
};
