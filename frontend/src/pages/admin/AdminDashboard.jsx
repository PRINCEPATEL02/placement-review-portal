import React, { useState, useEffect } from "react";
import {
  Users,
  FileText,
  TrendingUp,
  Eye,
  ThumbsUp,
  Calendar,
  Award,
  BarChart3,
} from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalReviews: 0,
    pendingReviews: 0,
    totalViews: 0,
    totalLikes: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching dashboard stats
    setTimeout(() => {
      setStats({
        totalUsers: 245,
        totalReviews: 89,
        pendingReviews: 12,
        totalViews: 15420,
        totalLikes: 892,
        recentActivity: [
          {
            id: 1,
            type: "review_submitted",
            message: "New review submitted by John Doe for Google",
            timestamp: "2024-01-15T10:30:00Z",
          },
          {
            id: 2,
            type: "review_approved",
            message: "Review for Microsoft approved",
            timestamp: "2024-01-15T09:15:00Z",
          },
          {
            id: 3,
            type: "user_registered",
            message: "New user Jane Smith registered",
            timestamp: "2024-01-15T08:45:00Z",
          },
          {
            id: 4,
            type: "review_submitted",
            message: "New review submitted by Mike Johnson for Amazon",
            timestamp: "2024-01-14T16:20:00Z",
          },
        ],
      });
      setLoading(false);
    }, 1000);
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case "review_submitted":
        return <FileText className="h-5 w-5 text-blue-600" />;
      case "review_approved":
        return <Award className="h-5 w-5 text-green-600" />;
      case "user_registered":
        return <Users className="h-5 w-5 text-purple-600" />;
      default:
        return <BarChart3 className="h-5 w-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-secondary-600">
          Monitor and manage the placement review portal.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">
                Total Users
              </p>
              <p className="text-2xl font-bold text-secondary-900">
                {stats.totalUsers}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">
                Total Reviews
              </p>
              <p className="text-2xl font-bold text-secondary-900">
                {stats.totalReviews}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">
                Pending Reviews
              </p>
              <p className="text-2xl font-bold text-secondary-900">
                {stats.pendingReviews}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Eye className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">
                Total Views
              </p>
              <p className="text-2xl font-bold text-secondary-900">
                {stats.totalViews.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-xl font-semibold text-secondary-900 mb-6">
            Recent Activity
          </h2>

          <div className="space-y-4">
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-secondary-900">
                    {activity.message}
                  </p>
                  <p className="text-xs text-secondary-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {stats.recentActivity.length === 0 && (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
              <p className="text-secondary-600">No recent activity</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-xl font-semibold text-secondary-900 mb-6">
            Quick Actions
          </h2>

          <div className="space-y-4">
            <button className="w-full btn-primary text-left flex items-center space-x-3">
              <FileText className="h-5 w-5" />
              <span>Review Pending Submissions</span>
            </button>

            <button className="w-full btn-secondary text-left flex items-center space-x-3">
              <Users className="h-5 w-5" />
              <span>Manage Users</span>
            </button>

            <button className="w-full btn-secondary text-left flex items-center space-x-3">
              <TrendingUp className="h-5 w-5" />
              <span>View Analytics</span>
            </button>

            <button className="w-full btn-secondary text-left flex items-center space-x-3">
              <BarChart3 className="h-5 w-5" />
              <span>Generate Reports</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Performing Reviews */}
      <div className="card mt-8">
        <h2 className="text-xl font-semibold text-secondary-900 mb-6">
          Top Performing Reviews
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-secondary-200">
            <thead className="bg-secondary-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Company & Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Engagement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-secondary-900">
                      Google
                    </div>
                    <div className="text-sm text-secondary-500">
                      Software Engineer
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                  John Doe
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4 text-secondary-400" />
                      <span>156</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="h-4 w-4 text-secondary-400" />
                      <span>24</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                  Jan 15, 2024
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-secondary-900">
                      Amazon
                    </div>
                    <div className="text-sm text-secondary-500">
                      Cloud Engineer
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                  Mike Johnson
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4 text-secondary-400" />
                      <span>203</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="h-4 w-4 text-secondary-400" />
                      <span>31</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                  Jan 10, 2024
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
