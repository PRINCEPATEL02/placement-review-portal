import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [enrollment, setEnrollment] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Enrollment Number</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    value={enrollment}
                                    onChange={(e) => setEnrollment(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-300 focus:border-vgec-blue focus:ring-1 focus:ring-vgec-blue outline-none transition-all placeholder-gray-400 text-sm"
                                    placeholder="230170116055"
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
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-10 py-3 rounded-md border border-gray-300 focus:border-vgec-blue focus:ring-1 focus:ring-vgec-blue outline-none transition-all placeholder-gray-400 text-sm"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
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
