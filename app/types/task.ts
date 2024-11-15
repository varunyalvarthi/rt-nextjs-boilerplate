export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Todo {
  id: number;
  text: string;
  status: TaskStatus;
  projectId?: number;
}

export interface Project {
  id: number;
  name: string;
  tasks: Todo[];
}
