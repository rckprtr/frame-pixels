import { NextRequest, NextResponse } from 'next/server';


export function middleware(req: NextRequest): Response {

  const res = NextResponse.next();
  // Set CORS headers
  res.headers.set('Access-Control-Allow-Origin', '*'); // Adjust according to your needs
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.headers.set('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return new Response('OK', { status: 200, headers: res.headers });
  }

  return res;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/', '/api/frame', '/api/image'],
}