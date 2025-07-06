import Link from 'next/link';
import Image from 'next/image';
import mvLogo from '@/public/MV_logo.jpg'   
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Heart
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-sky-400 via-sky-500 to-blue-400 text-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-3 left-10 w-16 h-16 bg-yellow-400 rounded-full blur-2xl"></div>
        <div className="absolute bottom-3 right-10 w-20 h-20 bg-orange-400 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          
          {/* Mobile Layout - Fixed */}
          <div className="block md:hidden">
            <div className="flex flex-col items-center text-center space-y-4">
              {/* Logo Section - Fixed */}
              <div className="flex flex-col items-center space-y-2">
                <div className="relative w-16 h-10">
                  <Image
                    src={mvLogo}
                    alt="Maurya Vihar Logo"
                    fill
                    sizes="(max-width: 768px) 64px, 80px"
                    className="rounded-lg object-cover shadow-lg"
                    priority
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-base font-bold text-white">Maurya Vihar</h3>
                  <p className="text-sky-100 text-sm">Cultural Association</p>
                </div>
              </div>
              
              {/* Contact Info - Compact */}
              <div className="flex items-center justify-center space-x-6 text-sm">
                <a 
                  href="mailto:mauryavihar@bits.edu" 
                  className="flex items-center space-x-2 text-sky-100 hover:text-yellow-300 transition-colors"
                >
                  <Mail size={14} />
                  <span>Email</span>
                </a>
                <a 
                  href="tel:+911596242227" 
                  className="flex items-center space-x-2 text-sky-100 hover:text-yellow-300 transition-colors"
                >
                  <Phone size={14} />
                  <span>Call</span>
                </a>
              </div>

              {/* Social Media - Compact */}
              <div className="flex justify-center space-x-3">
                {[
                  { icon: Facebook, label: 'Facebook', href: '#' },
                  { icon: Twitter, label: 'Twitter', href: '#' },
                  { icon: Instagram, label: 'Instagram', href: '#' },
                  { icon: Youtube, label: 'YouTube', href: '#' }
                ].map((social) => (
                  <Link 
                    key={social.label}
                    href={social.href}
                    className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-sky-800 transition-all duration-300 backdrop-blur-sm"
                    aria-label={social.label}
                  >
                    <social.icon size={16} />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:grid md:grid-cols-3 gap-6">
            
            {/* Association Info with Broader Logo */}
            <div>
              <div className="flex flex-col space-y-3 mb-4">
                <div className="relative w-20 h-12">
                  <Image
                    src={mvLogo}
                    alt="Maurya Vihar Logo"
                    fill
                    sizes="(min-width: 768px) 80px, 64px"
                    className="rounded-lg object-cover shadow-lg"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Maurya Vihar</h3>
                  <p className="text-sky-100 text-sm">Bihar & Jharkhand Cultural Association</p>
                </div>
              </div>
              
              {/* Social Media Links */}
              <div className="flex space-x-3">
                {[
                  { icon: Facebook, label: 'Facebook', href: '#' },
                  { icon: Twitter, label: 'Twitter', href: '#' },
                  { icon: Instagram, label: 'Instagram', href: '#' },
                  { icon: Youtube, label: 'YouTube', href: '#' }
                ].map((social) => (
                  <Link 
                    key={social.label}
                    href={social.href}
                    className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-sky-800 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                    aria-label={social.label}
                  >
                    <social.icon size={16} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links - Desktop Only */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Home', href: '/' },
                  { name: 'Events', href: '/events' },
                  { name: 'Alumni', href: '/alumni' },
                  { name: 'Members', href: '/members' },
                  { name: 'Professors', href: '/professors' },
                  { name: 'Feedback', href: '/feedback' }
                ].map((link) => (
                  <Link 
                    key={link.name}
                    href={link.href}
                    className="text-sky-100 hover:text-yellow-300 transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Contact</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin size={14} className="text-sky-200" />
                  <p className="text-sky-100 text-sm">BITS Pilani, Rajasthan</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Mail size={14} className="text-sky-200" />
                  <a 
                    href="mailto:mauryavihar@bits.edu"
                    className="text-sky-100 hover:text-yellow-300 transition-colors duration-200 text-sm"
                  >
                    mauryavihar@bits.edu
                  </a>
                </div>

                <div className="flex items-center space-x-2">
                  <Phone size={14} className="text-sky-200" />
                  <a 
                    href="tel:+911596242227"
                    className="text-sky-100 hover:text-yellow-300 transition-colors duration-200 text-sm"
                  >
                    +91 1596 242 227
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Compact */}
        <div className="border-t border-sky-300/30 bg-sky-600/40 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-1 sm:space-y-0">
              
              {/* Copyright */}
              <div className="text-sky-100 text-xs sm:text-sm text-center sm:text-left">
                &copy; 2025 Maurya Vihar. All rights reserved.
              </div>

              {/* Made with Love */}
              <div className="flex items-center space-x-1 sm:space-x-2 text-sky-100 text-xs sm:text-sm">
                <span className="hidden sm:inline">Made with</span>
                <span className="sm:hidden">❤️</span>
                <Heart size={12} className="text-red-400 animate-pulse hidden sm:block" />
                <span className="hidden sm:inline">for our community</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
