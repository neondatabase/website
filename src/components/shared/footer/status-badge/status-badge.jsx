'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import Link from 'components/shared/link';
import { getNeonStatus, NEON_STATUS } from 'utils/get-neon-status';

const statusData = {
  [NEON_STATUS.UP]: {
    color: 'bg-green-45',
    text: 'All systems operational',
  },
  [NEON_STATUS.HASISSUES]: {
    color: 'bg-yellow-70',
    text: 'Experiencing issues',
  },
  [NEON_STATUS.UNDERMAINTENANCE]: {
    color: 'bg-[red]',
    text: 'Active maintenance',
  },
};

const StatusBadge = () => {
  const [currentStatus, setCurrentStatus] = useState(null);
  const [ref, inView] = useInView({ triggerOnce: true, rootMargin: '0px 0px 200px 0px' });

  useEffect(() => {
    if (inView) {
      getNeonStatus()
        .then(({ status }) => {
          setCurrentStatus(status);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
    }
  }, [inView]);

  return (
    <Link
      className="flex items-center justify-center gap-x-1.5"
      to="https://neonstatus.com/"
      target="_blank"
      rel="noopener noreferrer"
      ref={ref}
    >
      <span
        className={clsx(
          'h-1.5 w-1.5 rounded-full',
          currentStatus ? statusData[currentStatus].color : 'bg-gray-new-50'
        )}
      />
      <span className="whitespace-nowrap text-sm leading-none tracking-extra-tight text-black-pure dark:text-white">
        {currentStatus ? statusData[currentStatus].text : 'Neon status loading...'}
      </span>
    </Link>
  );
};

export default StatusBadge;
