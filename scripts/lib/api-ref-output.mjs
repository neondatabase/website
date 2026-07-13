import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { resolve } from 'node:path';

export function createApiRefPaths(root) {
  const dataRoot = resolve(root, 'src/data/api-ref');
  const markdownRoot = resolve(root, 'public/md/docs/reference/api');
  return {
    root,
    dataRoot,
    markdownRoot,
    dataTmp: `${dataRoot}.next`,
    markdownTmp: `${markdownRoot}.next`,
    llmsRoot: resolve(root, 'public/docs/reference/api'),
    navYamlPath: resolve(root, 'content/docs/api-navigation.yaml'),
    apiDocsDir: resolve(root, 'content/api-docs'),
    sidecarDataDir: resolve(root, 'scripts/data'),
    cliSchemaPath: resolve(root, 'scripts/docs-checks/neonctl/schema.json'),
    apiMarkdownPath: resolve(root, 'public/md/docs/reference/api.md'),
  };
}

function readJsonIfExists(path, fallback = {}) {
  return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : fallback;
}

export function loadApiRefSidecars(paths) {
  const fromSidecar = (name) => readJsonIfExists(resolve(paths.sidecarDataDir, name));
  return {
    cliCoverage: fromSidecar('cli-coverage.json'),
    mcpCoverage: fromSidecar('mcp-coverage.json'),
    consoleBreadcrumbs: fromSidecar('console-breadcrumbs.json'),
    mcpToolDefs: fromSidecar('mcp-tool-definitions.json'),
    cliTableOutput: fromSidecar('cli-table-output.json'),
    responseExamples: fromSidecar('response-examples.json'),
    cliSchema: readJsonIfExists(paths.cliSchemaPath, null),
  };
}

export function prepareApiRefOutput(paths) {
  rmSync(paths.dataTmp, { recursive: true, force: true });
  rmSync(paths.markdownTmp, { recursive: true, force: true });
  mkdirSync(paths.dataTmp, { recursive: true });
  mkdirSync(paths.markdownTmp, { recursive: true });
}

export function writeOperationOutput(paths, opData, markdown) {
  const jsonDir = resolve(paths.dataTmp, opData.tag);
  mkdirSync(jsonDir, { recursive: true });
  writeFileSync(resolve(jsonDir, `${opData.id}.json`), `${JSON.stringify(opData, null, 2)}\n`);

  const markdownDir = resolve(paths.markdownTmp, opData.tag);
  mkdirSync(markdownDir, { recursive: true });
  writeFileSync(resolve(markdownDir, `${opData.id}.md`), markdown);
}

export function writeLlmsIndex(paths, file, content) {
  mkdirSync(paths.llmsRoot, { recursive: true });
  writeFileSync(resolve(paths.llmsRoot, file), content);
}

export function writeApiIndexMarkdown(paths, content) {
  writeFileSync(paths.apiMarkdownPath, content);
}

export function writeTagMarkdownFiles(paths, tagOps, tagDisplay, toAgentMarkdown) {
  for (const [tag, ops] of Object.entries(tagOps)) {
    const tagTitle = tagDisplay[tag] || ops[0]?.tagDisplay || tag;
    const introPath = resolve(paths.apiDocsDir, `${tag}.md`);
    const intro = existsSync(introPath) ? readFileSync(introPath, 'utf-8').trim() : null;
    const header = intro
      ? `# ${tagTitle}\n\n${intro}\n`
      : `# ${tagTitle}\n\nNeon Management API — ${tagTitle} endpoints.\n`;
    writeFileSync(
      resolve(paths.markdownTmp, `${tag}.md`),
      `${header}\n---\n\n${ops.map((op) => toAgentMarkdown(op)).join('\n---\n\n')}`
    );
  }
}

export function writeExtraApiDocs(paths, tagOps) {
  let extraDocCount = 0;
  for (const file of readdirSync(paths.apiDocsDir).filter((f) => f.endsWith('.md'))) {
    const base = file.slice(0, -3);
    if (tagOps[base]) continue;
    const title = base.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const content = readFileSync(resolve(paths.apiDocsDir, file), 'utf-8').trim();
    writeFileSync(resolve(paths.markdownTmp, file), `# ${title}\n\n${content}\n`);
    extraDocCount++;
  }
  return extraDocCount;
}

export function commitApiRefOutput(paths) {
  rmSync(paths.dataRoot, { recursive: true, force: true });
  rmSync(paths.markdownRoot, { recursive: true, force: true });
  renameSync(paths.dataTmp, paths.dataRoot);
  renameSync(paths.markdownTmp, paths.markdownRoot);
}

export function writeNavigationYaml(paths, content) {
  writeFileSync(paths.navYamlPath, content);
}

export function writeRunSummary(paths, { opCount, tagCount, extraDocCount }) {
  process.stderr.write(`Written:\n`);
  process.stderr.write(`  ${paths.dataRoot}/{tag}/{slug}.json (${opCount} files)\n`);
  process.stderr.write(`  ${paths.markdownRoot}/{tag}/{slug}.md (${opCount} files)\n`);
  process.stderr.write(`  public/md/docs/reference/api.md\n`);
  process.stderr.write(`  ${paths.llmsRoot}/llms.txt\n`);
  process.stderr.write(`  ${paths.llmsRoot}/llms-full.txt\n`);
  process.stderr.write(`  ${paths.markdownRoot}/{tag}.md (${tagCount} files)\n`);
  if (extraDocCount > 0)
    process.stderr.write(`  ${paths.markdownRoot}/[extra docs] (${extraDocCount} files)\n`);
  process.stderr.write(`  ${paths.navYamlPath}\n`);
}
