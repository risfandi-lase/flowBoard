// src/contexts/ApiContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockApi } from '../api/mockApi';
import type { User, Project, Task, GroupedTasks } from '../types/api';

interface ApiContextType {
  // State
  projects: Project[];
  currentProject: Project | null;
  tasks: GroupedTasks;
  users: User[];
  loading: boolean;
  error: string | null;

  // Actions
  loadProjects: () => Promise<void>;
  loadProject: (projectId: number) => Promise<void>;
  loadTasks: (projectId: number) => Promise<void>;
  createProject: (projectData: Partial<Project>) => Promise<void>;
  createTask: (taskData: Partial<Task>) => Promise<void>;
  moveTask: (taskId: number, newStatus: 'todo' | 'in-progress' | 'completed') => Promise<void>;
  addMemberToProject: (projectId: number, userId: number) => Promise<void>;
  setCurrentProject: (project: Project) => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

// Hook to use the API context
export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

// Provider component
interface ApiProviderProps {
  children: ReactNode;
}

export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<GroupedTasks>({
    todo: [],
    'in-progress': [],
    completed: []
  });
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    const initializeData = async () => {
      // Load users first
      await loadUsers();
      // Then load projects
      await loadProjects();
    };
    
    initializeData();
  }, []);

  // Load projects and set initial project
  useEffect(() => {
    if (projects.length > 0 && !currentProject && users.length > 0) {
      setCurrentProject(projects[0]);
      loadTasks(projects[0].id);
    }
  }, [projects, users]);

  // Load projects
  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await mockApi.getProjects();
      if (response.success) {
        setProjects(response.data);
      } else {
        setError('Failed to load projects');
      }
    } catch (err) {
      setError('Error loading projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load specific project
  const loadProject = async (projectId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await mockApi.getProject(projectId);
      if (response.success) {
        setCurrentProject(response.data);
        await loadTasks(projectId);
      } else {
        setError(response.error || 'Failed to load project');
      }
    } catch (err) {
      setError('Error loading project');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load tasks for a project
  const loadTasks = async (projectId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await mockApi.getTasks(projectId);
      if (response.success) {
        // Add assignee details to tasks - make sure users are loaded first
        const addAssigneeDetails = (task: Task): Task => {
          const assigneeDetails = task.assignees.map(userId => 
            users.find(u => u.id === userId)
          ).filter(Boolean) as User[];
          
          return { ...task, assigneeDetails };
        };

        const tasksWithDetails = {
          todo: response.data.todo.map(addAssigneeDetails),
          'in-progress': response.data['in-progress'].map(addAssigneeDetails),
          completed: response.data.completed.map(addAssigneeDetails)
        };
        setTasks(tasksWithDetails);
      } else {
        setError('Failed to load tasks');
      }
    } catch (err) {
      setError('Error loading tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load users
  const loadUsers = async () => {
    try {
      const response = await mockApi.getUsers();
      if (response.success) {
        setUsers(response.data);
      }
    } catch (err) {
      console.error('Error loading users:', err);
    }
  };

  // Create new project
  const createProject = async (projectData: Partial<Project>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await mockApi.createProject(projectData);
      if (response.success) {
        setProjects(prev => [...prev, response.data]);
      } else {
        setError('Failed to create project');
      }
    } catch (err) {
      setError('Error creating project');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Create new task
  const createTask = async (taskData: Partial<Task>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await mockApi.createTask(taskData);
      if (response.success) {
        // Add assignee details to the new task
        const assigneeDetails = response.data.assignees.map(userId => 
          users.find(u => u.id === userId)
        ).filter(Boolean) as User[];
        
        const newTask = { ...response.data, assigneeDetails };
        
        setTasks(prev => ({
          ...prev,
          [response.data.status]: [...prev[response.data.status], newTask]
        }));
        
        // Update current project task count
        if (currentProject && currentProject.id === response.data.projectId) {
          setCurrentProject(prev => prev ? { ...prev, taskCount: prev.taskCount + 1 } : null);
          setProjects(prev => prev.map(p => 
            p.id === response.data.projectId 
              ? { ...p, taskCount: p.taskCount + 1 }
              : p
          ));
        }
      } else {
        setError('Failed to create task');
      }
    } catch (err) {
      setError('Error creating task');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Move task between columns (drag and drop)
  const moveTask = async (taskId: number, newStatus: 'todo' | 'in-progress' | 'completed') => {
    try {
      setError(null);
      
      // Optimistically update UI first
      let movedTask: Task | null = null;
      setTasks(prev => {
        const newTasks = { ...prev };
        
        // Find and remove task from current status
        for (const status of ['todo', 'in-progress', 'completed'] as const) {
          const taskIndex = newTasks[status].findIndex(t => t.id === taskId);
          if (taskIndex !== -1) {
            movedTask = { ...newTasks[status][taskIndex], status: newStatus };
            newTasks[status] = newTasks[status].filter(t => t.id !== taskId);
            break;
          }
        }
        
        // Add task to new status
        if (movedTask) {
          newTasks[newStatus] = [...newTasks[newStatus], movedTask];
        }
        
        return newTasks;
      });

      // Then update on server
      const response = await mockApi.moveTask(taskId, newStatus);
      if (!response.success) {
        // Revert on failure
        if (currentProject) {
          await loadTasks(currentProject.id);
        }
        setError('Failed to move task');
      }
    } catch (err) {
      // Revert on error
      if (currentProject) {
        await loadTasks(currentProject.id);
      }
      setError('Error moving task');
      console.error(err);
    }
  };

  // Add member to project
  const addMemberToProject = async (projectId: number, userId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await mockApi.addMemberToProject(projectId, userId);
      if (response.success) {
        // Update projects state
        setProjects(prev => prev.map(p => 
          p.id === projectId ? response.data : p
        ));
        // Update current project if it's the one being updated
        if (currentProject && currentProject.id === projectId) {
          setCurrentProject(response.data);
        }
      } else {
        setError('Failed to add member to project');
      }
    } catch (err) {
      setError('Error adding member to project');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const value: ApiContextType = {
    // State
    projects,
    currentProject,
    tasks,
    users,
    loading,
    error,

    // Actions
    loadProjects,
    loadProject,
    loadTasks,
    createProject,
    createTask,
    moveTask,
    addMemberToProject,
    setCurrentProject
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
};

export default ApiProvider;