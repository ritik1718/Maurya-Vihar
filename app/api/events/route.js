// File: /app/api/events/route.js

import { NextResponse } from 'next/server';
import { connectDB } from '@/db/mv-db'; // Using your db connection import
import Event from '@/models/event'; // Make sure the path to your new Event model is correct

/**
 * Handles GET requests to /api/events
 * Fetches all events from the database, sorted by date in descending order.
 */
export async function GET(request) {
  try {
    await connectDB();

    // Find all events and sort them so the newest events appear first.
    const events = await Event.find({}).sort({ date: -1 });

    return NextResponse.json({ success: true, data: events }, { status: 200 });
  } catch (error) {
    console.error('API GET Error:', error);
    return NextResponse.json({ success: false, error: 'An internal server error occurred.' }, { status: 500 });
  }
}

/**
 * Handles POST requests to /api/events
 * Creates a new event in the database.
 */
export async function POST(request) {
  try {
    await connectDB();
    
    // Get the request body
    const body = await request.json();

    // Create a new event document in the database
    const newEvent = await Event.create(body);

    return NextResponse.json({ success: true, data: newEvent }, { status: 201 });
  } catch (error) {
    console.error('API POST Error:', error);
    // Handle validation errors from the Mongoose schema
    if (error.name === 'ValidationError') {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'An internal server error occurred.' }, { status: 500 });
  }
}
