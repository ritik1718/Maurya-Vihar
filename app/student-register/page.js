'use client'
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSession, signIn, signOut } from 'next-auth/react';
import mvLogo from '@/public/MV_logo.jpg'  
import MakarSankranti from '@/public/MakarSankranti.png'   
import mvPresentation from '@/public/Presentation.png'   
import TriptiGrub from '@/public/Triptigrub_menu.jpg'
import RoobarooPoster from '@/public/roobarooposter.jpg'   

import { toast } from 'react-toastify';
import Image from 'next/image';
import {
  User, IdCard, Building, Home, Phone, Mail, Calendar,
  MapPin, Users, GraduationCap, CheckCircle, AlertCircle,
  Camera, Upload, Loader2, X, LogOut, LogIn
} from 'lucide-react';

export default function StudentRegistration() {
  const { data: session, status } = useSession();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [uploadedImagePublicId, setUploadedImagePublicId] = useState(null); // Track uploaded image public_id

  const slideImages = [
    mvPresentation,
    RoobarooPoster,
    mvLogo,
    TriptiGrub,
    MakarSankranti,
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [slideImages.length]);

  const {
    register, handleSubmit, formState: { errors }, reset, setValue
  } = useForm({ mode: 'onChange' });

  // Set email from session when user logs in
  useEffect(() => {
    if (session?.user?.email) {
      setValue('email', session.user.email);
    }
  }, [session, setValue]);

  // Helper function to delete image from Cloudinary
  const deleteCloudinaryImage = async (publicId) => {
    if (!publicId) return;
    
    try {
      const response = await fetch('/api/cloudinary-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ public_id: publicId }),
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log('Image deleted from Cloudinary:', result.message);
      } else {
        console.error('Failed to delete image from Cloudinary:', result.message);
      }
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, WebP)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      // If there's already an uploaded image, delete it from Cloudinary
      if (uploadedImagePublicId) {
        deleteCloudinaryImage(uploadedImagePublicId);
        setUploadedImagePublicId(null);
      }

      const reader = new FileReader();
      reader.onload = (e) => setProfilePreview(e.target.result);
      reader.readAsDataURL(file);
      setSelectedImageFile(file);
    }
  };

  const removeProfilePicture = async () => {
    // Delete from Cloudinary if image was uploaded
    if (uploadedImagePublicId) {
      await deleteCloudinaryImage(uploadedImagePublicId);
      setUploadedImagePublicId(null);
    }

    setProfilePreview(null);
    setSelectedImageFile(null);
    const fileInput = document.getElementById('profilePicture');
    if (fileInput) fileInput.value = '';
    toast.info('Profile picture removed');
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    let imageUrl = null;
    let tempUploadedPublicId = null;

    try {
      // Upload image to Cloudinary if selected
      if (selectedImageFile) {
        setUploadingImage(true);
        const formData = new FormData();
        formData.append('file', selectedImageFile);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
        formData.append('folder', 'maurya-vihar/profiles');

        const uploadResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.secure_url;
        tempUploadedPublicId = uploadData.public_id;
        setUploadedImagePublicId(tempUploadedPublicId);
        setUploadingImage(false);
      }

      const formDataToSubmit = {
        name: data.name,
        bitsId: data.bitsId,
        dateOfBirth: data.dateOfBirth,
        mobile: data.mobile,
        email: data.email,
        hostel: data.hostel,
        roomNo: data.roomNo,
        homeAddress: data.homeAddress,
        department: data.department || null,
        clubs: data.clubs ? (Array.isArray(data.clubs) ? data.clubs : [data.clubs]) : [],
        profilePicture: imageUrl,
        profilePicturePublicId: tempUploadedPublicId, // Store public_id for future deletion
        sessionEmail: session?.user?.email,
      };

      const response = await fetch('/api/post-member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataToSubmit),
      });

      const result = await response.json();

      if (!response.ok) {
        // If registration fails and we uploaded an image, delete it
        if (tempUploadedPublicId) {
          await deleteCloudinaryImage(tempUploadedPublicId);
          setUploadedImagePublicId(null);
        }

        if (result?.error?.includes('email')) {
          toast.error('📧 Email already registered.');
        } else if (result?.error?.includes('bitsId')) {
          toast.error('🆔 BITS ID already exists.');
        } else if (result?.error?.includes('mobile')) {
          toast.error('📱 Mobile number already used.');
        } else {
          toast.error(result?.error || '❌ Submission failed.');
        }
        return;
      }

      // Registration successful
      toast.success('🎉 Registration successful!');
      reset();
      setProfilePreview(null);
      setSelectedImageFile(null);
      setUploadedImagePublicId(null);

    } catch (error) {
      console.error('Submission error:', error);
      
      // If there was an error and we uploaded an image, clean it up
      if (tempUploadedPublicId) {
        await deleteCloudinaryImage(tempUploadedPublicId);
        setUploadedImagePublicId(null);
      }
      
      toast.error('⚠️ Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
      setUploadingImage(false);
    }
  };

  // Hostel options
  const hostels = [
    'Vyas Bhawan', 'Shankar Bhawan', 'Gandhi Bhawan', 'Budh Bhawan',
    'Ashoka Bhawan', 'Ram Bhawan', 'Krishna Bhawan', 'Meera Bhawan',
    'Saraswati Bhawan', 'Malviya Bhawan'
  ];

  // Department options
  const departments = [
    'Computer Science', 'Electronics & Communication', 'Mechanical',
    'Civil', 'Chemical', 'Electrical & Electronics', 'Biotechnology',
    'Mathematics', 'Physics', 'Chemistry', 'Economics', 'Management'
  ];

  // Club options
  const clubs = [
    'Cultural Club', 'Technical Club', 'Sports Club', 'Literary Club',
    'Photography Club', 'Music Club', 'Dance Club', 'Drama Club',
    'Coding Club', 'Robotics Club', 'Environment Club', 'Social Service Club'
  ];

  // Show loading state while session is loading
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            
            {/* Slideshow for non-authenticated users */}
            <div className="mb-8">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                {slideImages.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                      index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Maurya Vihar ${index + 1}`}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                ))}
                
                {/* Slide Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {slideImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide 
                          ? 'bg-yellow-400 scale-125' 
                          : 'bg-white/50 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>

                {/* Overlay Content */}
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <h2 className="text-2xl font-bold mb-2">Join Maurya Vihar</h2>
                  <p className="text-white/90">
                    Bihar & Jharkhand Cultural Association at BITS Pilani
                  </p>
                </div>
              </div>
            </div>

            {/* Login Card */}
            <div className="bg-white rounded-2xl shadow-2xl border border-yellow-200 overflow-hidden max-w-md mx-auto">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-6 text-white text-center">
                <LogIn className="h-12 w-12 mx-auto mb-4" />
                <h1 className="text-2xl font-bold">Welcome to Maurya Vihar</h1>
                <p className="text-yellow-100 mt-2">Please login to register</p>
              </div>
              
              <div className="p-8 text-center">
                <p className="text-gray-600 mb-6">
                  You need to login with your Google account to access the registration form.
                </p>
                
                <button
                  onClick={() => signIn('google')}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-105"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>
                
                <p className="text-xs text-gray-500 mt-4">
                  By continuing, you agree to our terms and conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main registration form for authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 text-black via-orange-50 to-white">
      <div className="container mx-auto px-4 py-8">
        
        {/* User Info Header */}
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {session?.user?.image && (
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div>
                <p className="font-medium text-gray-800">
                  Welcome, {session?.user?.name}
                </p>
                <p className="text-sm text-gray-600">{session?.user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          
          {/* Left Section - Image Slideshow (Hidden on Mobile) */}
          <div className="hidden lg:block">
            <div className="sticky top-8">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                {slideImages.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                      index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Maurya Vihar ${index + 1}`}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                ))}
                
                {/* Slide Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {slideImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide 
                          ? 'bg-yellow-400 scale-125' 
                          : 'bg-white/50 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>

                {/* Overlay Content */}
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <h2 className="text-2xl font-bold mb-2">Join Maurya Vihar</h2>
                  <p className="text-white/90">
                    Bihar & Jharkhand Cultural Association at BITS Pilani
                  </p>
                </div>
              </div>

              {/* Welcome Message */}
              <div className="mt-6 p-6 bg-white rounded-xl shadow-lg border border-yellow-200">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Welcome to Our Community!</h3>
                <p className="text-gray-600 leading-relaxed">
                  Register to become a part of the vibrant Bihar & Jharkhand cultural community 
                  at BITS Pilani. Connect with fellow students, participate in cultural events, 
                  and celebrate our rich heritage together.
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Registration Form */}
          <div className="w-full">
            <div className="bg-white rounded-2xl shadow-2xl border border-yellow-200 overflow-hidden">
              
              {/* Form Header */}
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-6 text-white">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Student Registration</h1>
                    <p className="text-yellow-100">Join Maurya Vihar Community</p>
                  </div>
                </div>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                
                {/* Profile Picture Section */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                    <Camera className="h-5 w-5 text-yellow-500" />
                    <span>Profile Picture</span>
                  </h2>
                  
                  <div className="flex flex-col items-center space-y-4">
                    {/* Profile Picture Preview */}
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-yellow-400 shadow-lg bg-gray-100 flex items-center justify-center">
                        {uploadingImage ? (
                          <div className="text-yellow-500 text-center">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                            <span className="text-sm">Uploading...</span>
                          </div>
                        ) : profilePreview ? (
                          <img
                            src={profilePreview}
                            alt="Profile preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-gray-400 text-center">
                            <Camera className="h-8 w-8 mx-auto mb-2" />
                            <span className="text-sm">No photo</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Remove button */}
                      {profilePreview && !uploadingImage && (
                        <button
                          type="button"
                          onClick={removeProfilePicture}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {/* Upload Button */}
                    <div className="flex flex-col items-center space-y-2">
                      <label
                        htmlFor="profilePicture"
                        className={`cursor-pointer bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 hover:scale-105 ${
                          uploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <Upload className="h-4 w-4" />
                        <span>{uploadingImage ? 'Uploading...' : 'Upload Photo'}</span>
                      </label>
                      <input
                        id="profilePicture"
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                      <p className="text-xs text-gray-500 text-center">
                        JPG, PNG or WebP. Max size 5MB.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Rest of the form sections remain the same as in the previous code */}
                {/* Personal Information Section */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                    <User className="h-5 w-5 text-yellow-500" />
                    <span>Personal Information</span>
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        {...register('name', {
                          required: 'Name is required',
                          minLength: { value: 2, message: 'Name must be at least 2 characters' },
                          pattern: { value: /^[A-Za-z\s]+$/, message: 'Name should only contain letters' }
                        })}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200 ${
                          errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-yellow-400'
                        }`}
                        placeholder="Enter your full name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{errors.name.message}</span>
                        </p>
                      )}
                    </div>

                    {/* BITS ID */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        BITS ID *
                      </label>
                      <div className="relative">
                        <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          {...register('bitsId', {
                            required: 'BITS ID is required',
                          })}
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200 ${
                            errors.bitsId ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-yellow-400'
                          }`}
                          placeholder="2023A7PS1234H"
                        />
                      </div>
                      {errors.bitsId && (
                        <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{errors.bitsId.message}</span>
                        </p>
                      )}
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="date"
                          {...register('dateOfBirth', {
                            required: 'Date of birth is required',
                            validate: (value) => {
                              const today = new Date();
                              const birthDate = new Date(value);
                              const age = today.getFullYear() - birthDate.getFullYear();
                              return age >= 16 || 'Must be at least 16 years old';
                            }
                          })}
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200 ${
                            errors.dateOfBirth ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-yellow-400'
                          }`}
                        />
                      </div>
                      {errors.dateOfBirth && (
                        <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{errors.dateOfBirth.message}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                    <Phone className="h-5 w-5 text-yellow-500" />
                    <span>Contact Information</span>
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Mobile Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          {...register('mobile', {
                            required: 'Mobile number is required',
                            pattern: { 
                              value: /^[6-9]\d{9}$/, 
                              message: 'Enter valid 10-digit mobile number' 
                            }
                          })}
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200 ${
                            errors.mobile ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-yellow-400'
                          }`}
                          placeholder="9876543210"
                        />
                      </div>
                      {errors.mobile && (
                        <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{errors.mobile.message}</span>
                        </p>
                      )}
                    </div>

                    {/* Email - Pre-filled and readonly */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          {...register('email', {
                            required: 'Email is required',
                            pattern: { 
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
                              message: 'Enter valid email address' 
                            }
                          })}
                          readOnly
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                          placeholder="your.email@example.com"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Email is automatically filled from your Google account
                      </p>
                    </div>
                  </div>
                </div>

                {/* Accommodation Information Section */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                    <Building className="h-5 w-5 text-yellow-500" />
                    <span>Accommodation Details</span>
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Hostel Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hostel Name *
                      </label>
                      <select
                        {...register('hostel', { required: 'Hostel selection is required' })}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200 ${
                          errors.hostel ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-yellow-400'
                        }`}
                      >
                        <option value="">Select Hostel</option>
                        {hostels.map((hostel) => (
                          <option key={hostel} value={hostel}>{hostel}</option>
                        ))}
                      </select>
                      {errors.hostel && (
                        <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{errors.hostel.message}</span>
                        </p>
                      )}
                    </div>

                    {/* Room Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Room Number *
                      </label>
                      <div className="relative">
                        <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          {...register('roomNo', {
                            required: 'Room number is required',
                          })}
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200 ${
                            errors.roomNo ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-yellow-400'
                          }`}
                          placeholder="A101"
                        />
                      </div>
                      {errors.roomNo && (
                        <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{errors.roomNo.message}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Home Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Home Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <textarea
                      {...register('homeAddress', {
                        required: 'Home address is required',
                        minLength: { value: 10, message: 'Address must be at least 10 characters' }
                      })}
                      rows={3}
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200 resize-none ${
                        errors.homeAddress ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-yellow-400'
                      }`}
                      placeholder="Enter your complete home address"
                    />
                  </div>
                  {errors.homeAddress && (
                    <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.homeAddress.message}</span>
                    </p>
                  )}
                </div>

                {/* Optional Information Section */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                    <GraduationCap className="h-5 w-5 text-yellow-500" />
                    <span>Additional Information (Optional)</span>
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Department */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department
                      </label>
                      <select
                        {...register('department')}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200"
                      >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>

                    {/* Clubs */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Interested Clubs
                      </label>
                      <select
                        {...register('clubs')}
                        multiple
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200"
                      >
                        {clubs.map((club) => (
                          <option key={club} value={club}>{club}</option>
                        ))}
                      </select>
                      <p className="mt-1 text-xs text-gray-500">Hold Ctrl/Cmd to select multiple clubs</p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  {profilePreview !== null && (
                    <button
                      type="submit"
                      disabled={isSubmitting || uploadingImage}
                      className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300 ${
                        isSubmitting || uploadingImage
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 shadow-lg hover:shadow-xl'
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center space-x-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Submitting Registration...</span>
                        </div>
                      ) : uploadingImage ? (
                        <div className="flex items-center justify-center space-x-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Please wait, uploading image...</span>
                        </div>
                      ) : (
                        'Submit Registration'
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
