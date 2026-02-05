import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { ThumbsUp, Clock, User, Building, Eye } from "lucide-react";
import { getApiUrl } from '../utils/apiConfig';

const ReviewCard = ({ review: initialReview, showFullContent = false, onViewMore }) => {
  const { user } = useAuth();
  const [review, setReview] = useState(initialReview);
  const [isExpanded, setIsExpanded] = useState(showFullContent);
  const [loading, setLoading] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    if (review.hasOwnProperty('isLiked')) {
      setHasLiked(review.isLiked);
    } else if (user && review.likedBy) {
      setHasLiked(review.likedBy.includes(user.enrollment));
    } else {
      setHasLiked(false);
    }
  }, [user, review.likedBy, review.isLiked]);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(getApiUrl(`/reviews/${review._id}/like`), {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local state with new likes count and update likedBy array to keep UI consistent
      // Crucially, update isLiked so useEffect doesn't revert the state
      const newLikedBy = res.data.liked
        ? [...(review.likedBy || []), user.enrollment]
        : (review.likedBy || []).filter(id => id !== user.enrollment);

      const isLiked = res.data.liked;

      setReview(prev => ({
        ...prev,
        likes: res.data.likes,
        likedBy: newLikedBy,
        isLiked: isLiked
      }));

      // hasLiked will be updated by useEffect, but we can set it here too for speed
      setHasLiked(isLiked);
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
    if (typeof text !== 'string') return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Helper to format round names (HR -> HR, others -> Capitalized)
  const formatRoundName = (name) => {
    if (name.toLowerCase() === 'hr') return 'HR';
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const renderSteps = (steps, expanded) => {
    if (!steps) return <span className="text-gray-400 italic">No details provided.</span>;

    // Handle legacy string format
    if (typeof steps === 'string') {
      return (
        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
          {expanded ? steps : truncateText(steps)}
        </p>
      );
    }

    // Handle new object format
    if (typeof steps === 'object') {
      const rounds = Object.keys(steps).filter(key => steps[key] && steps[key].trim());

      if (rounds.length === 0) return <span className="text-gray-400 italic">No details provided.</span>;

      if (!expanded) {
        // Preview mode: Show first non-empty round truncated
        const firstRound = rounds[0];
        return (
          <div className="text-gray-600 text-sm leading-relaxed">
            <span className="font-semibold text-gray-700">{formatRoundName(firstRound)}: </span>
            {truncateText(steps[firstRound])}
            {rounds.length > 1 && <span className="text-gray-400 text-xs ml-1">(+{rounds.length - 1} more rounds)</span>}
          </div>
        );
      }

      // Expanded mode: Show all rounds
      return (
        <div className="space-y-3 mt-2">
          {rounds.map(round => (
            <div key={round} className="bg-gray-50 p-3 rounded-md border border-gray-100">
              <h5 className="font-semibold text-gray-700 text-sm mb-1">{formatRoundName(round)} Round</h5>
              <p className="text-gray-600 text-sm whitespace-pre-wrap">{steps[round]}</p>
            </div>
          ))}
        </div>
      );
    }
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
          {/* Interview Process - Always visible (truncated if not expanded) */}
          <div>
            <h4 className="text-sm font-bold text-gray-800 mb-1 border-l-2 border-vgec-blue pl-2">
              Interview Process
            </h4>
            {renderSteps(review.steps, isExpanded)}
          </div>


          {/* Full Content (Expanded) */}
          {isExpanded && (
            <>
              {review.tips && (
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 animate-fadeIn mt-3">
                  <h4 className="text-xs font-bold text-vgec-orange uppercase mb-1">Tips for Juniors</h4>
                  <p className="text-gray-700 text-sm italic whitespace-pre-wrap">{review.tips}</p>
                </div>
              )}

              {review.comments && (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 animate-fadeIn mt-3">
                  <h4 className="text-xs font-bold text-blue-800 uppercase mb-1">Additional Comments</h4>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">{review.comments}</p>
                </div>
              )}
            </>
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

        {/* Show button - if onViewMore is provided, always show "View More" to open modal. 
            Otherwise fall back to expand logic if content is long/hidden */}
        {/* Show button - if onViewMore is provided, always show "View More" to open modal. 
            Otherwise fall back to expand logic if content is long/hidden */}
        {/* Show button logic updated to handle object length check somewhat loosely for object types */}
        {(onViewMore || (typeof review.steps === 'string' ? review.steps.length > 200 : true) || review.tips || review.comments) && (
          <button
            onClick={() => onViewMore ? onViewMore(review) : setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-vgec-blue bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <Eye className="h-4 w-4" />
            {onViewMore ? "View Details" : (isExpanded ? "Show Less" : "View Details")}
          </button>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
