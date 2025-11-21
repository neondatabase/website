'use client';

import { useThrottleCallback } from '@react-hook/throttle';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

import Link from 'components/shared/link';

const SECTIONS = [
  { id: 'ai', title: 'AI', theme: 'dark' },
  { id: 'autoscaling', title: 'Advanced Autoscaling', theme: 'light' },
  { id: 'branching', title: 'Instant Branching', theme: 'dark' },
  { id: 'performance', title: 'Real-World Performance', theme: 'dark' },
  { id: 'features', title: 'Production-Grade Features', theme: 'dark' },
];

const THROTTLE_DELAY = 100;

const Toc = () => {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [currentTheme, setCurrentTheme] = useState('dark');
  const tocRef = useRef(null);

  const updateActiveSection = useThrottleCallback(() => {
    if (!tocRef.current) return;

    // Get all TOC link elements
    const tocLinks = tocRef.current.querySelectorAll('li');

    // Find the last section whose top is above its corresponding TOC link position
    let activeSection = SECTIONS[0];

    SECTIONS.forEach((section, index) => {
      const sectionElement = document.getElementById(section.id);
      const tocLinkElement = tocLinks[index];

      if (!sectionElement || !tocLinkElement) return;

      const sectionRect = sectionElement.getBoundingClientRect();
      const tocLinkRect = tocLinkElement.getBoundingClientRect();

      // Check if section has passed its corresponding TOC link position
      if (sectionRect.top <= tocLinkRect.top) {
        activeSection = section;
      }
    });

    setActiveSection(activeSection.id);
    setCurrentTheme(activeSection.theme);
  }, THROTTLE_DELAY);

  useEffect(() => {
    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, [updateActiveSection]);

  return (
    <div className="sticky top-0 z-10 pb-60 pt-40" ref={tocRef}>
      <ul className="flex w-[224px] flex-col gap-y-1.5">
        {SECTIONS.map((section) => {
          const isActive = activeSection === section.id;

          return (
            <li key={section.id}>
              <Link
                className={clsx(
                  'relative flex items-center gap-x-2.5 whitespace-nowrap py-1.5 pl-[18px] text-[15px] leading-none tracking-tight transition-colors duration-200',
                  'before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2',
                  'before:size-2 before:rounded-full before:transition-colors before:duration-200',
                  !isActive && 'text-gray-new-50',
                  currentTheme === 'dark' && 'hover:text-white',
                  currentTheme === 'light' && 'hover:text-black-pure',
                  isActive && currentTheme === 'dark' && 'text-white before:bg-white',
                  isActive && currentTheme === 'light' && 'text-black-pure before:bg-black-pure'
                )}
                href={`#${section.id}`}
              >
                {section.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Toc;
