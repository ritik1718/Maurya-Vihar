'use client'

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Upload, User, Mail, Phone, Briefcase, Building, FileText, Camera, Send, AlertCircle } from 'lucide-react';

const PORForm = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    clearErrors
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      bitsId: '',
      email: '',
      mobile: '',
      position: '',
      department: '',
      profilePicture: '',
      description: ''
    }
  });

  const watchedFields = watch();

  // Validation rules
  const validationRules = {
    name: {
      required: 'Name is required',
      minLength: {
        value: 2,
        message: 'Name must be at least 2 characters'
      },
      maxLength: {
        value: 50,
        message: 'Name cannot exceed 50 characters'
      },
      pattern: {
        value: /^[a-zA-Z\s]+$/,
        message: 'Name can only contain letters and spaces'
      }
    },
    bitsId: {
      required: 'BITS ID is required',
    
    },
    email: {
      required: 'Email is required',
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'Please enter a valid email address'
      }
    },
    mobile: {
      required: 'Mobile number is required',
      pattern: {
        value: /^[6-9]\d{9}$/,
        message: 'Enter a valid 10-digit mobile number'
      }
    },
    position: {
      required: 'Position is required',
      minLength: {
        value: 2,
        message: 'Position must be at least 2 characters'
      }
    },
    department: {
      required: 'Department is required',
      minLength: {
        value: 2,
        message: 'Department must be at least 2 characters'
      }
    },
    description: {
      required: 'Description is required',
      minLength: {
        value: 10,
        message: 'Description must be at least 10 characters'
      },
      maxLength: {
        value: 500,
        message: 'Description cannot exceed 500 characters'
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, or WebP)');
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      clearErrors('profilePicture');
      
      // Test Cloudinary configuration
      if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
        toast.error('Cloudinary configuration is missing. Please check your environment variables.');
        return;
      }
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
    
    // Add additional parameters for better upload handling
    formData.append('folder', 'por-profiles'); // Optional: organize uploads in folders
    formData.append('resource_type', 'image');

    try {
      console.log('Uploading to Cloudinary...');
      console.log('Cloud Name:', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
      console.log('Upload Preset:', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      console.log('Cloudinary Response:', data);

      if (!response.ok) {
        console.error('Cloudinary Error:', data);
        throw new Error(data.error?.message || 'Failed to upload image to Cloudinary');
      }

      if (data.error) {
        console.error('Cloudinary Error:', data.error);
        throw new Error(data.error.message || 'Cloudinary upload failed');
      }

      return data.secure_url;
    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error(error.message || 'Image upload failed. Please try again.');
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      // Upload image if present
      if (imageFile) {
        setIsUploading(true);
        const imageUrl = await uploadImageToCloudinary(imageFile);
        data.profilePicture = imageUrl;
        setIsUploading(false);
      }

      // Submit form data
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/post-por`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Form submission successful:', result);
      toast.success('POR registered successfully!');
      
      // Reset form
      reset();
      setImageFile(null);
      setImagePreview('');
      
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(error.message || 'Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  const departments = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
    'Electronics', 'Mechanical', 'Civil', 'Chemical', 'Economics', 'Management'
  ];

  const positions = [
    'General Secretary', 'President', 'Vice President', 'Secretary', 'Treasurer',
    'Joint Secretary', 'Technical Head', 'Cultural Head', 'Sports Head'
  ];

  return (
    <div className="min-h-screen text-black bg-gradient-to-br from-yellow-50 to-amber-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Configuration Check Alert */}
        {(!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <AlertCircle className="mr-2" size={20} />
            <div>
              <strong>Configuration Error:</strong> Cloudinary environment variables are missing.
              <br />
              <small>
                Missing: {!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && 'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME '}
                {!process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET && 'NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET'}
              </small>
            </div>
          </div>
        )}

        <div className="bg-white text-black rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-yellow-800 mb-2">
              Position of Responsibility Registration
            </h1>
            <p className="text-yellow-600">Fill in the details to register your POR</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Picture Upload */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 bg-yellow-100 rounded-full border-4 border-yellow-200 flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={48} className="text-yellow-400" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-full cursor-pointer transition-colors">
                  <Camera size={20} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 text-black md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-yellow-800 flex items-center">
                  <User size={16} className="mr-2" />
                  Full Name *
                </label>
                <input
                  {...register('name', validationRules.name)}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                    errors.name
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-yellow-200 focus:border-yellow-500'
                  } bg-yellow-50`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* BITS ID Field */}
              <div className="space-y-2 text-black">
                <label className="block text-sm font-medium text-yellow-800 flex items-center">
                  <FileText size={16} className="mr-2" />
                  BITS ID *
                </label>
                <input
                  {...register('bitsId', validationRules.bitsId)}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                    errors.bitsId
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-yellow-200 focus:border-yellow-500'
                  } bg-yellow-50`}
                  placeholder="e.g., 2023A7PS05"
                />
                {errors.bitsId && (
                  <p className="text-red-500 text-sm flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.bitsId.message}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm text-black font-medium text-yellow-800 flex items-center">
                  <Mail size={16} className="mr-2" />
                  Email Address *
                </label>
                <input
                  {...register('email', validationRules.email)}
                  type="email"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                    errors.email
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-yellow-200 focus:border-yellow-500'
                  } bg-yellow-50`}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Mobile Field */}
              <div className="space-y-2">
                <label className="block text-sm text-black font-medium text-yellow-800 flex items-center">
                  <Phone size={16} className="mr-2" />
                  Mobile Number *
                </label>
                <input
                  {...register('mobile', validationRules.mobile)}
                  type="tel"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                    errors.mobile
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-yellow-200 focus:border-yellow-500'
                  } bg-yellow-50`}
                  placeholder="9876543210"
                />
                {errors.mobile && (
                  <p className="text-red-500 text-sm flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.mobile.message}
                  </p>
                )}
              </div>

              {/* Position Field */}
              <div className="space-y-2">
                <label className="block text-sm text-black font-medium text-yellow-800 flex items-center">
                  <Briefcase size={16} className="mr-2" />
                  Position *
                </label>
                <select
                  {...register('position', validationRules.position)}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                    errors.position
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-yellow-200 focus:border-yellow-500'
                  } bg-yellow-50`}
                >
                  <option value="">Select Position</option>
                  {positions.map((position) => (
                    <option key={position} value={position}>
                      {position}
                    </option>
                  ))}
                </select>
                {errors.position && (
                  <p className="text-red-500 text-sm flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.position.message}
                  </p>
                )}
              </div>

              {/* Department Field */}
              <div className="space-y-2">
                <label className="block text-sm text-black font-medium text-yellow-800 flex items-center">
                  <Building size={16} className="mr-2" />
                  Department *
                </label>
                <select
                  {...register('department', validationRules.department)}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                    errors.department
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-yellow-200 focus:border-yellow-500'
                  } bg-yellow-50`}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="text-red-500 text-2 flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.department.message}
                  </p>
                )}
              </div>
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-black text-yellow-800 flex items-center">
                <FileText size={16} className="mr-2" />
                Description *
              </label>
              <textarea
                {...register('description', validationRules.description)}
                rows={4}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors resize-none ${
                  errors.description
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-yellow-200 focus:border-yellow-500'
                } bg-yellow-50`}
                placeholder="Describe your role and responsibilities..."
              />
              <div className="flex justify-between items-center">
                {errors.description && (
                  <p className="text-red-500 text-sm flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.description.message}
                  </p>
                )}
                <span className="text-sm text-yellow-600 ml-auto">
                  {watchedFields.description?.length || 0}/500
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
       {    imagePreview !== '' &&   <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 flex items-center space-x-2 ${
                  isSubmitting || isUploading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-yellow-500 hover:bg-yellow-600 hover:shadow-lg transform hover:scale-105'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>
                      {isUploading ? 'Uploading Image...' : 'Submitting...'}
                    </span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span>Submit POR</span>
                  </>
                )}
              </button> }
            </div>
          </form>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default PORForm;