// File: /app/api/alumni/route.js

import { NextResponse } from 'next/server';
import { connectDB } from '@/db/mv-db';
import Alumni from '@/models/alumni'; // Ensure the path to your new Alumni model is correct

/**
 * Handles GET requests to /api/alumni
 * Fetches all registered alumni, sorted by graduation year.
 * The 'phone' field is excluded.
 */
export async function GET(request) {
  try {
    await connectDB();

    // Find all alumni, exclude the phone number, and sort by graduation year (most recent first).
    const alumni = await Alumni.find({})
      .select('-phone')
      .sort({ graduationYear: -1 });

    return NextResponse.json({ success: true, data: alumni }, { status: 200 });
  } catch (error) {
    console.error('API GET Error:', error);
    return NextResponse.json({ success: false, error: 'An internal server error occurred.' }, { status: 500 });
  }
}

/**
 * Handles POST requests to /api/alumni
 * Creates a new alumni record in the database.
 */
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();

    const newAlumni = await Alumni.create(body);

    return NextResponse.json({ success: true, data: newAlumni }, { status: 201 });
  } catch (error) {
    console.error('API POST Error:', error);
    if (error.name === 'ValidationError' || error.code === 11000) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'An internal server error occurred.' }, { status: 500 });
  }
}
