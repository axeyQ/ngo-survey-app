import { NextResponse } from 'next/server';
import { surveyForms } from '@/lib/surveyForms';

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const surveyId = searchParams.get('id');

  if (!surveyId) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const selectedForm = surveyForms.find(form => form.id === surveyId);
  
  if (!selectedForm) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.redirect(selectedForm.url);
}