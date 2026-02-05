import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Plus, Search, RefreshCw } from "lucide-react";
import { getApiUrl } from "../../utils/apiConfig";
import { useQuery } from "@tanstack/react-query";
import ReviewCard from "../../components/ReviewCard";
import ReviewDetailsModal from "../../components/ReviewDetailsModal";

const StudentHome = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedReview, setSelectedReview] = useState(null);

  const { data: reviews = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const response = await fetch(getApiUrl('/reviews'), { headers });
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      return response.json();
    },
    refetchInterval: 5000,
    staleTime: 1000 * 30,
  });

  const filteredReviews = useMemo(() => {
    let filtered = reviews;

    if (searchTerm) {
      filtered = filtered.filter(
        (review) =>
          review.company_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          review.role.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedLevel) {
      filtered = filtered.filter((review) => review.level === selectedLevel);
    }

    if (selectedType) {
      filtered = filtered.filter((review) => review.type === selectedType);
    }

    return filtered;
  }, [reviews, searchTerm, selectedLevel, selectedType]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Error loading reviews.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">
          Welcome back, {user?.first_name || "Student"}!
        </h1>
        <p className="text-secondary-600">
          Discover placement experiences and share your journey with fellow
          students.
        </p>
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          <RefreshCw size={16} /> Refresh Feed
        </button>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <Link
              to="/student/add-review"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Share Your Experience</span>
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
              <input
                type="text"
                placeholder="Search companies or roles..."
                className="pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option value="">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <select
              className="px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="on-campus">On Campus</option>
              <option value="off-campus">Off Campus</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReviews.map((review) => (
          <ReviewCard
            key={review._id || review.id}
            review={review}
            onViewMore={setSelectedReview}
          />
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <div className="text-secondary-400 mb-4">
            <Search className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-secondary-900 mb-2">
            No reviews found
          </h3>
          <p className="text-secondary-600">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}

      {/* Review Details Modal */}
      {selectedReview && (
        <ReviewDetailsModal
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
        />
      )}
    </div>
  );
};

export default StudentHome;
