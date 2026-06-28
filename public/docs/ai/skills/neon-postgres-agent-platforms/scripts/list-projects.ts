import "dotenv/config";
import { createApiClient } from "@neondatabase/api-client";

const apiKey = process.env.NEON_API_KEY?.trim();
if (!apiKey) {
  throw new Error(
    "NEON_API_KEY is required. Add it to .env (see .env.example) or export it in your shell.",
  );
}

const api = createApiClient({ apiKey });

const { data } = await api.listProjects({ limit: 400 });
const projects = data.projects ?? [];

for (const p of projects) {
  const id = p.id;
  const name = p.name ?? "";
  if (!id) continue;
  console.log(`${id}\t${name}`);
}
