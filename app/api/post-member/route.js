// app/api/register/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/db/mv-db';
import Student from '@/models/member';

export async function POST(req) {
  try {
    const body = await req.json();

    // Connect to MongoDB
    await connectDB();

    // Check if student already exists by email
    const existingStudent = await Student.findOne({ email: body.email });
    if (existingStudent) {
      return NextResponse.json(
        { error: 'User already registered with this email' },
        { status: 400 }
      );
    }

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
      profilePicture: body.profilePicture || null,
    });

    // Save to MongoDB
    await newStudent.save();

    return NextResponse.json(
      { message: 'Registration successful' },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/register error:', error);
    return NextResponse.json(
      { error: 'Already submited the form wait for approval', details: error.message },
      { status: 500 }
    );
  }
}

// GET - Fetch All Registered Students
export async function GET() {
  try {
    await connectDB();

    const students = await Student.find().sort({ createdAt: -1 });

    return NextResponse.json({ data: students }, { status: 200 });
  } catch (error) {
    console.error('GET /api/register error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students', details: error.message },
      { status: 500 }
    );
  }
}



