import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

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

const StatusBadge = ({ isDocPage = false }) => {
  const [currentStatus, setCurrentStatus] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      const res = await fetch('https://neonstatus.com/summary.json');
      const data = await res.json();
      return data.page.status;
    };

    const callback = async (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fetchStatus()
            .then((status) => {
              setCurrentStatus(status);
              observer.unobserve(entry.target);
            })
            .catch((error) => {
              console.error(error);
            });
        }
      });
    };

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver(callback, options);
    const target = document.querySelector('#footer');

    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, []);

  if (currentStatus) {
    return (
      <Link
        to="https://neonstatus.com/"
        className={clsx(
          'flex items-center justify-center gap-x-1.5',
          isDocPage ? 'mt-12 lg:mt-10' : 'mt-[100px] lg:mt-20 md:mt-8'
        )}
      >
        <span className={clsx('h-1.5 w-1.5 rounded-full', statusData[currentStatus].color)} />
        <span className="whitespace-nowrap text-sm leading-none tracking-[0.02em]">
          {statusData[currentStatus].text}
        </span>
      </Link>
    );
  }

  return (
    <div
      className={clsx(
        'flex items-center justify-center gap-x-1.5',
        isDocPage ? 'mt-12 lg:mt-10' : 'mt-[100px] lg:mt-20 md:mt-8'
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-gray-new-50" />
      <span className="whitespace-nowrap text-sm leading-none tracking-[0.02em] text-gray-new-50">
        Loading status...
      </span>
    </div>
  );
};

StatusBadge.propTypes = { isDocPage: PropTypes.bool };

export default StatusBadge;
