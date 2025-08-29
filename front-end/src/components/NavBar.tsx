import { Icon } from "@iconify/react/dist/iconify.js";
import icon from "../assets/icon.png";
import ava from "../assets/ava.jpg";

function NavBar() {
  return (
    <div className="bg-base-100 ">
      {/* TOP-BAR */}
      <div className="navbar px-36 py-4 shadow-md">
        {/* Left side - Logo and title */}
        <div className="navbar-start">
          <div className="flex items-center gap-2">
            <img src={icon} alt="FlowBoard Logo" className="w-10" />
            <p className="text-3xl text-[#514899] font-semibold">FlowBoard</p>
          </div>
        </div>

        {/* Center - Search */}
        <div className="navbar-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for task, project, people..."
              className="input input-bordered w-96 pl-12"
              style={{ color: "#282828" }}
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
              style={{ color: "#282828" }}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </div>
        </div>

        {/* Right side - User menu */}
        <div className="navbar-end gap-8">
          <div className="flex gap-2">
            <Icon
              icon="streamline-ultimate:headphones-customer-support-question"
              className="border border-gray-300  w-12 h-12 rounded-2xl p-3 "
              style={{ color: "#0006" }}
            />

            <Icon
              icon="mdi:performance"
              className="border border-gray-300  w-12 h-12 rounded-2xl p-3 "
              style={{ color: "#0006" }}
            />
            <Icon
              icon="mingcute:notification-line"
              style={{ color: "#0006" }}
              className="border border-gray-300  w-12 h-12 rounded-2xl p-3 "
            />
          </div>

          <div className="flex items-center gap-2 ">
            <img
              alt="User avatar"
              src={ava}
              className="rounded-2xl w-12 h-12 object-cover"
            />
            <div className="text-sm">
              <p className="font-semibold">Risfandi Lase</p>
              <p className="text-xs text-gray-400 ">Product Manager</p>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
}
export default NavBar;
