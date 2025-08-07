'use client'
import React, { useState } from 'react';

// --- Helper Icons & Components ---

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// --- Main Add Alumni Page Component ---

export default function Page() {
  const initialFormState = {
    name: '',
    graduationYear: '',
    degree: '',
    currentCompany: '',
    position: '',
    email: '',
    phone: '',
    linkedinProfileUrl: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
        setFormErrors(prev => ({...prev, [name]: null}));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setMessage({ type: '', content: '' });
    }
  };

  const getPublicIdFromUrl = (url) => {
    try {
        const parts = url.split('/');
        const versionIndex = parts.findIndex(part => part.startsWith('v') && !isNaN(part.substring(1)));
        const publicIdWithExtension = parts.slice(versionIndex + 1).join('/');
        return publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));
    } catch (e) {
        console.error("Could not extract public_id from URL:", url);
        return null;
    }
  };

  const uploadImageToCloudinary = async (file) => {
    if (!file) throw new Error("Please select a profile picture.");

    const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      throw new Error("Image upload service is not configured.");
    }

    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('upload_preset', UPLOAD_PRESET);
    
    const response = await fetch(UPLOAD_URL, { method: 'POST', body: uploadFormData });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error.message || 'Image upload failed.');
    }
    return data.secure_url;
  };

  const deleteImageFromCloudinary = async (url) => {
      console.warn("Database save failed. Rolling back Cloudinary upload...");
      const public_id = getPublicIdFromUrl(url);
      if (public_id) {
          try {
              await fetch('/api/cloudinary-delete', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ public_id }),
              });
              console.log(`Cleanup: Successfully deleted orphan image ${public_id}`);
          } catch (error) {
              console.error(`Cleanup failed for image ${public_id}:`, error);
          }
      }
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email)) {
        errors.email = "Please enter a valid email address.";
    }

    const phoneRegex = /^\d{10}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
        errors.phone = "Phone number must be exactly 10 digits.";
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
        setFormErrors(validationErrors);
        return;
    }

    if (!imageFile) {
        setMessage({ type: 'error', content: 'Please upload a profile picture.' });
        return;
    }

    setIsLoading(true);
    setMessage({ type: '', content: '' });
    setFormErrors({});

    let uploadedImageUrl = '';
    try {
      uploadedImageUrl = await uploadImageToCloudinary(imageFile);

      const alumniData = {
        ...formData,
        profilePictureUrl: uploadedImageUrl,
      };

      const response = await fetch('/api/alumni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alumniData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to save alumni details.');
      }
      
      setMessage({ type: 'success', content: 'New alumni has been successfully registered!' });
      setFormData(initialFormState);
      setImageFile(null);
      setImagePreview('');

    } catch (error) {
      console.error('Submission failed:', error);
      
      // Check for the specific duplicate key error message from MongoDB
      if (error.message && error.message.includes('E11000')) {
        setMessage({ type: 'error', content: 'This email address is already registered. Please use a different email.' });
      } else {
        setMessage({ type: 'error', content: `Submission failed: ${error.message}` });
      }
      
      if (uploadedImageUrl) {
        await deleteImageFromCloudinary(uploadedImageUrl);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-yellow-50 min-h-screen font-sans text-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        
        <header className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-sky-900">Alumni Registration</h1>
          <p className="text-lg text-yellow-800 mt-2">Add a new member to the alumni network.</p>
          <div className="mt-4 w-20 h-1.5 bg-sky-500 mx-auto rounded-full"></div>
        </header>

        {message.content && (
          <div className={`p-4 mb-6 rounded-lg text-white ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
            {message.content}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl space-y-8">
          
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
                <div className="w-32 h-32 rounded-full bg-yellow-100 flex items-center justify-center overflow-hidden border-4 border-yellow-200">
                    {imagePreview ? (
                        <img src={imagePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                    ) : (
                        <UserIcon />
                    )}
                </div>
                 <label htmlFor="profile-picture" className="absolute -bottom-2 -right-2 bg-sky-500 hover:bg-sky-600 text-white p-2 rounded-full cursor-pointer shadow-md transition-transform hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536l12.232-12.232z" /></svg>
                    <input id="profile-picture" name="profile-picture" type="file" className="sr-only" accept="image/png, image/jpeg, image/webp" onChange={handleImageChange} />
                </label>
            </div>
            <p className="text-sm text-gray-500">Upload a profile picture</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-sky-800 mb-1">Full Name</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"/>
            </div>
            <div>
              <label htmlFor="graduationYear" className="block text-sm font-medium text-sky-800 mb-1">Graduation Year</label>
              <input type="number" name="graduationYear" id="graduationYear" value={formData.graduationYear} onChange={handleInputChange} required placeholder="e.g., 2020" className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"/>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="degree" className="block text-sm font-medium text-sky-800 mb-1">Degree</label>
              <input type="text" name="degree" id="degree" value={formData.degree} onChange={handleInputChange} required placeholder="e.g., B.E. Hons. Computer Science" className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"/>
            </div>
            <div>
              <label htmlFor="currentCompany" className="block text-sm font-medium text-sky-800 mb-1">Current Company (Optional)</label>
              <input type="text" name="currentCompany" id="currentCompany" value={formData.currentCompany} onChange={handleInputChange} className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"/>
            </div>
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-sky-800 mb-1">Position (Optional)</label>
              <input type="text" name="position" id="position" value={formData.position} onChange={handleInputChange} className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"/>
            </div>
             <div>
              <label htmlFor="email" className="block text-sm font-medium text-sky-800 mb-1">Email Address</label>
              <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"/>
              {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
            </div>
             <div>
              <label htmlFor="phone" className="block text-sm font-medium text-sky-800 mb-1">Phone Number (Optional)</label>
              <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"/>
              {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
            </div>
            <div className="md:col-span-2">
              <label htmlFor="linkedinProfileUrl" className="block text-sm font-medium text-sky-800 mb-1">LinkedIn Profile URL (Optional)</label>
              <input type="url" name="linkedinProfileUrl" id="linkedinProfileUrl" value={formData.linkedinProfileUrl} onChange={handleInputChange} placeholder="https://www.linkedin.com/in/..." className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"/>
            </div>
          </div>

          <div className="pt-4 text-right">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center px-8 py-3 bg-sky-600 text-white font-bold rounded-lg shadow-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-sky-300 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isLoading && <Spinner />}
              {isLoading ? 'Registering...' : 'Register Alumni'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
