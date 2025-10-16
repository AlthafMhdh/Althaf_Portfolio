import React from "react";
import clsx from "clsx";
import { FaTimes } from "react-icons/fa";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
  onMenuClick: (page: string) => void;
  activePage: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar, onMenuClick, activePage }) => {
  const menuItems = [
    "Profile",
    "About Me",
    "Skills",
    "Experience",
    "Projects",
    "Certifications",
    "Education",
    "Contact",
    "Logout",
  ];

  return (
    <aside
      className={clsx(
        "fixed md:static inset-y-0 left-0 w-64 bg-gray-200 transform transition-transform duration-300 ease-in-out z-40 flex flex-col",
        {
          "-translate-x-full": !isOpen,
          "translate-x-0": isOpen,
        },
        "md:translate-x-0"
      )}
    >
      {/* Sidebar Header */}
      <div className="hidden md:flex items-center justify-center bg-gray-200 h-30 font-semibold">
        {/* Customize Your Portfolio Website */}
      </div>

      {/* Mobile Close Button */}
      <div className="md:hidden flex justify-end p-3">
        <button
          type="button"
          onClick={closeSidebar}
          className="p-2 rounded-full hover:bg-gray-300 text-gray-700"
          title="Toggle Sidebar Close"
        >
          <FaTimes size={12} />
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 mt-2">
        {menuItems.map((item) => (
          <button
            key={item}
            onClick={() => onMenuClick(item)}
            className={clsx(
              "w-full text-left px-6 py-3 text-gray-700 hover:bg-gray-300 border-b border-gray-300 font-medium",
              { "bg-gray-500 text-white": activePage === item }
            )}
            //className="w-full text-left px-6 py-3 text-gray-700 hover:bg-gray-300 border-b border-gray-300 font-medium"
          >
            {item}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
