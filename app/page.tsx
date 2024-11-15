'use client';

import { useCallback, useEffect, useState } from 'react';
import { Calendar, User, Bot } from 'lucide-react';
import { useStore } from '@/lib/store/useStore';
import { TaskCard } from './(features)/tasks/components/TaskCard';
import { ProjectCard } from './(features)/tasks/components/ProjectCard';
import { ChatDialog } from './(features)/voice/components/ChatDialog';
import { MicButton } from './(features)/voice/components/MicButton';
import { useSpeechRecognition } from './(features)/voice/hooks/useSpeechRecognition';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingState } from './components/LoadingState';
import { ErrorToast } from './components/ErrorToast';

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

        {/* Transcript Section */}
        <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div 
              className="space-y-4 max-h-[240px] overflow-y-auto scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20"
              style={{
                scrollBehavior: 'smooth'
              }}
              ref={(el) => {
                if (el) {
                  el.scrollTop = el.scrollHeight;
                }
              }}
            >
              {messages.length === 0 ? (
                <p className="text-white/40 text-center py-4">
                  Start speaking to see the conversation here
                </p>
              ) : (
                messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`flex items-start gap-3 ${
                      message.type === 'user' ? 'text-purple-200' : 'text-emerald-200'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      message.type === 'user' ? 'bg-purple-500/10' : 'bg-emerald-500/10'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-medium">
                          {message.type === 'user' ? 'You' : 'Assistant'}
                        </span>
                        <span className="text-xs text-white/40">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="mt-1">{message.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
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