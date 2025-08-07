import mongoose from 'mongoose';

/**
 * Schema for the single upcoming event.
 * We will store up to 5 image URLs. The actual image files should be uploaded
 * to a storage service like Cloudinary, AWS S3, or Vercel Blob Storage first.
 */
const UpcomingEventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for the event.'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description.'],
    },
    date: {
      type: Date,
      required: [true, 'Please provide the event date.'],
    },
    time: {
      type: String,
      required: [true, 'Please provide the event time.'],
    },
    venue: {
      type: String,
      required: [true, 'Please provide the event venue.'],
      default: 'To be announced',
    },
    // We store the URLs of the images after they are uploaded.
    imageUrls: {
      type: [String],
      required: true,
      validate: [
        (val) => val.length > 0 && val.length <= 5,
        'You must provide between 1 and 5 images.',
      ],
    },
    contactPerson: {
      type: String,
      trim: true,
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// This prevents Mongoose from redefining the model every time in development mode (HMR).
export default mongoose.models.UpcomingEvent || mongoose.model('UpcomingEvent', UpcomingEventSchema);