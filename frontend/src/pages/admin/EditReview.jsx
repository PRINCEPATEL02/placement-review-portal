import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Save, Building, Type } from 'lucide-react';

const AdminEditReview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        // Since we don't have a single review get endpoint, we might filter from all reviews 
        // Or implement a specific Get By ID endpoint.
        // For now, let's fetch all (admin mode) and filter client side for quickness, 
        // OR better: ensure backend ReviewController has GetById? It does not explicitly.
        // Let's rely on dashboard strictly passing data? No, page refresh would break it.
        // Let's implement fetch all and find.
        const fetchReview = async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/reviews?admin=true');
            const review = res.data.find(r => r._id === id);
            if (review) setFormData(review);
        };
        fetchReview();
    }, [id]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://localhost:5000/api/reviews/${id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/admin');
        } catch (err) {
            alert('Error updating review');
        }
    };

    if (!formData) return <div>Loading...</div>;

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-vgec-blue p-6 text-white text-center">
                    <h2 className="text-2xl font-bold">Edit Review</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                            <div className="relative">
                                <Building className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input name="company_name" value={formData.company_name} onChange={handleChange} required
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-vgec-blue outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                            <input name="role" value={formData.role} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-vgec-blue outline-none" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                            <select name="type" value={formData.type} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-vgec-blue outline-none bg-white">
                                <option value="on campus">On Campus</option>
                                <option value="off campus">Off Campus</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Level</label>
                            <select name="level" value={formData.level} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-vgec-blue outline-none bg-white">
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Steps</label>
                        <textarea name="steps" value={formData.steps} onChange={handleChange} rows="6"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-vgec-blue outline-none" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Tips</label>
                        <textarea name="tips" value={formData.tips} onChange={handleChange} rows="3"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-vgec-blue outline-none" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Comments</label>
                        <textarea name="comments" value={formData.comments || ''} onChange={handleChange} rows="2"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-vgec-blue outline-none" />
                    </div>

                    <button type="submit" className="w-full bg-vgec-orange hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md">
                        <Save size={20} /> Update Review
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminEditReview;
