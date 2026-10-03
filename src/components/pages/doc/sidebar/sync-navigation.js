// Keep scrolling local to the sidebar: scrollIntoView can also move the document.
const syncNavigation = (nav, pathname) => {
  const activeLink = Array.from(nav.querySelectorAll('a[href]')).find(
    (link) => link.getAttribute('href') === pathname
  );
  if (!activeLink) return undefined;
  let shouldCenter = false;

  const reveal = () => {
    if (!nav.clientHeight || !activeLink.getClientRects().length) return;

    const bounds = nav.getBoundingClientRect();
    const linkBounds = activeLink.getBoundingClientRect();
    // The top padding also reserves space for the sidebar's fade overlay.
    const top = bounds.top + parseFloat(getComputedStyle(nav).paddingTop) + 8;
    const bottom = Math.min(bounds.top + nav.clientHeight, window.innerHeight) - 8;
    if (bottom <= top) return;

    shouldCenter = shouldCenter || linkBounds.top < top || linkBounds.bottom > bottom;
    if (shouldCenter) {
      // Once revealing a link, keep it centered through the expansion animation.
      // Native scroll limits handle links near the beginning/end of a short menu.
      nav.scrollTop +=
        linkBounds.height > bottom - top
          ? linkBounds.top - top
          : (linkBounds.top + linkBounds.bottom - top - bottom) / 2;
    }
  };

  // Expansion animations and responsive layout can move the target after navigation.
  const observer = new ResizeObserver(reveal);
  observer.observe(nav);
  if (nav.firstElementChild) observer.observe(nav.firstElementChild);
  reveal();

  // Once the user starts browsing the menu, leave its position under their control
  // until the pathname changes. Do not listen to scroll, which we also trigger.
  const events = ['wheel', 'touchstart', 'pointerdown', 'keydown'];
  const stop = () => {
    observer.disconnect();
    events.forEach((event) => nav.removeEventListener(event, stop));
  };
  events.forEach((event) => nav.addEventListener(event, stop, { passive: true }));

  return stop;
};

export default syncNavigation;
