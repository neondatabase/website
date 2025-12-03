export const NEON_STATUS = {
  UP: 'UP',
  HASISSUES: 'HASISSUES',
  UNDERMAINTENANCE: 'UNDERMAINTENANCE',
};

const STATUS_API = 'https://7687492087503394.hostedstatus.com/1.0/status/6878fc85709daa75be6c7e3c';

function mapStatusCodeToNeonStatus(statusCode) {
  if (statusCode === 100) return NEON_STATUS.UP;
  if (statusCode === 200) return NEON_STATUS.UNDERMAINTENANCE;
  if (statusCode === 300 || statusCode === 400 || statusCode === 500 || statusCode === 600)
    return NEON_STATUS.HASISSUES;

  return NEON_STATUS.UP;
}

export async function getNeonStatus() {
  try {
    const response = await fetch(STATUS_API, { cache: 'no-store' });
    const json = await response.json();
    const statusCode = json?.result?.status_overall?.status_code;
    const status = mapStatusCodeToNeonStatus(statusCode);

    return { status, error: null };
  } catch (error) {
    return { status: NEON_STATUS.UP, error };
  }
}
