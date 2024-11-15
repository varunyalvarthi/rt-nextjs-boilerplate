import { Project, Task, ProjectMember, TaskComment } from '@/app/types/task';

const now = new Date();
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

export const mockMembers: ProjectMember[] = [
  {
    id: 1,
    name: 'John Doe',
    role: 'owner',
    email: 'john@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    joinedAt: yesterday
  },
  {
    id: 2,
    name: 'Jane Smith',
    role: 'admin',
    email: 'jane@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    joinedAt: yesterday
  },
  {
    id: 3,
    name: 'Bob Wilson',
    role: 'member',
    email: 'bob@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    joinedAt: now
  }
];

export const mockComments: TaskComment[] = [
  {
    id: 1,
    taskId: 1,
    content: 'Started implementation using Web Speech API',
    authorId: 1,
    createdAt: yesterday,
    updatedAt: yesterday
  }
];

export const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Implement voice command system',
    description: 'Create a robust voice command system that can understand and process natural language instructions for task management.',
    status: 'in_progress',
    priority: 'high',
    type: 'feature',
    projectId: 1,
    assigneeId: 1,
    estimate: 8,
    timeSpent: 3,
    labels: ['voice', 'core-feature', 'ai'],
    createdAt: yesterday,
    updatedAt: now
  },
  {
    id: 2,
    title: 'Design UI components',
    description: 'Create reusable UI components following the glassmorphic design system.',
    status: 'todo',
    priority: 'medium',
    type: 'task',
    projectId: 1,
    assigneeId: 2,
    estimate: 5,
    labels: ['ui', 'design'],
    createdAt: now,
    updatedAt: now
  },
  {
    id: 3,
    title: 'Fix microphone permissions bug',
    description: 'Address issue where microphone permissions are not being properly requested on first load.',
    status: 'todo',
    priority: 'urgent',
    type: 'bug',
    projectId: 1,
    labels: ['bug', 'voice', 'permissions'],
    createdAt: now,
    updatedAt: now
  }
];

export const mockProjects: Project[] = [
  {
    id: 1,
    name: 'DeepKaam',
    description: 'Voice-powered project management application',
    color: 'emerald',
    members: [1, 2, 3],
    tasks: [1, 2, 3],
    createdAt: yesterday,
    updatedAt: now
  }
];

export const mockData = {
  tasks: mockTasks,
  projects: mockProjects,
  members: mockMembers
};
