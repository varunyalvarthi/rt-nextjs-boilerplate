'use client';

import { useCallback, useEffect, useState } from 'react';
import { Calendar, User, Bot, Mic } from 'lucide-react';
import { useStore } from '@/app/lib/store';
import { TaskCard } from './(features)/tasks/components/TaskCard';
import { ProjectCard } from './(features)/tasks/components/ProjectCard';
import { ChatDialog } from './(features)/voice/components/ChatDialog';
import { MicButton } from './(features)/voice/components/MicButton';
import { useSpeechRecognition } from './(features)/voice/hooks/useSpeechRecognition';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingState } from './components/LoadingState';
import { ErrorToast } from './components/ErrorToast';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface Message {
  type: 'user' | 'agent';
  text: string;
  timestamp: Date;
}

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Basic state
  const todos = useStore(state => state.todos);
  const projects = useStore(state => state.projects);
  const isLoading = useStore(state => state.isLoading);
  const activeChatTask = useStore(state => state.activeChatTask);
  const setActiveChatTask = useStore(state => state.setActiveChatTask);
  const addTask = useStore(state => state.addTask);

  const isChatOpen = activeChatTask !== null;

  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening 
  } = useSpeechRecognition({
    onTranscript: (transcript) => {
      console.log('Global command:', transcript);
      if (transcript.trim()) {
        setMessages(prev => [...prev, {
          type: 'user',
          text: transcript,
          timestamp: new Date()
        }]);
        
        // Mock agent response
        setTimeout(() => {
          setMessages(prev => [...prev, {
            type: 'agent',
            text: 'I understand you want to ' + transcript.toLowerCase() + '. I\'ll help you with that.',
            timestamp: new Date()
          }]);
        }, 1000);
      }
    }
  });

  // Handlers
  const handleChatClose = useCallback(() => {
    if (isListening) {
      stopListening();
    }
    setActiveChatTask(null);
  }, [isListening, stopListening, setActiveChatTask]);

  const handleVoiceCommand = useCallback((taskId?: number) => {
    if (isListening) {
      stopListening();
    } else {
      setActiveChatTask(taskId ?? -1);
      startListening();
    }
  }, [isListening, setActiveChatTask, startListening, stopListening]);

  if (isLoading) {
    return <LoadingState variant="full" />;
  }

  return (
    <ErrorBoundary>
      <main className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-white">
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

        {/* Voice Transcript Section */}
        <div className="relative">
          <div className="relative rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm">
            {/* Command Examples */}
            {messages.length === 0 && !isListening && (
              <div className="p-4">
                <h3 className="mb-3 text-sm font-medium text-white/60">Try these commands:</h3>
                <div className="space-y-2">
                  {[
                    'Create a new task called "Review project proposal"',
                    'Show me all high priority tasks',
                    'Mark task #3 as completed',
                    'Assign task #2 to John',
                    'What tasks are due today?'
                  ].map((example, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-sm text-white/60"
                    >
                      <Mic className="h-3.5 w-3.5" />
                      <span>{example}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Transcription */}
            {isListening && !transcript && (
              <div className="flex items-center gap-3 p-4">
                <div className="flex items-end gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-2 w-0.5 animate-pulse rounded-full bg-emerald-400/60"
                      style={{
                        animationDelay: `${i * 0.15}s`
                      }}
                    />
                  ))}
                </div>
                <p className="text-sm text-white/40">Waiting for voice command...</p>
              </div>
            )}

            {/* Current Transcript */}
            {isListening && transcript && (
              <div className="flex items-start gap-3 p-4">
                <div className="mt-1 rounded-full bg-emerald-500/20 p-1.5">
                  <Mic className="h-3.5 w-3.5 text-emerald-300" />
                </div>
                <p className="text-sm text-white/90">{transcript}</p>
              </div>
            )}

            {/* Conversation History */}
            {messages.length > 0 && (
              <div className="max-h-[300px] divide-y divide-white/5 overflow-y-auto scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/10">
                {messages.map((message, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4"
                  >
                    <div className={cn(
                      "mt-1 rounded-full p-1.5",
                      message.type === 'user' 
                        ? "bg-emerald-500/20" 
                        : "bg-purple-500/20"
                    )}>
                      {message.type === 'user' ? (
                        <Mic className="h-3.5 w-3.5 text-emerald-300" />
                      ) : (
                        <Bot className="h-3.5 w-3.5 text-purple-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white/90">{message.text}</p>
                      <p className="mt-1 text-xs text-white/40">
                        {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

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
                    <ErrorBoundary key={todo.id}>
                      <TaskCard
                        todo={todo}
                        projectName={projects.find(p => p.id === todo.projectId)?.name}
                        isListening={isListening}
                        onVoiceCommand={handleVoiceCommand}
                        activeChatTaskId={activeChatTask}
                      />
                    </ErrorBoundary>
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
                      {projects.length} projects • {projects.filter(p => p.tasks.every(t => t.status === 'completed')).length} completed
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
                    <ErrorBoundary key={project.id}>
                      <ProjectCard 
                        project={project} 
                        isListening={isListening}
                        onVoiceCommand={handleVoiceCommand}
                      />
                    </ErrorBoundary>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <MicButton
          isListening={isListening}
          onClick={() => handleVoiceCommand()}
          variant="floating"
        />

        <ChatDialog
          open={isChatOpen}
          onClose={handleChatClose}
          isListening={isListening}
          transcript={transcript}
        />

        {error && <ErrorToast message={error} onClose={() => setError(null)} />}
      </main>
    </ErrorBoundary>
  );
}