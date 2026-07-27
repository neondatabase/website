const { expect, test } = require('@playwright/test');

const { SUBSCRIPTION_CONTRACTS } = require('./contracts');
const {
  expectAnalyticsEvents,
  expectHealthyPage,
  expectManagedFormReady,
  installAnalyticsMock,
  mockExternalFormSubmissions,
  openCriticalPage,
} = require('./helpers');

function expectedSubscriptionEvents(email) {
  return [
    {
      name: 'identify',
      properties: { email },
    },
    {
      name: 'Changelog Subscription',
      properties: { email },
    },
  ];
}

for (const contract of SUBSCRIPTION_CONTRACTS) {
  test(`[${contract.id}] ${contract.name} reaches the monitored success outcome`, async ({
    page,
  }) => {
    await installAnalyticsMock(page);
    await mockExternalFormSubmissions(page);
    const applicationErrors = await openCriticalPage(page, contract.pagePath);
    const formContainer = page.locator('#changelog-form:visible');

    await expect(formContainer).toHaveCount(1);
    await expectManagedFormReady(formContainer.locator('form'));
    await formContainer.locator('input[name="email"]').fill(contract.email);
    await formContainer.getByRole('button', { name: 'Subscribe' }).click();

    await expect(formContainer.getByTestId('success-message')).toBeVisible();
    await expectAnalyticsEvents(page, expectedSubscriptionEvents(contract.email));
    await expectHealthyPage(applicationErrors);
  });
}

test('[TC-SUB-001-ERR] changelog subscription reports analytics failure', async ({ page }) => {
  const contract = SUBSCRIPTION_CONTRACTS[0];
  await installAnalyticsMock(page, { failureEventName: 'Changelog Subscription' });
  await mockExternalFormSubmissions(page);
  const applicationErrors = await openCriticalPage(page, contract.pagePath);
  const formContainer = page.locator('#changelog-form:visible');

  await expect(formContainer).toHaveCount(1);
  await expectManagedFormReady(formContainer.locator('form'));
  await formContainer.locator('input[name="email"]').fill(contract.email);
  await formContainer.getByRole('button', { name: 'Subscribe' }).click();

  await expect(formContainer.getByText('Please reload the page and try again')).toBeVisible();
  await expect(formContainer.getByTestId('success-message')).toHaveCount(0);
  await expectAnalyticsEvents(page, expectedSubscriptionEvents(contract.email));
  await expectHealthyPage(applicationErrors);
});
