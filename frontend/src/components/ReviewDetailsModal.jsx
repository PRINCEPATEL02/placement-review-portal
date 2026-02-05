import React from 'react';
import { X, Building, Clock, User, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const ReviewDetailsModal = ({ review, onClose }) => {
    if (!review) return null;

    const getLevelColor = (level) => {
        switch (level) {
            case "easy": return "bg-green-100 text-green-800 border-green-200";
            case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "hard": return "bg-red-100 text-red-800 border-red-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-start justify-between bg-gray-50/50">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Building className="text-vgec-orange" />
                            {review.company_name}
                        </h2>
                        <div className="flex items-center gap-3 mt-2">
                            <span className="text-lg font-medium text-vgec-blue">{review.role}</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border ${getLevelColor(review.level)}`}>
                                {review.level}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-blue-50 text-blue-700 border border-blue-100">
                                {review.type}
                            </span>
                            {review.status && (
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${getStatusColor(review.status)}`}>
                                    {review.status}
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-1.5">
                            <Clock size={16} />
                            {new Date(review.created_at || review.date_time).toLocaleDateString("en-IN", {
                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <User size={16} />
                            <span>Created by: {review.author || review.enrollment || 'Anonymous'}</span>
                        </div>
                    </div>

                    {/* Interview Process */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                            Interview Process
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-700 leading-relaxed">
                            {typeof review.steps === 'object' && review.steps !== null ? (
                                <div className="space-y-4">
                                    {Object.keys(review.steps).filter(k => review.steps[k]).map(round => (
                                        <div key={round}>
                                            <h4 className="font-bold text-gray-900 mb-1 text-sm border-b border-gray-200 pb-1 inline-block">
                                                {round.toLowerCase() === 'hr' ? 'HR' : round.charAt(0).toUpperCase() + round.slice(1)} Round
                                            </h4>
                                            <p className="whitespace-pre-wrap mt-1 text-sm">{review.steps[round]}</p>
                                        </div>
                                    ))}
                                    {Object.keys(review.steps).length === 0 && <p className="italic text-gray-400">No details provided.</p>}
                                </div>
                            ) : (
                                <p className="whitespace-pre-wrap">{review.steps || <span className="italic text-gray-400">No details provided.</span>}</p>
                            )}
                        </div>
                    </div>

                    {/* Tips */}
                    {review.tips && (
                        <div>
                            <h3 className="text-sm font-bold text-vgec-orange uppercase tracking-wider mb-2 flex items-center gap-2">
                                Tips for Juniors
                            </h3>
                            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-gray-800 italic">
                                {review.tips}
                            </div>
                        </div>
                    )}

                    {/* Comments */}
                    {review.comments && (
                        <div>
                            <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                                Additional Comments
                            </h3>
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-900">
                                {review.comments}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    {review.approved_by_email && (
                        <div className="mr-auto self-center text-xs text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                            Approved by: {review.approved_by_email}
                        </div>
                    )}
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewDetailsModal;
