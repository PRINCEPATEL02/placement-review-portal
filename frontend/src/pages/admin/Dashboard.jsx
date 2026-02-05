import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Check, X, Trash2, Shield, AlertCircle, Edit2 } from 'lucide-react';
import { getApiUrl } from '../../utils/apiConfig';

const Dashboard = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.role !== 'admin') {
            alert("Unauthorized: You must be an admin to view this page.");
            navigate('/');
        }
        fetchReviews();
    }, [user, navigate]);

    const fetchReviews = async () => {
        try {
            const res = await axios.get(getApiUrl('/reviews?admin=true'));
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
            console.log("Approving with token:", token ? "Present" : "Missing");
            await axios.put(getApiUrl(`/reviews/${id}/approve`), {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchReviews();
        } catch (err) {
            console.error("Approve error:", err);
            alert(`Error approving review: ${err.response?.data?.message || err.message}`);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(getApiUrl(`/reviews/${id}`), {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchReviews();
        } catch (err) {
            console.error("Delete error:", err);
            alert(`Error deleting review: ${err.response?.data?.message || err.message}`);
        }
    };

    if (loading) return <div className="p-8 text-center text-vgec-blue">Loading dashboard...</div>;

    const pendingReviews = reviews.filter(r => r.status === 'pending');
    const approvedReviews = reviews.filter(r => r.status === 'approved');

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-vgec-blue flex items-center gap-2 font-serif">
                    <Shield className="text-vgec-orange" /> Admin Dashboard
                </h1>
                <div className="text-right text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-200">
                    <p>Logged in as: <span className="font-bold">{user?.enrollment}</span></p>
                    <p>Role: <span className={`font-bold uppercase ${user?.role === 'admin' ? 'text-green-600' : 'text-red-500'}`}>{user?.role}</span></p>
                </div>
            </div>

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

const AdminReviewCard = ({ review, onApprove, onDelete, isPending }) => {
    const renderSteps = (steps) => {
        if (!steps) return <span className="italic text-gray-400">No steps provided.</span>;
        if (typeof steps === 'string') return steps;
        if (typeof steps === 'object') {
            const rounds = Object.keys(steps).filter(k => steps[k]);
            if (rounds.length === 0) return <span className="italic text-gray-400">No steps provided.</span>;
            return (
                <div className="flex flex-col gap-1">
                    {rounds.map(round => (
                        <div key={round} className="text-xs">
                            <span className="font-semibold capitalize text-gray-700">{round}:</span> <span className="text-gray-600">{steps[round].substring(0, 100)}{steps[round].length > 100 ? '...' : ''}</span>
                        </div>
                    ))}
                </div>
            );
        }
        return JSON.stringify(steps);
    };

    return (
        <div className={`bg-white rounded-xl shadow-sm border ${isPending ? 'border-orange-200 bg-orange-50/30' : 'border-gray-200'} p-4 md:p-6 transition-all hover:shadow-md`}>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1 w-full">
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                        <h3 className="text-lg font-bold text-vgec-blue break-words">{review.company_name}</h3>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200 whitespace-nowrap">{review.role}</span>
                        <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded whitespace-nowrap ${review.level === 'easy' ? 'bg-green-100 text-green-700' : review.level === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                            {review.level}
                        </span>
                    </div>
                    <div className="mb-2">
                        <p className="text-gray-800 text-sm font-medium">Steps:</p>
                        <div className="text-gray-600 text-sm mb-3">{renderSteps(review.steps)}</div>
                    </div>
                    {review.tips && (
                        <div className="mb-2">
                            <p className="text-gray-800 text-sm font-medium">Tips for Juniors:</p>
                            <p className="text-gray-600 text-xs italic mb-2 whitespace-pre-wrap bg-yellow-50 p-2 rounded border border-yellow-100">{review.tips}</p>
                        </div>
                    )}
                    {review.comments && (
                        <div className="mb-2">
                            <p className="text-gray-800 text-sm font-medium">Additional Comments:</p>
                            <p className="text-gray-600 text-xs mb-2 whitespace-pre-wrap bg-gray-50 p-2 rounded border border-gray-100">{review.comments}</p>
                        </div>
                    )}
                    <div className="flex flex-wrap gap-2 md:gap-4 text-xs text-gray-400 mt-3 border-t border-gray-100 pt-2">
                        <span>{review.type}</span>
                        <span>{new Date(review.created_at || review.date_time).toLocaleDateString()}</span>
                        <span>
                            Created by: <span className="font-semibold text-gray-600">{review.author || review.enrollment}</span>
                            {review.author && review.author !== review.enrollment && <span className="text-gray-400"> ({review.enrollment})</span>}
                        </span>
                    </div>
                </div>

                <div className="flex md:flex-col gap-2 w-full md:w-auto mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100 md:border-none justify-end">
                    {isPending && (
                        <button onClick={onApprove} className="flex-1 md:flex-none flex items-center justify-center p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors" title="Approve">
                            <Check size={20} /> <span className="md:hidden ml-2 text-sm font-medium">Approve</span>
                        </button>
                    )}
                    <Link to={`/admin/edit/${review._id}`} className="flex-1 md:flex-none flex items-center justify-center p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors" title="Edit">
                        <Edit2 size={20} /> <span className="md:hidden ml-2 text-sm font-medium">Edit</span>
                    </Link>
                    <button onClick={onDelete} className="flex-1 md:flex-none flex items-center justify-center p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors" title="Delete">
                        <Trash2 size={20} /> <span className="md:hidden ml-2 text-sm font-medium">Delete</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
