import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, Shield, Loader, CheckCircle, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { getApiUrl } from '../../utils/apiConfig';

const AddUser = () => {
    const [formData, setFormData] = useState({
        enrollment: '',
        email: '',
        password: '',
        role: 'student',
        first_name: '',
        last_name: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const token = localStorage.getItem('token');
            // Use Admin-only endpoint to create auto-approved users
            await axios.post(getApiUrl('/auth/create-user'), formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(`Successfully created ${formData.role} account for ${formData.first_name || 'User'}!`);
            // Reset form
            setFormData({
                enrollment: '',
                email: '',
                password: '',
                role: 'student',
                first_name: '',
                last_name: ''
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto px-4 md:px-0">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-vgec-blue py-6 px-6 md:px-8 flex flex-col md:flex-row justify-between items-center text-white gap-4 text-center md:text-left">
                    <div>
                        <h2 className="text-2xl font-bold font-serif">Add New User</h2>
                        <p className="text-blue-200 text-sm">Create Student or Admin accounts</p>
                    </div>
                    <div className="bg-white/10 p-3 rounded-full hidden md:block">
                        <User size={24} />
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    {message && (
                        <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 flex items-center gap-2 border border-green-100 animate-in fade-in slide-in-from-top-2">
                            <CheckCircle size={20} /> {message}
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100 animate-in fade-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Enrollment / Employee ID</label>
                            <div className="relative">
                                <Shield className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    name="enrollment"
                                    value={formData.enrollment}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-vgec-blue focus:ring-1 focus:ring-vgec-blue outline-none transition-all placeholder-gray-400"
                                    placeholder="e.g. 210170116010"
                                    required
                                />
                            </div>
                        </div>

                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                            <input
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-vgec-blue focus:ring-1 focus:ring-vgec-blue outline-none transition-all"
                                placeholder="First Name"
                            />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                            <input
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-vgec-blue focus:ring-1 focus:ring-vgec-blue outline-none transition-all"
                                placeholder="Last Name"
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-vgec-blue focus:ring-1 focus:ring-vgec-blue outline-none transition-all"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-200 focus:border-vgec-blue focus:ring-1 focus:ring-vgec-blue outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Role Assignment</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <label className={`p-4 border rounded-xl cursor-pointer text-center transition-all flex flex-col items-center gap-2 ${formData.role === 'student' ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                                    <input type="radio" name="role" value="student" className="hidden" onChange={handleChange} checked={formData.role === 'student'} />
                                    <User size={24} />
                                    Student
                                </label>
                                <label className={`p-4 border rounded-xl cursor-pointer text-center transition-all flex flex-col items-center gap-2 ${formData.role === 'admin' ? 'border-vgec-orange bg-orange-50 text-vgec-orange font-bold' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                                    <input type="radio" name="role" value="admin" className="hidden" onChange={handleChange} checked={formData.role === 'admin'} />
                                    <Shield size={24} />
                                    Administrator
                                </label>
                            </div>
                        </div>

                        <div className="col-span-1 md:col-span-2 mt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-vgec-blue hover:bg-blue-900 text-white font-bold py-3.5 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader className="animate-spin" size={20} /> : <User size={20} />}
                                Create User Account
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddUser;
