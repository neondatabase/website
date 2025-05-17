export const runtime = 'edge';

// Disable static optimization since this is a dynamic route
export const dynamic = 'force-dynamic';

import { createApiClient } from '@neondatabase/api-client';
import { neon } from '@neondatabase/serverless';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { findClosestRegion } from './regions';

const RATE_LIMIT_REQUESTS = 10;
const RATE_LIMIT_WINDOW = '10 s';
const DATABASE_QUOTA_BYTES = 250000000; // 250MB
const PG_VERSION = 17;
const MIN_COMPUTE_UNITS = 0.25;
const MAX_COMPUTE_UNITS = 0.25;
const SUSPEND_TIMEOUT_SECONDS = 120; // 2 minutes
const PROJECT_COOKIE_MAX_AGE_SECONDS = 3600; // 1 hour
const PROJECT_COOKIE_NAME = 'neon-project';

const neonApiClient = createApiClient({
  apiKey: process.env.DEPLOY_POSTGRES_NEON_API_KEY,
});

const ratelimit = new Ratelimit({ 
  redis: new Redis({
    url: process.env.DEPLOY_POSTGRES_UPSTASH_REDIS_REST_URL.replace('rediss://', 'https://'),
    token: process.env.DEPLOY_POSTGRES_UPSTASH_REDIS_REST_TOKEN,
  }),
  limiter: Ratelimit.slidingWindow(RATE_LIMIT_REQUESTS, RATE_LIMIT_WINDOW),
  analytics: true,
});

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      {
        result: null,
        success: false,
        error: {
          message: 'Too many requests. Please try again later.',
          code: 'RATE_LIMIT_EXCEEDED',
        },
      },
      { status: 429 }
    );
  }

  const latitude = request.headers.get('x-vercel-ip-latitude');
  const longitude = request.headers.get('x-vercel-ip-longitude');
  const responseStartTime = Date.now();

  const cookieStore = await cookies();
  const projectDataCookie = cookieStore.get(PROJECT_COOKIE_NAME);

  if (projectDataCookie) {
    const parsedProjectData = JSON.parse(projectDataCookie.value);

    return NextResponse.json(
      {
        result: parsedProjectData,
        success: true,
        error: null,
      },
      { status: 200 }
    );
  }

  const start = Date.now();

  const { data, status } = await neonApiClient.createProject({
    project: {
      region_id: findClosestRegion({
        lat: Number(latitude),
        lon: Number(longitude),
      }),
      settings: {
        quota: {
          logical_size_bytes: DATABASE_QUOTA_BYTES,
        },
      },
      pg_version: PG_VERSION,
      default_endpoint_settings: {
        autoscaling_limit_min_cu: MIN_COMPUTE_UNITS,
        autoscaling_limit_max_cu: MAX_COMPUTE_UNITS,
        suspend_timeout_seconds: SUSPEND_TIMEOUT_SECONDS,
      },
    },
  });

  if (status !== 201) {
    return NextResponse.json(
      {
        result: null,
        success: false,
        error: {
          message: 'Failed to create project',
          code: '400',
        },
      },
      { status: 400 }
    );
  }

  const timeToProvision = Date.now() - start;

  try {
    const sql = neon(process.env.DEPLOY_POSTGRES_DATABASE_URL);
    await sql`
      INSERT INTO projects (project_id, region)
      VALUES (${data?.project.id}, ${data?.project.region_id})
    `;
  } catch (error) {
    console.error('Failed to save project to database:', error);
    return NextResponse.json(
      {
        result: null,
        success: false,
        error: {
          message: 'Failed to save project to database',
          code: '400',
        },
      },
      { status: 400 }
    );
  }

  const newProjectData = {
    connectionUri: data.connection_uris[0]?.connection_uri,
    project: data.project,
    hasCreatedProject: true,
    timeToProvision,
  };

  const responseTime = Date.now() - responseStartTime;
  const response = NextResponse.json(
    {
      result: { ...newProjectData, responseTime },
      success: true,
      error: null,
    },
    { status: 201 }
  );

  // Set client-side cookie through response headers
  response.cookies.set(PROJECT_COOKIE_NAME, JSON.stringify(newProjectData), {
    httpOnly: false, // Allow JavaScript access
    secure: true,
    sameSite: 'none',
    maxAge: PROJECT_COOKIE_MAX_AGE_SECONDS, // 5 minutes
  });

  return response;
}
