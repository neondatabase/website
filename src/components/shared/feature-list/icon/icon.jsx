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

const Icon = ({ icon, index, isLast, lastActive, setLastActive }) => {
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

    if (inView) {
      setLastActive(Math.max(lastActive, index));
    } else if (index === lastActive) {
      setLastActive(Math.max(0, index - 1));
    }
  }, [inView, index, lastActive, setLastActive]);

  return (
    <div className="relative flex w-7">
      <div className="relative z-20 -m-1 size-9 bg-white p-1 dark:bg-black-pure">
        <div
          className={clsx(
            'relative flex size-7 items-center justify-center overflow-hidden rounded-full',
            !isActive && 'border border-gray-new-80 dark:border-gray-new-15'
          )}
          ref={ref}
        >
          <div
            className={clsx(
              'absolute inset-0 z-0 rounded-full drop-shadow-[0_0_10px_#087d696b] transition-opacity duration-300',
              isActive ? 'opacity-100' : 'opacity-0',
              'before:absolute before:inset-0 before:rounded-full',
              'before:bg-[radial-gradient(circle_at_bottom,#0055ff,transparent)]',
              'dark:before:bg-[radial-gradient(circle_at_bottom,#087D69,transparent)]'
            )}
          />
          <span className="absolute inset-0 z-10 rounded-full border border-black/90 mix-blend-overlay dark:border-white/90" />
          {IconComponent && (
            <div
              className={clsx(
                'relative z-20 flex size-full items-center justify-center transition-colors duration-300',
                isActive ? 'text-white' : 'text-gray-new-80 dark:text-gray-new-15'
              )}
            >
              <IconComponent />
            </div>
          )}
        </div>
      </div>
      {/* Progress line */}
      <span
        className={clsx(
          'absolute left-[14px] top-8 z-10 h-full w-px',
          index < lastActive && 'bg-secondary-8 dark:bg-[#0B4C43]',
          index >= lastActive &&
            isActive &&
            'bg-gradient-to-b from-secondary-8 to-gray-new-80 to-90% dark:from-[#0B4C43] dark:to-gray-new-15',
          index >= lastActive && !isActive && 'bg-gray-new-80 dark:bg-gray-new-15',
          isLast && 'hidden'
        )}
      />
    </div>
  );
};

Icon.propTypes = {
  index: PropTypes.number.isRequired,
  isLast: PropTypes.bool.isRequired,
  icon: PropTypes.oneOf(Object.keys(ICONS)).isRequired,
  lastActive: PropTypes.number.isRequired,
  setLastActive: PropTypes.func.isRequired,
};
export default Icon;
