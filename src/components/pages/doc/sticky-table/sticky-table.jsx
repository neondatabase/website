'use client';

import { LazyMotion, domAnimation, m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

const SCROLL_FADE_THRESHOLD = 50;
const fadeTransition = { duration: 0.2 };
const INTERACTIVE_SELECTOR = 'a[href], button, input, select, textarea, [tabindex]';

const getPointerOnlyHeaderHtml = (thead) => {
  const clone = thead.cloneNode(true);
  clone.querySelectorAll(INTERACTIVE_SELECTOR).forEach((element) => {
    element.setAttribute('tabindex', '-1');
  });
  return clone.innerHTML;
};

const StickyTableFades = ({ canScrollLeft, canScrollRight }) => (
  <>
    <m.div
      className="pointer-events-none absolute inset-y-0 left-0 z-20 h-full w-20 bg-linear-to-l from-transparent to-white dark:to-black-pure"
      initial={false}
      animate={{ opacity: canScrollLeft ? 1 : 0 }}
      transition={fadeTransition}
    />
    <m.div
      className="pointer-events-none absolute inset-y-0 right-0 z-20 h-full w-20 bg-linear-to-r from-transparent to-white dark:to-black-pure"
      initial={false}
      animate={{ opacity: canScrollRight ? 1 : 0 }}
      transition={fadeTransition}
    />
  </>
);

const StickyTable = ({
  children,
  className = null,
  headerClassName = null,
  headerKey = null,
  interactiveHeader = false,
  nativeSticky = false,
  stickyTopOffset = 0,
}) => {
  const rootRef = useRef(null);
  const geometryRef = useRef({ stickyTop: 0, headerHeight: 0 });
  const [layout, setLayout] = useState(null);
  const [scroll, setScroll] = useState({
    active: false,
    canScrollLeft: false,
    canScrollRight: false,
    scrollLeft: 0,
  });

  useEffect(() => {
    const root = rootRef.current;
    const wrapper = root?.querySelector('.table-wrapper');
    const table = wrapper?.querySelector('table');
    const thead = table?.querySelector('thead');

    if (!wrapper || !table || !thead) return undefined;

    const tableClassNames = className?.trim().split(/\s+/).filter(Boolean) || [];
    const addedTableClassNames = tableClassNames.filter(
      (tableClassName) => !table.classList.contains(tableClassName)
    );
    if (addedTableClassNames.length > 0) {
      table.classList.add(...addedTableClassNames);
    }

    const measure = () => {
      const rootRect = root.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();
      const tableRect = table.getBoundingClientRect();
      const headerRect = thead.getBoundingClientRect();
      const stickyTop =
        (parseFloat(getComputedStyle(root).getPropertyValue('--docs-header-height')) || 0) +
        stickyTopOffset;

      geometryRef.current = { stickyTop, headerHeight: headerRect.height };

      setLayout({
        columnWidths: Array.from(thead.querySelectorAll('th')).map(
          (cell) => cell.getBoundingClientRect().width
        ),
        fadeLeft: wrapperRect.left - rootRect.left,
        fadeTop: wrapperRect.top - rootRect.top,
        fadeHeight: wrapperRect.height,
        headerHtml: getPointerOnlyHeaderHtml(thead),
        left: wrapperRect.left,
        stickyTop,
        tableWidth: tableRect.width,
        width: wrapperRect.width,
      });
    };

    const updateScroll = () => {
      const { stickyTop, headerHeight } = geometryRef.current;
      const tableRect = table.getBoundingClientRect();
      const headerRect = thead.getBoundingClientRect();
      const active =
        nativeSticky ||
        (headerRect.top <= stickyTop && tableRect.bottom > stickyTop + headerHeight);
      const scrollLeft = wrapper.scrollLeft;
      const scrollRight = wrapper.scrollWidth - wrapper.clientWidth - scrollLeft;
      const canScrollLeft = scrollLeft >= SCROLL_FADE_THRESHOLD;
      const canScrollRight = scrollRight >= SCROLL_FADE_THRESHOLD;

      setScroll((prev) =>
        prev.active === active &&
        prev.canScrollLeft === canScrollLeft &&
        prev.canScrollRight === canScrollRight &&
        prev.scrollLeft === scrollLeft
          ? prev
          : { active, canScrollLeft, canScrollRight, scrollLeft }
      );
    };

    const onResize = () => {
      measure();
      updateScroll();
    };

    measure();
    updateScroll();

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(wrapper);
    resizeObserver.observe(table);

    if (!nativeSticky) window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', onResize);
    wrapper.addEventListener('scroll', updateScroll, { passive: true });

    return () => {
      if (addedTableClassNames.length > 0) {
        table.classList.remove(...addedTableClassNames);
      }
      resizeObserver.disconnect();
      if (!nativeSticky) window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', onResize);
      wrapper.removeEventListener('scroll', updateScroll);
    };
  }, [className, headerKey, nativeSticky, stickyTopOffset]);

  const handleHeaderClick = (event) => {
    if (!interactiveHeader) return;

    const button = event.target.closest('button');
    if (!button) return;

    const clonedButtons = [...event.currentTarget.querySelectorAll('button')];
    const buttonIndex = clonedButtons.indexOf(button);
    const originalButtons = rootRef.current?.querySelectorAll('.table-wrapper thead button');
    originalButtons?.[buttonIndex]?.click();
  };

  const handleHeaderMouseDown = (event) => {
    if (interactiveHeader && event.target.closest('button')) event.preventDefault();
  };

  return (
    <LazyMotion features={domAnimation}>
      <div
        className={nativeSticky ? 'sticky-table sticky-table--native' : 'sticky-table'}
        ref={rootRef}
      >
        {layout && (
          <div
            className={['sticky-table-header', headerClassName].filter(Boolean).join(' ')}
            aria-hidden="true"
            onClick={handleHeaderClick}
            onMouseDown={handleHeaderMouseDown}
            style={{
              left: nativeSticky ? undefined : layout.left,
              opacity: scroll.active ? 1 : 0,
              top: layout.stickyTop,
              width: nativeSticky ? undefined : layout.width,
            }}
          >
            <StickyTableFades
              canScrollLeft={scroll.canScrollLeft}
              canScrollRight={scroll.canScrollRight}
            />
            <table
              className={className}
              style={{
                tableLayout: 'fixed',
                transform: `translateX(-${scroll.scrollLeft}px)`,
                width: layout.tableWidth,
              }}
            >
              <colgroup>
                {layout.columnWidths.map((width, index) => (
                  <col key={index} style={{ width }} />
                ))}
              </colgroup>
              <thead dangerouslySetInnerHTML={{ __html: layout.headerHtml }} />
            </table>
          </div>
        )}
        {children}
        {layout && (
          <div
            className="pointer-events-none absolute z-20 overflow-hidden"
            aria-hidden="true"
            style={{
              height: layout.fadeHeight,
              left: layout.fadeLeft,
              top: layout.fadeTop,
              width: layout.width,
            }}
          >
            <StickyTableFades
              canScrollLeft={scroll.canScrollLeft}
              canScrollRight={scroll.canScrollRight}
            />
          </div>
        )}
      </div>
    </LazyMotion>
  );
};

StickyTableFades.propTypes = {
  canScrollLeft: PropTypes.bool.isRequired,
  canScrollRight: PropTypes.bool.isRequired,
};

StickyTable.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  headerClassName: PropTypes.string,
  headerKey: PropTypes.string,
  interactiveHeader: PropTypes.bool,
  nativeSticky: PropTypes.bool,
  stickyTopOffset: PropTypes.number,
};

export default StickyTable;
