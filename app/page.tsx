'use client';

import { useState, useEffect } from 'react';
import { Mic, MicOff, Trash2, AlertCircle, Calendar } from 'lucide-react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  timestamp: string;
}

interface ChatMessage {
  id: number;
  text: string;
  timestamp: string;
}

interface Project {
  id: number;
  name: string;
  tasks: Todo[];
  color: string;
}

// Dummy data for todos
const dummyTodos: Todo[] = [
  {
    id: 1,
    text: "Complete the project documentation",
    completed: false,
    timestamp: new Date().toISOString(),
  },
  {
    id: 2,
    text: "Review pull requests",
    completed: true,
    timestamp: new Date().toISOString(),
  },
  {
    id: 3,
    text: "Schedule team meeting for next sprint",
    completed: false,
    timestamp: new Date().toISOString(),
  },
  {
    id: 4,
    text: "Update dependencies in the project",
    completed: false,
    timestamp: new Date(Date.now() - 86400000).toISOString(), // Yesterday
  },
  {
    id: 5,
    text: "Fix bug in authentication module",
    completed: true,
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 6,
    text: "Write unit tests for new features",
    completed: false,
    timestamp: new Date().toISOString(),
  },
  {
    id: 7,
    text: "Prepare presentation for stakeholders",
    completed: false,
    timestamp: new Date().toISOString(),
  },
  {
    id: 8,
    text: "Deploy updates to production",
    completed: true,
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  }
];

// Dummy data for chat messages
const dummyMessages: ChatMessage[] = [
  {
    id: 1,
    text: "Add a new task to review the project documentation",
    timestamp: "9:00 AM"
  },
  {
    id: 2,
    text: "Mark the dependency update task as completed",
    timestamp: "9:15 AM"
  },
  {
    id: 3,
    text: "Schedule a team meeting for tomorrow",
    timestamp: "9:30 AM"
  },
  {
    id: 4,
    text: "Add a reminder to deploy the new features",
    timestamp: "10:00 AM"
  },
  {
    id: 5,
    text: "Create a task for unit testing",
    timestamp: "10:30 AM"
  },
  {
    id: 6,
    text: "Update the sprint board with new tasks",
    timestamp: "11:00 AM"
  },
  {
    id: 7,
    text: "Set up the presentation for next week",
    timestamp: "11:30 AM"
  },
  {
    id: 8,
    text: "Review and prioritize backlog items",
    timestamp: "12:00 PM"
  }
];

// Dummy data for projects
const dummyProjects: Project[] = [
  {
    id: 1,
    name: "Website Redesign",
    color: "bg-white/5",
    tasks: [
      {
        id: 101,
        text: "Create new homepage mockup",
        completed: false,
        timestamp: new Date().toISOString(),
      },
      {
        id: 102,
        text: "Implement responsive navigation",
        completed: true,
        timestamp: new Date().toISOString(),
      }
    ]
  },
  {
    id: 2,
    name: "Mobile App Development",
    color: "bg-white/5",
    tasks: [
      {
        id: 201,
        text: "Design user authentication flow",
        completed: false,
        timestamp: new Date().toISOString(),
      },
      {
        id: 202,
        text: "Set up Firebase integration",
        completed: true,
        timestamp: new Date().toISOString(),
      }
    ]
  },
  {
    id: 3,
    name: "Marketing Campaign",
    color: "bg-white/5",
    tasks: [
      {
        id: 301,
        text: "Create social media content calendar",
        completed: false,
        timestamp: new Date().toISOString(),
      },
      {
        id: 302,
        text: "Design email newsletter template",
        completed: false,
        timestamp: new Date().toISOString(),
      }
    ]
  }
];

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>(dummyTodos);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(dummyMessages);
  const [projects, setProjects] = useState<Project[]>(dummyProjects);

  // Get today's todos
  const todaysTodos = todos.filter(todo => {
    const todoDate = new Date(todo.timestamp).toDateString();
    const today = new Date().toDateString();
    return todoDate === today;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          const text = event.results[0][0].transcript;
          addTodo(text);
          addChatMessage(text);
          setIsListening(false);
          setError(null);
        };

        recognition.onerror = (event) => {
          setIsListening(false);
          switch (event.error) {
            case 'audio-capture':
              setError('No microphone was found. Ensure that a microphone is installed and that microphone settings are configured correctly.');
              break;
            case 'not-allowed':
              setError('Permission to use microphone was denied. Please allow microphone access and try again.');
              break;
            case 'network':
              setError('Network error occurred. Please check your internet connection.');
              break;
            default:
              setError(`Error occurred: ${event.error}`);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognition);
      } else {
        setError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      }
    }
  }, []);

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

  const toggleListening = async () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    const hasPermission = await checkMicrophonePermission();
    if (hasPermission) {
      try {
        setError(null);
        recognition.start();
        setIsListening(true);
      } catch (err) {
        setError('Error starting speech recognition. Please try again.');
        setIsListening(false);
      }
    }
  };

  const addChatMessage = (text: string) => {
    setChatMessages((prevMessages) => [
      ...prevMessages,
      {
        id: Date.now(),
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      },
    ]);
  };

  const addTodo = (text: string) => {
    setTodos((prevTodos) => [
      ...prevTodos,
      { 
        id: Date.now(), 
        text, 
        completed: false,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const toggleTodo = (id: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="h-screen flex bg-black text-white">
      {/* Left Column - Chat Section */}
      <div className="w-1/2 flex flex-col border-r border-white/20">
        <div className="flex-grow overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-4 bg-white/5 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {chatMessages.length === 0 ? (
              <p className="text-center text-white/60">
                Your conversation will appear here...
              </p>
            ) : (
              chatMessages.map((message) => (
                <div key={message.id} className="flex items-start gap-3 group">
                  <span className="text-sm text-white/60 whitespace-nowrap">
                    {message.timestamp}
                  </span>
                  <p className="text-white/90">{message.text}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-6 border-t border-white/20">
          <button
            onClick={toggleListening}
            className={`w-full flex items-center justify-center gap-2 p-4 transition-colors ${
              isListening
                ? 'bg-white text-black'
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5" /> DeepKaam
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" /> DeepKaam
              </>
            )}
          </button>
          {isListening && (
            <p className="text-center mt-4 text-white/60">
              Listening... Speak now
            </p>
          )}
        </div>
      </div>

      {/* Right Column - Tasks Section */}
      <div className="w-1/2 overflow-y-auto">
        <div className="p-6 space-y-8">
          {/* Today's Tasks Section */}
          <section>
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Today's Tasks
            </h2>
            <div className="space-y-2">
              {todaysTodos.length === 0 ? (
                <p className="text-white/60">
                  No tasks for today yet.
                </p>
              ) : (
                todaysTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center gap-4 p-3 bg-white/5 group hover:bg-white/10"
                  >
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="w-4 h-4 border border-white/20 bg-transparent checked:bg-white checked:border-white focus:ring-0"
                    />
                    <span
                      className={`flex-1 ${
                        todo.completed ? 'line-through text-white/40' : 'text-white/90'
                      }`}
                    >
                      {todo.text}
                    </span>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="opacity-0 group-hover:opacity-100 text-white/60 hover:text-white/90"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Current Projects Section */}
          <section>
            <h2 className="text-lg font-medium mb-4">
              Current Projects
            </h2>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="space-y-2">
                  <h3 className="text-white/90 font-medium">
                    {project.name}
                  </h3>
                  <div className="space-y-1">
                    {project.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-3 p-2 bg-white/5 group hover:bg-white/10"
                      >
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTodo(task.id)}
                          className="w-4 h-4 border border-white/20 bg-transparent checked:bg-white checked:border-white focus:ring-0"
                        />
                        <span
                          className={`flex-1 text-sm ${
                            task.completed ? 'line-through text-white/40' : 'text-white/90'
                          }`}
                        >
                          {task.text}
                        </span>
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
  );
}
