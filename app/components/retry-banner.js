'use client'
import { useState } from 'react';

export default function OfflineRetry() {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-400 to-orange-400 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-6">📡</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">You're Offline</h1>
        <p className="text-gray-600 mb-8">
          Check your internet connection and try again.
        </p>
        
        <button
          onClick={handleRetry}
          disabled={isRetrying}
          className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
            isRetrying
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white hover:from-yellow-500 hover:to-orange-500 transform hover:scale-105'
          }`}
        >
          {isRetrying ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Retrying...</span>
            </div>
          ) : (
            'Retry Connection'
          )}
        </button>
        
        <div className="mt-6 text-sm text-gray-500">
          Maurya Vihar - Bihar & Jharkhand Cultural Association
        </div>
      </div>
    </div>
  );
}
