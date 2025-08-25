import React from "react";
import sarahImg from "/src/assets/sarah.jpg";
import alexImg from "/src/assets/alex.jpeg";
import mikeImg from "/src/assets/mike.jpg";
import rachelImg from "/src/assets/rachel.jpg";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function WebsiteRedesign() {
  interface User {
    name: string;
    avatar: string;
  }

  const users: User[] = [
    { name: "Sarah Miller", avatar: sarahImg },
    { name: "Alex Johnson", avatar: alexImg },
    { name: "Mike Kim", avatar: mikeImg },
    { name: "Rachel Foster", avatar: rachelImg },
  ];

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-base-300 rounded-4xl p-4 shadow-sm">
      {/* HEAD PROJECT TITLE */}
      <div className="p-6">
        <h1 className="text-2xl font-bold">Website Redesign</h1>
        <p className="text-lg mt-2">
          Complete redesign of the company website to improve user experience,
          increase conversions, and modernize our digital presence. Lorem ipsum
          dolor sit amet consectetur adipisicing elit. Distinctio molestiae
          natus id autem similique corrupti nihil debitis dicta culpa,
          perspiciatis dolore assumenda veritatis labore quo suscipit saepe enim
          neque accusamus.
        </p>
        {/* Avatar */}
        <div>
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center">
              {users.map((user, index) => (
                <div
                  key={index}
                  className={`
            w-12 h-12 rounded-2xl border-2 border-white shadow-sm
            ${index > 0 ? "-ml-3" : ""}
          `}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-2xl object-cover"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                  <div className="hidden w-full h-full rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-sm">
                    {getInitials(user.name)}
                  </div>
                </div>
              ))}
            </div>

            <button className="btn btn-secondary">
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
      {/*///////////////////////////////////// CARD  */}
      <div className="flex mt-10 px-6 justify-between">
        {/* TODO CARD */}
        <div className="card bg-base-100 rounded-2xl items-center  h-full w-106 shadow-sm">
          <div className="bg-primary rounded-t-2xl relative h-20 w-full flex items-center justify-between px-6">
            <div className="flex items-center">
              <Icon icon="ri:todo-line" width="30" style={{ color: "#fff" }} />
              <h2 className="text-xl font-bold ml-2">TO DO!</h2>
            </div>
            <p className="text-xl font-bold absolute top-6 right-6">4</p>
          </div>

          <figure className="p-3">
            <div className="card bg-base-100 w-96 shadow-lg border-dashed border-1 border-gray-400 hover:shadow-lg hover:scale-102 cursor-grab transition-transform duration-500 ">
              <div className="card-body p-3 border-l-8 rounded-2xl border-amber-300">
                <h2 className="card-title text-sm font-semibold ">
                  Create wireframes for homepage
                </h2>
                <p className="text-md text-gray-400">
                  Design the basic layout and structure for the new homepage
                  including header, hero section, features, and footer{" "}
                </p>
                <div className="badge badge-info text-white">DESIGN</div>
                <div className="flex items-center">
                  {users.slice(1, 3).map((user, index) => (
                    <div
                      key={index}
                      className={`
            w-10 h-10 rounded-xl border-2 border-white shadow-sm
            ${index > 0 ? "-ml-3" : ""}
          `}
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-xl object-cover"
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          target.nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                      <div className="hidden w-full h-full rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-sm">
                        {getInitials(user.name)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="card-actions justify-end">time_created</div>
              </div>
            </div>
          </figure>

          <figure className="p-3">
            <div className="card bg-base-100 w-96 shadow-lg border-dashed border-1 border-gray-400 hover:shadow-lg hover:scale-102 cursor-grab transition-transform duration-500 ">
              <div className="card-body p-3 border-l-8 rounded-2xl border-red-300">
                <h2 className="card-title text-sm font-semibold ">
                  Set up development environment
                </h2>
                <p className="text-md text-gray-400">
                  Configure React, TypeScript, Tailwind CSS, and testing
                  framework for the new website build
                </p>
                <div className="badge badge-warning text-white">
                  DEVELOPMENT
                </div>
                <div className="flex items-center">
                  {users.slice(0, 5).map((user, index) => (
                    <div
                      key={index}
                      className={`
            w-10 h-10 rounded-xl border-2 border-white shadow-sm
            ${index > 0 ? "-ml-3" : ""}
          `}
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-xl object-cover"
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          target.nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                      <div className="hidden w-full h-full rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-sm">
                        {getInitials(user.name)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="card-actions justify-end">time_created</div>
              </div>
            </div>
          </figure>

          <figure className="p-3">
            <div className="card bg-base-100 w-96 shadow-lg border-dashed border-1 border-gray-400 hover:shadow-lg hover:scale-102 cursor-grab transition-transform duration-500 ">
              <div className="card-body p-3 border-l-8 rounded-2xl border-blue-300">
                <h2 className="card-title text-sm font-semibold ">
                  User research and interviews{" "}
                </h2>
                <p className="text-md text-gray-400">
                  Conduct comprehensive interviews with 15 users to understand
                  current pain points and gather feedback on proposed changes{" "}
                </p>
                <div className="badge badge-error text-white">RESEARCH</div>
                <div className="flex items-center">
                  {users.slice(2, 5).map((user, index) => (
                    <div
                      key={index}
                      className={`
            w-10 h-10 rounded-xl border-2 border-white shadow-sm
            ${index > 0 ? "-ml-3" : ""}
          `}
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-xl object-cover"
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          target.nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                      <div className="hidden w-full h-full rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-sm">
                        {getInitials(user.name)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="card-actions justify-end">time_created</div>
              </div>
            </div>
          </figure>
             <button className="btn btn-dash rounded-xl w-96 mt-15 mb-8 text-gray-400">
            {" "}
            <Icon
              icon="ic:baseline-plus"
              width="20"
              style={{ color: " #aaa" }}
            />
            Add New Task
          </button>
        </div>

        {/* IN PROGRESS CARD */}
        <div className="card bg-base-100 rounded-2xl items-center w-106  h-full shadow-sm">
          <div className="bg-secondary rounded-t-2xl w-full relative h-20 flex items-center justify-between px-6 ">
            <div className="flex items-center">
              <Icon
                icon="tabler:progress"
                width="30"
                style={{ color: "#fff" }}
              />
              <h2 className="text-xl font-bold ml-2">IN PROGRES</h2>
            </div>
            <p className="text-xl font-bold absolute top-6 right-6">4</p>
          </div>

          <figure className="p-3">
            <div className="card bg-base-100 w-96 shadow-lg border-dashed border-1 border-gray-400 hover:shadow-lg hover:scale-102 cursor-grab transition-transform duration-500 ">
              <div className="card-body p-3 border-l-8 rounded-2xl border-blue-300">
                <h2 className="card-title text-sm font-semibold ">
                  Implement user authentication
                </h2>
                <p className="text-md text-gray-400">
                  Set up OAuth integration and user session management. Resolve
                  layout problems on mobile devices{" "}
                </p>
                <div className="badge badge-success text-white">BUG</div>
                <div className="flex items-center">
                  {users.slice(2, 5).map((user, index) => (
                    <div
                      key={index}
                      className={`
            w-10 h-10 rounded-xl border-2 border-white shadow-sm
            ${index > 0 ? "-ml-3" : ""}
          `}
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-xl object-cover"
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          target.nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                      <div className="hidden w-full h-full rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-sm">
                        {getInitials(user.name)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="card-actions justify-end">time_created</div>
              </div>
            </div>
          </figure>
          <button className="btn btn-dash rounded-xl w-96 mt-15 mb-8 text-gray-400">
            {" "}
            <Icon
              icon="ic:baseline-plus"
              width="20"
              style={{ color: " #aaa" }}
            />
            Add New Task
          </button>
        </div>

        {/* COMPLETED CARD */}
        <div className="card bg-base-100 rounded-2xl w-106 h-full items-center  shadow-sm">
          <div className="bg-accent rounded-t-2xl relative w-full h-20 flex items-center justify-between px-6">
            <div className="flex items-center">
              <Icon
                icon="octicon:tracked-by-closed-completed-16"
                width="30"
                style={{ color: "#fff" }}
              />
              <h2 className="text-xl font-bold ml-2">COMPLETED</h2>
            </div>
            <p className="text-xl font-bold absolute top-6 right-6">4</p>
          </div>

          <figure className="p-3">
            <div className="card bg-base-100 w-96 shadow-lg border-dashed border-1 border-gray-400 hover:shadow-lg hover:scale-102 cursor-grab transition-transform duration-500 ">
              <div className="card-body p-3 border-l-8 rounded-2xl border-amber-300">
                <h2 className="card-title text-sm font-semibold ">
                  Create wireframes for homepage
                </h2>
                <p className="text-md text-gray-400">
                  Design the basic layout and structure for the new homepage
                  including header, hero section, features, and footer{" "}
                </p>
                <div className="badge badge-neutral text-white">MEETING</div>
                <div className="flex items-center">
                  {users.slice(0, 4).map((user, index) => (
                    <div
                      key={index}
                      className={`
            w-10 h-10 rounded-xl border-2 border-white shadow-sm
            ${index > 0 ? "-ml-3" : ""}
          `}
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-xl object-cover"
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          target.nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                      <div className="hidden w-full h-full rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-sm">
                        {getInitials(user.name)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="card-actions justify-end">time_created</div>
              </div>
            </div>
          </figure>

          <figure className="p-3">
            <div className="card bg-base-100 w-96 shadow-lg border-dashed border-1 border-gray-400 hover:shadow-lg hover:scale-102 cursor-grab transition-transform duration-500 ">
              <div className="card-body p-3 border-l-8 rounded-2xl  border-red-300">
                <h2 className="card-title text-sm font-semibold ">
                  Set up development environment
                </h2>
                <p className="text-md text-gray-400">
                  Configure React, TypeScript, Tailwind CSS, and testing
                  framework for the new website build
                </p>
                <div className="badge badge-warning text-white">
                  DEVELOPMENT
                </div>
                <div className="flex items-center">
                  {users.slice(4, 5).map((user, index) => (
                    <div
                      key={index}
                      className={`
            w-10 h-10 rounded-xl border-2 border-white shadow-sm
            ${index > 0 ? "-ml-3" : ""}
          `}
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-xl object-cover"
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          target.nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                      <div className="hidden w-full h-full rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-sm">
                        {getInitials(user.name)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="card-actions justify-end">time_created</div>
              </div>
            </div>
          </figure>
             <button className="btn btn-dash rounded-xl w-96 mt-15 mb-8 text-gray-400">
            {" "}
            <Icon
              icon="ic:baseline-plus"
              width="20"
              style={{ color: " #aaa" }}
            />
            Add New Task
          </button>
        </div>
      </div>
    </div>
  );
}
