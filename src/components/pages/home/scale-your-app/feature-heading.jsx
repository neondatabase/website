import PropTypes from 'prop-types';

import { cn } from 'utils/cn';

const FeatureHeading = ({ className, lines, description, descriptionClassName }) => (
  <header className={cn('relative z-20', className)}>
    <h3 className="font-mono text-[3.5rem] leading-none font-normal text-[#cae6dc] 2xl:text-[3.25rem] xl:text-[2.75rem] md:text-[2.25rem] sm:text-2xl">
      {lines.map(({ text, width }) => (
        <span
          className="relative block h-[63px] max-w-full xl:h-[50px] md:h-[41px] sm:h-[30px]"
          style={{ width }}
          key={text}
        >
          <span
            className="absolute inset-x-0 top-px h-15 bg-[#0d221a] 2xl:h-14 xl:h-12 md:h-10 sm:h-7"
            aria-hidden="true"
          />
          <span className="relative block h-full pl-8 leading-[63px] whitespace-nowrap xl:pl-6 xl:leading-[50px] md:pl-5 md:leading-[41px] sm:pl-4 sm:leading-[30px]">
            {text}
          </span>
        </span>
      ))}
    </h3>

    <p
      className={cn(
        'mt-3.5 ml-8 max-w-[352px] font-mono text-xl leading-dense font-normal text-[#cae6dc] uppercase xl:ml-6 lg:text-lg md:ml-5 md:max-w-[320px] md:text-base sm:mt-3 sm:ml-4 sm:max-w-[270px] sm:text-sm',
        descriptionClassName
      )}
    >
      {description}
    </p>
  </header>
);

FeatureHeading.propTypes = {
  className: PropTypes.string,
  lines: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired,
    })
  ).isRequired,
  description: PropTypes.string.isRequired,
  descriptionClassName: PropTypes.string,
};

export default FeatureHeading;
