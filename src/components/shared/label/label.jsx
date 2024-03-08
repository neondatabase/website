import clsx from 'clsx';
import PropTypes from 'prop-types';

const colorClassName = {
  yellow: {
    border: `border-image-[linear-gradient(124.33deg,rgba(240,240,117,0.24)_17.11%,rgba(240,240,117,0.12)_74.09%)]`,
    text: 'text-yellow-70',
  },
  pink: {
    border: `border-image-[linear-gradient(124.33deg,rgba(255,204,229,0.24)_17.11%,rgba(255,204,229,0.12)_74.09%)]`,
    text: 'text-pink-90',
  },
  blue: {
    border: `border-image-[linear-gradient(124.33deg,rgba(173,224,235,0.24)_17.11%,rgba(173,224,235,0.12)_74.09%)]`,
    text: 'text-blue-80',
  },
};

const Label = ({ label, color = 'blue' }) => (
  <span
    className={clsx(
      'relative mt-14 w-fit whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] leading-none -tracking-extra-tight lg:mt-6',
      colorClassName[color].text
    )}
  >
    <span className={clsx('absolute inset-0 rounded-[inherit]', colorClassName[color].border)} />
    {label}
  </span>
);

Label.propTypes = {
  label: PropTypes.string.isRequired,
  color: PropTypes.oneOf(Object.keys(colorClassName)),
};

export default Label;
