import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Save, Edit, User, Mail, Calendar, Award } from "lucide-react";

const StudentProfile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    middle_name: user?.middle_name || "",
    email: user?.email || "",
    enrollment: user?.enrollment || "",
  });
  const [stats, setStats] = useState({
    totalReviews: 0,
    totalLikes: 0,
    totalViews: 0,
    joinDate: "2023-08-15",
  });

  useEffect(() => {
    // Simulate fetching user stats
    setTimeout(() => {
      setStats({
        totalReviews: 3,
        totalLikes: 45,
        totalViews: 234,
        joinDate: "2023-08-15",
      });
    }, 500);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update profile in context
      updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      middle_name: user?.middle_name || "",
      email: user?.email || "",
      enrollment: user?.enrollment || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">
          My Profile
        </h1>
        <p className="text-secondary-600">
          Manage your account information and view your contribution statistics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card text-center">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-12 w-12 text-primary-600" />
            </div>

            <h2 className="text-xl font-semibold text-secondary-900 mb-1">
              {user?.first_name} {user?.last_name}
            </h2>
            <p className="text-secondary-600 mb-2">{user?.enrollment}</p>
            <p className="text-sm text-secondary-500 mb-4">
              Student • {user?.role}
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-2 text-sm text-secondary-600">
                <Mail className="h-4 w-4" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-secondary-600">
                <Calendar className="h-4 w-4" />
                <span>
                  Joined {new Date(stats.joinDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="card mt-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Your Statistics
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Award className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-secondary-900">
                      Reviews Shared
                    </p>
                    <p className="text-xs text-secondary-600">
                      Helpful contributions
                    </p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  {stats.totalReviews}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-secondary-900">
                      Total Likes
                    </p>
                    <p className="text-xs text-secondary-600">
                      Community appreciation
                    </p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-green-600">
                  {stats.totalLikes}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Award className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-secondary-900">
                      Profile Views
                    </p>
                    <p className="text-xs text-secondary-600">
                      Visibility in community
                    </p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-purple-600">
                  {stats.totalViews}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-secondary-900">
                Personal Information
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-secondary inline-flex items-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="first_name"
                    className="block text-sm font-medium text-secondary-700 mb-2"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`input-field ${!isEditing ? "bg-secondary-50" : ""}`}
                  />
                </div>

                <div>
                  <label
                    htmlFor="last_name"
                    className="block text-sm font-medium text-secondary-700 mb-2"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`input-field ${!isEditing ? "bg-secondary-50" : ""}`}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="middle_name"
                  className="block text-sm font-medium text-secondary-700 mb-2"
                >
                  Middle Name (Optional)
                </label>
                <input
                  type="text"
                  id="middle_name"
                  name="middle_name"
                  value={formData.middle_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`input-field ${!isEditing ? "bg-secondary-50" : ""}`}
                />
              </div>

              <div>
                <label
                  htmlFor="enrollment"
                  className="block text-sm font-medium text-secondary-700 mb-2"
                >
                  Enrollment Number
                </label>
                <input
                  type="text"
                  id="enrollment"
                  name="enrollment"
                  value={formData.enrollment}
                  disabled
                  className="input-field bg-secondary-50 cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-secondary-500">
                  Enrollment number cannot be changed
                </p>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-secondary-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`input-field ${!isEditing ? "bg-secondary-50" : ""}`}
                />
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-4 pt-6 border-t border-secondary-200">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn-secondary"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary inline-flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
