'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Calendar,
  MessageSquare,
  GraduationCap,
  Users,
  UserCheck,
  X,
  Home,
  ChevronRight,
  User,
  Bell,
  Settings,
} from 'lucide-react';

export default function Sidebar({ isOpen, toggleSidebar }) {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState(null);

  const sidebarItems = [
    { name: 'Home', href: '/', icon: Home, color: 'from-yellow-400 to-orange-400' },
    { name: 'Events', href: '/events', icon: Calendar, color: 'from-purple-400 to-pink-400' },
    { name: 'Feedback', href: '/feedback', icon: MessageSquare, color: 'from-blue-400 to-cyan-400' },
    { name: 'Alumni', href: '/alumni', icon: GraduationCap, color: 'from-green-400 to-emerald-400' },
    { name: 'Members', href: '/members', icon: Users, color: 'from-indigo-400 to-purple-400' },
    { name: 'Professors', href: '/professors', icon: UserCheck, color: 'from-pink-400 to-rose-400' },
  ];

  const handleNavClick = () => {
    if (toggleSidebar) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Responsive Sidebar with Fade + Slide Animation */}
      <div className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 sm:w-72 bg-gradient-to-br from-white via-yellow-50 to-yellow-100 shadow-2xl border-r-4 border-yellow-200 z-30 transform flex flex-col ${
        isOpen 
          ? 'translate-x-0 opacity-100 scale-100 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]' 
          : '-translate-x-full opacity-0 scale-95 transition-all duration-400 ease-[cubic-bezier(0.25,0.8,0.25,1)]'
      } lg:${isOpen ? 'relative translate-x-0 opacity-100 scale-100' : 'hidden'}`}>
        
        {/* Header - Mobile Close Button */}
     

        {/* User Profile Section */}
        <div className="p-3 sm:p-4 border-b border-yellow-200 flex-shrink-0">
          <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
              <User size={16} className="text-white sm:hidden" />
              <User size={20} className="text-white hidden sm:block" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">Welcome Back!</p>
              <p className="text-xs text-gray-600 truncate">Maurya Vihar Member</p>
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Navigation Items */}
          <nav className="flex-1 mt-4 sm:mt-6 px-3 sm:px-4 space-y-1 sm:space-y-2 overflow-y-auto">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              const IconComponent = item.icon;
              return (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Link href={item.href}>
                    <button
                      onClick={handleNavClick}
                      className={`group w-full flex items-center px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 ${
                        isActive
                          ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-white hover:shadow-md'
                      }`}
                    >
                      <div className={`p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3 transition-all duration-300 ${
                        isActive
                          ? 'bg-white bg-opacity-20'
                          : `bg-gradient-to-r ${item.color} text-white group-hover:scale-110`
                      }`}>
                        <IconComponent size={16} className="sm:hidden" />
                        <IconComponent size={20} className="hidden sm:block" />
                      </div>
                      <span className="flex-1 text-left truncate">{item.name}</span>
                      <ChevronRight size={14} className={`transition-transform duration-300 sm:hidden ${
                        isActive ? 'rotate-90' : 'group-hover:translate-x-1'
                      }`} />
                      <ChevronRight size={16} className={`transition-transform duration-300 hidden sm:block ${
                        isActive ? 'rotate-90' : 'group-hover:translate-x-1'
                      }`} />
                    </button>
                  </Link>
                  
                  {/* Hover Effect */}
                  {hoveredItem === item.name && !isActive && (
                    <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-r-full animate-pulse"></div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Association Info Section */}
          <div className="mx-3 sm:mx-4 mb-3 sm:mb-4 p-3 sm:p-4 bg-white/60 rounded-lg sm:rounded-xl border border-yellow-200 flex-shrink-0">
            <h3 className="text-gray-800 font-semibold mb-2 text-xs sm:text-sm">About Us</h3>
            <p className="text-gray-600 text-xs leading-relaxed">
              Bihar & Jharkhand Cultural Association at BITS Pilani
            </p>
          </div>
        </div>

        {/* Bottom Section - Fixed at bottom */}
        <div className="p-3 sm:p-4 bg-gradient-to-t from-yellow-100 to-transparent flex-shrink-0">
          <div className="space-y-1 sm:space-y-2">
            <button className="w-full flex items-center px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl text-gray-700 hover:bg-white hover:shadow-md transition-all duration-200 group">
              <div className="p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3 bg-gradient-to-r from-gray-400 to-gray-600 text-white group-hover:scale-110 transition-transform">
                <Settings size={14} className="sm:hidden" />
                <Settings size={16} className="hidden sm:block" />
              </div>
              <span className="truncate">Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black z-20 lg:hidden backdrop-blur-sm transition-all duration-700 ease-in-out ${
          isOpen 
            ? 'opacity-50 visibility-visible' 
            : 'opacity-0 visibility-hidden'
        }`}
        onClick={toggleSidebar}
      />
    </>
  );
}