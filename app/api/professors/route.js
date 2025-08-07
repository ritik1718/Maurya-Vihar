// File: /app/api/professors/route.js

import { NextResponse } from 'next/server';
import { connectDB } from '@/db/mv-db'; // Using your db connection import
import Professor from '@/models/professor'; // Make sure the path to your new Professor model is correct

/**
 * Handles GET requests to /api/professors
 * Fetches all registered professors, sorted alphabetically by name.
 */
export async function GET(request) {
  try {
    await connectDB();

    // Find all professors, sort by name, and exclude the 'phone' field from the result.
    const professors = await Professor.find({})
      .select('-phone')
      .sort({ name: 1 });

    return NextResponse.json({ success: true, data: professors }, { status: 200 });
  } catch (error) {
    console.error('API GET Error:', error);
    return NextResponse.json({ success: false, error: 'An internal server error occurred.' }, { status: 500 });
  }
}

/**
 * Handles POST requests to /api/professors
 * Creates a new professor record in the database.
 */
export async function POST(request) {
  try {
    await connectDB();
    
    // Get the request body
    const body = await request.json();

    // Create a new professor document in the database
    const newProfessor = await Professor.create(body);

    return NextResponse.json({ success: true, data: newProfessor }, { status: 201 });
  } catch (error) {
    console.error('API POST Error:', error);
    // Handle validation errors from the Mongoose schema (e.g., duplicate email)
    if (error.name === 'ValidationError' || error.code === 11000) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'An internal server error occurred.' }, { status: 500 });
  }
}
