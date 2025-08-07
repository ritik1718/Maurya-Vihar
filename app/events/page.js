'use client'
import React, { useState, useEffect } from 'react';

// --- Helper Icons ---
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-sky-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-sky-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-sky-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
    </div>
);

// --- Event Card Component with Integrated Details & Slideshow ---
const EventCard = ({ event }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = (e) => {
        e.stopPropagation(); // Prevent card click event
        setCurrentSlide((prev) => (prev + 1) % event.imageUrls.length);
    };
    const prevSlide = (e) => {
        e.stopPropagation(); // Prevent card click event
        setCurrentSlide((prev) => (prev - 1 + event.imageUrls.length) % event.imageUrls.length);
    };

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl">
            {/* Image Slideshow */}
            <div className="relative w-full h-80">
                {event.imageUrls.map((url, index) => (
                    <div key={index} className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                        <img 
                            src={url} 
                            alt={`Event slide ${index + 1}`} 
                            className="w-full h-full object-cover" 
                            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/800x600/38bdf8/FFFFFF?text=Event+Image'; }}
                        />
                    </div>
                ))}
                {event.imageUrls.length > 1 && (
                    <>
                        <button onClick={prevSlide} className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full focus:outline-none transition-all text-sky-800">&#10094;</button>
                        <button onClick={nextSlide} className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full focus:outline-none transition-all text-sky-800">&#10095;</button>
                    </>
                )}
            </div>
            {/* Event Details */}
            <div className="p-6">
                <span className="inline-block bg-yellow-200 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">{event.category}</span>
                <h3 className="text-2xl font-bold text-sky-900 mb-3">{event.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-5">{event.description}</p>
                <div className="space-y-3 border-t border-yellow-200 pt-4">
                    <div className="flex items-center text-gray-700"><CalendarIcon /> {formatDate(event.date)}</div>
                    <div className="flex items-center text-gray-700"><ClockIcon /> {event.time}</div>
                    <div className="flex items-center text-gray-700"><LocationIcon /> {event.venue}</div>
                </div>
            </div>
        </div>
    );
};


// --- Main Events Page Component ---
export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events.');
        }
        const { data } = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="bg-yellow-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <header className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-yellow-900 tracking-tight">Our Events</h1>
          <p className="mt-4 text-xl text-yellow-800">A gallery of our vibrant cultural celebrations and activities.</p>
          <div className="mt-6 w-24 h-1.5 bg-gradient-to-r from-yellow-400 to-amber-500 mx-auto rounded-full"></div>
        </header>

        {isLoading && <LoadingSpinner />}
        
        {error && <div className="text-center text-red-600 bg-red-100 p-4 rounded-lg">{error}</div>}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {events.length > 0 ? (
                events.map((event) => (
                    <EventCard key={event._id} event={event} />
                ))
            ) : (
                <div className="lg:col-span-2 text-center bg-yellow-100 text-yellow-800 p-8 rounded-2xl">
                    <h3 className="text-2xl font-semibold">No Events Found</h3>
                    <p className="mt-2">Check back soon for new and exciting events from Maurya Vihar!</p>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
