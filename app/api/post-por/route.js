import { NextResponse } from 'next/server';
import POR from '@/models/por';
import { connectDB } from '@/db/mv-db';

// POST API - Add a new POR
export async function POST(req) {
  try {
    const body = await req.json();
    await connectDB();

    // Check for existing POR by email
    const existingPOR = await POR.findOne({ email: body.email });
    if (existingPOR) {
      return NextResponse.json(
        { error: 'POR assigned for this email' },
        { status: 400 }
      );
    }

    // Create new POR
    const newPOR = new POR({
      name: body.name,
      bitsId: body.bitsId,
      email: body.email,
      mobile: body.mobile,
      position: body.position,
      department: body.department || '',
      profilePicture: body.profilePicture || null,
      description: body.description || '',
      linkedin: body.linkedin
    });

    await newPOR.save();

    return NextResponse.json(
      { message: 'POR created successfully', por: newPOR },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/post-por error:', error);
    return NextResponse.json(
      { error: 'Failed to create POR', details: error.message },
      { status: 500 }
    );
  }
}



// GET API - Get all PORs
export async function GET() {
  try {
    await connectDB();
    const pors = await POR.find().sort({ createdAt: -1 });

    return NextResponse.json({ data: pors }, { status: 200 });
  } catch (error) {
    console.error('GET /api/por error:', error);
    return NextResponse.json({ error: 'Failed to fetch PORs' }, { status: 500 });
  }
}
