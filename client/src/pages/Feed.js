"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  FiBookmark,
  FiShare2,
  FiFlag,
  FiTwitter,
  FiMessageSquare,
  FiRefreshCw,
} from "react-icons/fi";
import toast from "react-hot-toast";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSource, setSelectedSource] = useState("all");

  const fetchPosts = useCallback(async (source = "all") => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/posts/feed?source=${source}`);
      setPosts(res.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load feed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(selectedSource);
  }, [fetchPosts, selectedSource]);

  const handleSavePost = async (post) => {
    try {
      
      await axios.post(`${API_URL}/posts/save`, {
        post: {
          id: post.id,
          title: post.title,
          content: post.content,
          source: post.source,
          author: post.author,
          imageUrl: post.imageUrl,
          likes: post.likes,
          comments: post.comments,
          createdAt: post.createdAt,
        },
      });

      setPosts(
        posts.map((p) => {
          if (p.id === post.id) {
            return { ...p, saved: true };
          }
          return p;
        })
      );

      // Earn credits for interaction
      await axios.post(`${API_URL}/credits/add`, {
        amount: 2,
        reason: "Post interaction",
      });
      toast.success("Post saved! (+2 credits)");
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error("Failed to save post");
    }
  };

  const handleSharePost = async (post) => {
    // Copy link to clipboard
    const postUrl = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(postUrl);

    try {
      // Record share activity - send the full post data
      await axios.post(`${API_URL}/posts/share`, {
        post: {
          id: post.id,
          title: post.title,
          content: post.content,
          source: post.source,
          author: post.author,
        },
      });

      // Earn credits for interaction
      await axios.post(`${API_URL}/credits/add`, {
        amount: 3,
        reason: "Shared content",
      });
      toast.success("Link copied to clipboard! (+3 credits)");
    } catch (error) {
      console.error("Error sharing post:", error);
      toast.error("Failed to share post");
    }
  };

  const handleReportPost = async (post) => {
    try {
      // Send the full post data instead of just the ID
      await axios.post(`${API_URL}/posts/report`, {
        post: {
          id: post.id,
          title: post.title,
          content: post.content,
          source: post.source,
          author: post.author,
          imageUrl: post.imageUrl,
        },
        reason: "inappropriate",
      });
      toast.success(
        "Post reported. Thank you for helping to keep our community safe."
      );
    } catch (error) {
      console.error("Error reporting post:", error);
      toast.error("Failed to report post");
    }
  };

  const getSourceIcon = (source) => {
    switch (source) {
      case "twitter":
        return <FiTwitter className="h-5 w-5 text-blue-400" />;
      case "reddit":
        return <FiMessageSquare className="h-5 w-5 text-orange-500" />;
      default:
        return <FiMessageSquare className="h-5 w-5 text-gray-400" />;
    }
  };

  const sourceFilters = [
    { value: "all", label: "All Sources" },
    { value: "twitter", label: "Twitter" },
    { value: "reddit", label: "Reddit" },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Feed</h1>
          <p className="mt-1 text-sm text-gray-500">
            Discover content from across the web
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="block w-full rounded-md border-gray-300 pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {sourceFilters.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => fetchPosts(selectedSource)}
            className="p-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <FiRefreshCw className="h-5 w-5" />
            <span className="sr-only">Refresh</span>
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex items-center mb-3">
                    {getSourceIcon(post.source)}
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      {post.author}
                    </span>
                    <span className="mx-2 text-gray-500">•</span>
                    <span className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-700 mb-4">{post.content}</p>

                  {post.imageUrl && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <img
                        src={post.imageUrl || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-auto"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t pt-4 mt-4">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleSavePost(post)}
                        className={`flex items-center space-x-1 text-sm ${
                          post.saved
                            ? "text-indigo-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        <FiBookmark className="h-4 w-4" />
                        <span>{post.saved ? "Saved" : "Save"}</span>
                      </button>

                      <button
                        onClick={() => handleSharePost(post)}
                        className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
                      >
                        <FiShare2 className="h-4 w-4" />
                        <span>Share</span>
                      </button>

                      <button
                        onClick={() => handleReportPost(post)}
                        className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
                      >
                        <FiFlag className="h-4 w-4" />
                        <span>Report</span>
                      </button>
                    </div>

                    <div className="text-sm text-gray-500">
                      {post.likes} likes • {post.comments} comments
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <FiRefreshCw className="h-12 w-12" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No posts found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try changing your filter or check back later.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Feed;
