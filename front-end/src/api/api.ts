// src/api/api.ts
import axios from 'axios';
import type { User, Project, Task, GroupedTasks, ApiResponse } from '../types/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Helper function to simulate delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Real API functions
export const realApi = {
  // Users
  getUsers: async (): Promise<ApiResponse<User[]>> => {
    try {
      await delay(300);
      const response = await api.get('/users');
      return { success: true, data: response.data.data };
    } catch (error: any) {
      console.error('Error fetching users:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to fetch users' };
    }
  },

  createUser: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    try {
      await delay(300);
      const response = await api.post('/users', userData);
      return { success: true, data: response.data.data };
    } catch (error: any) {
      console.error('Error creating user:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to create user' };
    }
  },

  // Projects
  getProjects: async (): Promise<ApiResponse<Project[]>> => {
    try {
      await delay(300);
      const response = await api.get('/projects');
      const convertedProjects = response.data.data.map((project: any) => ({
        ...project,
        taskCount: parseInt(project.task_count || project.taskCount || '0', 10) || 0
      }));
      return { success: true, data: convertedProjects };
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to fetch projects' };
    }
  },

  getProject: async (projectId: number): Promise<ApiResponse<Project>> => {
    try {
      await delay(300);
      const response = await api.get(`/projects/${projectId}`);
      return { success: true, data: response.data.data };
    } catch (error: any) {
      console.error('Error fetching project:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to fetch project' };
    }
  },

  createProject: async (projectData: Partial<Project>): Promise<ApiResponse<Project>> => {
    try {
      await delay(300);
      const response = await api.post('/projects', projectData);
      return { success: true, data: response.data.data };
    } catch (error: any) {
      console.error('Error creating project:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to create project' };
    }
  },

  deleteProject: async (projectId: number): Promise<ApiResponse<void>> => {
    try {
      await delay(300);
      await api.delete(`/projects/${projectId}`);
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting project:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to delete project' };
    }
  },

  addMemberToProject: async (projectId: number, userId: number): Promise<ApiResponse<Project>> => {
    try {
      await delay(300);
      const response = await api.post(`/projects/${projectId}/members`, { user_id: userId });
      return { success: true, data: response.data.data };
    } catch (error: any) {
      console.error('Error adding member to project:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to add member to project' };
    }
  },

  // Tasks
  getTasks: async (projectId: number): Promise<ApiResponse<GroupedTasks>> => {
    try {
      await delay(300);
      const response = await api.get(`/tasks?project_id=${projectId}`);
      
      const convertTasks = (taskList: any[]) => 
        taskList.map((task: any) => ({
          ...task,
          projectId: task.project_id,
          categoryColor: task.category_color,
          borderColor: task.border_color,
          createdAt: task.created_at,
          updatedAt: task.updated_at,
          assigneeDetails: task.assignee_details || []
        }));

      const convertedData = {
        todo: convertTasks(response.data.data.todo || []),
        'in-progress': convertTasks(response.data.data['in-progress'] || []),
        completed: convertTasks(response.data.data.completed || [])
      };

      return { success: true, data: convertedData };
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to fetch tasks' };
    }
  },

  createTask: async (taskData: Partial<Task>): Promise<ApiResponse<Task>> => {
    try {
      await delay(300);
      const response = await api.post('/tasks', {
        project_id: taskData.projectId,
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        category: taskData.category,
        category_color: taskData.categoryColor,
        border_color: taskData.borderColor,
        assignees: taskData.assignees || []
      });
      
      const task = response.data.data;
      const convertedTask = {
        ...task,
        projectId: task.project_id,
        categoryColor: task.category_color,
        borderColor: task.border_color,
        createdAt: task.created_at,
        updatedAt: task.updated_at,
        assigneeDetails: task.assignee_details || []
      };
      
      return { success: true, data: convertedTask };
    } catch (error: any) {
      console.error('Error creating task:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to create task' };
    }
  },

  moveTask: async (taskId: number, newStatus: 'todo' | 'in-progress' | 'completed'): Promise<ApiResponse<Task>> => {
    try {
      await delay(300);
      const response = await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      return { success: true, data: response.data.data };
    } catch (error: any) {
      console.error('Error moving task:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to move task' };
    }
  },

  deleteTask: async (taskId: number): Promise<ApiResponse<void>> => {
    try {
      await delay(300);
      await api.delete(`/tasks/${taskId}`);
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting task:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to delete task' };
    }
  }
};

// Export with proper naming
export const mockApi = realApi;
export default realApi;