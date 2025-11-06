import cn from 'clsx';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';

const LinesPattern = ({ size, className }) => (
  <span
    className={cn("h-3 bg-[url('/images/pages/home-new/line.svg')] bg-repeat-x", className)}
    style={{ backgroundSize: `${size}px 100%` }}
    aria-hidden
  />
);

LinesPattern.propTypes = {
  size: PropTypes.number.isRequired,
  className: PropTypes.string,
};

const StatusLine = ({ className }) => (
  <Container className="2xl:max-w-[1280px] lg:px-16" size="1600">
    <div
      className={cn(
        'flex h-4 items-center justify-between pl-40 2xl:pl-0',
        'font-mono text-sm leading-dense tracking-extra-tight text-gray-new-60',
        className
      )}
    >
      <span className="mr-2 h-3 w-2.5 shrink-0 bg-gray-new-60" aria-hidden />
      <span className="mr-7 shrink-0">SYSTEM: NEON DATABASE PLATFORM</span>
      <LinesPattern size={4} className="-mr-0.5 basis-11" />
      <LinesPattern size={8} className="basis-[175px]" />
      <LinesPattern size={18} className="basis-[190px]" />
      <span className="ml-2.5 mr-1 shrink-0 -tracking-[0.05em]">[ STATUS: ONLINE ]</span>
      <LinesPattern size={18} className="basis-[106px]" />
      <LinesPattern size={8} className="basis-[170px]" />
      <LinesPattern size={4} className="basis-12" />
      <span className="ml-[34px] shrink-0 -tracking-[0.05em]">[ CONNECTION: STABLE ]</span>
    </div>
  </Container>
);

StatusLine.propTypes = {
  className: PropTypes.string,
};

export default StatusLine;
