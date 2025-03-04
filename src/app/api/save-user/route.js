import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/lib/models/User';
import { surveyForms } from '@/lib/surveyForms';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request) {
  try {
    // Verify that the user is authenticated
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name, email, image, selectedSurvey } = await request.json();

    // Validate data
    if (!name || !email || !selectedSurvey) {
      return NextResponse.json(
        { error: 'Name, email, and survey selection are required' },
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

    // Find the selected survey information
    const survey = surveyForms.find(s => s.id === selectedSurvey);
    
    // Check if user already exists and update, or create new user
    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        name,
        email,
        image,
        selectedSurvey,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json(
      { 
        success: true, 
        message: 'User data saved successfully',
        redirectUrl: survey.url 
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Save user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}