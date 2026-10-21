import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

const UNIVERSAL_IMAGE = 'neon-eval-universal';

export interface Container {
  id: string;
  name: string;
}

export interface FileSnapshot {
  path: string;
  content: string;
}

// Proxy env vars to pass through from host to container (if set)
const PROXY_ENV_VARS = [
  'NPM_REGISTRY',
  'PIP_INDEX_URL',
  'GOPROXY',
  'MAVEN_MIRROR_URL',
  'CARGO_REGISTRY_URL',
];

export async function startContainer(
  name: string,
  env: Record<string, string>,
): Promise<Container> {
  // Pass through any proxy env vars that are set on the host
  const allEnv = { ...env };
  for (const key of PROXY_ENV_VARS) {
    if (process.env[key] && !allEnv[key]) {
      allEnv[key] = process.env[key]!;
    }
  }

  const envArgs = Object.entries(allEnv).flatMap(([k, v]) => ['-e', `${k}=${v}`]);

  const { stdout } = await execFileAsync('docker', [
    'run', '-d',
    '--name', name,
    '-w', '/app',
    ...envArgs,
    UNIVERSAL_IMAGE,
    'sleep', 'infinity',
  ]);

  return { id: stdout.trim(), name };
}

export async function dockerExec(
  container: Container,
  command: string,
  timeoutMs = 120_000,
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  try {
    const { stdout, stderr } = await execFileAsync(
      'docker',
      ['exec', container.name, 'bash', '-c', command],
      { timeout: timeoutMs, maxBuffer: 10 * 1024 * 1024 },
    );
    return { stdout, stderr, exitCode: 0 };
  } catch (err: any) {
    return {
      stdout: err.stdout || '',
      stderr: err.stderr || '',
      exitCode: err.code ?? 1,
    };
  }
}

export async function dockerWriteFile(
  container: Container,
  filePath: string,
  content: string,
): Promise<string> {
  const safePath = filePath.replace(/'/g, "'\\''");
  // First ensure the directory exists
  await dockerExec(container, `mkdir -p "$(dirname '${safePath}')"`);
  // Write via stdin to avoid shell injection from file content
  try {
    const child = require('child_process').spawn(
      'docker', ['exec', '-i', container.name, 'bash', '-c', `cat > '${safePath}'`],
      { stdio: ['pipe', 'pipe', 'pipe'] },
    );
    child.stdin.write(content);
    child.stdin.end();
    await new Promise<void>((resolve, reject) => {
      child.on('close', (code: number) => code === 0 ? resolve() : reject(new Error(`exit ${code}`)));
      child.on('error', reject);
    });
    return `File written to ${filePath}`;
  } catch (err) {
    return `Error writing file: ${err}`;
  }
}

export async function dockerReadFile(
  container: Container,
  filePath: string,
): Promise<string> {
  const safePath = filePath.replace(/'/g, "'\\''");
  const { stdout, stderr, exitCode } = await dockerExec(container, `cat '${safePath}'`);
  if (exitCode !== 0) return `Error reading file: ${stderr}`;
  return stdout;
}

export async function captureFileSnapshots(container: Container): Promise<FileSnapshot[]> {
  // Grab all user-created files in one shot using a find+awk script
  // that prints PATH<NUL>CONTENT<NUL> for each file
  const result = await dockerExec(
    container,
    `find /app -type f \
      -not -path '*/node_modules/*' \
      -not -path '*/__pycache__/*' \
      -not -path '*/.git/*' \
      -not -path '*/venv/*' \
      -not -path '*/.venv/*' \
      -not -path '*/target/*' \
      -not -path '*/_build/*' \
      -not -path '*/deps/*' \
      -not -name 'package-lock.json' \
      -not -name '*.class' \
      -not -name 'go.sum' \
      -size -50k \
      2>/dev/null | sort | while IFS= read -r f; do
        printf '%s\\n' "===FILE:$f"
        cat "$f" 2>/dev/null
      done`,
    300_000,
  );

  const snapshots: FileSnapshot[] = [];
  const chunks = result.stdout.split(/^===FILE:/m).filter(Boolean);
  for (const chunk of chunks) {
    const newlineIdx = chunk.indexOf('\n');
    if (newlineIdx === -1) continue;
    const filePath = chunk.slice(0, newlineIdx).trim();
    const content = chunk.slice(newlineIdx + 1);
    if (filePath && content.length < 50_000) {
      snapshots.push({
        path: filePath.replace('/app/', ''),
        content,
      });
    }
  }

  return snapshots;
}

export async function removeContainer(container: Container): Promise<void> {
  try {
    await execFileAsync('docker', ['rm', '-f', container.name]);
  } catch {
    // ignore — container may already be gone
  }
}

export async function buildUniversalImage(): Promise<void> {
  const dockerDir = new URL('../docker', import.meta.url).pathname;

  // Check if image already exists
  try {
    await execFileAsync('docker', ['image', 'inspect', UNIVERSAL_IMAGE]);
    console.log(`Image ${UNIVERSAL_IMAGE} already exists. Delete it manually to rebuild.`);
    return;
  } catch {
    // Image doesn't exist, build it
  }

  console.log(`Building ${UNIVERSAL_IMAGE} (this takes a few minutes the first time)...`);
  await execFileAsync('docker', [
    'build', '-t', UNIVERSAL_IMAGE,
    '-f', `${dockerDir}/Dockerfile.universal`,
    dockerDir,
  ], { timeout: 600_000 });
  console.log(`Image ${UNIVERSAL_IMAGE} built.`);
}
