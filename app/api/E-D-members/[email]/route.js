import { NextResponse } from 'next/server';
import { connectDB } from '@/db/mv-db';
import Student from '@/models/member';

export async function DELETE(req, { params }) {
  const { email } = await params;

  try {
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await connectDB();

    const deleted = await Student.findOneAndDelete({ email });

    if (!deleted) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Student deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('DELETE /api/register/delete/[email] error:', error);
    return NextResponse.json({ error: 'Failed to delete student', details: error.message }, { status: 500 });
  }
}


// PATCH: Approve student using email from params
export async function PATCH(req, { params }) {
  try {
    const email = decodeURIComponent(params.email); // in case of special chars
    await connectDB();

    const updatedStudent = await Student.findOneAndUpdate(
      { email },
      { approved: true },
      { new: true }
    );

    if (!updatedStudent) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Student approved successfully', student: updatedStudent },
      { status: 200 }
    );
  } catch (error) {
    console.error('PATCH /api/register error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}