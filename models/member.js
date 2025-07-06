// models/Student.js

import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2
  },
  bitsId: {
    type: String,
    required: true,
    unique: true,
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  mobile: {
    type: String,
    required: true,
    match: /^[6-9]\d{9}$/
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  hostel: {
    type: String,
    required: true
  },
  roomNo: {
    type: String,
    required: true
  },
  homeAddress: {
    type: String,
    required: true,
    minlength: 10
  },
  department: {
    type: String,
    default: ''
  },
  clubs: {
    type: [String], // Array of clubs
    default: []
  },
  profilePicture: {
    type: String // URL or base64 string (or path in filesystem if you save locally)
  }
}, { timestamps: true });

// Prevent model overwrite on dev
export default mongoose.models.Student || mongoose.model('Student', StudentSchema);
