import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

interface Project {
  id: string;
  color: string;
  title: string;
  count: number;
}

interface Task {
  id: string;
  title: string;
  status: "todo" | "doing" | "done";
}

interface ProjectBoardProps {
  project: Project | null;
}

function ProjectBoard({ project }: ProjectBoardProps) {
  // This would come from your backend/state
  const getTasks = (projectId: string): Task[] => {
    // Mock data - replace with actual API call
    const mockTasks: Record<string, Task[]> = {
      "1": [
        { id: "t1", title: "Design homepage", status: "todo" },
        { id: "t2", title: "Create wireframes", status: "doing" },
        { id: "t3", title: "User research", status: "done" },
      ],
      "2": [
        { id: "t4", title: "Setup database", status: "todo" },
        { id: "t5", title: "Create patient model", status: "doing" },
      ],
      "3": [{ id: "t6", title: "Landing page copy", status: "todo" }],
      "4": [],
    };
    return mockTasks[projectId] || [];
  };

  if (!project) {
    return (
      <div className="flex-1 flex items-center bg-red justify-center">
        <div className="text-center">
          <Icon
            icon="ic:outline-folder-open"
            width="64"
            className="mx-auto mb-4 opacity-50"
          />
          <h1>Hello, Good Morning user</h1>
          <h2 className="text-xl font-semibold mb-2">Select a Project</h2>
          <p className="text-gray-500">
            Choose a project from the sidebar to get started
          </p>
        </div>
      </div>
    );
  }

  const tasks = getTasks(project.id);
  const todoTasks = tasks.filter((task) => task.status === "todo");
  const doingTasks = tasks.filter((task) => task.status === "doing");
  const doneTasks = tasks.filter((task) => task.status === "done");

  const Column = ({
    title,
    tasks,
    status,
  }: {
    title: string;
    tasks: Task[];
    status: string;
  }) => (
    <div className="bg-base-200 rounded-lg p-4 min-h-96">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{title}</h3>
        <span className="badge badge-neutral">{tasks.length}</span>
      </div>

      <div className="space-y-3 ">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white p-3 rounded shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <p className="text-sm">{task.title}</p>
          </div>
        ))}

        <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors">
          <Icon icon="ic:baseline-plus" width="16" className="inline mr-1" />
          Add a card
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex-1 p-6 bg-base-300 rounded-4xl">
      {/* Project Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold">{project.title}</h1>
        </div>
        <p className="text-gray-600">{project.count} tasks</p>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-3 gap-6">
        <Column title="To Do" tasks={todoTasks} status="todo" />
        <Column title="Doing" tasks={doingTasks} status="doing" />
        <Column title="Done" tasks={doneTasks} status="done" />
      </div>
    </div>
  );
}

export default ProjectBoard;
