import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

function Sidebar() {
  const projects = [
    { color: "bg-warning", title: "Website Redesign", count: 5 },
    { color: "bg-success", title: "SAAS For Hospital", count: 12 },
    { color: "bg-error", title: "Campaign Website", count: 1 },
    { color: "bg-info", title: "Mobile App", count: 0 },
  ];

  return (
    <div className="bg-base-300 py-2 w-72 h-full rounded-4xl  shadow-sm flex flex-col">
      <div className="flex-1 px-4">
        <button className="btn btn-primary mt-6 w-full">
          <Icon icon="ic:baseline-plus" width="20" style={{ color: " #fff" }} />
          New Project
        </button>
        <p className="mt-10">PROJECTS</p>

        <div className="mt-2 flex flex-col gap-5">
          {projects.map((project, index) => (
            <div
              key={index}
              className="flex items-center gap-2 hover:bg-primary hover:rounded-xl p-2 rounded cursor-pointer"
            >
              <div className={`w-2 h-2 ${project.color} rounded-full`}></div>
              <p>{project.title}</p>
              <span className="ml-auto">{project.count}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="flex items-center mb-4 px-4">
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
