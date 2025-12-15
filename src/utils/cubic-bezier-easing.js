/**
 * Creates an easing function from cubic-bezier coordinates
 * @param {number} x1 - First control point x coordinate (0-1)
 * @param {number} y1 - First control point y coordinate
 * @param {number} x2 - Second control point x coordinate (0-1)
 * @param {number} y2 - Second control point y coordinate
 * @returns {function} Easing function that takes a progress value (0-1) and returns eased value (0-1)
 */
const createCubicBezierEasing = (x1, y1, x2, y2) => {
  // Clamp control points to valid range
  const cx1 = Math.max(0, Math.min(1, x1));
  const cy1 = y1;
  const cx2 = Math.max(0, Math.min(1, x2));
  const cy2 = y2;

  // Cubic Bezier function: B(t) = (1-t)³P₀ + 3(1-t)²tP₁ + 3(1-t)t²P₂ + t³P₃
  // For easing, P₀ = (0,0) and P₃ = (1,1)
  const cubicBezier = (t) => {
    const t2 = t * t;
    const t3 = t2 * t;
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;

    return (
      mt3 * 0 + // P₀ = (0,0)
      3 * mt2 * t * cx1 + // P₁ = (cx1, cy1)
      3 * mt * t2 * cx2 + // P₂ = (cx2, cy2)
      t3 * 1 // P₃ = (1,1)
    );
  };

  // Binary search to find t for a given x
  const solveForX = (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;

    let t0 = 0;
    let t1 = 1;
    let t = x;

    // Use Newton's method for better precision
    for (let i = 0; i < 8; i += 1) {
      const currentX = cubicBezier(t);
      const dx = currentX - x;

      if (Math.abs(dx) < 0.0001) {
        break;
      }

      // Derivative: B'(t) = 3(1-t)²(cx1) + 6(1-t)t(cx2-cx1) + 3t²(1-cx2)
      const mt = 1 - t;
      const mt2 = mt * mt;
      const t2 = t * t;
      const dt = 3 * mt2 * cx1 + 6 * mt * t * (cx2 - cx1) + 3 * t2 * (1 - cx2);

      if (Math.abs(dt) < 0.0001) {
        // Fallback to binary search if derivative is too small
        break;
      }

      t -= dx / dt;
      t = Math.max(0, Math.min(1, t));
    }

    // Fallback to binary search if Newton's method didn't converge
    if (Math.abs(cubicBezier(t) - x) > 0.001) {
      t = (t0 + t1) / 2;
      for (let i = 0; i < 12; i += 1) {
        const currentX = cubicBezier(t);
        if (Math.abs(currentX - x) < 0.0001) {
          break;
        }
        if (currentX > x) {
          t1 = t;
        } else {
          t0 = t;
        }
        t = (t0 + t1) / 2;
      }
    }

    return t;
  };

  // Return easing function
  return (progress) => {
    if (progress <= 0) return 0;
    if (progress >= 1) return 1;

    const t = solveForX(progress);
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    const t2 = t * t;
    const t3 = t2 * t;

    // Calculate y value using cubic bezier
    return (
      mt3 * 0 + // P₀ = (0,0)
      3 * mt2 * t * cy1 + // P₁ = (cx1, cy1)
      3 * mt * t2 * cy2 + // P₂ = (cx2, cy2)
      t3 * 1 // P₃ = (1,1)
    );
  };
};

/**
 * Creates an easing function from cubic-bezier coordinates (array format)
 * @param {number[]} coords - Array of 4 numbers [x1, y1, x2, y2]
 * @returns {function} Easing function that takes a progress value (0-1) and returns eased value (0-1)
 */
const cubicBezierEasing = (coords) => {
  if (Array.isArray(coords) && coords.length === 4) {
    return createCubicBezierEasing(coords[0], coords[1], coords[2], coords[3]);
  }
  throw new Error('cubicBezierEasing expects an array of 4 numbers [x1, y1, x2, y2]');
};

export default cubicBezierEasing;
