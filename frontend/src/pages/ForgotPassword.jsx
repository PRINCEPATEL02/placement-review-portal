import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { getApiUrl } from '../utils/apiConfig';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(getApiUrl('/auth/forgot-password'), { email });
            setSubmitted(true);
        } catch (err) {
            alert(err.response?.data?.message || 'Error processing request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <Link to="/login" className="text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-6 text-sm font-medium">
                    <ArrowLeft size={16} /> Back to Login
                </Link>

                <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">Reset Password</h2>
                <p className="text-center text-gray-500 mb-8">Enter your email address to receive password reset instructions.</p>

                {submitted ? (
                    <div className="bg-green-50 text-green-700 p-6 rounded-xl text-center">
                        <p className="font-semibold mb-2">Check your email</p>
                        <p className="text-sm">We've sent your new credentials (temporary password) to {email}.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    placeholder="student@example.com"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full text-white font-semibold py-3 rounded-lg shadow-lg transition-all ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-1 shadow-blue-500/30'}`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                                    Sending...
                                </span>
                            ) : "Send Reset Link"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
