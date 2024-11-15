import { Project, Todo, TaskStatus } from '@/app/types';
import { mockProjects, mockTodos } from '../mock/tasks';

// In a real application, these would be API calls
export const taskService = {
  async getTodos(): Promise<Todo[]> {
    return mockTodos;
  },

  async getProjects(): Promise<Project[]> {
    return mockProjects;
  },

  async createTodo(text: string, projectId?: number): Promise<Todo> {
    const newTodo: Todo = {
      id: Math.max(...mockTodos.map(t => t.id)) + 1,
      text,
      status: 'pending',
      projectId,
      timestamp: new Date().toISOString()
    };
    mockTodos.push(newTodo);
    return newTodo;
  },

  async updateTodoStatus(id: number, status: TaskStatus): Promise<Todo> {
    const todo = mockTodos.find(t => t.id === id);
    if (!todo) throw new Error('Todo not found');
    todo.status = status;
    return todo;
  },

  async deleteTodo(id: number): Promise<void> {
    const index = mockTodos.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Todo not found');
    mockTodos.splice(index, 1);
  },

  async createProject(name: string): Promise<Project> {
    const newProject: Project = {
      id: Math.max(...mockProjects.map(p => p.id)) + 1,
      name,
      tasks: []
    };
    mockProjects.push(newProject);
    return newProject;
  },

  async deleteProject(id: number): Promise<void> {
    const index = mockProjects.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Project not found');
    // Also delete all todos associated with this project
    const projectTodos = mockTodos.filter(t => t.projectId === id);
    projectTodos.forEach(todo => {
      const todoIndex = mockTodos.findIndex(t => t.id === todo.id);
      if (todoIndex !== -1) mockTodos.splice(todoIndex, 1);
    });
    mockProjects.splice(index, 1);
  }
};
