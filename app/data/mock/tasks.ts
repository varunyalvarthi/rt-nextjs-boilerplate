import { Project, Todo, TaskStatus } from '@/app/types';

export const mockProjects: Project[] = [
  {
    id: 1,
    name: 'Personal Tasks',
    tasks: []
  },
  {
    id: 2,
    name: 'Work Projects',
    tasks: []
  }
];

export const mockTodos: Todo[] = [
  {
    id: 1,
    text: 'Complete the project documentation',
    status: 'pending' as TaskStatus,
    projectId: 1,
    timestamp: new Date().toISOString()
  },
  {
    id: 2,
    text: 'Review pull requests',
    status: 'in_progress' as TaskStatus,
    projectId: 2,
    timestamp: new Date().toISOString()
  }
];
