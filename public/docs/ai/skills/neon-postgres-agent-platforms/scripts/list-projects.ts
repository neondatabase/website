import "dotenv/config";
import { neonClient } from "./utils.js";

const apiKey = process.env.NEON_API_KEY?.trim();
if (!apiKey) {
  throw new Error(
    "NEON_API_KEY is required. Add it to .env (see .env.example) or export it in your shell.",
  );
}

const neon = neonClient(apiKey);

// `list()` is cursor-paginated; the async iterator streams every page for you
// (and throws on a page error).
for await (const project of neon.projects.list()) {
  if (!project.id) continue;
  console.log(`${project.id}\t${project.name ?? ""}`);
}
