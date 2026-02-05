import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Trash2, AlertCircle, Building, Clock, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getApiUrl } from '../../utils/apiConfig';
import ReviewDetailsModal from '../../components/ReviewDetailsModal';

const MyPosts = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const [selectedReview, setSelectedReview] = useState(null);

    useEffect(() => {
        fetchMyReviews();
    }, []);

    const fetchMyReviews = async () => {
        try {
            setError(null);
            const token = localStorage.getItem('token');
            const res = await axios.get(getApiUrl('/reviews/my-reviews'), {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReviews(res.data);
        } catch (err) {
            console.error("Failed to fetch my reviews", err);
            setError("Failed to load reviews. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this review? This action cannot be undone.")) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(getApiUrl(`/reviews/my-reviews/${id}`), {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Update UI locally
            setReviews(reviews.filter(r => r._id !== id));
            alert("Review deleted successfully.");
        } catch (err) {
            console.error("Delete error:", err);
            alert(`Error deleting review: ${err.response?.data?.message || err.message}`);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vgec-blue"></div>
        </div>
    );

    if (error) return (
        <div className="max-w-4xl mx-auto mt-8 p-4 bg-red-100 text-red-700 border border-red-200 rounded-lg text-center">
            {error}
            <button onClick={fetchMyReviews} className="block mx-auto mt-2 text-sm font-bold underline">Try Again</button>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-vgec-blue mb-8 font-serif border-b border-gray-200 pb-4">
                My Reviews
            </h1>

            {reviews.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                    <AlertCircle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No reviews yet</h3>
                    <p className="mt-1 text-gray-500">You haven't posted any reviews yet.</p>
                    <div className="mt-6">
                        <Link to="/add-review" className="text-white bg-vgec-blue hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors">
                            Write your first review
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {reviews.map(review => (
                        <ReviewItem
                            key={review._id}
                            review={review}
                            handleDelete={handleDelete}
                            onViewMore={setSelectedReview}
                        />
                    ))}
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

const ReviewItem = ({ review, handleDelete, onViewMore }) => {
    const renderStepsPreview = (steps) => {
        if (!steps) return <span className="text-gray-400 italic">No details.</span>;

        // Handle object
        if (typeof steps === 'object') {
            const rounds = Object.keys(steps).filter(k => steps[k]);
            if (rounds.length === 0) return <span className="text-gray-400 italic">No details.</span>;

            const firstRound = rounds[0];
            const text = steps[firstRound];
            const truncated = text.length > 100 ? text.substring(0, 100) + '...' : text;

            return (
                <span className="text-gray-700 text-sm">
                    <span className="font-semibold capitalize text-gray-800">{firstRound}:</span> {truncated}
                    {rounds.length > 1 && <span className="text-xs text-gray-500 ml-1">(+{rounds.length - 1} more)</span>}
                </span>
            );
        }

        // Handle string
        const truncated = steps.length > 150 ? steps.substring(0, 150) + '...' : steps;
        return <p className="text-gray-700 text-sm whitespace-pre-wrap">{truncated}</p>;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md h-full flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-vgec-blue flex items-center gap-2">
                            <Building className="h-5 w-5 text-vgec-orange" />
                            {review.company_name}
                        </h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${review.status === 'approved' ? 'bg-green-100 text-green-700' :
                            review.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                            {review.status}
                        </span>
                    </div>
                    <p className="text-gray-600 font-medium mb-1">{review.role} ({review.type})</p>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                        <Clock size={14} />
                        {new Date(review.created_at).toLocaleDateString()}
                    </div>
                </div>

                <div className="ml-4 flex flex-col gap-2">
                    <button
                        onClick={() => handleDelete(review._id)}
                        className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors group"
                        title="Delete Review"
                    >
                        <Trash2 size={20} className="group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            </div>

            <div className="flex-1 space-y-4">
                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Steps</h4>
                    {renderStepsPreview(review.steps)}
                </div>
                {review.tips && (
                    <div className="mt-2 text-xs">
                        <span className="font-bold text-gray-500">Tips:</span> <span className="text-gray-600 line-clamp-1">{review.tips}</span>
                    </div>
                )}
                {review.comments && (
                    <div className="mt-1 text-xs">
                        <span className="font-bold text-gray-500">Comments:</span> <span className="text-gray-600 line-clamp-1">{review.comments}</span>
                    </div>
                )}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                <button
                    onClick={() => onViewMore(review)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-vgec-blue bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                    <Eye className="h-4 w-4" />
                    View Details
                </button>
            </div>

            {review.status === 'approved' && review.approved_by_email && (
                <div className="mt-4 pt-2 border-t border-gray-50 text-xs text-green-700">
                    <span className="font-semibold">Approved by:</span> {review.approved_by_email}
                </div>
            )}
        </div>
    );
};

export default MyPosts;
