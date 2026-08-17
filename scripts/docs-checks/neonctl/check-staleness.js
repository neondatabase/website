// Passive staleness nudge: warns (never fails) when the committed
// schema.json is behind the latest published neonctl on npm. Wired into
// predev/prebuild; fail-silent offline with a short timeout so it can
// never slow or break a build.

const fs = require('fs');
const path = require('path');

const SCHEMA_PATH = path.join(__dirname, 'schema.json');

async function main() {
  let neonctlVersion;
  try {
    ({ neonctlVersion } = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8')));
  } catch (err) {
    // A passive nudge must never break dev or build; warn and bail.
    console.warn(`[neonctl docs] could not read schema.json (${err.message})`);
    return;
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2000);
  try {
    const res = await fetch('https://registry.npmjs.org/neonctl/latest', {
      signal: controller.signal,
    });
    if (!res.ok) return;
    const { version } = await res.json();
    if (version && version !== neonctlVersion) {
      console.warn(
        `\n[neonctl docs] schema.json is pinned to neonctl ${neonctlVersion}, but ${version} is the latest on npm.\n` +
          `[neonctl docs] Run: npm run cli-docs -- refresh\n`
      );
    }
  } catch {
    // Offline or registry hiccup: stay silent.
  } finally {
    clearTimeout(timer);
  }
}

main().catch(() => {});
