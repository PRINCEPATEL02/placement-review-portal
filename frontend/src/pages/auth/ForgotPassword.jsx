import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const result = await forgotPassword({ email });

      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-secondary-900">
              Check Your Email
            </h2>
            <p className="mt-2 text-sm text-secondary-600">
              We've sent a password to on this mail id <strong>{email}</strong>
            </p>
          </div>

          <div className="card">
            <div className="text-center space-y-4">
              <p className="text-secondary-700">
                If you don't see the email in your inbox, please check your spam
                folder. The link will expire in 24 hours.
              </p>

              <div className="space-y-3">
                <Link
                  to="/auth/login"
                  className="btn-primary w-full inline-flex items-center justify-center space-x-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Back to Login</span>
                </Link>

                <button
                  onClick={() => setSuccess(false)}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Didn't receive the email? Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center">
            <Mail className="h-8 w-8 text-primary-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-secondary-900">
            Forgot Your Password?
          </h2>
          <p className="mt-2 text-sm text-secondary-600">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        <div className="card">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-secondary-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input-field"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="mt-1 text-xs text-secondary-500">
                We'll send a password reset link to this email
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending Reset Link..." : "Send Reset Link"}
              </button>
            </div>

            <div className="text-center">
              <span className="text-sm text-secondary-600">
                Remember your password?{" "}
                <Link
                  to="/auth/login"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Sign in
                </Link>
              </span>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-xs text-secondary-500">
            Having trouble? Contact the placement office at{" "}
            <a
              href="mailto:placement@college.edu"
              className="text-primary-600 hover:text-primary-700"
            >
              placement@college.edu
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
