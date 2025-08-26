// src/components/Sidebar.tsx
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { useApi } from "../contexts/ApiContext";
import type { Project } from "../types/api";

function Sidebar() {
  const { projects, currentProject, loadProject, createProject, setCurrentProject } = useApi();
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [newProjectData, setNewProjectData] = useState({
    title: "",
    description: ""
  });

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
    setCurrentProject(project);
    await loadProject(project.id);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectData.title.trim()) {
      await createProject({
        ...newProjectData,
        color: getRandomColor() // Randomly assign color
      });
      setNewProjectData({ title: "", description: "" });
      setShowNewProjectForm(false);
    }
  };

  return (
    <div className="bg-base-300 py-2 w-72 h-full rounded-4xl shadow-sm flex flex-col">
      <div className="flex-1 px-4">
        <button 
          className="btn btn-primary mt-6 w-full"
          onClick={() => setShowNewProjectForm(!showNewProjectForm)}
        >
          <Icon icon="ic:baseline-plus" width="20" style={{ color: " #fff" }} />
          New Project
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
            />
            <textarea
              placeholder="Project description"
              className="textarea textarea-bordered w-full textarea-sm"
              value={newProjectData.description}
              onChange={(e) => setNewProjectData(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
            />
            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary btn-sm flex-1">
                Create
              </button>
              <button 
                type="button" 
                className="btn btn-ghost btn-sm flex-1"
                onClick={() => setShowNewProjectForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <p className="mt-10">PROJECTS</p>

        <div className="mt-2 flex flex-col gap-5">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`flex items-center gap-2 hover:bg-primary hover:rounded-xl p-2 rounded cursor-pointer transition-colors ${
                currentProject?.id === project.id ? 'bg-primary text-white' : ''
              }`}
              onClick={() => handleProjectClick(project)}
            >
              <div className={`w-2 h-2 ${project.color} rounded-full`}></div>
              <p className="flex-1 truncate">{project.title}</p>
              <span className="ml-auto">{project.taskCount}</span>
            </div>
          ))}
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