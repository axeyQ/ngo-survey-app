'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { surveyForms } from '@/lib/surveyForms';

export default function SurveyForm() {
  const [name, setName] = useState('');
  const [selectedSurvey, setSelectedSurvey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { data: session, status } = useSession();

  // Check for stored information when component mounts or session changes
  useEffect(() => {
    // Retrieve stored selection from localStorage
    const storedName = localStorage.getItem('surveyUserName');
    const storedSurvey = localStorage.getItem('selectedSurvey');
    
    if (storedName) setName(storedName);
    if (storedSurvey) setSelectedSurvey(storedSurvey);
    
    // If user is authenticated and we have a selected survey, redirect automatically
    if (status === 'authenticated' && session && storedSurvey) {
      const selectedForm = surveyForms.find(form => form.id === storedSurvey);
      if (selectedForm) {
        // Save user data to database then redirect
        saveUserDataAndRedirect(storedName, storedSurvey, selectedForm.url);
      }
    }
  }, [session, status, router]);

  // Function to save user data and redirect
  const saveUserDataAndRedirect = async (userName, surveyId, redirectUrl) => {
    try {
      const response = await fetch('/api/save-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userName,
          email: session.user.email,
          image: session.user.image,
          selectedSurvey: surveyId,
        }),
      });

      if (response.ok) {
        // Clear stored data after successful save
        localStorage.removeItem('surveyUserName');
        localStorage.removeItem('selectedSurvey');
        
        // Redirect to the selected form
        window.location.href = redirectUrl;
      }
    } catch (err) {
      console.error('Error saving user data:', err);
      setError('Error saving your information. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !selectedSurvey) {
      setError('Please fill in all fields');
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      // Store selections in localStorage to persist through OAuth flow
      localStorage.setItem('surveyUserName', name);
      localStorage.setItem('selectedSurvey', selectedSurvey);
      
      // If user is already logged in
      if (session) {
        const selectedForm = surveyForms.find(form => form.id === selectedSurvey);
        await saveUserDataAndRedirect(name, selectedSurvey, selectedForm.url);
      } else {
        // Trigger Google sign-in if not logged in
        signIn('google');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto ">
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md text-black border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          placeholder="Enter your name"
          required
        />
      </div>

      <div>
        <label htmlFor="survey" className="block text-sm font-semibold text-gray-700">
          Select your Domain
        </label>
        <select
          id="survey"
          value={selectedSurvey}
          onChange={(e) => setSelectedSurvey(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300  text-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          required
        >
          <option value="">-- Please select a survey --</option>
          {surveyForms.map((survey) => (
            <option key={survey.id} value={survey.id}>
              {survey.title}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-50"
      >
        {isSubmitting ? 'Processing...' : <span className='flex gap-3 items-center justify-center'>Continue with Google <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
      >
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
        <path fill="none" d="M1 1h22v22H1z" />
      </svg></span>}
      </button>
    </form>
  );
}