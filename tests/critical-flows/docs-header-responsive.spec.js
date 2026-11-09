const { expect, test } = require('@playwright/test');

const { DESTINATIONS } = require('./contracts');
const { expectHealthyPage, openCriticalPage } = require('./helpers');

// The docs single-bar header and the mobile burger/drawer must swap at exactly
// md (767/768). This lockstep guarantees there is always exactly one visible
// docs-search-trigger, and never a width band that shows both the inline single
// bar and the burger (two triggers) or neither (zero). These checks span the
// 768-1279 single-bar band, both sides of the 767/768 boundary, and below it.
//
// Widths are driven with setViewportSize so the assertions depend only on the
// CSS breakpoints, independent of the project's device emulation.

const SINGLE_BAR_WIDTHS = [1279, 1024, 1023, 900, 768];
const DRAWER_WIDTHS = [767, 700, 640];

test.describe('docs header responsive lockstep', () => {
  for (const width of SINGLE_BAR_WIDTHS) {
    test(`[TC-DOC-003] single-bar docs header holds at ${width}px with one search trigger`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      const applicationErrors = await openCriticalPage(page, DESTINATIONS.docs);

      // Exactly one visible search trigger (the inline single-bar one).
      await expect(page.locator('[data-test="docs-search-trigger"]:visible')).toHaveCount(1);
      // The inline interactive cluster is present (its login link is visible)...
      await expect(page.locator('[data-test="header-login"]:visible')).toHaveCount(1);
      // ...and the mobile burger has not taken over in this band.
      await expect(page.locator('[data-test="mobile-menu-toggle"]:visible')).toHaveCount(0);

      await expectHealthyPage(applicationErrors);
    });
  }

  for (const width of DRAWER_WIDTHS) {
    test(`[TC-DOC-003] docs drawer takes over at ${width}px with one search trigger`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      const applicationErrors = await openCriticalPage(page, DESTINATIONS.docs);

      // Still exactly one visible search trigger (now the mobile one).
      await expect(page.locator('[data-test="docs-search-trigger"]:visible')).toHaveCount(1);
      // Below md the burger is shown...
      await expect(page.locator('[data-test="mobile-menu-toggle"]:visible')).toHaveCount(1);
      // ...and the inline single-bar cluster is hidden.
      await expect(page.locator('[data-test="header-login"]:visible')).toHaveCount(0);

      await expectHealthyPage(applicationErrors);
    });
  }
});
