'use client';

import { useThrottleCallback } from '@react-hook/throttle';
import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';

import Link from 'components/shared/link';

const SECTIONS = [
  { id: 'ai', title: 'AI' },
  { id: 'autoscaling', title: 'Advanced Autoscaling' },
  { id: 'instant-branching', title: 'Instant Branching' },
  { id: 'real-world-performance', title: 'Real-World Performance' },
  { id: 'production-grade-features', title: 'Production-Grade Features' },
];

const THROTTLE_DELAY = 100;
const HEADER_OFFSET = 64;

const LUMINANCE_THRESHOLD = 0.5;
const LUMINANCE_RED_WEIGHT = 0.299;
const LUMINANCE_GREEN_WEIGHT = 0.587;
const LUMINANCE_BLUE_WEIGHT = 0.114;

const HEX_PAIR_LENGTH = 2;
const HEX_BASE = 16;
const RGB_MAX = 255;

const calculateLuminance = (hex) => {
  const r = parseInt(hex.substr(0, HEX_PAIR_LENGTH), HEX_BASE);
  const g = parseInt(hex.substr(HEX_PAIR_LENGTH, HEX_PAIR_LENGTH), HEX_BASE);
  const b = parseInt(hex.substr(HEX_PAIR_LENGTH * 2, HEX_PAIR_LENGTH), HEX_BASE);

  return (
    (LUMINANCE_RED_WEIGHT * r + LUMINANCE_GREEN_WEIGHT * g + LUMINANCE_BLUE_WEIGHT * b) / RGB_MAX
  );
};

const isLightColor = (color) => {
  const hex = color.replace('#', '');

  return calculateLuminance(hex) > LUMINANCE_THRESHOLD;
};

const getTextColor = (isActive, hasLightBackground) => {
  if (!isActive) {
    return 'text-gray-new-50';
  }

  if (hasLightBackground) {
    return 'text-black-pure';
  }

  return 'text-white';
};

const getIndicatorBackgroundColor = (isActive, hasLightBackground) => {
  if (!isActive) {
    return 'bg-transparent';
  }

  if (hasLightBackground) {
    return 'bg-black-pure';
  }

  return 'bg-white';
};

const findActiveSectionInView = (tocItems, sections) => {
  const reversedSections = [...sections].reverse();
  const reversedIndex = reversedSections.findIndex((section, idx) => {
    const originalIndex = sections.length - 1 - idx;
    if (!section.element || !tocItems[originalIndex]) return false;

    const sectionRect = section.element.getBoundingClientRect();
    const tocItemRect = tocItems[originalIndex].getBoundingClientRect();

    return sectionRect.top <= tocItemRect.top;
  });

  if (reversedIndex === -1) {
    return sections[0];
  }

  return reversedSections[reversedIndex];
};

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (!element) return;

  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - HEADER_OFFSET;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  });
};

const Toc = () => {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [currentBgColor, setCurrentBgColor] = useState('#E4F1EB');
  const sectionsRef = useRef([]);
  const tocRef = useRef(null);

  useEffect(() => {
    const initSections = () => {
      sectionsRef.current = SECTIONS.map((section) => ({
        ...section,
        element: document.getElementById(section.id),
      })).filter((section) => section.element !== null);
    };

    initSections();

    const timeoutId = setTimeout(initSections, THROTTLE_DELAY);

    return () => clearTimeout(timeoutId);
  }, []);

  const updateActiveSection = useCallback(() => {
    if (!tocRef.current || sectionsRef.current.length === 0) return;

    const tocItems = tocRef.current.querySelectorAll('li');
    const targetSection = findActiveSectionInView(tocItems, sectionsRef.current);

    if (targetSection) {
      setCurrentBgColor(targetSection.bgColor);
      setActiveSection(targetSection.id);
    }
  }, []);

  const handleScroll = useThrottleCallback(updateActiveSection, THROTTLE_DELAY);

  useEffect(() => {
    const initTimeout = setTimeout(updateActiveSection, THROTTLE_DELAY);

    const handleResize = () => {
      updateActiveSection();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      clearTimeout(initTimeout);

      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [handleScroll, updateActiveSection]);

  const handleClick = (e, sectionId) => {
    e.preventDefault();
    scrollToSection(sectionId);
  };

  const hasLightBackground = isLightColor(currentBgColor);

  return (
    <div className="sticky top-24 z-10" ref={tocRef}>
      <ul className="flex w-[224px] flex-col gap-y-1.5">
        {SECTIONS.map((section) => {
          const isActive = activeSection === section.id;
          const textColor = getTextColor(isActive, hasLightBackground);
          const indicatorBgColor = getIndicatorBackgroundColor(isActive, hasLightBackground);

          return (
            <li key={section.id}>
              <Link
                className={clsx(
                  'flex items-center gap-x-2.5 whitespace-nowrap py-1.5 text-[15px] leading-none tracking-tight transition-colors duration-200',
                  textColor
                )}
                href={`#${section.id}`}
                onClick={(e) => handleClick(e, section.id)}
              >
                <span
                  className={clsx(
                    'size-2 shrink-0 rounded-full transition-colors duration-200',
                    indicatorBgColor
                  )}
                />
                <span>{section.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Toc;
