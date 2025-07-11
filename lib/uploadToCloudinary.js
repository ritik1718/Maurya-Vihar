import axios from 'axios';

export const uploadToCloudinary = async (file) => {
  if (!file) throw new Error('No file selected');

  const formData = new FormData();
  formData.append('file', file);
  formData.append(
    'upload_preset',
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  );

  const { data } = await axios.post(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    formData
  );

  return data.secure_url;           // returns hosted image URL
};
