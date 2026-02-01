import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, Clock, User, XCircle, Shield } from 'lucide-react';

const PendingRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState('');

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/auth/pending-users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequests(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleApprove = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/auth/approve-user/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMsg('User approved successfully!');
            // Refresh list
            fetchRequests();

            // Clear message after 3 seconds
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            setMsg('Error approving user');
        }
    };

    if (loading) return (
        <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vgec-blue"></div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Pending User Approvals</h2>
                    <p className="text-gray-500 text-sm">Review and approve new account requests</p>
                </div>
                <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                    <Clock size={16} /> Pending: {requests.length}
                </div>
            </div>

            {msg && (
                <div className={`p-4 rounded-lg mb-6 text-center font-medium animate-in fade-in slide-in-from-top-2 ${msg.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {msg}
                </div>
            )}

            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                {requests.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <CheckCircle size={48} className="mx-auto text-green-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">All caught up!</h3>
                        <p>There are no pending account requests at the moment.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User Details</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Enrollment/ID</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {requests.map((req) => (
                                    <tr key={req._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-vgec-blue/10 flex items-center justify-center text-vgec-blue font-bold">
                                                    {req.first_name ? req.first_name[0] : 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{req.first_name} {req.last_name}</p>
                                                    <p className="text-sm text-gray-500">{req.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${req.role === 'admin'
                                                    ? 'bg-purple-100 text-purple-800'
                                                    : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {req.role === 'admin' ? <Shield size={12} /> : <User size={12} />}
                                                {req.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                                            {req.enrollment}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleApprove(req._id)}
                                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md flex items-center gap-2 ml-auto"
                                            >
                                                <CheckCircle size={16} /> Approve
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PendingRequests;
