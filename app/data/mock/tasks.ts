import { Project, Task, ProjectMember } from '@/app/types/task';

const now = new Date();
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

export const mockMembers: ProjectMember[] = [
  {
    id: 'user1',
    name: 'John Doe',
    role: 'owner',
    email: 'john@example.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
  },
  {
    id: 'user2',
    name: 'Jane Smith',
    role: 'admin',
    email: 'jane@example.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'
  },
  {
    id: 'user3',
    name: 'Bob Wilson',
    role: 'member',
    email: 'bob@example.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob'
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
    assigneeId: 'user1',
    estimate: 8,
    timeSpent: 3,
    labels: ['voice', 'core-feature', 'ai'],
    createdAt: yesterday,
    updatedAt: now,
    comments: [
      {
        id: 1,
        content: 'Started implementation using Web Speech API',
        authorId: 'user1',
        createdAt: yesterday,
        updatedAt: yesterday
      }
    ],
    activity: [
      {
        id: 1,
        type: 'status_change',
        userId: 'user1',
        timestamp: now,
        oldValue: 'todo',
        newValue: 'in_progress',
        description: 'Task moved to In Progress'
      }
    ]
  },
  {
    id: 2,
    title: 'Design UI components',
    description: 'Create reusable UI components following the glassmorphic design system.',
    status: 'todo',
    priority: 'medium',
    type: 'task',
    projectId: 1,
    assigneeId: 'user2',
    estimate: 5,
    labels: ['ui', 'design'],
    createdAt: now,
    updatedAt: now
  },
  {
    id: 3,
    title: 'Fix microphone permissions bug',
    description: 'Address issue where microphone permissions are not being properly requested on first load.',
    status: 'backlog',
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
    key: 'DK',
    status: 'active',
    members: mockMembers,
    tasks: mockTasks,
    createdAt: yesterday,
    updatedAt: now
  }
];

export const mockData = {
  tasks: mockTasks,
  projects: mockProjects,
  members: mockMembers
};
