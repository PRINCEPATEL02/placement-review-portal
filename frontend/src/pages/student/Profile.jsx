import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Shield, Save, Lock, Eye, EyeOff } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState('');

    // Password Change State
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passMsg, setPassMsg] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get('http://localhost:5000/api/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfile(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.put('http://localhost:5000/api/auth/profile', profile, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMsg('Profile updated successfully!');
        } catch (err) {
            setMsg('Error updating profile');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setPassMsg('Passwords do not match');
            return;
        }
        if (newPassword.length < 6) {
            setPassMsg('Password must be at least 6 characters');
            return;
        }

        const token = localStorage.getItem('token');
        try {
            await axios.put('http://localhost:5000/api/auth/change-password', { newPassword }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPassMsg('Success: Password updated successfully');
            setTimeout(() => {
                setShowPasswordModal(false);
                setNewPassword('');
                setConfirmPassword('');
                setPassMsg('');
            }, 2000);
        } catch (err) {
            setPassMsg(err.response?.data?.message || 'Error updating password');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-vgec-blue p-8 text-white flex items-center gap-6">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold backdrop-blur-sm">
                        {profile.first_name ? profile.first_name.charAt(0) : 'U'}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">{profile.first_name || 'Student'} {profile.last_name}</h2>
                        <p className="text-blue-200 text-sm flex items-center gap-2 mt-1">
                            <Shield size={14} /> {profile.role ? profile.role.toUpperCase() : 'STUDENT'}
                        </p>
                    </div>
                </div>

                <div className="p-8">
                    {msg && <div className={`p-3 rounded-lg mb-6 text-sm text-center ${msg.includes('Success') ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>{msg}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                <input
                                    value={profile.first_name || ''}
                                    onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-vgec-blue focus:ring-1 focus:ring-vgec-blue outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                <input
                                    value={profile.last_name || ''}
                                    onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-vgec-blue focus:ring-1 focus:ring-vgec-blue outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    value={profile.email_id || ''}
                                    onChange={(e) => setProfile({ ...profile, email_id: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-vgec-blue focus:ring-1 focus:ring-vgec-blue outline-none"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1 ml-1">You can update your contact email here.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Enrollment Number</label>
                            <input value={profile.enrollment} disabled className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-500 cursor-not-allowed" />
                        </div>

                        {/* Change Password Button */}
                        <div>
                            <button
                                type="button"
                                onClick={() => setShowPasswordModal(true)}
                                className="text-vgec-blue hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                            >
                                <Lock size={14} /> Change Password
                            </button>
                        </div>

                        <button type="submit" className="w-full bg-vgec-orange hover:bg-orange-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md">
                            <Save size={18} /> Save Changes
                        </button>
                    </form>
                </div>
            </div>

            {/* Change Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">Change Password</h3>

                        {passMsg && (
                            <div className={`p-3 rounded-lg mb-4 text-sm text-center ${passMsg.includes('Success') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                {passMsg}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-vgec-blue outline-none pr-10"
                                        placeholder="Enter new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                    >
                                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-vgec-blue outline-none pr-10"
                                        placeholder="Confirm new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => { setShowPasswordModal(false); setPassMsg(''); setNewPassword(''); setConfirmPassword(''); }}
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePasswordChange}
                                className="flex-1 px-4 py-2 rounded-lg bg-vgec-blue text-white hover:bg-blue-700 font-medium"
                            >
                                Update Password
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
