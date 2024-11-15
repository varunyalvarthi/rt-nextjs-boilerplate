'use client';

import { useState, useEffect } from 'react';
import { Mic, MicOff, Trash2 } from 'lucide-react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

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
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognition);
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
      setIsListening(true);
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
