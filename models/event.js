import mongoose from 'mongoose';

/**
 * Schema for individual events.
 * This allows storing multiple events in the database, unlike the singleton
 * 'UpcomingEvent' which only ever has one document.
 */
const EventSchema = new mongoose.Schema(
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
    },
    // You can store multiple image URLs for each event
    imageUrls: {
      type: [String],
      required: true,
      validate: [
        (val) => val.length > 0,
        'You must provide at least one image.',
      ],
    },
    category: {
        type: String,
        enum: ['Cultural', 'Workshop', 'Competition', 'General'],
        default: 'General',
    }
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// This prevents Mongoose from redefining the model every time in development mode (HMR).
export default mongoose.models.Event || mongoose.model('Event', EventSchema);
