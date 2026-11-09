#!/usr/bin/env node

// Rebuilds the vendored Realtime SDK TypeDoc artifact from a local neon-pkgs
// checkout, then regenerates the reference partials from it. It documents
// whatever that checkout has checked out, so check out the branch to document and
// run `pnpm install` there first. Git history of the vendored JSON is the record
// of what was documented. Run by `npm run update:realtime-sdk`.
// Usage: NEON_PKGS_PATH=<neon-pkgs checkout> node scripts/update-realtime-sdk.mjs
// NEON_PKGS_PATH defaults to a sibling ../neon-pkgs checkout.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

import {
  REPO_ROOT,
  SUPPORTED_TYPEDOC_VERSION,
  VENDORED_PATH,
  main as generate,
  readManifest,
} from './generate-realtime-sdk-reference.mjs';

async function main() {
  const neonPkgsRoot = resolve(process.env.NEON_PKGS_PATH || join(REPO_ROOT, '..', 'neon-pkgs'));
  if (!existsSync(join(neonPkgsRoot, 'node_modules'))) {
    throw new Error(
      `No installed neon-pkgs checkout at ${neonPkgsRoot}. Set NEON_PKGS_PATH, then run \`pnpm install\` there.`
    );
  }

  const { modules } = readManifest();
  const entryPoints = modules.map((m) => join(neonPkgsRoot, m.entryPoint));

  const tmp = mkdtempSync(join(tmpdir(), 'realtime-sdk-'));
  const tsconfigPath = join(tmp, 'tsconfig.json');
  const sourceDirs = [...new Set(entryPoints.map((entryPoint) => dirname(entryPoint)))];
  const tsconfig = {
    compilerOptions: {
      target: 'ES2022',
      module: 'ESNext',
      moduleResolution: 'Bundler',
      jsx: 'react-jsx',
      resolveJsonModule: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      skipLibCheck: true,
      baseUrl: neonPkgsRoot,
      // Resolve cross-package imports to source, so links between modules work
      // without building neon-pkgs.
      paths: Object.fromEntries(modules.map((m, i) => [m.importSpecifier, [entryPoints[i]]])),
      ignoreDeprecations: '6.0',
    },
    include: sourceDirs.flatMap((dir) => [`${dir}/**/*.ts`, `${dir}/**/*.tsx`]),
  };
  writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));

  const optionsPath = join(tmp, 'typedoc.json');
  const options = {
    entryPoints,
    tsconfig: tsconfigPath,
    name: 'Realtime SDK',
    readme: 'none',
    disableSources: true,
    excludeInternal: true,
    validation: { invalidLink: true, notDocumented: true, notExported: true },
  };
  writeFileSync(optionsPath, JSON.stringify(options, null, 2));

  const artifactPath = join(tmp, 'realtime-sdk.json');
  const result = spawnSync(
    'npx',
    [
      '-y',
      `typedoc@${SUPPORTED_TYPEDOC_VERSION}`,
      '--options',
      optionsPath,
      '--json',
      artifactPath,
    ],
    { cwd: neonPkgsRoot, stdio: 'inherit' }
  );
  if (result.status !== 0) {
    throw new Error(`TypeDoc exited with status ${result.status ?? result.signal}.`);
  }

  const artifact = JSON.parse(readFileSync(artifactPath, 'utf8'));
  // Source-path indexes the generator never reads.
  delete artifact.symbolIdMap;
  delete artifact.files;
  writeFileSync(resolve(REPO_ROOT, VENDORED_PATH), `${JSON.stringify(artifact, null, 2)}\n`);
  process.stderr.write(`[realtime-sdk] vendored ${VENDORED_PATH} from ${neonPkgsRoot}\n`);

  await generate();
}

main().catch((error) => {
  process.stderr.write(`Error: ${error.message}\n`);
  process.exit(1);
});
