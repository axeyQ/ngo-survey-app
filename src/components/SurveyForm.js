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
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Your Name
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
        <label htmlFor="survey" className="block text-sm font-medium text-gray-700">
          Select Survey
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
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {isSubmitting ? 'Processing...' : 'Continue'}
      </button>
    </form>
  );
}