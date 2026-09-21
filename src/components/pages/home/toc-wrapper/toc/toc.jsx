'use client';

import { useThrottleCallback } from '@react-hook/throttle';
import { useEffect, useRef, useState } from 'react';

import Link from 'components/shared/link';
import { cn } from 'utils/cn';

const SECTIONS = [
  { id: 'architecture', title: 'Lakebase Architecture', theme: 'light' },
  { id: 'autoscaling', title: 'Advanced Autoscaling', theme: 'dark' },
  { id: 'built-by', title: 'Built by Databricks', theme: 'dark' },
];

const THROTTLE_DELAY = 100;

const Toc = () => {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [currentTheme, setCurrentTheme] = useState(SECTIONS[0].theme);
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
    <div className="h-full pt-130 pb-60" ref={tocRef}>
      <ul className="sticky top-40 z-10 flex w-56 flex-col gap-y-1.5">
        {SECTIONS.map((section) => {
          const isActive = activeSection === section.id;

          return (
            <li key={section.id}>
              <Link
                className={cn(
                  'relative flex items-center gap-x-2.5 rounded-sm py-1.5 pl-4.5 whitespace-nowrap',
                  'text-[0.9375rem] leading-none tracking-tight transition-colors duration-200',
                  'before:absolute before:top-1/2 before:left-0 before:-translate-y-1/2',
                  'before:size-2 before:rounded-full before:transition-colors before:duration-200',
                  !isActive && 'text-gray-new-50',
                  currentTheme === 'dark' && 'hover:text-white',
                  currentTheme === 'light' && 'hover:text-black-pure',
                  isActive && currentTheme === 'dark' && 'text-white before:bg-white',
                  isActive && currentTheme === 'light' && 'text-black-pure before:bg-black-pure'
                )}
                href={`#${section.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(section.id);

                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
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
