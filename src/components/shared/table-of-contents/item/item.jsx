'use client';

import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import PropTypes from 'prop-types';

import { cn } from 'utils/cn';
import sendGtagEvent from 'utils/send-gtag-event';

const Item = ({
  title,
  level,
  id,
  numberedStep,
  items,
  currentAnchor,
  isUserScrolling,
  setIsUserScrolling,
  isTemplate,
  index,
  currentIndex,
}) => {
  const href = `#${id}`;
  const isActive = currentAnchor === id || items?.some(({ id }) => currentAnchor === id);
  const shouldRenderSubItems = !!items?.length && (isTemplate || (isActive && level < 2));

  const handleAnchorClick = (e, anchor) => {
    e.preventDefault();
    if (level === 1) {
      setIsUserScrolling(false);
    }

    const element = document.getElementById(anchor.replace(/^#/, ''));
    if (element) {
      // Account for scroll margin and header offset
      const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
      const offset = 130 - 1; // Match ANCHOR_SCROLL_MARGIN
      window.scrollTo({
        top: elementTop - offset,
        behavior: 'smooth',
      });
    }

    // Track TOC click
    sendGtagEvent('TOC Clicked', {
      heading: title,
      anchor: id,
      level,
      tag_name: 'TableOfContents',
    });

    // changing hash without default jumps to anchor
    if (history.pushState) {
      history.pushState({}, '', anchor);
    } else {
      // old browser support
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
                currentAnchor === id || index < currentIndex
                  ? 'bg-gray-new-15 text-white dark:bg-gray-new-94 dark:text-black-new'
                  : 'bg-gray-new-90 text-black-new dark:bg-gray-new-20 dark:text-gray-new-98'
              )}
            >
              {numberedStep}
            </span>
            <span
              className={cn(
                'absolute top-[3px] left-2 h-full w-px transition-colors duration-200 group-last:hidden',
                currentAnchor === id || index < currentIndex
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
  index: PropTypes.number,
  currentIndex: PropTypes.number,
  currentAnchor: PropTypes.string,
  setIsUserScrolling: PropTypes.func.isRequired,
  isUserScrolling: PropTypes.bool.isRequired,
  isTemplate: PropTypes.bool,
};

export default Item;
