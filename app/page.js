'use client'

import { useState, useEffect } from 'react';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const heroImages = [
    '/images/cultural-event-1.jpg',
    '/images/cultural-event-2.jpg',
    '/images/campus-life.jpg'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen">
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
        
        {/* Animated Background Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-bounce delay-500"></div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
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
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">What We Offer</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-sky-400 to-blue-400 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🎭',
                title: 'Cultural Events',
                description: 'Traditional festivals, dance performances, and cultural celebrations throughout the year.'
              },
              {
                icon: '🤝',
                title: 'Community Support',
                description: 'Academic guidance, mentorship programs, and peer support for all members.'
              },
              {
                icon: '🎓',
                title: 'Alumni Network',
                description: 'Strong connections with successful alumni for career guidance and opportunities.'
              }
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

      {/* Upcoming Events */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Upcoming Events</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-400 to-orange-400 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Chhath Puja Celebration',
                date: 'November 15, 2025',
                time: '6:00 PM',
                location: 'Main Auditorium'
              },
              {
                title: 'Bihar Diwas',
                date: 'March 22, 2025',
                time: '7:00 PM',
                location: 'Cultural Center'
              },
              {
                title: 'Jharkhand Foundation Day',
                date: 'November 15, 2025',
                time: '5:00 PM',
                location: 'Open Theater'
              }
            ].map((event, index) => (
              <div key={index} className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg border-l-4 border-orange-400 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{event.title}</h3>
                <div className="space-y-1 text-gray-600">
                  <p>📅 {event.date}</p>
                  <p>🕕 {event.time}</p>
                  <p>📍 {event.location}</p>
                </div>
                <button className="mt-4 bg-orange-400 text-white px-4 py-2 rounded-lg hover:bg-orange-500 transition-colors duration-200">
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
