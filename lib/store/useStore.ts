import { create } from 'zustand';
import { Todo, Project } from '@/app/types/task';
import { ChatMessage } from '@/app/types/chat';
import { dummyTodos, dummyProjects } from '../constants/dummy-data';

interface StoreState {
  todos: Todo[];
  projects: Project[];
  chatMessages: ChatMessage[];
  activeChatTask: number | null;
  isChatOpen: boolean;
  error: string | null;
  
  // Task actions
  addTodo: (todo: Omit<Todo, 'id'>) => void;
  updateTodoStatus: (id: number) => void;
  deleteTodo: (id: number) => void;
  
  // Project actions
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: number, project: Partial<Project>) => void;
  deleteProject: (id: number) => void;
  
  // Chat actions
  addChatMessage: (text: string, taskId?: number) => void;
  setChatOpen: (isOpen: boolean) => void;
  setActiveChatTask: (taskId: number | null) => void;
  
  // Error handling
  setError: (error: string | null) => void;
}

export const useStore = create<StoreState>((set) => ({
  todos: dummyTodos,
  projects: dummyProjects,
  chatMessages: [],
  activeChatTask: null,
  isChatOpen: false,
  error: null,

  // Task actions
  addTodo: (todo) => set((state) => ({
    todos: [...state.todos, { ...todo, id: state.todos.length + 1 }]
  })),

  updateTodoStatus: (id) => set((state) => ({
    todos: state.todos.map((todo) => {
      if (todo.id === id) {
        const statusMap: Record<Todo['status'], Todo['status']> = {
          'pending': 'in_progress',
          'in_progress': 'completed',
          'completed': 'pending'
        };
        return { ...todo, status: statusMap[todo.status] };
      }
      return todo;
    })
  })),

  deleteTodo: (id) => set((state) => ({
    todos: state.todos.filter((todo) => todo.id !== id)
  })),

  // Project actions
  addProject: (project) => set((state) => ({
    projects: [...state.projects, { ...project, id: state.projects.length + 1 }]
  })),

  updateProject: (id, project) => set((state) => ({
    projects: state.projects.map((p) => 
      p.id === id ? { ...p, ...project } : p
    )
  })),

  deleteProject: (id) => set((state) => ({
    projects: state.projects.filter((p) => p.id !== id)
  })),

  // Chat actions
  addChatMessage: (text, taskId) => set((state) => ({
    chatMessages: [
      ...state.chatMessages,
      {
        id: state.chatMessages.length + 1,
        text,
        sender: 'user',
        timestamp: new Date(),
        taskId
      }
    ]
  })),

  setChatOpen: (isOpen) => set({ isChatOpen: isOpen }),
  
  setActiveChatTask: (taskId) => set({ activeChatTask: taskId }),

  // Error handling
  setError: (error) => set({ error })
}));
