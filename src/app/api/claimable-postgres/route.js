const DEFAULT_CLAIMABLE_NEON_ORIGIN = 'https://claimable.neon.tech';
const ALLOWED_SERVICES = new Map([
  ['auth', 'auth'],
  ['data-api', 'data_api'],
]);

class ClaimableResponseError extends Error {
  constructor(status, body) {
    super('Claimable Postgres rejected the request.');
    this.name = 'ClaimableResponseError';
    this.status = status;
    this.body = body;
  }
}

class ClaimableConnectionError extends Error {
  constructor(cause) {
    super('Claimable Postgres could not be reached.', { cause });
    this.name = 'ClaimableConnectionError';
  }
}

class ClaimableContractError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ClaimableContractError';
  }
}

const jsonResponse = (body, status = 200) =>
  Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  });

const claimableOrigin = () => {
  const configured = process.env.CLAIMABLE_NEON_ORIGIN || DEFAULT_CLAIMABLE_NEON_ORIGIN;
  const url = new URL(configured);
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error('CLAIMABLE_NEON_ORIGIN must use http or https.');
  }
  return url.origin;
};

const requestClaimable = async (path, init = {}) => {
  let response;
  try {
    response = await fetch(`${claimableOrigin()}${path}`, {
      ...init,
      cache: 'no-store',
    });
  } catch (error) {
    throw new ClaimableConnectionError(error);
  }

  const text = await response.text();
  let body = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      throw new ClaimableContractError(
        `Claimable Postgres returned non-JSON content with HTTP ${response.status}.`
      );
    }
  }

  if (!response.ok) {
    throw new ClaimableResponseError(response.status, body);
  }
  return body;
};

const exchangeAssertion = (assertion) =>
  requestClaimable('/v1/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
      resource: `${claimableOrigin()}/`,
    }),
  });

const requireRegistration = (body) => {
  if (
    !body ||
    typeof body.identity_assertion !== 'string' ||
    !body.project ||
    typeof body.project.id !== 'string' ||
    typeof body.project.branch_id !== 'string' ||
    typeof body.project.expires_at !== 'string' ||
    !Array.isArray(body.capabilities)
  ) {
    throw new ClaimableContractError('Claimable Postgres returned an invalid registration.');
  }
  return body;
};

const requireToken = (body) => {
  if (!body || typeof body.access_token !== 'string') {
    throw new ClaimableContractError('Claimable Postgres returned an invalid access token.');
  }
  return body.access_token;
};

const requireCredentials = (body, project) => {
  if (
    !body ||
    body.project_id !== project.id ||
    body.branch_id !== project.branch_id ||
    typeof body.database_url !== 'string' ||
    !body.services ||
    typeof body.services !== 'object'
  ) {
    throw new ClaimableContractError(
      'Claimable Postgres returned invalid credentials for the provisioned project.'
    );
  }
  return body;
};

const requireClaim = (body) => {
  if (
    !body ||
    typeof body.verification_uri_complete !== 'string' ||
    typeof body.expires_in !== 'number'
  ) {
    throw new ClaimableContractError('Claimable Postgres returned an invalid claim link.');
  }
  return body;
};

const errorFor = (error) => {
  if (error instanceof ClaimableResponseError) {
    return jsonResponse(
      error.body ?? {
        error: {
          code: 'claimable_request_failed',
          message: `Claimable Postgres returned HTTP ${error.status}.`,
        },
      },
      error.status
    );
  }
  if (error instanceof ClaimableConnectionError) {
    return jsonResponse(
      {
        error: {
          code: 'claimable_service_unavailable',
          message: error.message,
        },
      },
      502
    );
  }
  if (error instanceof ClaimableContractError) {
    return jsonResponse(
      {
        error: {
          code: 'invalid_claimable_response',
          message: error.message,
        },
      },
      502
    );
  }
  console.error('[claimable-postgres] Unexpected error:', error);
  return jsonResponse(
    {
      error: {
        code: 'internal_error',
        message: 'The database could not be created.',
      },
    },
    500
  );
};

export async function POST(request) {
  let input;
  try {
    input = await request.json();
  } catch {
    return jsonResponse(
      {
        error: {
          code: 'invalid_request',
          message: 'Request body must be valid JSON.',
        },
      },
      400
    );
  }

  const services = input?.services ?? [];
  if (
    !Array.isArray(services) ||
    services.some((service) => typeof service !== 'string' || !ALLOWED_SERVICES.has(service))
  ) {
    return jsonResponse(
      {
        error: {
          code: 'invalid_request',
          message: 'services may contain only auth and data-api.',
        },
      },
      400
    );
  }

  const requestedServices = new Set(services);
  const capabilities = [
    'postgres',
    ...['data-api', 'auth']
      .filter((service) => requestedServices.has(service))
      .map((service) => ALLOWED_SERVICES.get(service)),
  ];

  let registration;
  let accessToken;
  try {
    registration = requireRegistration(
      await requestClaimable('/v1/agent/identity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'anonymous',
          capabilities,
          source: 'neon_website',
        }),
      })
    );

    accessToken = requireToken(await exchangeAssertion(registration.identity_assertion));
    const authorization = { Authorization: `Bearer ${accessToken}` };
    const credentials = requireCredentials(
      await requestClaimable(`/v1/projects/${registration.project.id}/credentials`, {
        headers: authorization,
      }),
      registration.project
    );
    const claim = requireClaim(
      await requestClaimable(`/v1/projects/${registration.project.id}/claim`, {
        method: 'POST',
        headers: authorization,
      })
    );

    return jsonResponse(
      {
        project: registration.project,
        capabilities: registration.capabilities,
        credentials,
        claim: {
          verification_uri_complete: claim.verification_uri_complete,
          expires_in: claim.expires_in,
        },
      },
      201
    );
  } catch (error) {
    if (registration) {
      try {
        if (!accessToken) {
          accessToken = requireToken(await exchangeAssertion(registration.identity_assertion));
        }
        await requestClaimable(`/v1/projects/${registration.project.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      } catch (cleanupError) {
        console.error(
          `[claimable-postgres] Cleanup failed for project ${registration.project.id}:`,
          cleanupError
        );
        return jsonResponse(
          {
            error: {
              code: 'claimable_cleanup_failed',
              message:
                'Database setup failed and the temporary project could not be deleted. It will expire automatically.',
            },
          },
          500
        );
      }
    }
    return errorFor(error);
  }
}
