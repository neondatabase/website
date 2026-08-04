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

    const searchDialog = page.getByRole('dialog').filter({ visible: true });
    await expect(searchDialog).toBeVisible();
    await expect(searchDialog.getByRole('combobox')).toBeVisible();

    await page.keyboard.press('Escape');
    await expectHealthyPage(applicationErrors);
  });
});
