import { NextResponse } from 'next/server';

const ALLOWED_RETURN_URL_HOST = 'console.neon.tech';
const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

/**
 * Check if user has given consent for personalization cookies.
 * Reads the neon_consent cookie and checks for NomZ: true.
 */
function hasPersonalizationConsent(request) {
  const consentCookie = request.cookies.get('neon_consent')?.value;
  if (!consentCookie) return false;
  try {
    const consent = JSON.parse(consentCookie);
    return consent.NomZ === true;
  } catch {
    return false;
  }
}

/**
 * Validate that the return URL is allowed (must be console.neon.tech).
 */
function isValidReturnUrl(returnUrl) {
  if (!returnUrl) return false;
  try {
    const url = new URL(returnUrl);
    return url.host === ALLOWED_RETURN_URL_HOST;
  } catch {
    return false;
  }
}

/**
 * GET /api/identify
 *
 * Login flow:
 *   /api/identify?userId=xxx&returnUrl=https://console.neon.tech/...
 *
 * Logout flow:
 *   /api/identify?logout=true&returnUrl=https://console.neon.tech/...
 *
 * Sets cookies and redirects back to the console.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const returnUrl = searchParams.get('returnUrl');
  const userId = searchParams.get('userId');
  const isLogout = searchParams.get('logout') === 'true';

  // Validate returnUrl
  if (!isValidReturnUrl(returnUrl)) {
    return NextResponse.json(
      { error: 'Invalid or missing returnUrl. Must be a console.neon.tech URL.' },
      { status: 400 }
    );
  }

  const response = NextResponse.redirect(returnUrl);

  if (isLogout) {
    // Clear cookies
    response.cookies.set('neon_login_indicator', '', {
      maxAge: 0,
      path: '/',
    });
    response.cookies.set('ajs_user_id', '', {
      maxAge: 0,
      path: '/',
    });
  } else if (userId) {
    // Set login indicator (always, no consent needed)
    response.cookies.set('neon_login_indicator', 'true', {
      maxAge: ONE_YEAR_IN_SECONDS,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    // Set user ID only if personalization consent is given
    if (hasPersonalizationConsent(request)) {
      response.cookies.set('ajs_user_id', userId, {
        maxAge: ONE_YEAR_IN_SECONDS,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
    }
  } else {
    return NextResponse.json(
      { error: 'Missing required parameter: userId or logout' },
      { status: 400 }
    );
  }

  return response;
}
