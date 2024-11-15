import { StateCreator } from 'zustand';
import { Project, Task, TaskStatus, TaskPriority, ProjectMember } from '@/app/types/task';
import { mockData } from '@/app/data/mock/tasks';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: number;
  assigneeId?: string;
  labels?: string[];
}

export interface Project {
  id: number;
  name: string;
  description: string;
  tasks: Task[];
}

export interface ProjectMember {
  id: string;
  name: string;
}

export interface TaskSlice {
  // State
  todos: Task[];
  projects: Project[];
  members: ProjectMember[];
  isLoading: boolean;
  activeChatTask: number | null;
  activeProject: number | null;
  filters: {
    status?: TaskStatus[];
    priority?: TaskPriority[];
    assignee?: string[];
    labels?: string[];
  };

  // Actions
  setActiveChatTask: (taskId: number | null) => void;
  setActiveProject: (projectId: number | null) => void;
  updateTaskStatus: (taskId: number, status: TaskStatus) => void;
  updateTaskPriority: (taskId: number, priority: TaskPriority) => void;
  assignTask: (taskId: number, memberId: string) => void;
  addTaskLabel: (taskId: number, label: string) => void;
  removeTaskLabel: (taskId: number, label: string) => void;
  updateFilters: (filters: Partial<TaskSlice['filters']>) => void;
}

export const createTaskSlice: StateCreator<TaskSlice> = (set, get) => ({
  // Initial state with null checks
  todos: mockData?.tasks || [],
  projects: mockData?.projects || [],
  members: mockData?.members || [],
  isLoading: false,
  activeChatTask: null,
  activeProject: mockData?.projects?.[0]?.id || null,
  filters: {},

  // Actions
  setActiveChatTask: (taskId) => set({ activeChatTask: taskId }),
  
  setActiveProject: (projectId) => set({ activeProject: projectId }),
  
  updateTaskStatus: (taskId, status) => set(state => ({
    todos: state.todos.map(todo =>
      todo.id === taskId ? { ...todo, status, updatedAt: new Date() } : todo
    )
  })),
  
  updateTaskPriority: (taskId, priority) => set(state => ({
    todos: state.todos.map(todo =>
      todo.id === taskId ? { ...todo, priority, updatedAt: new Date() } : todo
    )
  })),
  
  assignTask: (taskId, memberId) => set(state => ({
    todos: state.todos.map(todo =>
      todo.id === taskId ? { ...todo, assigneeId: memberId, updatedAt: new Date() } : todo
    )
  })),
  
  addTaskLabel: (taskId, label) => set(state => ({
    todos: state.todos.map(todo =>
      todo.id === taskId
        ? { 
            ...todo, 
            labels: [...new Set([...(todo.labels || []), label])],
            updatedAt: new Date() 
          }
        : todo
    )
  })),
  
  removeTaskLabel: (taskId, label) => set(state => ({
    todos: state.todos.map(todo =>
      todo.id === taskId
        ? { 
            ...todo, 
            labels: (todo.labels || []).filter(l => l !== label),
            updatedAt: new Date() 
          }
        : todo
    )
  })),
  
  updateFilters: (filters) => set(state => ({
    filters: { ...state.filters, ...filters }
  }))
});
