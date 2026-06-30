import "dotenv/config";
import { createApiClient } from "@neondatabase/api-client";

const apiKey = process.env.NEON_API_KEY?.trim();
const projectId = process.env.NEON_PROJECT_ID;

if (!apiKey) {
  console.error("NEON_API_KEY is required.");
  process.exit(1);
}

if (!projectId) {
  console.error("Set NEON_PROJECT_ID to the project to delete.");
  process.exit(1);
}

const api = createApiClient({ apiKey });
await api.deleteProject(projectId);
console.log(`Deleted project ${projectId}`);
