import Link from 'next/link';
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
        <div className="absolute top-5 left-10 w-20 h-20 bg-yellow-400 rounded-full blur-2xl"></div>
        <div className="absolute bottom-5 right-10 w-24 h-24 bg-orange-400 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Association Info */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">म</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Maurya Vihar</h3>
                  <p className="text-sky-100 text-xs">Bihar & Jharkhand Cultural Association</p>
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

            {/* Quick Links */}
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

        {/* Bottom Bar */}
        <div className="border-t border-sky-300/30 bg-sky-600/40 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
              
              {/* Copyright */}
              <div className="text-sky-100 text-sm">
                &copy; 2025 Maurya Vihar. All rights reserved.
              </div>

              {/* Made with Love */}
              <div className="flex items-center space-x-2 text-sky-100 text-sm">
                <span>Made with</span>
                <Heart size={14} className="text-red-400 animate-pulse" />
                <span>for our community</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
