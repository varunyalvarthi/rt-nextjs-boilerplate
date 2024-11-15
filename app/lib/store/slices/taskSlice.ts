import { StateCreator } from 'zustand';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  projectId: number;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  tasks: Task[];
}

export interface TaskSlice {
  todos: Task[];
  projects: Project[];
  isLoading: boolean;
  activeChatTask: number | null;
  setActiveChatTask: (taskId: number | null) => void;
}

// Mock data
const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Implement voice commands',
    description: 'Add voice command functionality to the app',
    status: 'in_progress',
    projectId: 1
  },
  {
    id: 2,
    title: 'Design UI components',
    description: 'Create reusable UI components',
    status: 'completed',
    projectId: 1
  }
];

const mockProjects: Project[] = [
  {
    id: 1,
    name: 'DeepKaam App',
    description: 'Voice-powered task management application',
    tasks: mockTasks
  }
];

export const createTaskSlice: StateCreator<TaskSlice> = (set) => ({
  todos: mockTasks,
  projects: mockProjects,
  isLoading: false,
  activeChatTask: null,
  setActiveChatTask: (taskId) => set({ activeChatTask: taskId })
});
