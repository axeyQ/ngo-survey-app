'use client';

import { useEffect, useState } from 'react';

// This is where you'll add your Google Forms data
// Example format: { id: 'unique-id', title: 'Survey Title', url: 'https://docs.google.com/forms/d/...' }
const SURVEY_OPTIONS = [
  // You'll replace this with your actual Google Forms data
  { id: 'form1', title: 'Government Authorities & Policymakers', url: 'https://forms.gle/xyVZVXYMjZ6Swu8X7' },
  { id: 'form2', title: 'Local Government & Panchayati Raj Institutions', url: 'https://forms.gle/1w5c4qzB6aEFs8Bg8' },
  { id: 'form3', title: 'Disaster Management Authorities (NDMA, SDRF, NDRF, Local Response Units)', url: 'https://forms.gle/oSJnWUfmB18yw1aQ9' },
  { id: 'form4', title: 'Police & Law Enforcement', url: 'https://forms.gle/RErWbAxDpew7j9b49' },
  { id: 'form5', title: 'Health & Medical Professionals', url: 'https://forms.gle/YGSfgqsW2mMqqQjXA' },
  { id: 'form6', title: 'Education Sector (Schools, Colleges, Universities)', url: 'https://forms.gle/tdGtq1VB252jGk5k6' },
//   { id: '', title: '', url: '' },
//   { id: '', title: '', url: '' },
//   { id: '', title: '', url: '' },
//   { id: '', title: '', url: '' },
//   { id: '', title: '', url: '' },
//   { id: '', title: '', url: '' },
//   { id: '', title: '', url: '' },
//   { id: '', title: '', url: '' },
//   { id: '', title: '', url: '' },
//   { id: '', title: '', url: '' },
//   { id: '', title: '', url: '' },
//   { id: '', title: '', url: '' },
//   { id: '', title: '', url: '' },
//   { id: '', title: '', url: '' },
//   { id: '', title: '', url: '' },
//   { id: '', title: '', url: '' },
//   { id: '', title: '', url: '' },
//   { id: '', title: '', url: '' },



  // Add more forms as needed
];

export default function SurveySelector({ name, setName, selectedSurvey, setSelectedSurvey }) {
  const [surveys, setSurveys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real application, you might fetch this from an API
    // For now, we'll use the static data defined above
    setSurveys(SURVEY_OPTIONS);
    setIsLoading(false);
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Your Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="survey" className="block text-sm font-medium text-black mb-1">
          Select Survey
        </label>
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading surveys...</p>
        ) : (
          <select
            id="survey"
            name="survey"
            value={selectedSurvey}
            onChange={(e) => setSelectedSurvey(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a survey</option>
            {surveys.map((survey) => (
              <option key={survey.id} value={JSON.stringify(survey)}>
                {survey.title}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}