// src/api/mockApi.ts

// Mock data structure
let mockData: MockData = {
  projects: [
    { 
      id: 1, 
      title: "Website Redesign", 
      description: "Complete redesign of the company website to improve user experience, increase conversions, and modernize our digital presence. Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio molestiae natus id autem similique corrupti nihil debitis dicta culpa, perspiciatis dolore assumenda veritatis labore quo suscipit saepe enim neque accusamus.",
      color: "bg-warning", 
      taskCount: 5,
      members: [
        { id: 1, name: "Sarah Miller", avatar: "/src/assets/sarah.jpg" },
        { id: 2, name: "Alex Johnson", avatar: "/src/assets/alex.jpeg" },
        { id: 3, name: "Mike Kim", avatar: "/src/assets/mike.jpg" },
        { id: 4, name: "Rachel Foster", avatar: "/src/assets/rachel.jpg" }
      ]
    },
    { 
      id: 2, 
      title: "SAAS For Hospital", 
      description: "Developing a comprehensive hospital management system",
      color: "bg-success", 
      taskCount: 12,
      members: []
    },
    { 
      id: 3, 
      title: "Campaign Website", 
      description: "Marketing campaign website for new product launch",
      color: "bg-error", 
      taskCount: 0,
      members: []
    },
   
  ],
  
  tasks: [
    // TO DO tasks
    {
      id: 1,
      projectId: 1,
      title: "Create wireframes for homepage",
      description: "Design the basic layout and structure for the new homepage including header, hero section, features, and footer",
      status: "todo",
      category: "DESIGN",
      categoryColor: "badge-info",
      borderColor: "border-amber-300",
      assignees: [2, 3], // Alex, Mike
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      projectId: 1,
      title: "Set up development environment",
      description: "Configure React, TypeScript, Tailwind CSS, and testing framework for the new website build",
      status: "todo",
      category: "DEVELOPMENT",
      categoryColor: "badge-warning",
      borderColor: "border-red-300",
      assignees: [1, 2, 3, 4], // All users
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      projectId: 1,
      title: "User research and interviews",
      description: "Conduct comprehensive interviews with 15 users to understand current pain points and gather feedback on proposed changes",
      status: "todo",
      category: "RESEARCH",
      categoryColor: "badge-error",
      borderColor: "border-blue-300",
      assignees: [3, 4], // Mike, Rachel
      createdAt: new Date().toISOString()
    },
    
    // IN PROGRESS tasks
    {
      id: 4,
      projectId: 1,
      title: "Implement user authentication",
      description: "Set up OAuth integration and user session management. Resolve layout problems on mobile devices",
      status: "in-progress",
      category: "BUG",
      categoryColor: "badge-success",
      borderColor: "border-blue-300",
      assignees: [3, 4], // Mike, Rachel
      createdAt: new Date().toISOString()
    },
    
    // COMPLETED tasks
    {
      id: 5,
      projectId: 1,
      title: "Create wireframes for homepage",
      description: "Design the basic layout and structure for the new homepage including header, hero section, features, and footer",
      status: "completed",
      category: "MEETING",
      categoryColor: "badge-neutral",
      borderColor: "border-amber-300",
      assignees: [1, 2, 3, 4], // All users
      createdAt: new Date().toISOString()
    },
    {
      id: 6,
      projectId: 1,
      title: "Set up development environment",
      description: "Configure React, TypeScript, Tailwind CSS, and testing framework for the new website build",
      status: "completed",
      category: "DEVELOPMENT",
      categoryColor: "badge-warning",
      borderColor: "border-red-300",
      assignees: [4], // Rachel
      createdAt: new Date().toISOString()
    }
  ],
  
  users: [
    { id: 1, name: "Sarah Miller", avatar: "/src/assets/sarah.jpg" },
    { id: 2, name: "Alex Johnson", avatar: "/src/assets/alex.jpeg" },
    { id: 3, name: "Mike Kim", avatar: "/src/assets/mike.jpg" },
    { id: 4, name: "Rachel Foster", avatar: "/src/assets/rachel.jpg" }
  ]
};

// Helper function to simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions with proper typing
export const mockApi = {
  // Projects
  getProjects: async (): Promise<ApiResponse<Project[]>> => {
    await delay();
    return { success: true, data: mockData.projects };
  },

  getProject: async (projectId: number): Promise<ApiResponse<Project>> => {
    await delay();
    const project = mockData.projects.find(p => p.id === projectId);
    if (!project) {
      return { success: false, error: "Project not found" };
    }
    return { success: true, data: project };
  },

  createProject: async (projectData: Partial<Project>): Promise<ApiResponse<Project>> => {
    await delay();
    const newProject: Project = {
      id: Date.now(),
      title: projectData.title || '',
      description: projectData.description || '',
      color: projectData.color || 'bg-warning',
      taskCount: 0,
      members: [],
      ...projectData
    };
    mockData.projects.push(newProject);
    return { success: true, data: newProject };
  },

  updateProject: async (projectId: number, updates: Partial<Project>): Promise<ApiResponse<Project>> => {
    await delay();
    const projectIndex = mockData.projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      return { success: false, error: "Project not found" };
    }
    mockData.projects[projectIndex] = { ...mockData.projects[projectIndex], ...updates };
    return { success: true, data: mockData.projects[projectIndex] };
  },

  deleteProject: async (projectId: number): Promise<ApiResponse<void>> => {
    await delay();
    const projectIndex = mockData.projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      return { success: false, error: "Project not found" };
    }
    mockData.projects.splice(projectIndex, 1);
    // Also delete all tasks for this project
    mockData.tasks = mockData.tasks.filter(t => t.projectId !== projectId);
    return { success: true };
  },

  // Tasks
  getTasks: async (projectId: number): Promise<ApiResponse<GroupedTasks>> => {
    await delay();
    const tasks = mockData.tasks.filter(t => t.projectId === projectId);
    
    // Group tasks by status
    const groupedTasks: GroupedTasks = {
      todo: tasks.filter(t => t.status === 'todo'),
      'in-progress': tasks.filter(t => t.status === 'in-progress'),
      completed: tasks.filter(t => t.status === 'completed')
    };
    
    return { success: true, data: groupedTasks };
  },

  getTask: async (taskId: number): Promise<ApiResponse<Task>> => {
    await delay();
    const task = mockData.tasks.find(t => t.id === taskId);
    if (!task) {
      return { success: false, error: "Task not found" };
    }
    
    // Add assignee details
    const taskWithAssignees: Task = {
      ...task,
      assigneeDetails: task.assignees.map(userId => 
        mockData.users.find(u => u.id === userId)
      ).filter(Boolean) as User[]
    };
    
    return { success: true, data: taskWithAssignees };
  },

  createTask: async (taskData: Partial<Task>): Promise<ApiResponse<Task>> => {
    await delay();
    const newTask: Task = {
      id: Date.now(),
      projectId: taskData.projectId || 1,
      title: taskData.title || '',
      description: taskData.description || '',
      status: taskData.status || 'todo',
      category: taskData.category || 'DESIGN',
      categoryColor: taskData.categoryColor || 'badge-info',
      borderColor: taskData.borderColor || 'border-amber-300',
      assignees: taskData.assignees || [],
      createdAt: new Date().toISOString(),
      ...taskData
    };
    mockData.tasks.push(newTask);
    
    // Update project task count
    const project = mockData.projects.find(p => p.id === newTask.projectId);
    if (project) {
      project.taskCount += 1;
    }
    
    return { success: true, data: newTask };
  },

  updateTask: async (taskId: number, updates: Partial<Task>): Promise<ApiResponse<Task>> => {
    await delay();
    const taskIndex = mockData.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      return { success: false, error: "Task not found" };
    }
    mockData.tasks[taskIndex] = { ...mockData.tasks[taskIndex], ...updates };
    return { success: true, data: mockData.tasks[taskIndex] };
  },

  // Drag and drop - update task status
  moveTask: async (taskId: number, newStatus: 'todo' | 'in-progress' | 'completed'): Promise<ApiResponse<Task>> => {
    await delay();
    const taskIndex = mockData.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      return { success: false, error: "Task not found" };
    }
    
    mockData.tasks[taskIndex].status = newStatus;
    return { success: true, data: mockData.tasks[taskIndex] };
  },

  deleteTask: async (taskId: number): Promise<ApiResponse<void>> => {
    await delay();
    const taskIndex = mockData.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      return { success: false, error: "Task not found" };
    }
    
    const task = mockData.tasks[taskIndex];
    mockData.tasks.splice(taskIndex, 1);
    
    // Update project task count
    const project = mockData.projects.find(p => p.id === task.projectId);
    if (project && project.taskCount > 0) {
      project.taskCount -= 1;
    }
    
    return { success: true };
  },

  // Users
  getUsers: async (): Promise<ApiResponse<User[]>> => {
    await delay();
    return { success: true, data: mockData.users };
  },

  // Add member to project
  addMemberToProject: async (projectId: number, userId: number): Promise<ApiResponse<Project>> => {
    await delay();
    const project = mockData.projects.find(p => p.id === projectId);
    const user = mockData.users.find(u => u.id === userId);
    
    if (!project || !user) {
      return { success: false, error: "Project or user not found" };
    }
    
    if (!project.members.find(m => m.id === user.id)) {
      project.members.push(user);
    }
    
    return { success: true, data: project };
  },

  // Remove member from project
  removeMemberFromProject: async (projectId: number, userId: number): Promise<ApiResponse<Project>> => {
    await delay();
    const project = mockData.projects.find(p => p.id === projectId);
    
    if (!project) {
      return { success: false, error: "Project not found" };
    }
    
    project.members = project.members.filter(m => m.id !== userId);
    return { success: true, data: project };
  }
};

// Export default for convenience
export default mockApi;