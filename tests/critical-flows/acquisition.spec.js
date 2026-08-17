const { expect, test } = require('@playwright/test');

const {
  HEADER_LINK_CONTRACTS,
  HOME_LINK_CONTRACTS,
  PRICING_LINK_CONTRACTS,
} = require('./contracts');
const { expectHealthyPage, openCriticalPage } = require('./helpers');

async function expectContractLink(page, contract) {
  const link = page.getByTestId(contract.testId);

  await expect(link, `${contract.id}: ${contract.name} is missing`).toBeVisible();
  await expect(link).toHaveAttribute('href', contract.expectedHref);
}

test.describe('critical acquisition journeys', () => {
  test('[TC-ACQ-001..005] homepage entry points preserve their destinations', async ({
    baseURL,
    isMobile,
    page,
  }) => {
    const applicationErrors = await openCriticalPage(page, '/');

    for (const contract of HOME_LINK_CONTRACTS) {
      await test.step(`${contract.id}: ${contract.name}`, async () => {
        await expectContractLink(page, contract);
      });
    }

    const headerContracts = isMobile ? HEADER_LINK_CONTRACTS.mobile : HEADER_LINK_CONTRACTS.desktop;

    if (isMobile) {
      const menuToggle = page.getByTestId('mobile-menu-toggle');
      await expect(menuToggle).toBeVisible();
      await menuToggle.click();
      await expect(menuToggle).toHaveAttribute('aria-label', 'Close menu');
    }

    for (const contract of headerContracts) {
      await test.step(`${contract.id}: ${contract.name}`, async () => {
        await expectContractLink(page, contract);
      });
    }

    if (isMobile) {
      const menuToggle = page.getByTestId('mobile-menu-toggle');
      await menuToggle.click();
      await expect(menuToggle).toHaveAttribute('aria-label', 'Open menu');
    }

    const docsLink = page.getByTestId('home-docs');
    await docsLink.click();
    await expect(page).toHaveURL(new URL('/docs/introduction', baseURL).toString());
    await expect(page.getByRole('heading', { level: 1, name: 'Neon documentation' })).toBeVisible();
    await expectHealthyPage(applicationErrors);
  });

  test('[TC-ACQ-006..008] pricing plans preserve signup and billing destinations', async ({
    page,
  }) => {
    const applicationErrors = await openCriticalPage(page, '/pricing');

    await expect(page.getByRole('heading', { level: 1, name: 'Neon pricing' })).toBeVisible();

    for (const contract of PRICING_LINK_CONTRACTS) {
      await test.step(`${contract.id}: ${contract.name}`, async () => {
        await expectContractLink(page, contract);
      });
    }

    await expectHealthyPage(applicationErrors);
  });
});
