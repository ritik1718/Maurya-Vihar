// app/api/register/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/db/mv-db';
import Student from '@/models/member';

export async function POST(req) {
  try {
    const body = await req.json();

    // Connect to MongoDB
    await connectDB();

    // Create new student
    const newStudent = new Student({
      name: body.name,
      bitsId: body.bitsId,
      dateOfBirth: body.dateOfBirth,
      mobile: body.mobile,
      email: body.email,
      hostel: body.hostel,
      roomNo: body.roomNo,
      homeAddress: body.homeAddress,
      department: body.department || '',
      clubs: body.clubs || [],
      profilePicture: body.profilePicture || null, // base64 string or URL
    });

    // Save to MongoDB
    await newStudent.save();

    return NextResponse.json({ message: 'Registration successful' }, { status: 201 });
  } catch (error) {
    console.error('POST /api/register error:', error);
    return NextResponse.json({ error: 'Registration failed', details: error.message }, { status: 500 });
  }
}
