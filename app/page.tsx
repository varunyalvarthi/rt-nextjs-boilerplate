'use client';

import { useState, useEffect } from 'react';
import { Mic, MicOff, Trash2, AlertCircle, Calendar, Folders } from 'lucide-react';

type TaskStatus = 'pending' | 'in_progress' | 'completed';

interface Todo {
  id: number;
  text: string;
  status: TaskStatus;
  chatHistory: ChatMessage[];
  projectId?: number;  // Optional reference to parent project
  timestamp: string;   // To track when the task was created
}

interface ChatMessage {
  id: number;
  text: string;
  timestamp: string;
  isUser: boolean;
}

interface Project {
  id: number;
  name: string;
  tasks: Todo[];
  status: TaskStatus;
}

// Dummy data for todos (tasks not associated with any project)
const dummyTodos: Todo[] = [
  { 
    id: 1, 
    text: 'Review project proposal', 
    status: 'pending', 
    chatHistory: [],
    timestamp: new Date().toISOString()
  },
  { 
    id: 2, 
    text: 'Team sync meeting', 
    status: 'in_progress', 
    chatHistory: [],
    timestamp: new Date().toISOString()
  },
];

// Dummy data for chat messages
const dummyMessages: ChatMessage[] = [];

// Dummy data for projects
const dummyProjects: Project[] = [
  {
    id: 1,
    name: 'Website Redesign',
    status: 'in_progress',
    tasks: [
      { 
        id: 3, 
        text: 'Wireframe approval', 
        status: 'completed', 
        chatHistory: [],
        projectId: 1,
        timestamp: new Date().toISOString()
      },
      { 
        id: 4, 
        text: 'Frontend implementation', 
        status: 'in_progress', 
        chatHistory: [],
        projectId: 1,
        timestamp: new Date().toISOString()
      },
    ],
  },
  {
    id: 2,
    name: 'Mobile App',
    status: 'pending',
    tasks: [
      { 
        id: 5, 
        text: 'User research', 
        status: 'pending', 
        chatHistory: [],
        projectId: 2,
        timestamp: new Date().toISOString()
      },
      { 
        id: 6, 
        text: 'Prototype design', 
        status: 'pending', 
        chatHistory: [],
        projectId: 2,
        timestamp: new Date().toISOString()
      },
    ],
  },
];

export default function Home() {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [activeChatTask, setActiveChatTask] = useState<number | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [transcript, setTranscript] = useState<string>('');

  const [todaysTodos, setTodaysTodos] = useState<Todo[]>(dummyTodos);

  const [projects, setProjects] = useState<Project[]>(dummyProjects);

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-red-500';
      case 'in_progress':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-green-500';
      default:
        return 'bg-white/20';
    }
  };

  const getStatusText = (status: TaskStatus) => {
    return status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1);
  };

  const toggleTaskStatus = (taskId: number, projectId?: number) => {
    const statusCycle: TaskStatus[] = ['pending', 'in_progress', 'completed'];

    if (projectId) {
      setProjects(projects.map(project => {
        if (project.id === projectId) {
          const updatedTasks = project.tasks.map(task => {
            if (task.id === taskId) {
              const currentIndex = statusCycle.indexOf(task.status);
              const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];
              return { ...task, status: nextStatus };
            }
            return task;
          });

          // Update project status based on tasks
          const allCompleted = updatedTasks.every(task => task.status === 'completed');
          const anyInProgress = updatedTasks.some(task => task.status === 'in_progress');
          const projectStatus = allCompleted ? 'completed' : anyInProgress ? 'in_progress' : 'pending';

          return { ...project, tasks: updatedTasks, status: projectStatus };
        }
        return project;
      }));
    } else {
      setTodaysTodos(todaysTodos.map(todo => {
        if (todo.id === taskId) {
          const currentIndex = statusCycle.indexOf(todo.status);
          const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];
          return { ...todo, status: nextStatus };
        }
        return todo;
      }));
    }
  };

  const startTaskChat = (taskId: number) => {
    setActiveChatTask(taskId);
    // Add initial system message for the task
    const task = todaysTodos.find(t => t.id === taskId) ||
      projects.flatMap(p => p.tasks).find(t => t.id === taskId);

    if (task) {
      setChatMessages([{
        id: Date.now(),
        text: `Let's discuss the task: ${task.text}`,
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      }]);
    }
  };

  const startListening = async () => {
    try {
      if (!await checkMicrophonePermission()) {
        setError('Microphone permission denied. Please allow microphone access to use voice commands.');
        return;
      }

      setError(null);
      setIsListening(true);
      setIsChatOpen(true);
      setTranscript('');

      const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);
      };

      recognition.onend = () => {
        if (transcript) {
          addChatMessage(transcript);
        }
        setIsListening(false);
        setTranscript('');
      };

      recognition.start();
    } catch (err) {
      console.error('Error starting speech recognition:', err);
      setError('Error starting speech recognition. Please try again.');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
    recognition.stop();
    setIsListening(false);
  };

  const addChatMessage = (text: string) => {
    setChatMessages((prevMessages) => [
      ...prevMessages,
      {
        id: Date.now(),
        text,
        isUser: true,
        timestamp: new Date().toLocaleTimeString()
      },
      {
        id: Date.now() + 1,
        text: `I've added a task: ${text}`,
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
    
    // Add the task
    addTask(text);
  };

  const addTask = (text: string, projectId?: number) => {
    const newTask: Todo = {
      id: Date.now(),
      text,
      status: 'pending',
      chatHistory: [],
      projectId,
      timestamp: new Date().toISOString()
    };

    if (projectId) {
      // Add to project
      setProjects(projects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: [...project.tasks, newTask]
          };
        }
        return project;
      }));
    } else {
      // Add as standalone task
      setTodaysTodos([...todaysTodos, newTask]);
    }
  };

  const checkMicrophonePermission = async () => {
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });

      if (permissionStatus.state === 'granted') {
        return true;
      } else if (permissionStatus.state === 'prompt') {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        return true;
      } else {
        setError('Microphone access is blocked. Please allow microphone access in your browser settings and refresh the page.');
        return false;
      }
    } catch (err) {
      console.error('Error checking microphone permission:', err);
      return false;
    }
  };

  // Get all tasks due today (including both standalone and project tasks)
  const getTodaysTasks = () => {
    const today = new Date().toDateString();
    
    // Get standalone tasks for today
    const standaloneTasks = todaysTodos.filter(todo => {
      const taskDate = new Date(todo.timestamp).toDateString();
      return taskDate === today;
    });

    // Get project tasks for today
    const projectTasks = projects.flatMap(project => 
      project.tasks.filter(task => {
        const taskDate = new Date(task.timestamp).toDateString();
        return taskDate === today;
      })
    );

    return [...standaloneTasks, ...projectTasks];
  };

  return (
    <div className="h-screen flex bg-black text-white">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Today's Tasks Section */}
            <section className="space-y-4">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Today's Tasks ({getTodaysTasks().length})
              </h2>
              <div className="space-y-2">
                {getTodaysTasks().length === 0 ? (
                  <p className="text-white/60">
                    No tasks for today yet.
                  </p>
                ) : (
                  getTodaysTasks().map((todo) => (
                    <div key={todo.id} className="space-y-2">
                      <div className="flex items-center gap-4 p-3 bg-white/5 group hover:bg-white/10">
                        <button
                          onClick={() => toggleTaskStatus(todo.id, todo.projectId)}
                          className={`w-3 h-3 rounded-full transition-colors ${getStatusColor(todo.status)}`}
                          title={getStatusText(todo.status)}
                        />
                        <div className="flex-1">
                          <span className="text-white/90">
                            {todo.text}
                          </span>
                          {todo.projectId && (
                            <span className="ml-2 text-xs text-white/40">
                              {projects.find(p => p.id === todo.projectId)?.name}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            startTaskChat(todo.id);
                            setIsChatOpen(true);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-white/60 hover:text-white/90"
                        >
                          <Mic className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Current Projects Section */}
            <section className="space-y-4">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <Folders className="w-5 h-5" />
                Current Projects
              </h2>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`} />
                      <h3 className="text-white/90 font-medium">
                        {project.name}
                      </h3>
                    </div>
                    <div className="space-y-1">
                      {project.tasks.map((task) => (
                        <div key={task.id} className="space-y-2">
                          <div className="flex items-center gap-3 p-2 bg-white/5 group hover:bg-white/10">
                            <button
                              onClick={() => toggleTaskStatus(task.id, project.id)}
                              className={`w-2.5 h-2.5 rounded-full transition-colors ${getStatusColor(task.status)}`}
                              title={getStatusText(task.status)}
                            />
                            <span className="flex-1 text-sm text-white/90">
                              {task.text}
                            </span>
                            <button
                              onClick={() => {
                                startTaskChat(task.id);
                                setIsChatOpen(true);
                              }}
                              className="opacity-0 group-hover:opacity-100 text-white/60 hover:text-white/90"
                            >
                              <Mic className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <button
        onClick={startListening}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg transition-all duration-200 z-10 ${
          isListening 
            ? 'bg-purple-600 hover:bg-purple-700 animate-pulse' 
            : 'bg-purple-500 hover:bg-purple-600'
        }`}
      >
        {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
      </button>

      {/* Chat Dialog */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-4 z-20">
          <div className="bg-zinc-900 w-full max-w-2xl rounded-t-lg sm:rounded-lg shadow-xl flex flex-col max-h-[85vh]">
            {/* Dialog Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-lg font-medium">DeepKaam Assistant</h2>
              <button
                onClick={() => {
                  setIsChatOpen(false);
                  if (isListening) stopListening();
                }}
                className="text-white/60 hover:text-white/90"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {error && (
                <div className="mb-4 p-4 bg-red-500/10 text-red-500 flex items-start gap-2 rounded">
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {chatMessages.length === 0 && !transcript ? (
                <p className="text-center text-white/60">
                  Start speaking to create or manage tasks...
                </p>
              ) : (
                <div className="space-y-4">
                  {chatMessages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex gap-3 ${message.isUser ? 'flex-row' : 'flex-row-reverse'}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.isUser ? 'bg-white/10' : 'bg-white/20'
                      }`}>
                        {message.isUser ? (
                          <svg className="w-4 h-4 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                        )}
                      </div>

                      <div className={`flex-1 space-y-1 ${message.isUser ? 'text-left' : 'text-right'}`}>
                        <p className="text-white/90 bg-white/5 p-3 inline-block rounded-lg max-w-[80%]">
                          {message.text}
                        </p>
                        <p className="text-xs text-white/40">
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Live Transcript */}
                  {transcript && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-white/10 animate-pulse">
                        <svg className="w-4 h-4 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-white/90 bg-white/5 p-3 inline-block rounded-lg max-w-[80%]">
                          {transcript}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Voice Status */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <p className="text-white/60">
                  {isListening ? (
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                      Listening...
                    </span>
                  ) : (
                    'Click the mic button to start speaking'
                  )}
                </p>
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded transition-all duration-200 ${
                    isListening
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : 'bg-purple-500 hover:bg-purple-600'
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-4 h-4" /> Stop
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" /> Start
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
