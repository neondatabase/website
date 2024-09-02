'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import Link from 'components/shared/link';

const statusData = {
  UP: {
    color: 'bg-green-45',
    text: 'All systems operational',
  },
  HASISSUES: {
    color: 'bg-yellow-70',
    text: 'Experiencing issues',
  },
  UNDERMAINTENANCE: {
    color: 'bg-yellow-70',
    text: 'Active maintenance',
  },
};

const fetchStatus = async () => {
  const res = await fetch('https://neonstatus.com/api/v1/summary');
  const response = await res.json();
  const data = response.subpages;

  const hasOngoingIncidents = data.some((subpage) => subpage.summary.ongoing_incidents.length > 0);
  const hasInProgressMaintenances = data.some(
    (subpage) => subpage.summary.in_progress_maintenances.length > 0
  );

  if (hasOngoingIncidents) {
    return 'HASISSUES';
  }
  if (hasInProgressMaintenances) {
    return 'UNDERMAINTENANCE';
  }
  return 'UP';
};

const StatusBadge = ({ hasThemesSupport = false, isDarkTheme = true }) => {
  const [currentStatus, setCurrentStatus] = useState(null);
  const [ref, inView] = useInView({ triggerOnce: true, rootMargin: '0px 0px 200px 0px' });

  useEffect(() => {
    if (inView) {
      fetchStatus()
        .then((status) => {
          setCurrentStatus(status);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [inView]);

  return (
    <Link
      to="https://neonstatus.com/"
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(
        'flex items-center justify-center gap-x-1.5',
        hasThemesSupport ? 'mt-12 lg:mt-8' : 'mt-auto lg:mt-8 md:mt-8'
      )}
      ref={ref}
    >
      <span
        className={clsx(
          'h-1.5 w-1.5 rounded-full',
          currentStatus ? statusData[currentStatus].color : 'bg-gray-new-50'
        )}
      />
      <span
        className={clsx(
          'whitespace-nowrap text-sm leading-none tracking-extra-tight dark:text-white',
          isDarkTheme ? 'text-white' : 'text-black-new'
        )}
      >
        {currentStatus ? statusData[currentStatus].text : 'All systems operational'}
      </span>
    </Link>
  );
};

StatusBadge.propTypes = { hasThemesSupport: PropTypes.bool, isDarkTheme: PropTypes.bool };

export default StatusBadge;
