import { NextRequest, NextResponse } from 'next/server';
import { createSession, getSessionCookieName } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const appPassword = process.env.APP_PASSWORD || 'changeme';
    
    if (password !== appPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
    
    const token = await createSession();
    const response = NextResponse.json({ success: true });
    response.cookies.set(getSessionCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
