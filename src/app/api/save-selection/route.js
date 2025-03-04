import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/lib/models/User';
import { surveyForms } from '@/lib/surveyForms';

export async function POST(request) {
  try {
    const { name, selectedSurvey } = await request.json();

    // Validate data
    if (!name || !selectedSurvey) {
      return NextResponse.json(
        { error: 'Name and survey selection are required' },
        { status: 400 }
      );
    }

    // Verify the selected survey exists
    const surveyExists = surveyForms.some(survey => survey.id === selectedSurvey);
    if (!surveyExists) {
      return NextResponse.json(
        { error: 'Invalid survey selection' },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Store the selection in the session for now
    // The actual user record will be created/updated when they sign in with Google
    // We could use cookies or a temporary collection for this
    
    // For this example, we'll create a temporary user document that will be updated
    // with Google profile data after OAuth
    const tempUser = {
      name,
      selectedSurvey,
      tempId: Date.now().toString(), // Just a placeholder, will be replaced with Google ID
    };

    // Store in session storage or temporary collection
    // This is a simplified approach - in a real app, you might use
    // server-side sessions, cookies, or a temporary collection

    return NextResponse.json(
      { success: true, message: 'Selection saved', tempUser },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Save selection error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}