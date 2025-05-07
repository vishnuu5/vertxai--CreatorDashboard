"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  FiUsers,
  FiActivity,
  FiFlag,
  FiEdit2,
  FiPlusCircle,
  FiMinusCircle,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    userCount: 0,
    totalCredits: 0,
    reportedPosts: 0,
  });
  const [users, setUsers] = useState([]);
  const [reportedContent, setReportedContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [creditAmount, setCreditAmount] = useState(0);

  // Check if user is admin
  useEffect(() => {
    if (user?.role !== "admin") {
      window.location.href = "/dashboard";
    }
  }, [user]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, usersRes, reportsRes] = await Promise.all([
          axios.get(`${API_URL}/admin/stats`),
          axios.get(`${API_URL}/admin/users`),
          axios.get(`${API_URL}/admin/reports`),
        ]);

        setStats(statsRes.data);
        setUsers(usersRes.data);
        setReportedContent(reportsRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        toast.error("Failed to load admin data");
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleUpdateCredits = async (userId, action) => {
    if (!creditAmount || creditAmount <= 0) {
      toast.error("Please enter a valid credit amount");
      return;
    }

    const amount = action === "add" ? creditAmount : -creditAmount;

    try {
      await axios.post(`${API_URL}/admin/credits`, {
        userId,
        amount,
        reason: `Admin ${action === "add" ? "added" : "removed"} credits`,
      });

      // Update local state
      setUsers(
        users.map((user) => {
          if (user._id === userId) {
            return {
              ...user,
              credits: user.credits + amount,
            };
          }
          return user;
        })
      );

      toast.success(
        `Credits ${action === "add" ? "added" : "removed"} successfully`
      );
      setCreditAmount(0);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error updating credits:", error);
      toast.error("Failed to update credits");
    }
  };

  const handleResolveReport = async (reportId) => {
    try {
      await axios.put(`${API_URL}/admin/reports/${reportId}/resolve`);

      // Update local state
      setReportedContent(
        reportedContent.filter((report) => report._id !== reportId)
      );

      toast.success("Report resolved successfully");
    } catch (error) {
      console.error("Error resolving report:", error);
      toast.error("Failed to resolve report");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage users, credits, and reported content
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-500">
              <FiUsers className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.userCount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500">
              <FiActivity className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Credits</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalCredits}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-500">
              <FiFlag className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Reported Posts
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.reportedPosts}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            User Management
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            View and manage user accounts
          </p>
        </div>

        <ul className="divide-y divide-gray-200">
          {users.map((user) => (
            <li key={user._id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-800 font-medium">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-indigo-600">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      {user.credits} Credits
                    </span>
                    <button
                      onClick={() =>
                        setSelectedUser(
                          selectedUser === user._id ? null : user._id
                        )
                      }
                      className="ml-2 p-2 text-gray-400 hover:text-gray-500"
                    >
                      <FiEdit2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {selectedUser === user._id && (
                  <div className="mt-4 flex items-center space-x-2">
                    <input
                      type="number"
                      value={creditAmount}
                      onChange={(e) =>
                        setCreditAmount(Number.parseInt(e.target.value))
                      }
                      min="1"
                      placeholder="Amount"
                      className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <button
                      onClick={() => handleUpdateCredits(user._id, "add")}
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <FiPlusCircle className="mr-1 h-4 w-4" />
                      Add
                    </button>
                    <button
                      onClick={() => handleUpdateCredits(user._id, "remove")}
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <FiMinusCircle className="mr-1 h-4 w-4" />
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Reported Content */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Reported Content
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Review and resolve reported posts
          </p>
        </div>

        {reportedContent.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {reportedContent.map((report) => (
              <li key={report._id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <div className="mb-2 sm:mb-0">
                      <div className="text-sm font-medium text-indigo-600">
                        {report.post.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        Reported by: {report.reportedBy.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Reason: {report.reason}
                      </div>
                      <div className="mt-2 text-sm text-gray-700">
                        {report.post.content.substring(0, 100)}...
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={() => handleResolveReport(report._id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Resolve
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-4 py-5 text-center text-sm text-gray-500 sm:px-6">
            No reported content found
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
