"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FiEdit2, FiUser, FiMail, FiCheckCircle } from "react-icons/fi";
import toast from "react-hot-toast";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const Profile = () => {
  const { user, checkAuthStatus } = useAuth();
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
    socialLinks: {
      twitter: "",
      linkedin: "",
      website: "",
    },
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/users/profile`);
        setProfileData({
          ...res.data,
          socialLinks: res.data.socialLinks || {
            twitter: "",
            linkedin: "",
            website: "",
          },
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setProfileData({
        ...profileData,
        [parent]: {
          ...profileData[parent],
          [child]: value,
        },
      });
    } else {
      setProfileData({
        ...profileData,
        [name]: value,
      });
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await axios.put(`${API_URL}/users/profile`, profileData);

      // Award credits for completing profile
      if (!user.profileCompleted) {
        await axios.post(`${API_URL}/credits/add`, {
          amount: 10,
          reason: "Profile completion",
        });
        toast.success(
          "Profile updated! (+10 credits for completing your profile)"
        );
      } else {
        toast.success("Profile updated successfully!");
      }

      setEditing(false);
      checkAuthStatus(); // Refresh user data
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
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
    <div className="max-w-3xl mx-auto">
      <header className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
          <button
            onClick={() => setEditing(!editing)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiEdit2 className="mr-2" />
            {editing ? "Cancel" : "Edit Profile"}
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account details and preferences
        </p>
      </header>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32 sm:h-40"></div>

        <div className="px-4 sm:px-6 -mt-16">
          <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-5">
            <div className="flex">
              <div className="h-24 w-24 rounded-full ring-4 ring-white bg-indigo-100 flex items-center justify-center">
                <FiUser className="h-12 w-12 text-indigo-500" />
              </div>
            </div>
            <div className="mt-6 sm:mt-0 sm:flex-1 sm:min-w-0">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-gray-900 truncate">
                  {profileData.name}
                </h2>
                {user?.profileCompleted && (
                  <div className="text-indigo-500">
                    <FiCheckCircle className="h-5 w-5" />
                  </div>
                )}
              </div>
              <div className="flex items-center mt-1">
                <FiMail className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-sm text-gray-500">
                  {profileData.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="col-span-1 sm:col-span-2">
              <div className="bg-indigo-50 rounded-md p-4 mb-6">
                <p className="text-sm text-indigo-700">
                  Complete your profile to earn{" "}
                  <span className="font-bold">10 credits</span>!
                </p>
              </div>
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                disabled={!editing}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                disabled
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 sm:text-sm"
              />
            </div>

            <div className="col-span-1 sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                name="bio"
                rows="3"
                value={profileData.bio || ""}
                onChange={handleInputChange}
                disabled={!editing}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder={
                  editing
                    ? "Write a short bio about yourself..."
                    : "No bio provided"
                }
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={profileData.location || ""}
                onChange={handleInputChange}
                disabled={!editing}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder={editing ? "City, Country" : "No location provided"}
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">
                Twitter
              </label>
              <input
                type="text"
                name="socialLinks.twitter"
                value={profileData.socialLinks.twitter || ""}
                onChange={handleInputChange}
                disabled={!editing}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder={editing ? "@username" : "Not provided"}
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">
                LinkedIn
              </label>
              <input
                type="text"
                name="socialLinks.linkedin"
                value={profileData.socialLinks.linkedin || ""}
                onChange={handleInputChange}
                disabled={!editing}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder={editing ? "LinkedIn URL" : "Not provided"}
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">
                Website
              </label>
              <input
                type="text"
                name="socialLinks.website"
                value={profileData.socialLinks.website || ""}
                onChange={handleInputChange}
                disabled={!editing}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder={editing ? "https://example.com" : "Not provided"}
              />
            </div>

            {editing && (
              <div className="col-span-1 sm:col-span-2">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="w-full mt-4 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {saving ? "Saving..." : "Save Profile"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Credits Section */}
        <div className="px-4 py-5 sm:p-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Credits
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Your current credit balance and history
              </p>
            </div>
            <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-lg font-semibold">
              {user?.credits || 0} Credits
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
