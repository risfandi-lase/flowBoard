// src/pages/WebsiteRedesign.tsx
import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useApi } from "../contexts/ApiContext";
import type { Task, User } from "../types/api";
import AddMemberModal from "./addMemberModal";

export default function WebsiteRedesign() {
  const [isModalOpen, setIsOpenModal] = useState(false);
  const {
    currentProject,
    tasks,
    createTask,
    moveTask,
    addMemberToProject,
    users,
  } = useApi();
  const [showNewTaskForms, setShowNewTaskForms] = useState<{
    todo: boolean;
    "in-progress": boolean;
    completed: boolean;
  }>({
    todo: false,
    "in-progress": false,
    completed: false,
  });
  const [newTaskData, setNewTaskData] = useState({
    title: "",
    description: "",
    category: "DESIGN",
    categoryColor: "badge-info",
    borderColor: "border-amber-300",
    status: "todo" as const,
    assignees: [] as number[], // Add assignees field
  });

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const categoryOptions = [
    { name: "DESIGN", color: "badge-info", border: "border-amber-300" },
    { name: "DEVELOPMENT", color: "badge-warning", border: "border-red-300" },
    { name: "RESEARCH", color: "badge-error", border: "border-blue-300" },
    { name: "BUG", color: "badge-success", border: "border-blue-300" },
    { name: "MEETING", color: "badge-neutral", border: "border-amber-300" },
  ];

  const handleCreateTask = async (
    status: "todo" | "in-progress" | "completed"
  ) => {
    if (!currentProject || !newTaskData.title.trim()) return;

    await createTask({
      ...newTaskData,
      projectId: currentProject.id,
      status,
    });

    setNewTaskData({
      title: "",
      description: "",
      category: "DESIGN",
      categoryColor: "badge-info",
      borderColor: "border-amber-300",
      status: "todo",
      assignees: [], // Reset assignees
    });
    setShowNewTaskForms({ ...showNewTaskForms, [status]: false });
  };

  const openModal = () => setIsOpenModal(true);
  const closeModal = () => setIsOpenModal(false);

  const handleDragStart = (e: React.DragEvent, taskId: number) => {
    e.dataTransfer.setData("text/plain", taskId.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (
    e: React.DragEvent,
    newStatus: "todo" | "in-progress" | "completed"
  ) => {
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData("text/plain"));
    await moveTask(taskId, newStatus);
  };

  // Toggle assignee selection
  const toggleAssignee = (userId: number) => {
    setNewTaskData(prev => ({
      ...prev,
      assignees: prev.assignees.includes(userId)
        ? prev.assignees.filter(id => id !== userId)
        : [...prev.assignees, userId]
    }));
  };

  const renderTaskCard = (task: Task) => (
    <figure key={task.id} className="p-3">
      <div
        className="card bg-base-100 w-96 shadow-lg border-dashed border-1 border-gray-400 hover:shadow-lg hover:scale-102 cursor-grab transition-transform duration-500 group"
        draggable
        onDragStart={(e) => handleDragStart(e, task.id)}
      >
        <div
          className={`card-body p-3 border-l-8 rounded-2xl ${task.borderColor}`}
        >
          {/* Title and Delete Icon Row */}
          <div className="flex items-start justify-between mb-2">
            <h2 className="card-title text-sm font-semibold flex-1 mr-2">{task.title}</h2>
            <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
              <Icon
                icon="mdi-light:delete"
                width="20"
                className="cursor-pointer"
                style={{ color: "#f03030" }}
              />
            </button>
          </div>
          
          <p className="text-md text-gray-400">{task.description}</p>

          <div className={`badge ${task.categoryColor} text-white`}>
            {task.category}
          </div>
          <div className="flex items-center">
            {task.assigneeDetails
              ?.slice(0, 4)
              .map((user: User, index: number) => (
                <div
                  key={user.id}
                  className={`w-10 h-10 rounded-xl border-2 border-white shadow-sm ${
                    index > 0 ? "-ml-3" : ""
                  }`}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-xl object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                  <div className="hidden w-full h-full rounded-xl bg-gray-500 flex items-center justify-center text-white font-bold text-sm">
                    {getInitials(user.name)}
                  </div>
                </div>
              ))}
          </div>
          <div className="card-actions justify-end">
            {new Date(task.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </figure>
  );

  const renderNewTaskForm = (status: "todo" | "in-progress" | "completed") => (
    <div className="p-3">
      <div className="card bg-base-100 w-96 shadow-lg border-2 border-dashed border-primary">
        <div className="card-body p-3">
          <input
            type="text"
            placeholder="Task title"
            className="input input-bordered input-sm w-full mb-2"
            value={newTaskData.title}
            onChange={(e) =>
              setNewTaskData((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <textarea
            placeholder="Task description"
            className="textarea textarea-bordered textarea-sm w-full mb-2"
            rows={2}
            value={newTaskData.description}
            onChange={(e) =>
              setNewTaskData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />

          <select
            className="select select-bordered select-sm w-full mb-2"
            value={newTaskData.category}
            onChange={(e) => {
              const selected = categoryOptions.find(
                (cat) => cat.name === e.target.value
              );
              setNewTaskData((prev) => ({
                ...prev,
                category: e.target.value,
                categoryColor: selected?.color || "badge-info",
                borderColor: selected?.border || "border-amber-300",
              }));
            }}
          >
            {categoryOptions.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Assignee Selection */}
          <div className="mb-2">
            <label className="label label-text text-sm font-medium mb-1">
              Assign to:
            </label>
            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto border rounded-lg p-2">
              {currentProject?.members.map((user: User) => (
                <div
                  key={user.id}
                  className={`flex items-center gap-1 p-1 rounded-lg cursor-pointer transition-colors ${
                    newTaskData.assignees.includes(user.id)
                      ? "bg-primary text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  onClick={() => toggleAssignee(user.id)}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                  <div className="hidden w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center text-white text-xs font-bold">
                    {getInitials(user.name)}
                  </div>
                  <span className="text-xs truncate max-w-20">{user.name}</span>
                </div>
              ))}
            </div>
            {currentProject?.members.length === 0 && (
              <p className="text-xs text-gray-400 mt-1">
                No members in this project. Add members first.
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              className="btn btn-primary btn-sm flex-1"
              onClick={() => handleCreateTask(status)}
            >
              Create Task
            </button>
            <button
              className="btn btn-ghost btn-sm flex-1"
              onClick={() =>
                setShowNewTaskForms({ ...showNewTaskForms, [status]: false })
              }
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderColumn = (
    title: string,
    status: "todo" | "in-progress" | "completed",
    icon: string,
    bgColor: string,
    tasksArray: Task[]
  ) => (
    <div
      className="card bg-base-100 rounded-2xl items-center h-full w-106 shadow-sm"
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, status)}
    >
      <div
        className={`${bgColor} rounded-t-2xl relative h-20 w-full flex items-center justify-between px-6`}
      >
        <div className="flex items-center">
          <Icon icon={icon} width="30" style={{ color: "#fff" }} />
          <h2 className="text-xl font-bold ml-2">{title}</h2>
        </div>
        <p className="text-xl font-bold absolute top-6 right-6">
          {tasksArray.length}
        </p>
      </div>

      {tasksArray.map(renderTaskCard)}
      {showNewTaskForms[status] && renderNewTaskForm(status)}

      <button
        className="btn btn-dash rounded-xl text-xs w-96 mt-4 mb-8 text-gray-400"
        onClick={() =>
          setShowNewTaskForms({ ...showNewTaskForms, [status]: true })
        }
      >
        <Icon icon="ic:baseline-plus" width="20" style={{ color: " #aaa" }} />
        Add New Task / Drag and Drop from the other cards
      </button>
    </div>
  );

  if (!currentProject) {
    return (
      <div className="bg-base-300 rounded-4xl p-4 shadow-sm">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Icon
              icon="mdi:folder-outline"
              width="64"
              className="text-gray-400 mx-auto mb-4"
            />
            <p className="text-xl text-gray-400">No project selected</p>
            <p className="text-gray-500 mt-2">
              Select a project from the sidebar to get started
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-300 rounded-4xl p-4 shadow-sm">
      {/* HEAD PROJECT TITLE */}
      <div className="p-6">
        <h1 className="text-2xl font-bold">{currentProject.title}</h1>
        <p className="text-lg mt-2">{currentProject.description}</p>

        {/* Avatar */}
        <div>
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center">
              {currentProject.members?.map((user: User, index: number) => (
                <div
                  key={user.id}
                  className={`w-12 h-12 rounded-2xl border-2 border-white shadow-sm ${
                    index > 0 ? "-ml-3" : ""
                  }`}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-2xl object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                  <div className="hidden w-full h-full rounded-2xl bg-gray-500 flex items-center justify-center text-white font-bold text-sm">
                    {getInitials(user.name)}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={openModal} className="btn btn-secondary">
              <Icon
                icon="ic:baseline-plus"
                width="20"
                style={{ color: " #fff" }}
              />
              Add Member
            </button>
          </div>
        </div>
      </div>

      {/*///////////////////////////////////// CARDS  */}
      <div className="flex mt-10 px-6 justify-between">
        {renderColumn(
          "TO DO!",
          "todo",
          "ri:todo-line",
          "bg-primary",
          tasks.todo
        )}
        {renderColumn(
          "IN PROGRESS",
          "in-progress",
          "tabler:progress",
          "bg-secondary",
          tasks["in-progress"]
        )}
        {renderColumn(
          "COMPLETED",
          "completed",
          "octicon:tracked-by-closed-completed-16",
          "bg-accent",
          tasks.completed
        )}
      </div>

      <AddMemberModal isModalOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}