'use client';

import { useState, useEffect } from 'react';
import { Mic, MicOff, Trash2, AlertCircle } from 'lucide-react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        // We need to request permission
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        return true;
      } else {
        // Permission denied
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

  const addTodo = (text: string) => {
    setTodos((prevTodos) => [
      ...prevTodos,
      { id: Date.now(), text, completed: false },
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          Voice Todo List
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
          
          <button
            onClick={toggleListening}
            className={`w-full flex items-center justify-center gap-2 p-4 rounded-lg text-white transition-colors ${
              isListening
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-6 h-6" /> Stop Listening
              </>
            ) : (
              <>
                <Mic className="w-6 h-6" /> Start Listening
              </>
            )}
          </button>
          {isListening && (
            <p className="text-center mt-4 text-gray-600 dark:text-gray-300">
              Listening... Speak now
            </p>
          )}
        </div>

        <div className="space-y-4">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="w-5 h-5 accent-blue-500"
              />
              <span
                className={`flex-1 text-gray-800 dark:text-gray-200 ${
                  todo.completed ? 'line-through text-gray-400' : ''
                }`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          {todos.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No todos yet. Click the button above and speak to add one!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
