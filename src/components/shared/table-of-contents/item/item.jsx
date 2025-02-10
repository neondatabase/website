import clsx from 'clsx';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import PropTypes from 'prop-types';

const linkClassName =
  'py-1.5 flex items-start gap-2.5 text-sm leading-tight transition-colors duration-200 text-gray-new-40 hover:text-black-new dark:text-gray-new-90 dark:hover:text-white [&_code]:rounded-sm [&_code]:leading-none [&_code]:py-px [&_code]:bg-gray-new-94 [&_code]:px-1.5 [&_code]:font-mono [&_code]:font-normal dark:[&_code]:bg-gray-new-15';

const Item = ({
  title,
  level,
  id,
  numberedStep,
  items,
  currentAnchor,
  isUserScrolling,
  setIsUserScrolling,
  isUseCase,
  index,
  currentIndex,
}) => {
  const href = `#${id}`;
  const isActive = currentAnchor === id || items?.some(({ id }) => currentAnchor === id);
  const shouldRenderSubItems = !!items?.length && (isUseCase || (isActive && level < 2));

  const handleAnchorClick = (e, anchor) => {
    e.preventDefault();
    if (level === 1) {
      setIsUserScrolling(false);
    }

    document.querySelector(anchor)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    // changing hash without default jumps to anchor
    // eslint-disable-next-line no-restricted-globals
    if (history.pushState) {
      // eslint-disable-next-line no-restricted-globals
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
        className={clsx(linkClassName, isActive && 'font-medium text-black-new dark:text-white')}
        href={href}
        onClick={(e) => handleAnchorClick(e, href, id)}
      >
        {numberedStep && (
          <>
            <span
              className={clsx(
                'z-10 flex size-4 shrink-0 items-center justify-center rounded-full bg-gray-new-15 text-[10px] font-medium leading-none tracking-extra-tight outline outline-[3px] outline-white transition-colors duration-200 dark:outline-black-new',
                currentAnchor === id || index < currentIndex
                  ? 'bg-gray-new-15 text-white dark:bg-gray-new-94 dark:text-black-new'
                  : 'bg-gray-new-90 text-black-new dark:bg-gray-new-20 dark:text-gray-new-98'
              )}
            >
              {numberedStep}
            </span>
            <span
              className={clsx(
                'absolute left-2 top-[3px] h-full w-px transition-colors duration-200 group-last:hidden',
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
            className={clsx(numberedStep ? 'ml-[34px]' : 'ml-2')}
            initial={{ opacity: 0, maxHeight: 0 }}
            animate={{ opacity: 1, maxHeight: 1000 }}
            exit={{ opacity: 0, maxHeight: 0 }}
            transition={{ duration: 0.2 }}
          >
            {items.map((item, subIndex) => (
              <li className="relative" key={subIndex}>
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
  isUseCase: PropTypes.bool,
};

export default Item;
