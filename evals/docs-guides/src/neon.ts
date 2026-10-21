export interface NeonDatabase {
  id: string;
  connectionString: string;
  directConnectionString: string;
  expiresAt: string;
}

export async function createDatabase(): Promise<NeonDatabase> {
  const response = await fetch('https://neon.new/api/v1/database', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ref: 'neon-docs-eval' }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create Neon database: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  const pooledUrl: string = data.connection_string;

  // Derive direct URL by removing -pooler from hostname
  const directUrl = pooledUrl.replace('-pooler.', '.');

  return {
    id: data.id,
    connectionString: pooledUrl,
    directConnectionString: directUrl,
    expiresAt: data.expires_at,
  };
}
