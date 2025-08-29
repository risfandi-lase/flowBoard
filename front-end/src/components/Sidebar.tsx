// src/components/Sidebar.tsx
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { useApi } from "../contexts/ApiContext";
import type { Project } from "../types/api";

function Sidebar() {
  const { projects, currentProject, loadProject, createProject, deleteProject, setCurrentProject, loading } = useApi();
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [newProjectData, setNewProjectData] = useState({
    title: "",
    description: ""
  });
  const [showDeleteMenu, setShowDeleteMenu] = useState<number | null>(null);

  const colors = [
    "bg-warning",
    "bg-success", 
    "bg-error",
    "bg-info",
    "bg-primary",
    "bg-secondary"
  ];

  // Function to get a random color
  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleProjectClick = async (project: Project) => {
    if (loading) return; // Prevent clicks during loading
    setCurrentProject(project);
    await loadProject(project.id);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectData.title.trim() && !loading) {
      await createProject({
        ...newProjectData,
        color: getRandomColor() // Randomly assign color
      });
      setNewProjectData({ title: "", description: "" });
      setShowNewProjectForm(false);
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      await deleteProject(projectId);
    }
    setShowDeleteMenu(null);
  };

  const handleRightClick = (e: React.MouseEvent, projectId: number) => {
    e.preventDefault();
    setShowDeleteMenu(showDeleteMenu === projectId ? null : projectId);
  };

  // Close delete menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setShowDeleteMenu(null);
    };
    
    if (showDeleteMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showDeleteMenu]);

  return (
    <div className="bg-base-100 py-2 w-72 h-full rounded-4xl border border-gray-200 shadow-xl flex flex-col">
      <div className="flex-1 px-4">
        <button 
          className={`btn mt-6 w-full ${loading ? 'btn-disabled' : 'btn-primary shadow-md '}`}
          onClick={() => !loading && setShowNewProjectForm(!showNewProjectForm)}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Creating...
            </>
          ) : (
            <>
              <Icon icon="ic:baseline-plus" width="20" style={{ color: " #fff" }} />
              <p className="text-white">New Project</p>
            </>
          )}
        </button>

        {/* New Project Form */}
        {showNewProjectForm && (
          <form onSubmit={handleCreateProject} className="mt-4 space-y-3">
            <input
              type="text"
              placeholder="Project title"
              className="input input-bordered w-full input-sm"
              value={newProjectData.title}
              onChange={(e) => setNewProjectData(prev => ({ ...prev, title: e.target.value }))}
              required
              disabled={loading}
            />
            <textarea
              placeholder="Project description"
              className="textarea textarea-bordered w-full textarea-sm"
              value={newProjectData.description}
              onChange={(e) => setNewProjectData(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
              disabled={loading}
            />
            <div className="flex gap-2">
              <button 
                type="submit" 
                className={`btn btn-sm flex-1 ${loading ? 'btn-disabled' : 'btn-primary'}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Creating...
                  </>
                ) : (
                  "Create"
                )}
              </button>
              <button 
                type="button" 
                className="btn btn-ghost btn-sm flex-1"
                onClick={() => setShowNewProjectForm(false)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <p className="mt-10 font-semibold text-[#342e60]">PROJECTS</p>

        <div className="mt-2 flex flex-col gap-5">
          {projects.map((project) => (
            <div
              key={project.id}
              className="relative"
            >
              <div
                className={`flex items-center gap-2 hover:bg-primary/20 hover:rounded p-2 rounded cursor-pointer transition-colors ${
                  currentProject?.id === project.id ? 'bg-primary text-white' : ''
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => handleProjectClick(project)}
                onContextMenu={(e) => handleRightClick(e, project.id)}
              >
                <div className={`w-2 h-2 ${project.color} rounded-full`}></div>
                <p className="flex-1 truncate">{project.title}</p>
                <span className="ml-auto  px-2 text-white bg-primary/30 rounded text-xs">{project.taskCount || 0}</span>
                
                {/* Three dots menu button */}
                <button
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white hover:bg-opacity-20 rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteMenu(showDeleteMenu === project.id ? null : project.id);
                  }}
                >
                  <Icon icon="mdi:dots-vertical" width="16" />
                </button>
              </div>
              
              {/* Delete menu */}
              {showDeleteMenu === project.id && (
                <div className="absolute right-0 top-10 bg-white shadow-lg border rounded-lg z-10 py-1 min-w-32">
                  <button
                    className="w-full px-3 py-2 text-left text-red-600 hover:cursor-pointer flex items-center gap-2 text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project.id);
                    }}
                    disabled={loading}
                  >
                    <Icon icon="mdi:delete-outline" width="16" />
                    Delete Project
                  </button>
                </div>
              )}
            </div>
          ))}
          
          {loading && projects.length === 0 && (
            <div className="flex items-center justify-center py-4">
              <span className="loading loading-spinner loading-sm"></span>
              <span className="ml-2">Loading projects...</span>
            </div>
          )}
        </div>
      </div>
      
      <p className="flex items-center mb-4 px-4 cursor-pointer hover:text-primary transition-colors">
        <Icon
          icon="material-symbols-light:settings-outline-rounded"
          width="26"
          style={{ color: "#444" }}
        />
        Settings
      </p>
    </div>
  );
}

export default Sidebar;