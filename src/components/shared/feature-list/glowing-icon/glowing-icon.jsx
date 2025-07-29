'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const GlowingIcon = ({ icon, index, activeIndex, setActiveIndex, isLastItem }) => {
  const { ref: inViewRef, inView } = useInView({
    threshold: 0,
    rootMargin: '-600px 0px',
  });

  useEffect(() => {
    if (inView) {
      setActiveIndex(index);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  const isActive = index === activeIndex;
  const isPrev = index === activeIndex - 1;

  return (
    <>
      {!isLastItem && (
        <div className="absolute left-[14px] top-[34px] h-full w-px -translate-x-1/2 md:top-8">
          <div
            className={clsx(
              'absolute inset-0 bg-gray-new-15 transition-opacity duration-700',
              isActive || isPrev ? 'opacity-0' : 'opacity-100'
            )}
          />

          <div
            className={clsx(
              'absolute inset-0 bg-gradient-to-b from-[#087D69] to-[#0B0C0D] transition-opacity duration-700',
              isActive ? 'opacity-100' : 'opacity-0'
            )}
          />

          <div
            className={clsx(
              'absolute inset-0 bg-gradient-to-b from-[#0B0C0D] to-[#087D69] transition-opacity duration-700',
              isPrev ? 'opacity-100' : 'opacity-0'
            )}
          />
        </div>
      )}
      <div ref={inViewRef} className="relative flex flex-col items-center">
        <div className="relative flex size-7 items-center justify-center rounded-full border border-gray-new-15">
          <div
            className={clsx(
              'absolute inset-0 z-0 rounded-full drop-shadow-[0_0_10px_#087D69] transition-opacity duration-300',
              isActive ? 'opacity-100' : 'opacity-0',
              'before:absolute before:inset-0 before:rounded-full',
              'before:bg-[radial-gradient(circle_at_bottom,_#087D69_0%,_#0B2D29_47%,_#0B0C0D_100%)]'
            )}
          />
          <div className="absolute inset-0 z-10 rounded-full border border-white/90 mix-blend-overlay" />
          <div
            className={clsx(
              'relative z-20 flex size-full items-center justify-center transition duration-300',
              isActive ? 'text-white' : 'text-gray-new-15'
            )}
          >
            {icon}
          </div>
        </div>
      </div>
    </>
  );
};

GlowingIcon.propTypes = {
  icon: PropTypes.node.isRequired,
  index: PropTypes.number.isRequired,
  activeIndex: PropTypes.number.isRequired,
  setActiveIndex: PropTypes.func.isRequired,
  isLastItem: PropTypes.bool.isRequired,
};
export default GlowingIcon;
