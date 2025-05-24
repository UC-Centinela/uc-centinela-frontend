import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  // Extract any auth tokens or session data from the request if needed
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  
  // Get the returnTo parameter or default to /tasks
  const returnTo = searchParams.get('returnTo') || '/tasks';
  
  // Create a redirect response to the tasks page
  const response = NextResponse.redirect(new URL(returnTo, url.origin));
  
  // Return the response
  return response;
}
