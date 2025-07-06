import { useState } from 'react';
import Link from 'next/link';
import { 
  Menu, 
  X,
  Search, 
  Bell,
  User,
  Settings,
  Home,
  MapPin,
  Phone,
  Mail,
  UserPlus,
  LogIn
} from 'lucide-react';

export default function Navbar({ toggleSidebar, sidebarOpen }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
    }
  };

  const notifications = [
    { id: 1, text: "New cultural event announced", time: "2 min ago" },
    { id: 2, text: "Alumni meetup this weekend", time: "1 hour ago" },
    { id: 3, text: "Monthly meeting scheduled", time: "3 hours ago" }
  ];

  return (
    <nav className="bg-gradient-to-r from-white via-yellow-50 to-yellow-100 shadow-lg fixed w-full top-0 z-50 border-b-2 border-yellow-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Menu Button */}
          <div className="flex items-center">
            {/* SIDEBAR TOGGLE BUTTON - Using Lucide React */}
            <button
              onClick={toggleSidebar}
              className="inline-flex relative right-24 items-center justify-center p-2 rounded-md text-gray-700 hover:bg-yellow-200 transition-all duration-200 hover:scale-105 mr-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              aria-label="Toggle sidebar"
              type="button"
            >
              {sidebarOpen ? (
                <X size={24} className="text-gray-700" />
              ) : (
                <Menu size={24} className="text-gray-700" />
              )}
            </button>
            
            <Link href="/" className="flex items-center group">
              <div className="w-10 h-10 relative right-22 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-200">
                <span className="text-white font-bold text-xl">म</span>
              </div>
              <span className="ml-3 relative right-22 text-gray-800 text-xl font-bold group-hover:text-yellow-600 transition-colors duration-200">
                Maurya Vihar
              </span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="w-full relative">
              <div className={`relative transition-all duration-300 ${isSearchFocused ? 'transform scale-105' : ''}`}>
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
                  placeholder="Search events, members, alumni..."
                  className="w-full pl-10 pr-4 py-2 border-2 border-yellow-200 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white shadow-sm hover:shadow-md transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Navigation Icons & Auth Buttons */}
          <div className="flex items-center space-x-3">
            {/* Quick Nav Icons */}
            <div className="hidden lg:flex items-center space-x-2">
              <button className="p-2 rounded-full text-gray-600 hover:bg-yellow-200 hover:text-yellow-600 transition-all duration-200 hover:scale-110">
                <Home size={20} />
              </button>
              <button className="p-2 rounded-full text-gray-600 hover:bg-yellow-200 hover:text-yellow-600 transition-all duration-200 hover:scale-110">
                <MapPin size={20} />
              </button>
              <button className="p-2 rounded-full text-gray-600 hover:bg-yellow-200 hover:text-yellow-600 transition-all duration-200 hover:scale-110">
                <Phone size={20} />
              </button>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full text-gray-600 hover:bg-yellow-200 hover:text-yellow-600 transition-all duration-200 hover:scale-110 relative"
              >
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center animate-pulse">
                  3
                </span>
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-xl border border-yellow-200 z-[60]">
                  <div className="p-3 border-b border-yellow-100">
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-3 border-b border-yellow-50 hover:bg-yellow-50 transition-colors">
                        <p className="text-sm text-gray-700">{notification.text}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-2 rounded-full text-gray-600 hover:bg-yellow-200 hover:text-yellow-600 transition-all duration-200 hover:scale-110"
              >
                <User size={20} />
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-xl border border-yellow-200 z-[60]">
                  <div className="p-2">
                    <button className="w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-yellow-50 transition-colors">
                      <div className="flex items-center space-x-2">
                        <User size={16} />
                        <span>Profile</span>
                      </div>
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-yellow-50 transition-colors">
                      <div className="flex items-center space-x-2">
                        <Settings size={16} />
                        <span>Settings</span>
                      </div>
                    </button>
                    <hr className="my-2 border-yellow-100" />
                    <button className="w-full text-left px-3 py-2 rounded-md text-red-600 hover:bg-red-50 transition-colors">
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            <Link href="/login">
              <button className="relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2.5 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group">
                <span className="relative z-10 flex items-center space-x-2">
                  <LogIn size={16} />
                  <span className="hidden sm:inline">Login</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>
            
            <Link href="/register">
              <button className="relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2.5 rounded-full font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group">
                <span className="relative z-10 flex items-center space-x-2">
                  <span className="hidden sm:inline">Register</span>
                  <span className="sm:hidden">Join</span>
                  <div className="w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border-2 border-yellow-200 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white shadow-sm"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
