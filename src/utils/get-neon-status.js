export const NEON_STATUS = {
  UP: 'UP',
  HASISSUES: 'HASISSUES',
  UNDERMAINTENANCE: 'UNDERMAINTENANCE',
};

function mapStatusCodeToNeonStatus(statusCode) {
  if (statusCode === 100) return NEON_STATUS.UP;
  if (statusCode === 200) return NEON_STATUS.UNDERMAINTENANCE;
  if (statusCode === 300 || statusCode === 400 || statusCode === 500 || statusCode === 600)
    return NEON_STATUS.HASISSUES;

  return NEON_STATUS.UP;
}

export async function getNeonStatus() {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_NEON_STATUS_API, { cache: 'no-store' });
    const json = await response.json();
    const statusCode = json?.result?.status_overall?.status_code;
    const status = mapStatusCodeToNeonStatus(statusCode);

    return { status, error: null };
  } catch (error) {
    return { status: NEON_STATUS.UP, error };
  }
}
