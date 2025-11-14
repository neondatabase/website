import clsx from 'clsx';
import { m } from 'framer-motion';
import PropTypes from 'prop-types';

const Step = ({ index, title, children }) => (
  <m.li
    className={clsx(
      'relative pl-16 2xl:pl-[50px] xl:pl-11 lg:pl-[56px] sm:pl-7',
      index === 1 && 'opacity-30'
    )}
  >
    <span className="absolute left-0 top-0 h-full w-10 xl:w-7 lg:w-8 sm:w-4">
      <span
        className={clsx(
          'absolute -top-2 left-0 z-10 flex w-full justify-center bg-black-pure p-2.5',
          index !== 0 && 'h-full',
          'font-mono-new leading-none text-gray-new-60',
          'xl:-top-1.5 xl:p-[7px] xl:text-[11px] lg:p-2 lg:text-sm sm:-top-[3px] sm:p-1 sm:text-[7px]'
        )}
        aria-label={`Step ${index + 1}`}
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <m.span
        className={clsx(
          'absolute left-1/2 w-px -translate-x-1/2 bg-gray-new-20',
          index === 0 ? 'top-0 h-full' : '-top-12 h-0'
        )}
        aria-hidden
      />
    </span>
    <h4
      className={clsx(
        'mb-6 text-xl leading-none tracking-extra-tight',
        '2xl:text-lg xl:mb-4 xl:text-sm lg:mb-[18px] lg:text-lg sm:mb-[10px] sm:text-[9px]',
        '[&>span]:font-mono-new [&>span]:text-gray-new-70'
      )}
      dangerouslySetInnerHTML={{ __html: title }}
    />
    {children}
  </m.li>
);

Step.propTypes = {
  index: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Step;
