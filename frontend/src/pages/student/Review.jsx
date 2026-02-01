import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Save, Send, Building, Type, List } from 'lucide-react';
import { getApiUrl } from '../../utils/apiConfig';

const Review = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        company_name: '',
        role: '',
        type: 'on campus',
        steps: '',
        level: 'medium',
        tips: ''
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(getApiUrl('/reviews'), formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Review submitted for approval!');
            navigate('/');
        } catch (err) {
            alert('Error submitting review');
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-vgec-blue p-8 text-white text-center">
                    <h2 className="text-3xl font-bold mb-2">Share Your Experience</h2>
                    <p className="opacity-90">Help your juniors ace their interviews by sharing your journey.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name *</label>
                            <div className="relative">
                                <Building className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input name="company_name" value={formData.company_name} onChange={handleChange} required
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                    placeholder="e.g. Google" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Role Offered</label>
                            <input name="role" value={formData.role} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                placeholder="e.g. Software Engineer" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Placement Type *</label>
                            <div className="relative">
                                <Type className="absolute left-3 top-3 text-gray-400" size={18} />
                                <select name="type" value={formData.type} onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none bg-white">
                                    <option value="on campus">On Campus</option>
                                    <option value="off campus">Off Campus</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty Level *</label>
                            <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200">
                                {['easy', 'medium', 'hard'].map((l) => (
                                    <button
                                        key={l}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, level: l })}
                                        className={`flex-1 py-2 text-sm font-medium rounded-md capitalize transition-all ${formData.level === l ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Interview Steps & Experience *</label>
                        <textarea name="steps" value={formData.steps} onChange={handleChange} required rows="6"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            placeholder="Describe the rounds, coding questions asked, and overall process..." />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Tips for Juniors</label>
                        <textarea name="tips" value={formData.tips} onChange={handleChange} rows="3"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            placeholder="Any advice or resources that helped you?" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Comments</label>
                        <textarea name="comments" value={formData.comments} onChange={handleChange} rows="3"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            placeholder="Any other details you want to share..." />
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
                            <Send size={20} /> Submit Review
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Review;
