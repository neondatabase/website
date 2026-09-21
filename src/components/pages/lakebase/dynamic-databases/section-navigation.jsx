'use client';

import { useThrottleCallback } from '@react-hook/throttle';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

import Link from 'components/shared/link';
import { cn } from 'utils/cn';

const THROTTLE_DELAY = 100;

const SectionNavigation = ({ items }) => {
  const [activeId, setActiveId] = useState(items[0].id);
  const navigationRef = useRef(null);

  const updateActiveItem = useThrottleCallback(() => {
    if (!navigationRef.current) return;

    const links = navigationRef.current.querySelectorAll('li');
    let nextActiveId = items[0].id;

    items.forEach(({ id }, index) => {
      const section = document.getElementById(id);
      const link = links[index];

      if (!section || !link) return;

      if (section.getBoundingClientRect().top <= link.getBoundingClientRect().top) {
        nextActiveId = id;
      }
    });

    setActiveId(nextActiveId);
  }, THROTTLE_DELAY);

  useEffect(() => {
    updateActiveItem();
    window.addEventListener('scroll', updateActiveItem, { passive: true });
    window.addEventListener('resize', updateActiveItem, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateActiveItem);
      window.removeEventListener('resize', updateActiveItem);
    };
  }, [updateActiveItem]);

  return (
    <nav className="h-full" ref={navigationRef} aria-label="Lakebase capabilities">
      <ol className="sticky top-36 z-10 flex w-56 flex-col gap-y-1.5">
        {items.map(({ id, label }) => {
          const isActive = activeId === id;

          return (
            <li key={id}>
              <Link
                className={cn(
                  'relative flex items-center gap-x-2.5 rounded-sm py-1.5 pl-[18px] whitespace-nowrap',
                  'text-[15px] leading-none tracking-[-0.02em] transition-colors duration-200',
                  'before:absolute before:top-1/2 before:left-0 before:size-2 before:-translate-y-1/2',
                  'before:rounded-full before:transition-colors before:duration-200',
                  isActive ? 'text-white before:bg-white' : 'text-gray-new-50 hover:text-white'
                )}
                href={`#${id}`}
                aria-current={isActive ? 'location' : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  const section = document.getElementById(id);

                  if (section) {
                    setActiveId(id);
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

SectionNavigation.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default SectionNavigation;
