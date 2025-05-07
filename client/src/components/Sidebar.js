"use client";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiCompass, FiUser, FiShield, FiX } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: "/dashboard", name: "Dashboard", icon: FiHome },
    { path: "/feed", name: "Feed", icon: FiCompass },
    { path: "/profile", name: "Profile", icon: FiUser },
  ];

  if (user?.role === "admin") {
    navItems.push({ path: "/admin", name: "Admin", icon: FiShield });
  }

  return (
    <>
      {/* Backdrop for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar - Adjust width to be narrower */}
      <div
        className={`fixed inset-y-0 left-0 flex flex-col z-30 w-56 bg-white shadow-lg transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <Link to="/dashboard" className="text-lg font-bold text-indigo-600">
            Creator
          </Link>
          <button
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500"
            onClick={() => setOpen(false)}
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col flex-1 overflow-y-auto pt-5 pb-4">
          <nav className="flex-1 px-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive(item.path)
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
                onClick={() => setOpen(false)}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${
                    isActive(item.path) ? "text-indigo-500" : "text-gray-400"
                  }`}
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center p-4 border-t">
          <div className="flex-shrink-0">
            <div className="bg-indigo-500 rounded-full h-8 w-8 flex items-center justify-center text-white">
              {user?.name?.charAt(0) || "U"}
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700 truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs font-medium text-gray-500">
              Credits: {user?.credits || 0}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
