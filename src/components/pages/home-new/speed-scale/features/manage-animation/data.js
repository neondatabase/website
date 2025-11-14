export const ANIMATION_CONFIG = {
  INITIAL: {
    start: 0,
  },
  API_CALL_CODE: {
    start: 1.13,
    duration: 0.2,
    ease: 'linear',
  },
  CONNECTION_STRING: {
    start: 1.42,
    duration: 1.47,
    ease: 'linear',
  },
  LINE_GROWTH: {
    start: 3.1,
    duration: 0.1,
    ease: [0.65, 0, 0.83, 0.83],
  },
  SQL_SHOW: {
    start: 3.1,
    duration: 1.0,
    ease: [0.33, 0, 0, 1.01],
  },
  SQL_TYPING: {
    start: 3.1,
    duration: 1.0,
    ease: [0.33, 0, 0, 1.01],
  },
  LOOP: {
    start: 4.5,
    duration: 0.5,
    ease: [0.33, -0, 0.67, 1],
  },
};

export const ANIMATION_DURATION = 5;

export const API_CALL_CODE = 'curl -X POST https://api.neon.tech/v2/projects/:id/database';
export const CONNECTION_STRING = 'postgresql://example@ep-812.eu-west-1.aws.neon.tech/primary';

export const SQL_CODE = `CREATE TABLE IF NOT EXISTS playing_with_neon(id SERIAL PRIMARY KEY, name TEXT NOT NULL, value REAL);
INSERT INTO playing_with_neon(name, value)
SELECT LEFT(md5(i::TEXT), 10), random() FROM generate_series(1, 10) s(i);
SELECT * FROM playing_with_neon;`;
