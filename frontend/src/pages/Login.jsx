import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [enrollment, setEnrollment] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { user, login } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    React.useEffect(() => {
        if (user) {
            navigate(user.role === 'admin' ? '/admin' : '/', { replace: true });
        }
    }, [user, navigate]);

    // Prevent rendering if user is logged in
    if (user) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const loggedInUser = await login(enrollment, password);
            if (loggedInUser.role === 'admin') navigate('/admin', { replace: true });
            else navigate('/', { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex min-h-screen bg-blue-50 items-center justify-center p-4">
            <div className="flex w-full max-w-5xl bg-white rounded-lg shadow-2xl overflow-hidden min-h-[600px]">

                {/* Left Side - Login Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
                    <div className="w-full max-w-md mx-auto">

                        {/* Header Box */}
                        <div className="flex justify-center mb-10">
                            <div className="bg-vgec-blue text-white px-8 py-2 text-3xl font-bold uppercase tracking-wider shadow-md">
                                Login
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center border border-red-100">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Username / Enrollment */}
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">Username</label>
                                <input
                                    type="text"
                                    value={enrollment}
                                    onChange={(e) => setEnrollment(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vgec-blue focus:border-transparent transition placeholder-gray-400"
                                    placeholder="Enter Username Here..."
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vgec-blue focus:border-transparent transition placeholder-gray-400 pr-12"
                                        placeholder="Enter Password Here..."
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

                            {/* Actions */}
                            <div>
                                <button type="submit" className="w-full bg-[#1e293b] text-white font-bold py-3.5 rounded-md hover:bg-slate-800 transition duration-300 shadow-lg text-lg">
                                    Login
                                </button>
                            </div>

                            <div className="text-center pt-2">
                                <Link to="/forgot-password" className="text-vgec-blue font-semibold hover:underline text-sm">
                                    Forgot your password?
                                </Link>
                                <div className="mt-4 text-sm text-gray-500">
                                    New here? <Link to="/register" className="text-vgec-orange font-bold hover:underline">Register</Link>
                                </div>
                            </div>

                        </form>
                    </div>
                </div>

                {/* Right Side - Brand Section */}
                <div className="hidden md:flex w-1/2 bg-vgec-blue flex-col items-center justify-center text-white p-12 relative overflow-hidden">
                    {/* Decorative Circles */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center mb-8 shadow-2xl p-2">
                            {/* College Logo Placeholder - using Text if image not available */}
                            <div className="w-full h-full rounded-full border-4 border-vgec-blue flex items-center justify-center bg-white p-4">
                                <img src="/favicon.ico" alt="VGEC Logo" className="w-full h-full object-contain" />
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold uppercase tracking-widest text-center mt-4">
                            VGEC Review
                        </h2>
                        <div className="w-16 h-1 bg-vgec-orange mt-6 mb-4 rounded-full"></div>
                        <p className="text-blue-100 text-center max-w-sm font-light">
                            Vishwakarma Government Engineering College<br />Placement & Review Portal
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;
