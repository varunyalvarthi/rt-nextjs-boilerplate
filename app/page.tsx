'use client';

import { Calendar } from 'lucide-react';
import { useStore } from '@/lib/store/useStore';
import { TaskCard } from './(features)/tasks/components/TaskCard';
import { ProjectCard } from './(features)/tasks/components/ProjectCard';
import { ChatDialog } from './(features)/voice/components/ChatDialog';
import { MicButton } from './(features)/voice/components/MicButton';
import { useSpeechRecognition } from './(features)/voice/hooks/useSpeechRecognition';

export default function Home() {
  const { todos, projects, setChatOpen, isChatOpen } = useStore();
  const { isListening, transcript, error, startListening, stopListening } = useSpeechRecognition({
    onTranscript: (transcript) => {
      // Handle global voice commands
      console.log('Global command:', transcript);
    }
  });

  const handleChatClose = () => {
    if (isListening) {
      stopListening();
    }
    setChatOpen(false);
  };

  const handleVoiceCommand = (taskId?: number) => {
    if (isListening) {
      stopListening();
    } else {
      setChatOpen(true);
      startListening();
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight text-white/90">
              DeepKaam
              <span className="ml-2 text-sm font-normal text-white/40">
                Voice-Powered Task Management
              </span>
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-full bg-purple-500/10 px-4 py-1.5">
                <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
                <span className="text-sm text-purple-200">
                  {isListening ? 'Listening...' : 'Ready'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Tasks */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/10 p-2.5">
                <Calendar className="h-5 w-5 text-purple-300" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-white/90">Today's Tasks</h2>
                <p className="text-sm text-white/40">
                  {todos.length} tasks • {todos.filter(t => t.status === 'completed').length} completed
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {todos.length === 0 ? (
                <div className="rounded-xl border border-white/5 bg-white/5 p-8 text-center backdrop-blur-sm">
                  <p className="text-white/40">No tasks for today. Start by adding one!</p>
                </div>
              ) : (
                todos.map((todo) => (
                  <TaskCard
                    key={todo.id}
                    todo={todo}
                    projectName={projects.find(p => p.id === todo.projectId)?.name}
                    isListening={isListening}
                    onVoiceCommand={handleVoiceCommand}
                  />
                ))
              )}
            </div>
          </div>

          {/* Projects */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-gradient-to-br from-indigo-500/20 to-indigo-500/10 p-2.5">
                  <Calendar className="h-5 w-5 text-indigo-300" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-white/90">Projects</h2>
                  <p className="text-sm text-white/40">
                    {projects.length} projects • {projects.filter(p => p.status === 'completed').length} completed
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {projects.length === 0 ? (
                <div className="rounded-xl border border-white/5 bg-white/5 p-8 text-center backdrop-blur-sm">
                  <p className="text-white/40">No projects yet. Create your first project!</p>
                </div>
              ) : (
                projects.map((project) => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    isListening={isListening}
                    onVoiceCommand={handleVoiceCommand}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <MicButton
        isListening={isListening}
        onClick={() => handleVoiceCommand()}
        variant="floating"
      />

      {/* Chat Dialog */}
      <ChatDialog
        isOpen={isChatOpen}
        onClose={handleChatClose}
        isListening={isListening}
        transcript={transcript}
        error={error}
        onStartListening={startListening}
        onStopListening={stopListening}
      />
    </main>
  );
}