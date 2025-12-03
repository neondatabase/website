export const NEON_STATUS = {
  UP: 'UP',
  HASISSUES: 'HASISSUES',
  UNDERMAINTENANCE: 'UNDERMAINTENANCE',
};

const STATUS_CODE_MAP = {
  100: NEON_STATUS.UP,
  200: NEON_STATUS.UNDERMAINTENANCE,
  300: NEON_STATUS.HASISSUES,
  400: NEON_STATUS.HASISSUES,
  500: NEON_STATUS.HASISSUES,
  600: NEON_STATUS.HASISSUES,
};

function mapStatusCodeToNeonStatus(statusCode) {
  return STATUS_CODE_MAP[statusCode] ?? NEON_STATUS.UP;
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
