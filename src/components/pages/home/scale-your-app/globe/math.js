const EPSILON = 0.000001;

export const addVectors = (left, right) => [
  left[0] + right[0],
  left[1] + right[1],
  left[2] + right[2],
];

export const applyQuaternion = ([x, y, z], [qx, qy, qz, qw]) => {
  const ix = qw * x + qy * z - qz * y;
  const iy = qw * y + qz * x - qx * z;
  const iz = qw * z + qx * y - qy * x;
  const iw = -qx * x - qy * y - qz * z;

  return [
    ix * qw + iw * -qx + iy * -qz - iz * -qy,
    iy * qw + iw * -qy + iz * -qx - ix * -qz,
    iz * qw + iw * -qz + ix * -qy - iy * -qx,
  ];
};

export const distanceBetween = (left, right) =>
  Math.hypot(left[0] - right[0], left[1] - right[1], left[2] - right[2]);

export const distanceBetweenSquared = (left, right) => {
  const x = left[0] - right[0];
  const y = left[1] - right[1];
  const z = left[2] - right[2];

  return x * x + y * y + z * z;
};

export const lerpVectors = (from, to, progress) => [
  from[0] + (to[0] - from[0]) * progress,
  from[1] + (to[1] - from[1]) * progress,
  from[2] + (to[2] - from[2]) * progress,
];

export const multiplyVector = (vector, scalar) => [
  vector[0] * scalar,
  vector[1] * scalar,
  vector[2] * scalar,
];

export const normalizeVector = (vector) => {
  const length = Math.hypot(vector[0], vector[1], vector[2]);

  if (length < EPSILON) return [0, 0, 0];
  return multiplyVector(vector, 1 / length);
};

export const quaternionBetweenUnitVectors = (from, to) => {
  let scalar = from[0] * to[0] + from[1] * to[1] + from[2] * to[2] + 1;
  let x;
  let y;
  let z;

  if (scalar < EPSILON) {
    scalar = 0;
    if (Math.abs(from[0]) > Math.abs(from[2])) {
      x = -from[1];
      y = from[0];
      z = 0;
    } else {
      x = 0;
      y = -from[2];
      z = from[1];
    }
  } else {
    x = from[1] * to[2] - from[2] * to[1];
    y = from[2] * to[0] - from[0] * to[2];
    z = from[0] * to[1] - from[1] * to[0];
  }

  const length = Math.hypot(x, y, z, scalar);
  if (length < EPSILON) return [0, 0, 0, 1];

  return [x / length, y / length, z / length, scalar / length];
};
