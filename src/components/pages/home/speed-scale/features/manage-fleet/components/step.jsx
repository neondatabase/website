import clsx from 'clsx';
import { m } from 'framer-motion';
import PropTypes from 'prop-types';

const Step = ({ index, title, children, lineAnimation }) => (
  <div className="relative pl-16 2xl:pl-[50px] sm:pl-7 lg:pl-[56px] xl:pl-11">
    <span className="absolute top-0 left-0 h-full w-10 sm:w-4 lg:w-8 xl:w-7">
      <span
        className={clsx(
          'absolute -top-2 left-0 z-10 flex w-full justify-center bg-black-pure p-2.5',
          index !== 0 && 'h-full',
          'font-mono leading-none text-gray-new-60',
          'sm:-top-[3px] sm:p-1 sm:text-[7px] lg:p-2 lg:text-sm xl:-top-1.5 xl:p-[7px] xl:text-[11px]'
        )}
        aria-label={`Step ${index + 1}`}
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      {index === 0 && (
        <m.span
          className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-gray-new-20"
          {...lineAnimation}
          aria-hidden
        />
      )}
    </span>
    <h4
      className={clsx(
        'mb-6 text-xl leading-none tracking-extra-tight',
        '2xl:text-lg sm:mb-[10px] sm:text-[9px] lg:mb-[18px] lg:text-lg xl:mb-4 xl:text-sm',
        '[&>span]:font-mono [&>span]:text-gray-new-70'
      )}
      dangerouslySetInnerHTML={{ __html: title }}
    />
    {children}
  </div>
);

Step.propTypes = {
  index: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  lineAnimation: PropTypes.shape({
    initial: PropTypes.object,
    animate: PropTypes.object,
    transition: PropTypes.object,
  }),
};

Step.defaultProps = {
  lineAnimation: undefined,
};

export default Step;
