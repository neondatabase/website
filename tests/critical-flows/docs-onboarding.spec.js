const { expect, test } = require('@playwright/test');

const { DOCS_ONBOARDING_CONTRACT } = require('./contracts');
const {
  expectClipboardText,
  expectHealthyPage,
  expectReactHandlerReady,
  installClipboardMock,
  openCriticalPage,
} = require('./helpers');

const INIT_COMMAND = 'npx neon@latest init';

test.describe('critical documentation onboarding', () => {
  test(`[${DOCS_ONBOARDING_CONTRACT.id}] docs onboarding exposes search, copy, and guided setup`, async ({
    page,
    hasTouch,
  }) => {
    await installClipboardMock(page);
    const applicationErrors = await openCriticalPage(page, DOCS_ONBOARDING_CONTRACT.pagePath);

    await expect(page.getByRole('heading', { level: 1, name: 'Neon documentation' })).toBeVisible();

    const copyButton = page.getByRole('button', {
      name: `Copy command: ${INIT_COMMAND}`,
    });
    await expect(copyButton).toBeVisible();
    await expectReactHandlerReady(copyButton, 'onClick');
    await copyButton.click();
    await expectClipboardText(page, INIT_COMMAND);

    const quickstartLink = page.getByRole('link', { name: 'Open quickstart' });
    await expect(quickstartLink).toHaveAttribute(
      'href',
      '/docs/get-started/full-backend-quickstart'
    );

    const searchTrigger = page.locator('[data-test="docs-search-trigger"]:visible');
    await expect(searchTrigger).toHaveCount(1);
    await expectReactHandlerReady(searchTrigger, 'onClick');
    await searchTrigger.click();

    const searchInput = page.getByRole('dialog', { name: 'Search Neon' }).getByRole('combobox');
    await expect(searchInput).toBeVisible();

    // Headless UI skips initial focus on touch devices so the keyboard stays closed.
    if (hasTouch) {
      await searchInput.tap();
    } else {
      await expect(searchInput).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(searchInput).toBeHidden();
      await page.keyboard.press('ControlOrMeta+k');
      await expect(searchInput).toBeFocused();
    }
    await page.keyboard.type('branching');
    await expect(searchInput).toHaveValue('branching');

    const composingArrowPrevented = await searchInput.evaluate((input) => {
      const event = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        keyCode: 229,
        isComposing: true,
        bubbles: true,
        cancelable: true,
      });
      input.dispatchEvent(event);
      return event.defaultPrevented;
    });
    expect(composingArrowPrevented).toBe(false);

    await page.keyboard.press('Escape');
    await expectHealthyPage(applicationErrors);
  });
});
