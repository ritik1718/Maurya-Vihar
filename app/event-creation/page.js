'use client'
import React, { useState } from 'react';

// --- Helper Components for UI ---

const UploadIcon = () => (
  <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
  </svg>
);

const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// --- Main Add Event Page Component ---

export default function AddEventPage() {
  const initialFormState = {
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    category: 'General',
  };

  // State for form fields
  const [formData, setFormData] = useState(initialFormState);

  // State for image handling
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  
  // State for UI feedback
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });

  // Handle changes in text inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // You can set a limit if you want, e.g., 10 images
    if (files.length > 10) {
      setMessage({ type: 'error', content: 'You can select a maximum of 10 images.' });
      return;
    }

    setImageFiles(files);

    // Create local previews
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previewUrls);
    setMessage({ type: '', content: '' }); // Clear previous messages
  };

  // Helper to extract public_id from a Cloudinary URL for deletion
  const getPublicIdFromUrl = (url) => {
    try {
        const parts = url.split('/');
        const versionIndex = parts.findIndex(part => part.startsWith('v') && !isNaN(part.substring(1)));
        const publicIdWithExtension = parts.slice(versionIndex + 1).join('/');
        const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));
        return publicId;
    } catch (e) {
        console.error("Could not extract public_id from URL:", url);
        return null;
    }
  };
  
  // Function to upload images to Cloudinary
  const uploadImagesToCloudService = async (files) => {
    if (files.length === 0) {
      throw new Error("Please select at least one image to upload.");
    }

    const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      throw new Error("Image upload service is not configured.");
    }

    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    
    const uploadPromises = files.map(async file => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);
        
        const response = await fetch(UPLOAD_URL, { method: 'POST', body: formData });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error.message || 'An error occurred during image upload.');
        }
        return data.secure_url;
    });

    return await Promise.all(uploadPromises);
  };

  // Function to clean up uploaded images from Cloudinary if DB save fails
  const deleteImagesFromCloudinary = async (urls) => {
      console.warn("Database save failed. Rolling back Cloudinary uploads...");
      const deletePromises = urls.map(async (url) => {
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
      });
      await Promise.all(deletePromises);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (imageFiles.length === 0) {
        setMessage({ type: 'error', content: 'You must select at least one image.' });
        return;
    }

    setIsLoading(true);
    setMessage({ type: '', content: '' });

    let uploadedImageUrls = [];
    try {
      // Step 1: Upload images to Cloudinary
      uploadedImageUrls = await uploadImagesToCloudService(imageFiles);

      // Step 2: Prepare the final data payload
      const eventData = {
        ...formData,
        imageUrls: uploadedImageUrls,
      };

      // Step 3: Send the data to the Next.js API endpoint
      const response = await fetch('/api/events', { // Note the endpoint is '/api/events'
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });

      const result = await response.json();

      // If the API returns an error, throw to trigger the catch block
      if (!response.ok) {
        throw new Error(result.error || 'Failed to save the event to the database.');
      }
      
      setMessage({ type: 'success', content: 'New event has been successfully added!' });
      // Reset form and states on success
      setFormData(initialFormState);
      setImageFiles([]);
      setImagePreviews([]);

    } catch (error) {
      console.error('Submission failed:', error);
      setMessage({ type: 'error', content: `Submission failed: ${error.message}. Cleaning up uploaded files.` });
      
      // *** IMPORTANT: ROLLBACK LOGIC ***
      // If images were uploaded but the DB save failed, delete them.
      if (uploadedImageUrls.length > 0) {
        await deleteImagesFromCloudinary(uploadedImageUrls);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-lg text-gray-600 mt-1">Add a New Event</p>
          <div className="w-24 h-1 bg-orange-500 mt-2 rounded"></div>
        </header>

        {message.content && (
          <div className={`p-4 mb-6 rounded-lg text-white ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
            {message.content}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-xl shadow-lg space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
              <input type="text" name="title" id="title" value={formData.title} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"/>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" id="description" rows="4" value={formData.description} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"></textarea>
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" name="date" id="date" value={formData.date} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"/>
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input type="text" name="time" id="time" placeholder="e.g., 11:00 AM onwards" value={formData.time} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"/>
            </div>

            <div>
              <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
              <input type="text" name="venue" id="venue" placeholder="e.g., Community Hall, Patna" value={formData.venue} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"/>
            </div>
            
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select name="category" id="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition">
                    <option>General</option>
                    <option>Cultural</option>
                    <option>Workshop</option>
                    <option>Competition</option>
                </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Images</label>
            <div className="flex justify-center items-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadIcon />
                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500">PNG, JPG, or WEBP</p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" multiple accept="image/png, image/jpeg, image/webp" onChange={handleImageChange} />
                </label>
            </div> 
          </div>

          {imagePreviews.length > 0 && (
            <div>
              <h3 className="text-md font-medium text-gray-800 mb-2">Image Previews</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {imagePreviews.map((src, index) => (
                  <div key={index} className="relative w-full h-32 rounded-lg overflow-hidden shadow-md">
                     <img src={src} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 text-right">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center px-8 py-3 bg-orange-500 text-white font-bold rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-300 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isLoading && <Spinner />}
              {isLoading ? 'Adding Event...' : 'Add Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
