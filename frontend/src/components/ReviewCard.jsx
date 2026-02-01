import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { ThumbsUp, Clock, User, Building } from "lucide-react";
import { getApiUrl } from '../utils/apiConfig';

const ReviewCard = ({ review: initialReview, showFullContent = false }) => {
  const { user } = useAuth();
  const [review, setReview] = useState(initialReview);
  const [isExpanded, setIsExpanded] = useState(showFullContent);
  const [loading, setLoading] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    if (user && review.likedBy) {
      setHasLiked(review.likedBy.includes(user.enrollment));
    } else {
      setHasLiked(false);
    }
  }, [user, review.likedBy]);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(getApiUrl(`/reviews/${review._id}/like`), {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local state with new likes count and update likedBy array to keep UI consistent
      const newLikedBy = res.data.liked
        ? [...(review.likedBy || []), user.enrollment]
        : (review.likedBy || []).filter(id => id !== user.enrollment);

      setReview(prev => ({
        ...prev,
        likes: res.data.likes,
        likedBy: newLikedBy
      }));

      // hasLiked will be updated by useEffect, but we can set it here too for speed
      setHasLiked(res.data.liked);
    } catch (err) {
      console.error("Like error", err);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "hard":
        return "bg-vgec-orange/10 text-vgec-orange border-vgec-orange/20";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeColor = (type) => {
    return type === "on-campus"
      ? "bg-blue-100 text-blue-800 border-blue-200"
      : "bg-purple-100 text-purple-800 border-purple-200";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateText = (text, maxLength = 200) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 md:p-6 pb-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-3 gap-2">
          <div className="flex-1">
            <h3 className="text-lg md:text-xl font-bold text-vgec-blue flex flex-wrap items-center gap-2">
              <Building className="h-5 w-5 text-vgec-orange shrink-0" />
              <span className="break-words">{review.company_name}</span>
            </h3>
            <p className="text-gray-600 font-medium text-sm mt-1">{review.role}</p>
          </div>
          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border whitespace-nowrap ${getLevelColor(review.level)}`}
            >
              {review.level}
            </span>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 mb-4 border-b border-gray-50 pb-4 gap-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1 whitespace-nowrap">
              <Clock className="h-3.5 w-3.5" /> {formatDate(review.created_at || review.date_time)}
            </span>
            <span className="font-medium text-gray-600">
              Created by: <span className="text-gray-500 font-normal">
                {review.author && review.author !== review.enrollment
                  ? `${review.author} (${review.enrollment})`
                  : (review.enrollment || 'Anonymous')}
              </span>
            </span>
          </div>
          <span className={`px-2 py-0.5 rounded text-xs font-medium border whitespace-nowrap ${getTypeColor(review.type)}`}>
            {review.type}
          </span>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-bold text-gray-800 mb-1 border-l-2 border-vgec-blue pl-2">
              Interview Process
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
              {isExpanded ? review.steps : truncateText(review.steps)}
            </p>
          </div>

          {review.tips && (
            <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
              <h4 className="text-xs font-bold text-vgec-orange uppercase mb-1">Tips for Juniors</h4>
              <p className="text-gray-700 text-sm italic">
                {isExpanded ? review.tips : truncateText(review.tips)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Admin/Creator Info */}
      <div className="px-6 py-2 text-xs text-gray-500 border-t border-gray-50 bg-gray-50/50">
        <div className="flex flex-col gap-1">
          {review.approved_by_email && (
            <span className="font-medium text-gray-600">
              Approved by: <span className="text-gray-500 font-normal">{review.approved_by_email}</span>
            </span>
          )}
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="mt-auto p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between rounded-b-xl">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            disabled={loading}
            className={`flex items-center gap-1.5 transition-colors text-sm font-medium ${hasLiked ? 'text-vgec-blue font-bold' : 'text-gray-500 hover:text-vgec-blue'}`}
          >
            <ThumbsUp className={`h-4 w-4 ${loading ? 'animate-pulse' : ''}`} fill={hasLiked ? "currentColor" : "none"} />
            <span>{review.likes || review.like_count || 0} Helpful</span>
          </button>
        </div>

        {(review.steps?.length > 200 || review.tips?.length > 200) && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-vgec-blue hover:text-blue-800 text-sm font-semibold hover:underline"
          >
            {isExpanded ? "Show Less" : "Read Full Review"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
