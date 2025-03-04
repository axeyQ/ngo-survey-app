'use client';

import { useState, useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
import SurveyForm from '@/components/SurveyForm';
import AuthButton from '@/components/AuthButton';

export default function Home() {
  // We'll handle the loading state to prevent form flash
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // If we've just returned from OAuth flow, this prevents the form from flashing briefly
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <SessionProvider>
      <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              NGO Survey Portal
            </h1>
            <p className="text-gray-600">
              Please provide your information and select a survey to continue
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="mb-8">
              <SurveyForm />
            </div>
          )}

          <div className="flex justify-center">
            <AuthButton />
          </div>
        </div>
      </main>
    </SessionProvider>
  );
}