import React, { useState, useEffect } from "react";
import axios from "axios";
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
  const [topReviews, setTopReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      // Fetch all reviews (admin view)
      const reviewsRes = await axios.get('http://localhost:5000/api/reviews?admin=true', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const reviews = reviewsRes.data;

      // Calculate stats
      const totalReviews = reviews.length;
      const pendingReviews = reviews.filter(r => r.status === 'pending').length;
      const totalLikes = reviews.reduce((sum, r) => sum + (r.likes || 0), 0);
      // views are not in schema effectively yet, defaulting to 0 or mock logic. Schema has likes.
      const totalViews = reviews.reduce((sum, r) => sum + (r.views || 0), 0);

      // Generate recent activity from reviews
      const recentActivity = reviews.slice(0, 5).map(r => ({
        id: r._id,
        type: r.status === 'pending' ? 'review_submitted' : 'review_approved',
        message: `Review for ${r.company_name} by ${r.author} is ${r.status}`,
        timestamp: r.created_at
      }));

      setStats({
        totalUsers: 0, // No endpoint for this yet
        totalReviews,
        pendingReviews,
        totalViews,
        totalLikes,
        recentActivity
      });

      // Store fetched reviews for Top Performing section locally? 
      // AdminDashboard structure uses `stats` object mostly. 
      // I will add a `topReviews` property to state to render the table.
      setTopReviews(reviews.sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 5));

    } catch (err) {
      console.error("Dashboard stats error:", err);
    } finally {
      setLoading(false);
    }
  };

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
              {topReviews.map((review) => (
                <tr key={review._id || review.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-secondary-900">
                        {review.company_name}
                      </div>
                      <div className="text-sm text-secondary-500">
                        {review.role}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                    <div>{review.author}</div>
                    <div className="text-xs text-secondary-500">{review.enrollment || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4 text-secondary-400" />
                        <span>{review.views || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="h-4 w-4 text-secondary-400" />
                        <span>{review.likes || 0}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
