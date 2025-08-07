import mongoose from 'mongoose';

/**
 * Schema for registering alumni of the cultural society.
 */
const AlumniSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide the alumni\'s name.'],
      trim: true,
    },
    graduationYear: {
      type: Number,
      required: [true, 'Please provide the graduation year.'],
      min: 1964,
      max: new Date().getFullYear(),
    },
    degree: {
        type: String,
        required: [true, 'Please provide the degree (e.g., B.E. Hons. EEE).'],
        trim: true,
    },
    currentCompany: {
      type: String,
      trim: true,
    },
    position: {
        type: String,
        trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address.'],
      unique: true,
      trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    linkedinProfileUrl: {
        type: String,
        trim: true,
    },
    profilePictureUrl: {
      type: String,
      required: [true, 'Please provide a profile picture URL.'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Alumni || mongoose.model('Alumni', AlumniSchema);
