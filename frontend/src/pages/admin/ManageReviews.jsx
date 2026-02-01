import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { getApiUrl } from '../../utils/apiConfig';

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReview, setSelectedReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      // Fetch all reviews (admin=true to get pending ones too)
      const res = await axios.get(getApiUrl('/reviews?admin=true'));
      setReviews(res.data);
      setFilteredReviews(res.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = reviews;

    if (searchTerm) {
      filtered = filtered.filter(
        (review) =>
          review.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (review.author && review.author.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((review) => review.status === statusFilter);
    }

    setFilteredReviews(filtered);
  }, [searchTerm, statusFilter, reviews]);

  const handleStatusChange = async (reviewId, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      if (newStatus === 'approved') {
        await axios.put(getApiUrl(`/reviews/${reviewId}/approve`), {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Use generic update for rejection or other statuses
        await axios.put(getApiUrl(`/reviews/${reviewId}`), { status: newStatus }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      // Optimistic update
      setReviews((prev) =>
        prev.map((review) =>
          review._id === reviewId ? { ...review, status: newStatus } : review
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
      alert(`Failed to update status: ${err.response?.data?.message || err.message}`);
      fetchReviews(); // Revert changes by re-fetching
    }
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(getApiUrl(`/reviews/${reviewId}`), {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReviews((prev) => prev.filter((review) => review._id !== reviewId));
      } catch (err) {
        console.error("Error deleting review:", err);
        alert("Failed to delete review");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
          Manage Reviews
        </h1>
        <p className="text-secondary-600">
          Review, approve, and manage student placement experiences.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
              <input
                type="text"
                placeholder="Search by company, role, or author..."
                className="pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full lg:w-96"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <select
              className="px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                  Type & Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Stats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {filteredReviews.map((review) => (
                <tr key={review._id || review.id} className="hover:bg-secondary-50">
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-secondary-900">
                      {review.author}
                    </div>
                    <div className="text-sm text-secondary-500">
                      {review.enrollment}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {review.type}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(review.level)}`}
                      >
                        {review.level}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}
                    >
                      {review.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                    <div>{review.likes} likes</div>
                    <div>{review.views} views</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedReview(review)}
                        className="text-primary-600 hover:text-primary-900 p-1"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {review.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusChange(review._id, "approved")
                            }
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Approve"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(review._id, "rejected")
                            }
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Reject"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => handleDelete(review._id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              No reviews found
            </h3>
            <p className="text-secondary-600">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Review Details Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">
                  Review Details
                </h2>
                <button
                  onClick={() => setSelectedReview(null)}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">
                      Company
                    </label>
                    <p className="text-secondary-900">
                      {selectedReview.company_name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">
                      Role
                    </label>
                    <p className="text-secondary-900">{selectedReview.role}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">
                      Author
                    </label>
                    <p className="text-secondary-900">
                      {selectedReview.author}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">
                      Enrollment
                    </label>
                    <p className="text-secondary-900">
                      {selectedReview.enrollment || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">
                      Status
                    </label>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedReview.status)}`}
                    >
                      {selectedReview.status}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Placement Steps
                  </label>
                  <p className="text-secondary-700 bg-secondary-50 p-3 rounded-lg">
                    {selectedReview.steps}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Tips for Juniors
                  </label>
                  <p className="text-secondary-700 bg-secondary-50 p-3 rounded-lg">
                    {selectedReview.tips}
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-secondary-200">
                <button
                  onClick={() => setSelectedReview(null)}
                  className="btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageReviews;
