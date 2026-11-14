import PropTypes from 'prop-types';

// Halftone icons in the style of the "Built for agents" set: a 56px square,
// a dot grid, and dots that grow towards the top right.
const SIZE = 56;
const DIAMETERS = [0, 1.72, 2.58, 3.44, 4.3, 6.03];

// Glyph icons: each digit is a dot diameter index (0 = no dot) on a 6x6 grid.
const GLYPHS = {
  // A plus, heaviest at the centre: add your own template.
  plus: ['002200', '014410', '245542', '245542', '014410', '002200'],
  // A grid of templates with one block missing: the one you could not find.
  gap: ['222200', '233300', '233444', '234445', '234455', '234455'],
  // Rising steps: add, run, deploy.
  steps: ['000005', '000045', '000445', '003445', '023445', '123445'],
};

const getDots = (shape) => {
  const rows = GLYPHS[shape];
  const pitch = SIZE / rows.length;
  return rows.flatMap((row, y) =>
    [...row].map((level, x) => ({
      x: pitch * x + pitch / 2,
      y: pitch * y + pitch / 2,
      diameter: DIAMETERS[Number(level)],
    }))
  );
};

const DotIcon = ({ shape, className = null }) => (
  <svg
    className={className}
    width={SIZE}
    height={SIZE}
    viewBox={`0 0 ${SIZE} ${SIZE}`}
    fill="none"
    aria-hidden
  >
    {getDots(shape)
      .filter((dot) => dot.diameter > 0)
      .map((dot) => (
        <circle
          key={`${dot.x}-${dot.y}`}
          cx={dot.x}
          cy={dot.y}
          r={dot.diameter / 2}
          fill="currentColor"
        />
      ))}
  </svg>
);

DotIcon.propTypes = {
  shape: PropTypes.oneOf(Object.keys(GLYPHS)).isRequired,
  className: PropTypes.string,
};

export default DotIcon;
