import clsx from 'clsx';
import PropTypes from 'prop-types';

const BlurWrapper = ({ children, className }) => (
  <div
    className={clsx(
      'relative z-10 rounded-[14px] bg-white bg-opacity-[0.03] p-1.5 backdrop-blur-[4px] xl:rounded-xl',
      className
    )}
  >
    <div
      className="absolute inset-0 z-10 rounded-[inherit] border border-white/[0.04]"
      aria-hidden
    />
    <div
      className="absolute inset-[5px] z-10 rounded-[10px] border border-white/[0.04] mix-blend-overlay"
      aria-hidden
    />
    {children}
  </div>
);

BlurWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default BlurWrapper;
