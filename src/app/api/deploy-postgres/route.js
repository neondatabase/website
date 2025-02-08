import { cookies } from 'next/headers';
import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
import { createApiClient } from '@neondatabase/api-client';

export const neonApiClient = createApiClient({
  apiKey: process.env.NEON_API_KEY,
});

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { findClosestRegion, regions } from './regions';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
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
  const projectDataCookie = cookieStore.get('neon-project');

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
          logical_size_bytes: 250000000, // 250MB
        },
      },
      pg_version: 16,
      default_endpoint_settings: {
        autoscaling_limit_min_cu: 0.25,
        autoscaling_limit_max_cu: 0.25,
        suspend_timeout_seconds: 120, // 2 minutes
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
  /*
  // Run this query to set up the database
    CREATE TABLE projects (
        id SERIAL PRIMARY KEY,
        project_id VARCHAR(256) NOT NULL UNIQUE,
        region VARCHAR(256) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        is_deleted BOOLEAN DEFAULT FALSE
    );

    CREATE INDEX project_id_idx ON projects (project_id);
  */
  try {
    const sql = neon(process.env.DATABASE_URL);
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
  response.cookies.set('neon-project', JSON.stringify(newProjectData), {
    httpOnly: false, // Allow JavaScript access
    secure: true,
    sameSite: 'none',
    maxAge: 300, // 5 minutes
  });

  return response;
}
