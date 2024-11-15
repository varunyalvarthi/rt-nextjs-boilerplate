import { Todo, Project } from '@/app/types/task';

export const dummyTodos: Todo[] = [
  {
    id: 1,
    text: "Complete project proposal",
    status: "pending",
    projectId: 1
  },
  {
    id: 2,
    text: "Review code changes",
    status: "in_progress",
    projectId: 1
  },
  {
    id: 3,
    text: "Update documentation",
    status: "completed",
    projectId: 2
  }
];

export const dummyProjects: Project[] = [
  {
    id: 1,
    name: "Website Redesign",
    tasks: dummyTodos.filter(todo => todo.projectId === 1)
  },
  {
    id: 2,
    name: "Mobile App",
    tasks: dummyTodos.filter(todo => todo.projectId === 2)
  }
];
