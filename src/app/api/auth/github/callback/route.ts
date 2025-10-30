import { NextRequest, NextResponse } from 'next/server';

/**
 * GitHub OAuth Callback Handler
 *
 * This endpoint:
 * 1. Receives the OAuth code from GitHub
 * 2. Exchanges it for an access token
 * 3. Fetches user profile data
 * 4. Returns the user data to the frontend
 *
 * Setup in GitHub OAuth App:
 * - Authorization callback URL: https://yourapp.com/api/auth/github/callback
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  // Handle OAuth errors
  if (error) {
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(error)}`, request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', request.url));
  }

  // Exchange code for access token
  let accessToken: string;
  try {
    const tokenResponse = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      throw new Error(tokenData.error_description || 'Failed to exchange code');
    }

    accessToken = tokenData.access_token;
  } catch (error) {
    console.error('Token exchange error:', error);
    return NextResponse.redirect(
      new URL(
        `/?error=${encodeURIComponent('Failed to exchange OAuth code')}`,
        request.url
      )
    );
  }

  // Fetch user profile with access token
  try {
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    const userData = await userResponse.json();

    if (!userResponse.ok) {
      throw new Error(userData.message || 'Failed to fetch user data');
    }

    // Also fetch email if available
    let email = userData.email;
    if (!email) {
      try {
        const emailResponse = await fetch(
          'https://api.github.com/user/emails',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/json',
            },
          }
        );
        const emails = await emailResponse.json();
        const primaryEmail = emails.find(
          (e: { primary: boolean; email: string }) => e.primary
        );
        email = primaryEmail?.email || emails[0]?.email || null;
      } catch {
        // Email fetch failed, continue without it
      }
    }

    // Return user data as JSON
    // Note: In production, you might want to:
    // 1. Store the access token securely in a session/DB
    // 2. Create or update a user record
    // 3. Generate a JWT or session token
    return NextResponse.json({
      user: {
        id: userData.id,
        login: userData.login,
        name: userData.name,
        email: email,
        avatar_url: userData.avatar_url,
        bio: userData.bio,
      },
      // Store access token securely (consider using httpOnly cookies instead)
      // In production, don't expose this to the client
      access_token: accessToken,
    });
  } catch (error) {
    console.error('User fetch error:', error);
    return NextResponse.redirect(
      new URL(
        `/?error=${encodeURIComponent('Failed to fetch user data')}`,
        request.url
      )
    );
  }
}
