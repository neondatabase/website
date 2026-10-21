// Loaded by WebMcpTools only in browsers with WebMCP, so other visitors never
// download the tool definitions.

import { scrollToSection } from 'components/shared/inkeep-trigger/section-scroll';
import { createNeonTools, matchSection } from 'utils/webmcp';

const NAVIGATION_TIMEOUT_MS = 10000;
const TITLE_TIMEOUT_MS = 2000;
const HEADING_TIMEOUT_MS = 3000;
const POLL_MS = 100;

// Resolves with check()'s first truthy value, or null after timeoutMs.
const waitFor = (check, timeoutMs, signal) =>
  new Promise((resolve, reject) => {
    const deadline = Date.now() + timeoutMs;
    const poll = () => {
      if (signal?.aborted) {
        reject(signal.reason);
        return;
      }
      const value = check();
      if (value || Date.now() >= deadline) resolve(value || null);
      else setTimeout(poll, POLL_MS);
    };
    poll();
  });

// Same headings scrollToSection considers, so its match is the one we found.
const findHeading = (section) => {
  const elements = [...document.querySelectorAll('h2, h3, h4')].filter(
    (element) => !element.closest('header, footer, nav, [role="dialog"]')
  );
  const index = matchSection(
    section,
    elements.map((element) => ({ text: element.textContent, id: element.id }))
  );
  return elements[index] ?? null;
};

const describeLocation = () => {
  const location = `${window.location.pathname}${window.location.search}`;
  return document.title ? `"${document.title}" (${location})` : location;
};

const createOpenPage =
  (router) =>
  async ({ pathname, search, section }, { signal }) => {
    const href = `${pathname}${search}`;
    const from = `${window.location.pathname}${window.location.search}`;
    if (from !== href) {
      const fromTitle = document.title;
      router.push(href);
      const moved = await waitFor(
        () => `${window.location.pathname}${window.location.search}` !== from,
        NAVIGATION_TIMEOUT_MS,
        signal
      );
      if (!moved) return `${href} is still loading. Check the page again in a moment.`;
      // The URL changes before Next.js applies the new page's metadata, and the
      // title is briefly empty in between.
      await waitFor(
        () => document.title !== '' && document.title !== fromTitle,
        TITLE_TIMEOUT_MS,
        signal
      );
    }
    if (!section) return `Opened ${describeLocation()}.`;

    const heading = await waitFor(() => findHeading(section), HEADING_TIMEOUT_MS, signal);
    if (heading && scrollToSection([heading.textContent])) {
      return `Opened ${describeLocation()} at "${heading.textContent.trim()}".`;
    }
    return `Opened ${describeLocation()}, but found no section matching "${section}". Use read_neon_page to list its sections.`;
  };

const createTools = (router) =>
  createNeonTools({
    origin: window.location.origin,
    fetch: (...args) => window.fetch(...args),
    openPage: createOpenPage(router),
  });

export default createTools;
