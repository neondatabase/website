import { PropTypes } from 'prop-types';

const BgDecor = ({ hasBorder = null, hasNoise = null, hasPattern = null, children = null }) => (
  <div className="pointer-events-none absolute inset-0 rounded-[inherit]" aria-hidden>
    {children}
    {hasPattern && (
      <div className="absolute inset-px rounded-[inherit] bg-[url('/images/pages/variable-load/bg-pattern.png')] bg-[6px,3.45px]" />
    )}
    {hasNoise && (
      <div className="absolute inset-px rounded-[inherit] bg-[url('/images/pages/variable-load/bg-noise.png')] bg-[50px,50px]" />
    )}
    {hasBorder && (
      <div className="absolute inset-0 rounded-[inherit] border border-white mix-blend-overlay" />
    )}
  </div>
);

BgDecor.propTypes = {
  hasBorder: PropTypes.bool,
  hasNoise: PropTypes.bool,
  hasPattern: PropTypes.bool,
  children: PropTypes.node,
};

export default BgDecor;
