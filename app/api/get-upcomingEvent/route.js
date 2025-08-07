// File: /app/api/upcoming-event/route.js

import { NextResponse } from 'next/server';
import { connectDB } from '@/db/mv-db'; // Using your db connection import
import UpcomingEvent from '@/models/upcomingEvent'; // Using your model import

/**
 * Handles GET requests to /api/upcoming-event
 * Fetches the single most recent upcoming event.
 */
export async function GET(request) {
  try {
    await connectDB();

    // Find the single event. We sort by createdAt descending to get the latest one.
    const event = await UpcomingEvent.findOne({}).sort({ createdAt: -1 });

    if (!event) {
      return NextResponse.json({ success: false, message: 'No upcoming event found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: event }, { status: 200 });
  } catch (error) {
    console.error('API GET Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * Handles PUT requests to /api/upcoming-event
 * Deletes the old event and creates a new one with the provided data.
 */
export async function PUT(request) {
  try {
    await connectDB();
    
    // Get the request body from the Next.js Request object
    const body = await request.json();

    // This is the core logic: Delete any and all existing events.
    await UpcomingEvent.deleteMany({});

    // Create a new event with the data from the request body.
    const newEvent = await UpcomingEvent.create(body);

    return NextResponse.json({ success: true, data: newEvent }, { status: 201 });
  } catch (error) {
    console.error('API PUT Error:', error);
    // This will catch validation errors from the Mongoose schema as well
    if (error.name === 'ValidationError') {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'An internal server error occurred.' }, { status: 500 });
  }
}
