export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Todo {
  id: number;
  text: string;
  status: TaskStatus;
  projectId?: number;
  timestamp: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  color?: string;
  tasks: Todo[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskFilter {
  status?: TaskStatus;
  projectId?: number;
  priority?: Todo['priority'];
  tags?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}
