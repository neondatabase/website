'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { findSectionHeading } from 'utils/site-search-section';

let pending = null;

// The page's section headings, outside the header, footer, nav, and dialogs.
export const sectionHeadings = () =>
  [...document.querySelectorAll('h2, h3, h4')].filter(
    (element) => !element.closest('header, footer, nav, [role="dialog"]')
  );

// Opens any collapsed <details> around a heading, scrolls to it, and puts its
// id in the URL.
export function revealHeading(element) {
  for (
    let details = element.closest('details');
    details;
    details = details.parentElement?.closest('details')
  ) {
    details.open = true;
  }
  element.scrollIntoView();
  if (element.id) {
    window.history.replaceState(null, '', `#${element.id}`);
  }
}

// The page is the authority on its heading ids: explicit `(#id)` headings and
// component headings don't use the text-derived slug, and heading text repeats.
export function scrollToSection(sections) {
  const elements = sectionHeadings();
  const index = findSectionHeading(
    sections,
    elements.map((element) => ({ level: Number(element.tagName[1]), text: element.textContent }))
  );
  if (index === -1) return false;
  revealHeading(elements[index]);
  return true;
}

export function scrollToSectionAfterNavigation(pathname, sections) {
  pending = { pathname, sections };
}

// Mounted in the root layout so it runs on every page a search hit can open,
// including pages without the search modal.
const SectionScroll = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (pending?.pathname !== pathname) return undefined;
    const frame = requestAnimationFrame(() => {
      if (pending?.pathname !== pathname) return;
      const { sections } = pending;
      pending = null;
      scrollToSection(sections);
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
};

export default SectionScroll;
