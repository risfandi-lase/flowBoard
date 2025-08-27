// src/contexts/ApiContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockApi } from '../api/api'; // Now importing the real API
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
  createUser: (userData: Partial<User>) => Promise<User | null>;
  moveTask: (taskId: number, newStatus: 'todo' | 'in-progress' | 'completed') => Promise<void>;
  addMemberToProject: (projectId: number, userId: number) => Promise<void>;
  setCurrentProject: (project: Project) => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

// Hook to use the API context - exported separately
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
      console.log('Initializing data from real API...');
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
      console.log('Setting initial project:', projects[0]);
      setCurrentProject(projects[0]);
      loadTasks(projects[0].id);
    }
  }, [projects, users]);

  // Load projects
  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading projects from API...');
      
      const response = await mockApi.getProjects();
      if (response.success) {
        console.log('Projects loaded:', response.data);
        setProjects(response.data);
      } else {
        console.error('Failed to load projects:', response.error);
        setError(response.error || 'Failed to load projects');
      }
    } catch (err) {
      console.error('Error loading projects:', err);
      setError('Error loading projects');
    } finally {
      setLoading(false);
    }
  };

  // Load specific project
  const loadProject = async (projectId: number) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading project:', projectId);
      
      const response = await mockApi.getProject(projectId);
      if (response.success) {
        console.log('Project loaded:', response.data);
        setCurrentProject(response.data);
        await loadTasks(projectId);
      } else {
        console.error('Failed to load project:', response.error);
        setError(response.error || 'Failed to load project');
      }
    } catch (err) {
      console.error('Error loading project:', err);
      setError('Error loading project');
    } finally {
      setLoading(false);
    }
  };

  // Load tasks for a project
  const loadTasks = async (projectId: number) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading tasks for project:', projectId);
      
      const response = await mockApi.getTasks(projectId);
      if (response.success) {
        // Ensure all field conversions are applied consistently
        const convertTasks = (taskList: Task[]) => 
          taskList.map(task => ({
            ...task,
            projectId: task.project_id || task.projectId,
            categoryColor: task.category_color || task.categoryColor,
            borderColor: task.border_color || task.borderColor,
            createdAt: task.created_at || task.createdAt,
            updatedAt: task.updated_at || task.updatedAt,
            assigneeDetails: task.assignee_details || task.assigneeDetails || []
          }));

        const convertedTasks = {
          todo: convertTasks(response.data.todo || []),
          'in-progress': convertTasks(response.data['in-progress'] || []),
          completed: convertTasks(response.data.completed || [])
        };

        console.log('Tasks loaded and converted:', convertedTasks);
        setTasks(convertedTasks);
      } else {
        console.error('Failed to load tasks:', response.error);
        setError(response.error || 'Failed to load tasks');
      }
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError('Error loading tasks');
    } finally {
      setLoading(false);
    }
  };

  // Load users
  const loadUsers = async () => {
    try {
      console.log('Loading users from API...');
      
      const response = await mockApi.getUsers();
      if (response.success) {
        console.log('Users loaded:', response.data);
        setUsers(response.data);
      } else {
        console.error('Failed to load users:', response.error);
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
      console.log('Creating project:', projectData);
      
      const response = await mockApi.createProject(projectData);
      if (response.success) {
        console.log('Project created:', response.data);
        setProjects(prev => [...prev, response.data]);
      } else {
        console.error('Failed to create project:', response.error);
        setError(response.error || 'Failed to create project');
      }
    } catch (err) {
      console.error('Error creating project:', err);
      setError('Error creating project');
    } finally {
      setLoading(false);
    }
  };

  // Create new task
  const createTask = async (taskData: Partial<Task>) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Creating task:', taskData);
      
      const response = await mockApi.createTask(taskData);
      if (response.success) {
        console.log('Task created:', response.data);
        
        const newTask = response.data;
        
        setTasks(prev => ({
          ...prev,
          [newTask.status]: [...prev[newTask.status], newTask]
        }));
        
        // Update current project task count properly
        if (currentProject && currentProject.id === newTask.projectId) {
          const newTaskCount = (currentProject.taskCount || 0) + 1;
          setCurrentProject(prev => prev ? { ...prev, taskCount: newTaskCount } : null);
          setProjects(prev => prev.map(p => 
            p.id === newTask.projectId 
              ? { ...p, taskCount: newTaskCount }
              : p
          ));
        }
      } else {
        console.error('Failed to create task:', response.error);
        setError(response.error || 'Failed to create task');
      }
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Error creating task');
    } finally {
      setLoading(false);
    }
  };

  // Create new user
  const createUser = async (userData: Partial<User>): Promise<User | null> => {
    try {
      setLoading(true);
      setError(null);
      console.log('Creating user:', userData);
      
      const response = await mockApi.createUser(userData);
      if (response.success) {
        console.log('User created:', response.data);
        setUsers(prev => [...prev, response.data]);
        return response.data;
      } else {
        console.error('Failed to create user:', response.error);
        setError(response.error || 'Failed to create user');
        return null;
      }
    } catch (err) {
      console.error('Error creating user:', err);
      setError('Error creating user');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Move task between columns (drag and drop)
  const moveTask = async (taskId: number, newStatus: 'todo' | 'in-progress' | 'completed') => {
    try {
      setError(null);
      console.log('Moving task:', taskId, 'to', newStatus);
      
      // Optimistically update UI first - preserve assignee details
      let movedTask: Task | null = null;
      setTasks(prev => {
        const newTasks = { ...prev };
        
        // Find and remove task from current status
        for (const status of ['todo', 'in-progress', 'completed'] as const) {
          const taskIndex = newTasks[status].findIndex(t => t.id === taskId);
          if (taskIndex !== -1) {
            const originalTask = newTasks[status][taskIndex];
            movedTask = { 
              ...originalTask, 
              status: newStatus,
              // Preserve assignee details
              assigneeDetails: originalTask.assigneeDetails || []
            };
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
        console.error('Failed to move task:', response.error);
        // Revert on failure
        if (currentProject) {
          await loadTasks(currentProject.id);
        }
        setError(response.error || 'Failed to move task');
      } else {
        console.log('Task moved successfully');
      }
    } catch (err) {
      console.error('Error moving task:', err);
      // Revert on error
      if (currentProject) {
        await loadTasks(currentProject.id);
      }
      setError('Error moving task');
    }
  };

  // Add member to project
  const addMemberToProject = async (projectId: number, userId: number) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Adding member to project:', { projectId, userId });
      
      const response = await mockApi.addMemberToProject(projectId, userId);
      if (response.success) {
        console.log('Member added to project:', response.data);
        // Update projects state
        setProjects(prev => prev.map(p => 
          p.id === projectId ? response.data : p
        ));
        // Update current project if it's the one being updated
        if (currentProject && currentProject.id === projectId) {
          setCurrentProject(response.data);
        }
      } else {
        console.error('Failed to add member to project:', response.error);
        setError(response.error || 'Failed to add member to project');
      }
    } catch (err) {
      console.error('Error adding member to project:', err);
      setError('Error adding member to project');
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
    createUser,
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

// Default export
export default ApiProvider;