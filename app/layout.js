'use client'

import { useState } from 'react';
import Navbar from '@/app/components/Navbar';
import Sidebar from '@/app/components/Sidebar';
import Footer from '@/app/components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';

export default function RootLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-white">
          <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
          
          <div className="flex pt-16">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            <main className={`flex-1 min-h-[calc(100vh-4rem)] ${
              sidebarOpen 
                ? 'lg:ml-72 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]' 
                : 'ml-0 transition-all duration-400 ease-[cubic-bezier(0.25,0.8,0.25,1)]'
            }`}>
              <div className="min-h-[calc(100vh-8rem)]">
                {children}
              </div>
              <Footer />
            </main>
          </div>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          toastClassName="custom-toast"
          bodyClassName="custom-toast-body"
          style={{ zIndex: 9999 }}
        />
      </body>
    </html>
  );
}
