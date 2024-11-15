export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskType = 'feature' | 'bug' | 'task' | 'story';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;
  projectId: number;
  assigneeId?: string;
  estimate?: number;
  timeSpent?: number;
  labels: string[];
  createdAt: Date;
  updatedAt: Date;
  comments?: Comment[];
  attachments?: Attachment[];
  activity?: ActivityLog[];
}

export interface Project {
  id: number;
  name: string;
  description: string;
  key: string;
  status: 'active' | 'archived' | 'completed';
  members: ProjectMember[];
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectMember {
  id: string;
  name: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  avatarUrl?: string;
  email: string;
}

export interface Comment {
  id: number;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  attachments?: Attachment[];
}

export interface Attachment {
  id: number;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface ActivityLog {
  id: number;
  type: 'status_change' | 'priority_change' | 'assignment' | 'comment' | 'attachment' | 'estimate_change';
  userId: string;
  timestamp: Date;
  oldValue?: string;
  newValue?: string;
  description: string;
}
