import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import clientPromise from '@/lib/mongodb';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session) {
      return NextResponse.json(
        { error: 'You must be signed in to perform this action' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const { userId, userName, userEmail, surveyId, surveyTitle } = await request.json();
    
    // Validate required fields
    if (!userId || !surveyId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    
    // Save the survey selection
    const result = await db.collection('surveySelections').insertOne({
      userId,
      userName,
      userEmail,
      surveyId,
      surveyTitle,
      timestamp: new Date(),
    });
    
    return NextResponse.json(
      { success: true, id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving survey selection:', error);
    return NextResponse.json(
      { error: 'An error occurred while saving the survey selection' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session) {
      return NextResponse.json(
        { error: 'You must be signed in to perform this action' },
        { status: 401 }
      );
    }
    
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    
    // Get survey selections for the current user
    const selections = await db.collection('surveySelections')
      .find({ userId: session.user.id })
      .sort({ timestamp: -1 })
      .toArray();
    
    return NextResponse.json({ selections });
  } catch (error) {
    console.error('Error fetching survey selections:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching survey selections' },
      { status: 500 }
    );
  }
}