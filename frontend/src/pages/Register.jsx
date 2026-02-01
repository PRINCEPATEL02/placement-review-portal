import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Shield, Eye, EyeOff } from 'lucide-react';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        enrollment: '',
        email: '',
        password: '',
        role: 'student',
        first_name: '',
        last_name: ''
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="flex justify-center items-center py-10">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-vgec-blue py-6 text-center">
                    <h2 className="text-2xl font-bold text-white mb-1">Create Account</h2>
                    <p className="text-blue-100 text-sm">Join the Official Placement Portal</p>
                </div>

                <div className="p-8">
                    {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center border border-red-100">{error}</div>}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Enrollment */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Enrollment Number</label>
                            <div className="relative">
                                <Shield className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    name="enrollment"
                                    value={formData.enrollment}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Name Fields */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                            <input
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                            <input
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            />
                        </div>

                        {/* Email */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
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

                        {/* Role Selection */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
                            <div className="flex gap-4">
                                <label className={`flex-1 p-4 border rounded-xl cursor-pointer text-center transition-all ${formData.role === 'student' ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                                    <input type="radio" name="role" value="student" className="hidden" onChange={handleChange} checked={formData.role === 'student'} />
                                    Student
                                </label>
                                <label className={`flex-1 p-4 border rounded-xl cursor-pointer text-center transition-all ${formData.role === 'admin' ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-semibold' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                                    <input type="radio" name="role" value="admin" className="hidden" onChange={handleChange} checked={formData.role === 'admin'} />
                                    Administrator
                                </label>
                            </div>
                        </div>

                        <div className="col-span-2">
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1">
                                Create Account
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-gray-600 text-sm mt-6">
                        Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
