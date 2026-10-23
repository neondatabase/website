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
    isMobile,
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
    const searchDialog = page.getByRole('dialog', { name: 'Search Neon' });
    // Phone widths collapse the category chips into a single menu.
    if (isMobile) {
      const categoryMenu = searchDialog.locator('[data-test="search-category-menu"]');
      await expect(categoryMenu).toHaveText('Search in: Docs');
      await categoryMenu.click();
      const options = page.getByRole('listbox', { name: 'Search in: Docs' });
      await expect(options.getByRole('option', { name: 'Docs', exact: true })).toHaveAttribute(
        'aria-selected',
        'true'
      );
      await expect(options.getByRole('option', { name: 'All', exact: true })).toHaveAttribute(
        'aria-selected',
        'false'
      );
      await page.keyboard.press('Escape');
      await expect(options).toBeHidden();
      await expect(searchInput).toBeVisible();
    } else {
      await expect(searchDialog.getByRole('button', { name: 'Docs', exact: true })).toHaveAttribute(
        'aria-pressed',
        'true'
      );
      await expect(searchDialog.getByRole('button', { name: 'All', exact: true })).toHaveAttribute(
        'aria-pressed',
        'false'
      );
    }

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
