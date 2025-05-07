"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiMenu,
  FiBell,
  FiUser,
  FiLogOut,
  FiTrash2,
  FiCheck,
} from "react-icons/fi";
import toast from "react-hot-toast";

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "You earned 5 credits for daily login",
      time: "Just now",
      read: false,
    },
    {
      id: 2,
      message: "Your profile is 80% complete",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 3,
      message: "New content available in your feed",
      time: "Yesterday",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );
    toast.success("All notifications marked as read");
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast.success("All notifications cleared");
    setNotificationsOpen(false);
  };

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  return (
    <nav className="bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              {/* Mobile menu button */}
              <button
                type="button"
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                onClick={toggleSidebar}
              >
                <FiMenu className="h-6 w-6" />
              </button>

              <Link
                to="/dashboard"
                className="text-xl font-bold text-indigo-600"
              >
                Creator Dashboard
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            <div className="hidden md:flex items-center mr-4">
              <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                Credits: {user?.credits || 0}
              </div>
            </div>

            {/* Notifications dropdown */}
            <div className="relative">
              <button
                className="p-2 rounded-full text-gray-400 hover:text-gray-500 relative"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <FiBell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
                )}
              </button>

              {notificationsOpen && (
                <div
                  className="absolute right-[-3.5rem]  mt-2 w-80 max-w-xs sm:max-w-sm md:max-w-md
                  rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                  // style={{
                  //   right: window.innerWidth < 640 ? "0" : "auto",
                  //   left: window.innerWidth < 640 ? "50%" : "auto",
                  //   transform:
                  //     window.innerWidth < 640 ? "translateX(-50%)" : "none",
                  //   maxWidth:
                  //     window.innerWidth < 640 ? "calc(100vw - 2rem)" : "20rem",
                  // }}
                >
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="text-sm font-medium text-gray-900">
                        Notifications
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
                          onClick={markAllAsRead}
                          disabled={
                            notifications.length === 0 ||
                            notifications.every((n) => n.read)
                          }
                        >
                          <FiCheck className="mr-1 h-3 w-3" />
                          Read all
                        </button>
                        <button
                          className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
                          onClick={clearAllNotifications}
                          disabled={notifications.length === 0}
                        >
                          <FiTrash2 className="mr-1 h-3 w-3" />
                          Clear all
                        </button>
                      </div>
                    </div>
                    {notifications.length > 0 ? (
                      <div className="max-h-60 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 hover:bg-gray-50 ${
                              notification.read ? "" : "bg-blue-50"
                            } relative group`}
                          >
                            <div onClick={() => markAsRead(notification.id)}>
                              <p className="text-sm text-gray-800">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notification.time}
                              </p>
                            </div>
                            <button
                              className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() =>
                                deleteNotification(notification.id)
                              }
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500 text-center">
                        No notifications
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="ml-3 relative">
              <div>
                <button
                  type="button"
                  className="flex items-center max-w-xs bg-gray-100 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <FiUser className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {dropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Your Profile
                  </Link>
                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <FiLogOut className="mr-2" />
                      Sign out
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
