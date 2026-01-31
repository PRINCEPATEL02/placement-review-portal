import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Check, X, Trash2, Shield, AlertCircle, Edit2 } from 'lucide-react';

const Dashboard = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/reviews?admin=true');
            setReviews(res.data);
        } catch (err) {
            console.error("Failed to fetch reviews");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://localhost:5000/api/reviews/${id}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchReviews();
        } catch (err) {
            alert('Error approving review');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/reviews/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchReviews();
        } catch (err) {
            alert('Error deleting review');
        }
    };

    if (loading) return <div className="p-8 text-center text-vgec-blue">Loading dashboard...</div>;

    const pendingReviews = reviews.filter(r => r.status === 'pending');
    const approvedReviews = reviews.filter(r => r.status === 'approved');

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-vgec-blue flex items-center gap-2 font-serif">
                <Shield className="text-vgec-orange" /> Admin Dashboard
            </h1>

            {/* Pending Reviews Section */}
            <div className="mb-12">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-vgec-orange border-b border-gray-200 pb-2">
                    <AlertCircle size={20} /> Pending Approvals
                    <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">{pendingReviews.length}</span>
                </h2>

                {pendingReviews.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl border border-dashed border-gray-300 text-center text-gray-500">
                        No pending reviews.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pendingReviews.map(review => (
                            <AdminReviewCard key={review._id} review={review} onApprove={() => handleApprove(review._id)} onDelete={() => handleDelete(review._id)} isPending />
                        ))}
                    </div>
                )}
            </div>

            {/* Approved Reviews Section */}
            <div>
                <h2 className="text-xl font-bold mb-4 text-vgec-blue border-b border-gray-200 pb-2">Published Reviews</h2>
                <div className="space-y-4">
                    {approvedReviews.map(review => (
                        <AdminReviewCard key={review._id} review={review} onDelete={() => handleDelete(review._id)} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const AdminReviewCard = ({ review, onApprove, onDelete, isPending }) => (
    <div className={`bg-white rounded-xl shadow-sm border ${isPending ? 'border-orange-200 bg-orange-50/30' : 'border-gray-200'} p-6 transition-all hover:shadow-md`}>
        <div className="flex justify-between items-start">
            <div className="flex-1 pr-6">
                <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-vgec-blue">{review.company_name}</h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">{review.role}</span>
                    <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${review.level === 'easy' ? 'bg-green-100 text-green-700' : review.level === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        {review.level}
                    </span>
                </div>
                <div className="mb-2">
                    <p className="text-gray-800 text-sm font-medium">Steps:</p>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{review.steps}</p>
                </div>
                {review.tips && (
                    <div className="mb-2">
                        <p className="text-gray-800 text-sm font-medium">Tips:</p>
                        <p className="text-gray-500 text-xs italic mb-2 line-clamp-2">{review.tips}</p>
                    </div>
                )}
                <div className="flex gap-4 text-xs text-gray-400 mt-3 border-t border-gray-100 pt-2">
                    <span>{review.type}</span>
                    <span>{new Date(review.created_at || review.date_time).toLocaleDateString()}</span>
                    <span>Auth: {review.author}</span>
                </div>
            </div>

            <div className="flex flex-col gap-2 ml-4">
                {isPending && (
                    <button onClick={onApprove} className="flex items-center justify-center p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors" title="Approve">
                        <Check size={20} />
                    </button>
                )}
                <Link to={`/admin/edit/${review._id}`} className="flex items-center justify-center p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors" title="Edit">
                    <Edit2 size={20} />
                </Link>
                <button onClick={onDelete} className="flex items-center justify-center p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors" title="Delete">
                    <Trash2 size={20} />
                </button>
            </div>
        </div>
    </div>
);

export default Dashboard;
