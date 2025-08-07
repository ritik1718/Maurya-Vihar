'use client'

import { useState, useEffect } from 'react';

// --- Helper Components & Icons ---

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

// --- Main Homepage Component ---

export default function HomePage() {
  const [upcomingEvent, setUpcomingEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch upcoming event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // Using the correct consolidated API endpoint
        const response = await fetch('/api/get-upcomingEvent');
        if (response.ok) {
          const { data } = await response.json();
          setUpcomingEvent(data);
        } else {
          // It's okay if no event is found (404), just log it.
          console.log("No upcoming event found. The section will be hidden.");
        }
      } catch (error) {
        console.error("Failed to fetch upcoming event:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, []);

  // Slideshow logic
  useEffect(() => {
    if (!upcomingEvent || upcomingEvent.imageUrls.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % upcomingEvent.imageUrls.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [upcomingEvent, currentSlide]);
  
  const nextSlide = () => {
    if (!upcomingEvent) return;
    setCurrentSlide((prev) => (prev + 1) % upcomingEvent.imageUrls.length);
  };

  const prevSlide = () => {
    if (!upcomingEvent) return;
    setCurrentSlide((prev) => (prev - 1 + upcomingEvent.imageUrls.length) % upcomingEvent.imageUrls.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };
  
  // Helper to format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-pulse">
              Maurya Vihar
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light">
              Bihar & Jharkhand Cultural Association
            </p>
            <p className="text-lg md:text-xl mb-8">
              Celebrating our rich heritage at BITS Pilani
            </p>
            <button className="bg-white text-orange-500 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
              Join Our Community
            </button>
          </div>
        </div>
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-bounce delay-500"></div>
      </section>

      {/* --- DYNAMIC UPCOMING EVENT SECTION --- */}
      {!isLoading && upcomingEvent && (
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Next Big Event!</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-red-400 to-orange-400 mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Image Slideshow */}
              <div className="relative w-full h-96 rounded-xl shadow-2xl overflow-hidden">
                {upcomingEvent.imageUrls.map((url, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <img src={url} alt={`Event slide ${index + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/10"></div>
                  </div>
                ))}
                
                {/* Slideshow Controls */}
                <button onClick={prevSlide} className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/50 hover:bg-white text-gray-800 p-2 rounded-full focus:outline-none transition-all">
                  &#10094;
                </button>
                <button onClick={nextSlide} className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/50 hover:bg-white text-gray-800 p-2 rounded-full focus:outline-none transition-all">
                  &#10095;
                </button>

                {/* Dot Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {upcomingEvent.imageUrls.map((_, index) => (
                        <button key={index} onClick={() => goToSlide(index)} className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'}`}></button>
                    ))}
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-6">
                <h3 className="text-4xl font-extrabold text-gray-900 tracking-tight">{upcomingEvent.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{upcomingEvent.description}</p>
                <div className="space-y-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center text-lg">
                        <CalendarIcon />
                        <span className="font-semibold text-gray-800">{formatDate(upcomingEvent.date)}</span>
                    </div>
                    <div className="flex items-center text-lg">
                        <ClockIcon />
                        <span className="font-semibold text-gray-800">{upcomingEvent.time}</span>
                    </div>
                    <div className="flex items-center text-lg">
                        <LocationIcon />
                        <span className="font-semibold text-gray-800">{upcomingEvent.venue}</span>
                    </div>
                </div>
                 <button className="mt-6 w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-lg">
                    I'm Interested!
                 </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">About Maurya Vihar</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">Our Mission</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Maurya Vihar serves as a cultural bridge for students from Bihar and Jharkhand at BITS Pilani. 
                We celebrate our rich traditions, promote cultural exchange, and create a home away from home 
                for our community members.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-500">500+</div>
                  <div className="text-gray-600">Members</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-500">50+</div>
                  <div className="text-gray-600">Events</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-80 bg-gradient-to-br from-sky-200 to-blue-300 rounded-lg flex items-center justify-center">
                <div className="text-center text-blue-800">
                  <div className="text-6xl mb-4">🏛️</div>
                  <p className="text-lg font-semibold">Cultural Heritage</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">What We Offer</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-sky-400 to-blue-400 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🎭', title: 'Cultural Events', description: 'Traditional festivals, dance performances, and cultural celebrations throughout the year.' },
              { icon: '🤝', title: 'Community Support', description: 'Academic guidance, mentorship programs, and peer support for all members.' },
              { icon: '🎓', title: 'Alumni Network', description: 'Strong connections with successful alumni for career guidance and opportunities.' }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="text-4xl mb-4 text-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-center leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
