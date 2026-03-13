'use client';

import cn from 'clsx';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import Container from 'components/shared/container';
import { getNeonStatus, NEON_STATUS } from 'utils/get-neon-status';

const LinesPattern = ({ size, className }) => (
  <span
    className={cn(
      "h-3 bg-[url('/images/pages/home/speed-scale/status-line/line.svg')] bg-repeat-x lg:h-[7px] xl:h-2.5",
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

const statusData = {
  [NEON_STATUS.UP]: 'ONLINE',
  [NEON_STATUS.HASISSUES]: 'ISSUES',
  [NEON_STATUS.UNDERMAINTENANCE]: 'MAINTENANCE',
};

const StatusLine = ({ className }) => {
  const [currentStatus, setCurrentStatus] = useState('UP');

  useEffect(() => {
    getNeonStatus()
      .then(({ status }) => {
        setCurrentStatus(status);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
      });
  }, []);

  return (
    <Container
      className="2xl:max-w-[1280px] lg:pl-16 xl:max-w-5xl xl:pl-16 md:pr-3 md:pl-5"
      size="1600"
    >
      <div
        className={cn(
          'relative flex items-center justify-between pl-40',
          'font-mono text-sm leading-dense -tracking-[0.05em] text-gray-new-60',
          '2xl:pl-0 lg:text-[9px] xl:text-xs',
          className
        )}
      >
        <span
          className="mr-2 h-3 w-2.5 shrink-0 bg-gray-new-60 lg:mr-1.5 lg:size-1.5 xl:mr-1 xl:h-2.5 xl:w-2"
          aria-hidden
        />
        <span className="mr-7 shrink-0 tracking-extra-tight xl:mr-4">
          SYSTEM: NEON DATABASE PLATFORM
        </span>
        <LinesPattern size={4} className="-mr-0.5 basis-11 lg:basis-[42px] xl:mr-0 xl:basis-14" />
        <LinesPattern size={8} className="basis-[175px] lg:flex-1 xl:basis-[240px]" />
        <LinesPattern size={18} className="basis-[190px] xl:hidden" />
        <span className="mr-1 ml-2.5 shrink-0 xl:ml-0">
          [ STATUS: {statusData[currentStatus]} ]
        </span>
        <LinesPattern
          size={18}
          className="basis-[106px] lg:basis-[68px] xl:basis-[104px] xs:hidden"
        />
        <LinesPattern size={8} className="basis-[170px] xl:hidden" />
        <LinesPattern size={4} className="basis-12 xl:hidden" />
        <span className="ml-[34px] shrink-0 lg:ml-[22px] lg:hidden xl:ml-0">
          [ CONNECTION: STABLE ]
        </span>
        <span
          className="pointer-events-none absolute z-10 size-full bg-[url('/images/pages/home/speed-scale/status-line/noise.svg')]"
          aria-hidden
        />
      </div>
    </Container>
  );
};

StatusLine.propTypes = {
  className: PropTypes.string,
};

export default StatusLine;
