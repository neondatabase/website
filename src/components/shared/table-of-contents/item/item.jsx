'use client';

import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useContext } from 'react';

import { cn } from 'utils/cn';
import { TabsContext } from 'contexts/tabs-context';
import sendGtagEvent from 'utils/send-gtag-event';

const scrollToAnchor = (anchor) => {
  const element = document.getElementById(anchor.replace(/^#/, ''));
  if (element) {
    const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
    const offset = 130 - 1;
    window.scrollTo({
      top: elementTop - offset,
      behavior: 'smooth',
    });
  }
};

const Item = ({
  title,
  level,
  id,
  numberedStep,
  items,
  tabLabel,
  tabGroupLabels,
  currentAnchor,
  currentAnchorInSteps,
  isUserScrolling,
  setIsUserScrolling,
  isTemplate,
  index,
  currentIndex,
}) => {
  const href = `#${id}`;
  const { activeTab, setActiveTab } = useContext(TabsContext);

  // The Tabs component defaults to the first tab when activeTab doesn't match
  // any label (e.g. on first load when activeTab is ''). Mirror that logic here.
  const effectiveActiveTab = tabGroupLabels?.includes(activeTab) ? activeTab : tabGroupLabels?.[0];
  const isInActiveTab = !tabLabel || tabLabel === effectiveActiveTab;
  const isActive =
    (currentAnchor === id && isInActiveTab) ||
    (isInActiveTab && items?.some(({ id: childId }) => currentAnchor === childId));
  const shouldRenderSubItems = !!items?.length && (isTemplate || (isActive && level < 2));

  const handleAnchorClick = (e, anchor) => {
    e.preventDefault();
    if (level === 1) {
      setIsUserScrolling(false);
    }

    sendGtagEvent('TOC Clicked', {
      heading: title,
      anchor: id,
      level,
      tag_name: 'TableOfContents',
    });

    // If this heading is in a tab that isn't currently active, switch first
    if (tabLabel && effectiveActiveTab !== tabLabel) {
      setActiveTab(tabLabel);
      // Wait for React to re-render the tab content before scrolling
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToAnchor(anchor);
        });
      });
    } else {
      scrollToAnchor(anchor);
    }

    // eslint-disable-next-line no-restricted-globals
    if (history.pushState) {
      // eslint-disable-next-line no-restricted-globals
      history.pushState({}, '', anchor);
    } else {
      window.location.hash = anchor;
    }

    setTimeout(() => {
      setIsUserScrolling(true);
    }, 700);
  };

  return (
    <LazyMotion features={domAnimation}>
      <a
        className={cn(
          'flex items-start gap-2 rounded-sm py-0 text-sm leading-snug font-normal tracking-extra-tight',
          'transition-colors duration-200',
          isActive
            ? 'text-black-pure dark:text-white'
            : 'text-gray-new-40 hover:text-black-pure dark:text-gray-new-70 dark:hover:text-white',
          '[&_code]:rounded-sm [&_code]:bg-gray-new-94 [&_code]:px-1.5 [&_code]:py-px [&_code]:font-mono [&_code]:leading-none [&_code]:font-normal dark:[&_code]:bg-gray-new-15'
        )}
        href={href}
        onClick={(e) => handleAnchorClick(e, href, id)}
      >
        {numberedStep && (
          <>
            <span
              className={cn(
                'z-10 flex size-4 shrink-0 items-center justify-center rounded-full bg-gray-new-15 text-[10px] leading-none font-normal tracking-extra-tight outline outline-[3px] outline-white transition-colors duration-200 dark:outline-black-new',
                isInActiveTab &&
                  (currentAnchor === id || (index < currentIndex && currentAnchorInSteps))
                  ? 'bg-gray-new-15 text-white dark:bg-gray-new-94 dark:text-black-new'
                  : 'bg-gray-new-90 text-black-new dark:bg-gray-new-20 dark:text-gray-new-98'
              )}
            >
              {numberedStep}
            </span>
            <span
              className={cn(
                'absolute top-[3px] left-2 h-full w-px transition-colors duration-200 group-last:hidden',
                isInActiveTab &&
                  (currentAnchor === id || (index < currentIndex && currentAnchorInSteps))
                  ? 'bg-gray-new-40 dark:bg-gray-new-60'
                  : 'bg-gray-new-80 dark:bg-gray-new-15'
              )}
            />
          </>
        )}
        <span dangerouslySetInnerHTML={{ __html: title.split('\\').join('') }} />
      </a>
      <AnimatePresence initial={false}>
        {shouldRenderSubItems && (
          <m.ul
            className={cn(
              numberedStep
                ? 'ml-[34px]'
                : 'relative mt-3 flex flex-col gap-3 pl-4 before:absolute before:top-0 before:bottom-0 before:left-0 before:w-px before:bg-gray-new-80 dark:before:bg-gray-new-15/70'
            )}
            initial={{ opacity: 0, maxHeight: 0 }}
            animate={{ opacity: 1, maxHeight: 1000 }}
            exit={{ opacity: 0, maxHeight: 0 }}
            transition={{ duration: 0.2 }}
          >
            {items.map((item, subIndex) => (
              <li
                className={cn(
                  'relative before:absolute before:top-0 before:bottom-0 before:-left-4 before:w-px before:bg-gray-new-15/70 before:opacity-0 before:transition-opacity before:duration-200 dark:before:bg-white',
                  item.id === currentAnchor && 'before:opacity-100'
                )}
                key={subIndex}
              >
                <Item
                  index={item.index}
                  currentIndex={currentIndex}
                  currentAnchor={currentAnchor}
                  currentAnchorInSteps={currentAnchorInSteps}
                  isUserScrolling={isUserScrolling}
                  setIsUserScrolling={setIsUserScrolling}
                  {...item}
                />
              </li>
            ))}
          </m.ul>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
};

Item.propTypes = {
  title: PropTypes.string.isRequired,
  level: PropTypes.number.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      index: PropTypes.number.isRequired,
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      level: PropTypes.number.isRequired,
    })
  ),
  id: PropTypes.string.isRequired,
  numberedStep: PropTypes.string,
  tabLabel: PropTypes.string,
  tabGroupLabels: PropTypes.arrayOf(PropTypes.string),
  index: PropTypes.number,
  currentIndex: PropTypes.number,
  currentAnchor: PropTypes.string,
  currentAnchorInSteps: PropTypes.bool,
  setIsUserScrolling: PropTypes.func.isRequired,
  isUserScrolling: PropTypes.bool.isRequired,
  isTemplate: PropTypes.bool,
};

export default Item;
