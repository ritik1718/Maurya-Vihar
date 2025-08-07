'use client'
import React, { useState, useEffect } from 'react';

// --- Helper Icons & Components ---

const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const LinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
);

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
    </div>
);

// --- Main Professors Page Component ---
export default function Page() {
  const [professors, setProfessors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const response = await fetch('/api/professors');
        if (!response.ok) {
          throw new Error('Failed to fetch professor data.');
        }
        const { data } = await response.json();
        setProfessors(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfessors();
  }, []);

  return (
    <div className="bg-yellow-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <header className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-sky-900 tracking-tight">Our Professors</h1>
          <p className="mt-4 text-xl text-yellow-800">Meet the esteemed faculty members associated with our society.</p>
          <div className="mt-6 w-24 h-1.5 bg-gradient-to-r from-sky-400 to-yellow-500 mx-auto rounded-full"></div>
        </header>

        {isLoading && <LoadingSpinner />}
        
        {error && <div className="text-center text-red-600 bg-red-100 p-4 rounded-lg">{error}</div>}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {professors.length > 0 ? (
                professors.map((prof) => (
                    <div key={prof._id} className="bg-white rounded-2xl shadow-lg text-center p-6 transform hover:-translate-y-2 transition-all duration-300 flex flex-col">
                        <div className="relative mx-auto mb-4">
                            <img 
                                src={prof.profilePictureUrl} 
                                alt={`Profile of ${prof.name}`} 
                                className="w-32 h-32 rounded-full object-cover shadow-md border-4 border-yellow-200"
                                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/128x128/fef9c3/a855f7?text=Prof'; }}
                            />
                        </div>
                        <h3 className="text-xl font-bold text-sky-900">{prof.name}</h3>
                        <p className="text-yellow-700 text-sm mb-4">{prof.department}</p>
                        
                        <div className="space-y-3 mt-auto pt-4 border-t border-yellow-100">
                            <a href={`mailto:${prof.email}`} className="flex items-center justify-center text-gray-600 hover:text-sky-700 transition-colors">
                                <MailIcon />
                                <span>Email</span>
                            </a>
                            <a href={prof.bitsProfileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center text-gray-600 hover:text-sky-700 transition-colors">
                                <LinkIcon />
                                <span>BITS Profile</span>
                            </a>
                        </div>
                    </div>
                ))
            ) : (
                <div className="col-span-full text-center bg-yellow-100 text-yellow-800 p-8 rounded-2xl">
                    <h3 className="text-2xl font-semibold">No Professors Found</h3>
                    <p className="mt-2">The directory is currently empty. Please check back later.</p>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
