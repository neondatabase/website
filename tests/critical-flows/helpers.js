const { expect } = require('@playwright/test');

const ANALYTICS_EVENTS_KEY = '__NEON_CRITICAL_FLOW_ANALYTICS_EVENTS__';
const CLIPBOARD_TEXT_KEY = '__NEON_CRITICAL_FLOW_CLIPBOARD_TEXT__';
const NON_BLOCKING_PAGE_ERRORS = [
  /\/unpkg\.com\/@rive-app\/canvas@.+\/rive\.wasm due to access control checks\.$/,
];

function observeApplicationErrors(page) {
  const errors = [];

  page.on('pageerror', (error) => {
    const isKnownNonBlockingError = NON_BLOCKING_PAGE_ERRORS.some((pattern) =>
      pattern.test(error.message)
    );

    if (!isKnownNonBlockingError) {
      errors.push(error.message);
    }
  });

  return errors;
}

async function openCriticalPage(page, pagePath) {
  const applicationErrors = observeApplicationErrors(page);
  const response = await page.goto(pagePath, { waitUntil: 'domcontentloaded' });

  expect(response, `${pagePath} did not return a document response`).not.toBeNull();
  expect(response.ok(), `${pagePath} returned ${response.status()}`).toBeTruthy();
  await expect(page).not.toHaveTitle('');

  return applicationErrors;
}

async function expectHealthyPage(applicationErrors) {
  expect(applicationErrors).toEqual([]);
}

async function expectReactHandlerReady(element, handlerName) {
  // SSR controls can be visible before React attaches their event handlers.
  await expect
    .poll(() =>
      element.evaluate(
        (node, expectedHandlerName) =>
          Object.keys(node).some(
            (key) =>
              key.startsWith('__reactProps$') &&
              typeof node[key]?.[expectedHandlerName] === 'function'
          ),
        handlerName
      )
    )
    .toBe(true);
}

async function expectManagedFormReady(form) {
  // A form without React's onSubmit falls back to a native GET navigation.
  await expectReactHandlerReady(form, 'onSubmit');
}

async function installAnalyticsMock(page, options = {}) {
  await page.addInitScript(
    ({ eventsKey, failureEventName }) => {
      window[eventsKey] = [];
      const analytics = {
        identify: async (email) => {
          window[eventsKey].push({ name: 'identify', properties: { email } });
        },
        track: async (name, properties) => {
          window[eventsKey].push({ name, properties });
          if (name === failureEventName) {
            throw new Error(`Mocked analytics failure for ${name}`);
          }
        },
      };

      Object.defineProperty(window, 'zaraz', {
        configurable: true,
        get: () => analytics,
        set: () => {},
      });
    },
    {
      eventsKey: ANALYTICS_EVENTS_KEY,
      failureEventName: options.failureEventName,
    }
  );
}

async function installClipboardMock(page) {
  await page.addInitScript(
    ({ clipboardKey }) => {
      window[clipboardKey] = '';
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: async (text) => {
            window[clipboardKey] = text;
          },
        },
      });
    },
    { clipboardKey: CLIPBOARD_TEXT_KEY }
  );
}

async function expectAnalyticsEvents(page, expectedEvents) {
  await expect
    .poll(() => page.evaluate((eventsKey) => window[eventsKey] || [], ANALYTICS_EVENTS_KEY))
    .toEqual(expectedEvents);
}

async function expectNoAnalyticsEvents(page) {
  const events = await page.evaluate((eventsKey) => window[eventsKey] || [], ANALYTICS_EVENTS_KEY);

  expect(events).toEqual([]);
}

async function expectClipboardText(page, expectedText) {
  await expect
    .poll(() => page.evaluate((clipboardKey) => window[clipboardKey], CLIPBOARD_TEXT_KEY))
    .toBe(expectedText);
}

async function mockExternalFormSubmissions(page) {
  await page.route('**/api/hubspot', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: '{}',
    });
  });

  await page.route('https://api.hsforms.com/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: '{}',
    });
  });
}

module.exports = {
  expectAnalyticsEvents,
  expectClipboardText,
  expectHealthyPage,
  expectManagedFormReady,
  expectNoAnalyticsEvents,
  expectReactHandlerReady,
  installAnalyticsMock,
  installClipboardMock,
  mockExternalFormSubmissions,
  openCriticalPage,
};
