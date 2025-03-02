import { createApiClient } from '@neondatabase/api-client';
import { neon } from '@neondatabase/serverless';

export async function GET() {
  try {
    const sql = neon(process.env.DEPLOY_POSTGRES_DATABASE_URL);
    const neonApiClient = createApiClient({ apiKey: process.env.DEPLOY_POSTGRES_NEON_API_KEY });

    // Calculate cleanup threshold (1 hour ago)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    // Find old projects that need to be cleaned up
    const oldProjects = await sql`
      SELECT * FROM projects 
      WHERE created_at < ${oneHourAgo}
      AND is_deleted = false
    `;

    // Delete projects from Neon API
    await Promise.all(
      oldProjects.map((project) => neonApiClient.deleteProject(project.project_id))
    );

    // Mark projects as deleted in our database
    await sql`
      UPDATE projects 
      SET is_deleted = true 
      WHERE created_at < ${oneHourAgo}
      AND is_deleted = false
    `;

    return new Response('Cleanup completed successfully', { status: 200 });
  } catch (error) {
    console.error('Error cleaning up projects', error);
    return new Response(error.message, { status: 500 });
  }
}
