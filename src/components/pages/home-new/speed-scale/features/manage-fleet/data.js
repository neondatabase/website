export const ANIMATION_CONFIG = {
  API_CALL_CODE: {
    start: 0.6,
    duration: 0.2,
    ease: 'linear',
  },
  CONNECTION_STRING: {
    start: 0.8,
    duration: 0.8,
    ease: [0.32, 0.07, 0.5, 1],
  },
  LINE_GROWTH: {
    start: 1.6,
    duration: 0.3,
    ease: 'easeInOut',
  },
  STEP_2: {
    start: 1.6,
    duration: 1.0,
    ease: 'easeInOut',
  },
  SQL_CODE: {
    start: 1.9,
    duration: 1.3,
  },
  LOOP: {
    start: 29.5,
    duration: 0.5,
    ease: [0.33, 0, 0.67, 1],
  },
};

export const ANIMATION_DURATION = 30;

export const API_CALL_CODE =
  'curl -X <span>POST</span> https://api.neon.tech/v2/projects/:id/database';
export const CONNECTION_STRING = 'postgresql://example@ep-812.eu-west-1.aws.neon.tech/primary';

export const SQL_CODE = `CREATE TABLE IF NOT EXISTS playing_with_neon(id SERIAL PRIMARY KEY, name TEXT NOT NULL, value REAL);
INSERT INTO playing_with_neon(name, value)
SELECT LEFT(md5(i::TEXT), 10), random() FROM generate_series(1, 10) s(i);
SELECT * FROM playing_with_neon;`;
