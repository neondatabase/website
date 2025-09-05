'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import AgentIcon from 'icons/features-icon/agent.inline.svg';
import ApiIcon from 'icons/features-icon/api.inline.svg';
import BranchingIcon from 'icons/features-icon/branching.inline.svg';
import DatabaseIcon from 'icons/features-icon/database.inline.svg';
import LockIcon from 'icons/features-icon/lock.inline.svg';
import ScaleIcon from 'icons/features-icon/scale.inline.svg';
import SpeedometerIcon from 'icons/features-icon/speedometer.inline.svg';

export const ICONS = {
  agent: AgentIcon,
  speedometer: SpeedometerIcon,
  branching: BranchingIcon,
  database: DatabaseIcon,
  lock: LockIcon,
  scale: ScaleIcon,
  api: ApiIcon,
};

const Icon = ({ index, isLast, icon }) => {
  const [isActive, setIsActive] = useState(index === 0);
  const [ref, inView] = useInView({
    threshold: 0,
    rootMargin: '0px 0px -500px 0px',
  });

  const IconComponent = ICONS[icon];

  useEffect(() => {
    if (index !== 0) {
      setIsActive(inView);
    }
  }, [inView, index]);

  return (
    <div className="relative flex w-7">
      <div className="relative z-20 -m-1 size-9 bg-white p-1 dark:bg-black-pure">
        <div
          className="relative flex size-7 items-center justify-center overflow-hidden rounded-full border border-gray-new-80 dark:border-gray-new-15"
          ref={ref}
        >
          <div
            className={clsx(
              'absolute inset-0 z-0 rounded-full drop-shadow-[0_0_10px_#087d696b] transition-opacity duration-300',
              isActive ? 'opacity-100' : 'opacity-0',
              'before:roundedfull before:absolute before:inset-0',
              'before:bg-[radial-gradient(circle_at_bottom,_#0055ff_48%,transparent)]',
              'dark:before:bg-[radial-gradient(circle_at_bottom,_#087D69_48%,_transparent)]'
            )}
          />
          <span className="absolute inset-0 z-10 rounded-full border border-black/10 mix-blend-overlay dark:border-white/90" />
          <div
            className={clsx(
              'relative z-20 flex size-full items-center justify-center transition-colors duration-300',
              isActive ? 'text-white' : 'text-gray-new-80 dark:text-gray-new-15'
            )}
          >
            <IconComponent />
          </div>
        </div>
      </div>
      {/* Progress line */}
      <span
        className={clsx(
          'absolute -top-1 left-[14px] z-10 h-full w-px -translate-y-full bg-secondary-8 transition-opacity duration-300 dark:bg-[#0B4C43]',
          index === 0 && 'hidden',
          isActive ? 'opacity-100' : 'opacity-0'
        )}
      />
      <span
        className={clsx(
          'absolute left-[14px] top-8 z-10 h-full w-px',
          isActive ? 'opacity-100' : 'opacity-0',
          isLast
            ? 'bg-white opacity-100 dark:bg-black-pure'
            : 'bg-gradient-to-b from-secondary-8 to-transparent to-90% dark:from-[#0B4C43]'
        )}
      />
    </div>
  );
};

Icon.propTypes = {
  index: PropTypes.number.isRequired,
  isLast: PropTypes.bool.isRequired,
  icon: PropTypes.oneOf(Object.keys(ICONS)).isRequired,
};
export default Icon;
