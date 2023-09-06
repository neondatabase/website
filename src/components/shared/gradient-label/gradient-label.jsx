import clsx from 'clsx';
import PropTypes from 'prop-types';

const themeClassName = {
  green: {
    wrapper: 'after:bg-[linear-gradient(180deg,rgba(0,229,153,0.2)20%,rgba(0,229,153,0.6)100%)]',
    text: 'bg-[linear-gradient(180deg,rgba(0,229,153,0.00)0%,rgba(0,229,153,0.10)100%)] text-green-45',
  },
  gray: {
    wrapper:
      'after:bg-[linear-gradient(180deg,rgba(175,177,182,0.2)20%,rgba(175,177,182,0.6)100%)]',
    text: 'bg-[linear-gradient(180deg,rgba(175,177,182,0.00)_0%,rgba(175,177,182,0.10)100%)] text-gray-new-70',
  },
};

const GradientLabel = ({ className = '', children, theme = 'green' }) => (
  <span
    className={clsx(
      'relative before:absolute before:inset-0 before:z-10 before:rounded-[40px] before:bg-black-new after:absolute after:-inset-px after:rounded-[40px]',
      className,
      themeClassName[theme].wrapper
    )}
  >
    <span
      className={clsx(
        'relative z-20 block rounded-[40px] px-[13px] py-1.5 text-sm font-medium leading-none -tracking-extra-tight',
        themeClassName[theme].text
      )}
    >
      {children}
    </span>
  </span>
);

GradientLabel.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  theme: PropTypes.oneOf(Object.keys(themeClassName)),
};

export default GradientLabel;
