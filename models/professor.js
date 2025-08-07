import mongoose from 'mongoose';

/**
 * Schema for registering professors associated with the cultural society.
 */
const ProfessorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide the professor\'s name.'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Please provide a department.'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address.'],
      unique: true, // Each professor should have a unique email
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address.',
      ],
      trim: true,
    },
    phone: {
        type: String,
        trim: true,
        // Basic validation for a 10-digit phone number
        match: [/^\d{10}$/, 'Please provide a valid 10-digit phone number.'],
    },
    // This will store the URL from Cloudinary after the image is uploaded
    profilePictureUrl: {
      type: String,
      required: [true, 'Please provide a profile picture URL.'],
    },
    // Specific field for the BITS Pilani profile link
    bitsProfileUrl: {
        type: String,
        required: [true, 'Please provide the BITS Pilani profile link.'],
        trim: true,
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// This prevents Mongoose from redefining the model every time in development mode (HMR).
export default mongoose.models.Professor || mongoose.model('Professor', ProfessorSchema);
