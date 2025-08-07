'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserPlus, CalendarPlus, Shield, Users } from 'lucide-react';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      // Corrected: Use template literals for environment variables
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/post-member`);
      const result = await response.json();
      // Only show unapproved students
      const unapprovedStudents = result.data.filter(student => !student.approved);
      setStudents(unapprovedStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (studentId, action) => {
    const student = students.find(s => s._id === studentId);
    if (!student) return;

    setActionLoading(prev => ({ ...prev, [studentId]: action }));

    try {
      if (action === 'delete') {
        // Corrected: Use template literals for environment variables
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/E-D-members/${encodeURIComponent(student.email)}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publicId: student.profilePicture?.split('/').pop().split('.')[0] || '' })
        });
        setStudents(prev => prev.filter(s => s._id !== studentId));
      } else if (action === 'accept') {
        // Corrected: Use template literals for environment variables
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/E-D-members/${encodeURIComponent(student.email)}`, {
          method: 'PATCH'
        });
        const data = await res.json();
        // Remove the student from list after approval
        setStudents(prev => prev.filter(s => s._id !== studentId));
      } else {
        console.log(`${action} student with ID: ${studentId}`);
      }
    } catch (error) {
      console.error(`Error ${action}ing student:`, error);
    } finally {
      setActionLoading(prev => ({ ...prev, [studentId]: null }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // A common style for the new navigation buttons
  const navButtonStyle = "flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm";

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Management</h1>
        <p className="text-gray-600">Review and manage new student applications.</p>
      </div>

      {/* Admin Actions Navigation */}
      <div className="mb-8 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Admin Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/por-creation">
            <button className={navButtonStyle}>
              <Shield size={16} /> POR Creation
            </button>
          </Link>
          <Link href="/prof-creation">
            <button className={navButtonStyle}>
              <UserPlus size={16} /> Prof Creation
            </button>
          </Link>
          <Link href="/event-creation">
            <button className={navButtonStyle}>
              <CalendarPlus size={16} /> Event Creation
            </button>
          </Link>
            <Link href="/upcoming-event">
            <button className={navButtonStyle}>
              <CalendarPlus size={16} /> Upcoming Event
            </button>
          </Link>

          
          <Link href="/alumni-creation">
            {/* Corrected text for the button */}
            <button className={navButtonStyle}>
              <Users size={16} /> Alumni Creation
            </button>
          </Link>
        </div>
      </div>

      {/* Student Application Cards */}
      {students.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {students.map((student) => (
            <div key={student._id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={student.profilePicture || '/default-avatar.png'}
                    alt={student.name}
                    className="w-16 h-16 rounded-full border-4 border-white object-cover"
                  />
                  <div className="text-white">
                    <h2 className="text-xl font-bold">{student.name}</h2>
                    <p className="text-blue-100">BITS ID: {student.bitsId}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 flex-grow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Student details */}
                   <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-800 break-words">{student.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Mobile</label>
                      <p className="text-gray-800">{student.mobile}</p>
                    </div>
                     <div>
                      <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                      <p className="text-gray-800">{formatDate(student.dateOfBirth)}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                     <div>
                      <label className="text-sm font-medium text-gray-500">Hostel & Room</label>
                      <p className="text-gray-800">{student.hostel}, {student.roomNo}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Department</label>
                      <p className="text-gray-800">{student.department || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Home Address</label>
                      <p className="text-gray-800 text-sm">{student.homeAddress}</p>
                    </div>
                  </div>
                </div>
                {student.clubs && student.clubs.length > 0 && (
                   <div>
                    <label className="text-sm font-medium text-gray-500">Clubs</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {student.clubs.map((club, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {club}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-gray-50 border-t">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleAction(student._id, 'accept')}
                    disabled={!!actionLoading[student._id]}
                    className="flex-1 min-w-[100px] bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    {actionLoading[student._id] === 'accept' ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : 'Accept'}
                  </button>
                  <button
                    onClick={() => handleAction(student._id, 'reject')}
                    disabled={!!actionLoading[student._id]}
                    className="flex-1 min-w-[100px] bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    {actionLoading[student._id] === 'reject' ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : 'Reject'}
                  </button>
                  <button
                    onClick={() => handleAction(student._id, 'delete')}
                    disabled={!!actionLoading[student._id]}
                    className="flex-1 min-w-[100px] bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    {actionLoading[student._id] === 'delete' ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg border border-dashed">
          <div className="text-gray-400 text-6xl mb-4">✅</div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">All Caught Up!</h3>
          <p className="text-gray-500">There are no new student applications to review.</p>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
