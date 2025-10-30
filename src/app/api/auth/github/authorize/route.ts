import { NextResponse } from 'next/server';

/**
 * GitHub OAuth Authorization Endpoint
 *
 * Redirects user to GitHub OAuth authorization page
 */
export async function GET() {
  const clientId = process.env.GITHUB_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      { error: 'GITHUB_CLIENT_ID not configured' },
      { status: 500 }
    );
  }

  // Generate state parameter for CSRF protection
  const state = crypto.randomUUID();

  // Store state in a cookie (consider using a session store in production)
  const response = NextResponse.redirect(
    `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=read:user%20user:email&state=${state}`
  );

  // Store state in httpOnly cookie for verification
  response.cookies.set('github_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 minutes
  });

  return response;
}
