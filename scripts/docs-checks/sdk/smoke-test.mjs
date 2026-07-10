#!/usr/bin/env node
/**
 * Smoke-test @neon/sdk patterns used in SDK docs against a live Neon account.
 * Usage: node scripts/docs-checks/sdk/smoke-test.mjs
 * Loads NEON_API_KEY from ~/neon.env (or process.env).
 */
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { createNeonClient, raw } from '@neon/sdk';

function loadEnvFile(path) {
  const env = {};
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

/** Prefer variables under `# TEST API SDK` in ~/neon.env when present. */
function loadTestSdkEnv(path) {
  const lines = readFileSync(path, 'utf8').split('\n');
  const start = lines.findIndex((line) => line.trim() === '# TEST API SDK');
  if (start === -1) return loadEnvFile(path);

  const env = {};
  for (const line of lines.slice(start + 1)) {
    const trimmed = line.trim();
    if (trimmed.startsWith('#') && trimmed !== '# TEST API SDK') break;
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

const envPath = join(homedir(), 'neon.env');
const fileEnv = loadTestSdkEnv(envPath);
const apiKey = process.env.NEON_API_KEY ?? fileEnv.NEON_API_KEY;

if (!apiKey) {
  console.error('NEON_API_KEY not found in environment or ~/neon.env');
  process.exit(1);
}

const neon = createNeonClient({ apiKey });
const neonThrow = createNeonClient({ apiKey, throwOnError: true });

const results = [];

function pass(name, detail = '') {
  results.push({ name, ok: true, detail });
  console.log(`✓ ${name}${detail ? `: ${detail}` : ''}`);
}

function fail(name, err) {
  const detail = err instanceof Error ? err.message : String(err);
  results.push({ name, ok: false, detail });
  console.error(`✗ ${name}: ${detail}`);
}

async function run() {
  console.log('Running @neon/sdk doc smoke tests...\n');

  // migration guide + typescript-sdk: list orgs + projects page
  try {
    const { data: orgs, error: orgsError } = await neon.user.organizations();
    if (orgsError) throw orgsError;
    if (!orgs?.length) throw new Error('no organizations returned');

    const { data: page, error } = await neon.projects.list({ org_id: orgs[0].id }).page();
    if (error) throw error;
    if (!Array.isArray(page?.items)) throw new Error('page.items is not an array');

    pass('user.organizations + projects.list().page()', `${orgs.length} org(s), ${page.items.length} project(s) on first page`);

    const projectId = page.items[0]?.id;
    if (projectId) {
      const { data: branchPage, error: branchError } = await neon.branches.list(projectId).page();
      if (branchError) throw branchError;
      if (!Array.isArray(branchPage?.items)) throw new Error('branch page.items is not an array');
      pass('branches.list().page()', `${branchPage.items.length} branch(es)`);

      const defaultBranchId = branchPage.items.find((b) => b.default)?.id ?? branchPage.items[0]?.id;
      if (defaultBranchId) {
        const { data: cs, error: csError } = await neon.postgres.connectionString({
          projectId,
          branchId: defaultBranchId,
        });
        if (csError) throw csError;
        if (typeof cs !== 'string' || !cs.startsWith('postgresql://')) {
          throw new Error('unexpected connection string shape');
        }
        pass('postgres.connectionString()', 'ok');
      }
    }
  } catch (err) {
    fail('list orgs/projects/branches', err);
  }

  // multitenancy pattern (throwOnError: true + list().all())
  try {
    const { data: projects, error } = await neonThrow.projects.list().all();
    if (error) throw error;
    if (!Array.isArray(projects)) throw new Error('all() data is not an array');
    pass('projects.list().all() with throwOnError', `${projects.length} project(s)`);
  } catch (err) {
    fail('projects.list().all() with throwOnError', err);
  }

  // pagination section pattern (default throwOnError)
  try {
    const { data: allProjects, error: allError } = await neon.projects.list().all();
    if (allError) throw allError;
    const { data: onePage, error: pageError } = await neon.projects.list().page();
    if (pageError) throw pageError;
    if (!Array.isArray(allProjects) || !Array.isArray(onePage?.items)) {
      throw new Error('pagination envelope shape mismatch');
    }
    pass('projects.list().all() + .page() default client', `${allProjects.length} total, ${onePage.items.length} on page`);
  } catch (err) {
    fail('pagination default client', err);
  }

  // raw.getProject if we have a project
  try {
    const { data: allProjects, error } = await neon.projects.list().all();
    if (error) throw error;
    const projectId = allProjects?.[0]?.id;
    if (!projectId) {
      pass('raw.getProject', 'skipped (no projects)');
    } else {
      const project = await raw.getProject({
        client: neon.client,
        path: { project_id: projectId },
        throwOnError: true,
      });
      const id = project?.project?.id ?? project?.id;
      if (!id) throw new Error('raw.getProject missing project id');
      pass('raw.getProject', id);
    }
  } catch (err) {
    fail('raw.getProject', err);
  }

  console.log('\n---');
  const failed = results.filter((r) => !r.ok);
  if (failed.length) {
    console.error(`${failed.length} failed, ${results.length - failed.length} passed`);
    process.exit(1);
  }
  console.log(`All ${results.length} checks passed.`);
}

run();
