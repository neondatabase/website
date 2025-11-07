import cn from 'clsx';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';

const LinesPattern = ({ size, className }) => (
  <span
    className={cn(
      "h-3 bg-[url('/images/pages/home-new/line.svg')] bg-repeat-x xl:h-2.5 lg:h-[7px]",
      className
    )}
    style={{ backgroundSize: `${size}px 100%` }}
    aria-hidden
  />
);

LinesPattern.propTypes = {
  size: PropTypes.number.isRequired,
  className: PropTypes.string,
};

const StatusLine = ({ className }) => (
  <Container
    className="2xl:max-w-[1344px] 2xl:pl-16 xl:max-w-5xl lg:pl-16 md:pl-5 md:pr-3"
    size="1600"
  >
    <div
      className={cn(
        'flex items-center justify-between pl-40',
        'font-mono text-sm leading-dense -tracking-[0.05em] text-gray-new-60',
        '2xl:pl-0 xl:text-xs lg:text-[9px]',
        className
      )}
    >
      <span
        className="mr-2 h-3 w-2.5 shrink-0 bg-gray-new-60 xl:mr-1 xl:h-2.5 xl:w-2 lg:mr-1.5 lg:size-1.5"
        aria-hidden
      />
      <span className="mr-7 shrink-0 tracking-extra-tight xl:mr-4">
        SYSTEM: NEON DATABASE PLATFORM
      </span>
      <LinesPattern size={4} className="-mr-0.5 basis-11 xl:mr-0 xl:basis-14 lg:basis-[42px]" />
      <LinesPattern size={8} className="basis-[175px] xl:basis-[240px] lg:flex-1" />
      <LinesPattern size={18} className="basis-[190px] xl:hidden" />
      <span className="ml-2.5 mr-1 shrink-0 xl:ml-0 lg:hidden">[ STATUS: ONLINE ]</span>
      <LinesPattern
        size={18}
        className="basis-[106px] xl:basis-[104px] lg:basis-[68px] xs:hidden"
      />
      <LinesPattern size={8} className="basis-[170px] xl:hidden" />
      <LinesPattern size={4} className="basis-12 xl:hidden" />
      <span className="ml-[34px] shrink-0 xl:ml-0 lg:ml-[22px] xs:hidden">
        [ CONNECTION: STABLE ]
      </span>
    </div>
  </Container>
);

StatusLine.propTypes = {
  className: PropTypes.string,
};

export default StatusLine;
