import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail } from 'lucide-react';
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [captchaToken, setCaptchaToken] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!captchaToken) {
            setError("Please verify you are human.");
            return;
        }

        try {
            const user = await login(email, password);
            if (user.role === 'admin') navigate('/admin');
            else navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex justify-center items-start pt-20 min-h-[80vh]">
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-vgec-blue py-6 text-center">
                    <h2 className="text-2xl font-bold text-white mb-1">Student / Admin Login</h2>
                    <p className="text-blue-100 text-sm">Access the Official Placement Portal</p>
                </div>

                <div className="p-8">
                    {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center border border-red-100">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-300 focus:border-vgec-blue focus:ring-1 focus:ring-vgec-blue outline-none transition-all placeholder-gray-400 text-sm"
                                    placeholder="student@vgecg.ac.in"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="block text-sm font-semibold text-gray-700">Password</label>
                                <Link to="/forgot-password" className="text-xs text-vgec-blue hover:underline font-medium">Forgot Password?</Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-300 focus:border-vgec-blue focus:ring-1 focus:ring-vgec-blue outline-none transition-all placeholder-gray-400 text-sm"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-center mt-4">
                            <ReCAPTCHA
                                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                                onChange={(token) => setCaptchaToken(token)}
                            />
                        </div>

                        <button type="submit" className="w-full bg-vgec-orange hover:bg-orange-700 text-white font-bold py-3 rounded-md shadow-md transition-all hover:-translate-y-0.5 mt-2">
                            Sign In
                        </button>

                        <p className="text-center text-gray-600 text-sm mt-6">
                            New Student? <Link to="/register" className="text-vgec-blue font-bold hover:underline">Register Now</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
