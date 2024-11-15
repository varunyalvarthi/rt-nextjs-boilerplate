export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskType = 'task' | 'bug' | 'feature' | 'improvement';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  type: TaskType;
  priority: TaskPriority;
  projectId: number;
  createdAt: Date;
  updatedAt: Date;
  labels: string[];
  estimate?: number; // in hours
  timeSpent?: number; // in hours
  assigneeId?: number;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  members: number[]; // Member IDs
  tasks: number[]; // Task IDs
}

export interface ProjectMember {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: Date;
}

export interface TaskComment {
  id: number;
  taskId: number;
  authorId: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  attachments?: string[]; // URLs to attached files
}
