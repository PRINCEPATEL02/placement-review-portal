import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import { getApiUrl } from "../../utils/apiConfig";

import { useMutation, useQueryClient } from "@tanstack/react-query";

const AddReview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    company_name: "",
    role: "",
    type: "",
    level: "",
    steps: "",
    tips: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.company_name.trim()) {
      newErrors.company_name = "Company name is required";
    }
    if (!formData.role.trim()) {
      newErrors.role = "Role is required";
    }
    if (!formData.type) {
      newErrors.type = "Placement type is required";
    }
    if (!formData.level) {
      newErrors.level = "Difficulty level is required";
    }
    if (!formData.steps.trim()) {
      newErrors.steps = "Placement steps are required";
    }
    if (!formData.tips.trim()) {
      newErrors.tips = "Tips for juniors are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const mutation = useMutation({
    mutationFn: async (newReview) => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("No authorization token found");

      const response = await fetch(getApiUrl('/reviews'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newReview)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit review');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['reviews']); // Mark reviews as stale so they reload immediately
      navigate("/student/home", {
        state: {
          message: "Your placement review has been submitted successfully!",
        },
      });
    },
    onError: (error) => {
      console.error("Error submitting review:", error);
      setErrors({ submit: error.message || "Failed to submit review. Please try again." });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    mutation.mutate(formData);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/student/home")}
          className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Home</span>
        </button>

        <h1 className="text-3xl font-bold text-secondary-900 mb-2">
          Share Your Placement Experience
        </h1>
        <p className="text-secondary-600">
          Help fellow students by sharing your placement journey and insights.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span>{errors.submit}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Name */}
            <div>
              <label
                htmlFor="company_name"
                className="block text-sm font-medium text-secondary-700 mb-2"
              >
                Company Name *
              </label>
              <input
                type="text"
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                className={`input-field ${errors.company_name ? "border-red-300 focus:ring-red-500" : ""}`}
                placeholder="e.g., Google, Microsoft, Amazon"
              />
              {errors.company_name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.company_name}
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-secondary-700 mb-2"
              >
                Role/Position *
              </label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`input-field ${errors.role ? "border-red-300 focus:ring-red-500" : ""}`}
                placeholder="e.g., Software Engineer, Data Analyst"
              />
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Placement Type */}
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-secondary-700 mb-2"
              >
                Placement Type *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`input-field ${errors.type ? "border-red-300 focus:ring-red-500" : ""}`}
              >
                <option value="">Select placement type</option>
                <option value="on campus">On Campus</option>
                <option value="off campus">Off Campus</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type}</p>
              )}
            </div>

            {/* Difficulty Level */}
            <div>
              <label
                htmlFor="level"
                className="block text-sm font-medium text-secondary-700 mb-2"
              >
                Difficulty Level *
              </label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                className={`input-field ${errors.level ? "border-red-300 focus:ring-red-500" : ""}`}
              >
                <option value="">Select difficulty level</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              {errors.level && (
                <p className="mt-1 text-sm text-red-600">{errors.level}</p>
              )}
            </div>
          </div>

          {/* Placement Steps */}
          <div>
            <label
              htmlFor="steps"
              className="block text-sm font-medium text-secondary-700 mb-2"
            >
              Placement Process/Steps *
            </label>
            <textarea
              id="steps"
              name="steps"
              rows={6}
              value={formData.steps}
              onChange={handleChange}
              className={`input-field resize-none ${errors.steps ? "border-red-300 focus:ring-red-500" : ""}`}
              placeholder="Describe the complete placement process, including all rounds, interviews, tests, etc. Be as detailed as possible to help other students."
            />
            {errors.steps && (
              <p className="mt-1 text-sm text-red-600">{errors.steps}</p>
            )}
          </div>

          {/* Tips for Juniors */}
          <div>
            <label
              htmlFor="tips"
              className="block text-sm font-medium text-secondary-700 mb-2"
            >
              Tips for Juniors *
            </label>
            <textarea
              id="tips"
              name="tips"
              rows={4}
              value={formData.tips}
              onChange={handleChange}
              className={`input-field resize-none ${errors.tips ? "border-red-300 focus:ring-red-500" : ""}`}
              placeholder="Share preparation tips, resources, important topics, common mistakes to avoid, etc."
            />
            {errors.tips && (
              <p className="mt-1 text-sm text-red-600">{errors.tips}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-secondary-200">
            <button
              type="button"
              onClick={() => navigate("/student/home")}
              className="btn-secondary"
              disabled={mutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn-primary inline-flex items-center space-x-2"
            >
              {mutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Submit Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Guidelines */}
      < div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6" >
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Review Guidelines
        </h3>
        <ul className="text-blue-800 space-y-2 text-sm">
          <li>• Be honest and accurate in your description</li>
          <li>• Include specific details about the process and requirements</li>
          <li>• Share preparation resources and study materials</li>
          <li>• Mention any specific skills or technologies tested</li>
          <li>• Keep the content appropriate and professional</li>
        </ul>
      </div >
    </div >
  );
};

/* 
   We need to update the handleSubmit function entirely, but replace_file_content works on chunks. 
   I will target the handleSubmit function logic specifically.
   Actually, the user has simulation code inside handleSubmit. 
   I will use multi-replacement or just replace the function body.
*/

export default AddReview;
