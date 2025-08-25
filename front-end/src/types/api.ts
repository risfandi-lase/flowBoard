// src/types/api.ts

export interface User {
  id: number;
  name: string;
  avatar: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  color: string;
  taskCount: number;
  members: User[];
}

export interface Task {
  id: number;
  projectId: number;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  category: string;
  categoryColor: string;
  borderColor: string;
  assignees: number[];
  assigneeDetails?: User[];
  createdAt: string;
}

export interface GroupedTasks {
  todo: Task[];
  'in-progress': Task[];
  completed: Task[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}