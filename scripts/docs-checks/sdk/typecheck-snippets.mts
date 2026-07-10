/**
 * Type-check @neon/sdk patterns from SDK docs (no live API calls).
 * Run: npx tsc --noEmit --module nodenext --moduleResolution nodenext --target es2022 --skipLibCheck scripts/docs-checks/sdk/typecheck-snippets.mts
 */
import { createNeonClient, raw } from '@neon/sdk';
import type { Project, Branch } from '@neon/sdk';

const apiKey = 'test-key';
const projectId = 'p1';
const branchId = 'b1';
const parentBranchId = 'parent';

const neon = createNeonClient({ apiKey });
const neonThrow = createNeonClient({ apiKey, throwOnError: true });

async function docPatterns() {
  const { data: orgs, error: orgsError } = await neon.user.organizations();
  if (orgsError) throw orgsError;

  const { data: page, error } = await neon.projects.list({ org_id: orgs![0].id }).page();
  if (error) throw error;
  console.log(page!.items);

  const { data: branchPage, error: branchError } = await neon.branches.list(projectId).page();
  if (branchError) throw branchError;
  console.log(branchPage!.items);

  const { data: allProjects, error: allError } = await neon.projects.list().all();
  if (allError) throw allError;

  const { data: projects, error: listError } = await neonThrow.projects.list().all();
  if (listError) throw listError;
  void projects;

  const { data, error: createError } = await neon.projects.createAndConnect({
    name: 'my-app',
    region_id: 'aws-us-east-1',
    pg_version: 17,
  });
  if (createError) throw createError;
  void data!.connectionString;

  const { data: branchData, error: branchCreateError } = await neon.branches.createWithCompute(
    projectId,
    { name: 'dev-1', parentId: parentBranchId }
  );
  if (branchCreateError) throw branchCreateError;
  void branchData!.connectionString;

  const { error: dbError } = await neon.postgres.databases.create(projectId, branchId, {
    name: 'mydb',
    owner_name: 'neondb_owner',
  });
  if (dbError) throw dbError;

  const connection_string = await neonThrow.postgres.connectionString({ projectId, branchId });

  const rawProject = await raw.getProject({
    client: neon.client,
    path: { project_id: projectId },
    throwOnError: true,
  });
  void rawProject;

  const { connectionString } = await neonThrow.branches.createWithCompute(projectId, {
    name: 'sandbox',
  });
  void connectionString;
}

const _types: [Project, Branch] = [{} as Project, {} as Branch];
void [docPatterns, _types];
