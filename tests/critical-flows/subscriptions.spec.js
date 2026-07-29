const { expect, test } = require('@playwright/test');

const { SUBSCRIPTION_CONTRACTS } = require('./contracts');
const {
  expectAnalyticsEvents,
  expectHealthyPage,
  expectManagedFormReady,
  expectNoAnalyticsEvents,
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

async function openSubscriptionForm(page, contract, analyticsOptions = {}) {
  await installAnalyticsMock(page, analyticsOptions);
  await mockExternalFormSubmissions(page);
  const applicationErrors = await openCriticalPage(page, contract.pagePath);
  const formContainer = page.locator('#changelog-form:visible');

  await expect(formContainer).toHaveCount(1);
  await expectManagedFormReady(formContainer.locator('form'));

  return { applicationErrors, formContainer };
}

async function submitSubscription(formContainer, email) {
  if (email !== undefined) {
    await formContainer.locator('input[name="email"]').fill(email);
  }
  await formContainer.getByRole('button', { name: 'Subscribe' }).click();
}

for (const contract of SUBSCRIPTION_CONTRACTS) {
  test(`[${contract.id}] ${contract.name} reaches the monitored success outcome`, async ({
    page,
  }) => {
    const { applicationErrors, formContainer } = await openSubscriptionForm(page, contract);

    await submitSubscription(formContainer, contract.email);

    await expect(formContainer.getByTestId('success-message')).toBeVisible();
    await expectAnalyticsEvents(page, expectedSubscriptionEvents(contract.email));
    await expectHealthyPage(applicationErrors);
  });
}

const changelogContract = SUBSCRIPTION_CONTRACTS[0];

test(`[${changelogContract.validation.required.id}] ${changelogContract.name} requires an email`, async ({
  page,
}) => {
  const { applicationErrors, formContainer } = await openSubscriptionForm(page, changelogContract);

  await submitSubscription(formContainer);

  const errors = formContainer.getByTestId('error-field-message');
  await expect(errors).toHaveCount(1);
  await expect(errors).toHaveText(changelogContract.validation.required.errorText);
  await expectNoAnalyticsEvents(page);
  await expectHealthyPage(applicationErrors);
});

test(`[${changelogContract.validation.invalidEmail.id}] ${changelogContract.name} rejects an invalid email`, async ({
  page,
}) => {
  const { applicationErrors, formContainer } = await openSubscriptionForm(page, changelogContract);

  await submitSubscription(formContainer, changelogContract.validation.invalidEmail.email);

  const errors = formContainer.getByTestId('error-field-message');
  await expect(errors).toHaveCount(1);
  await expect(errors).toHaveText(changelogContract.validation.invalidEmail.errorText);
  await expectNoAnalyticsEvents(page);
  await expectHealthyPage(applicationErrors);
});

test('[TC-SUB-001-ERR] changelog subscription reports analytics failure', async ({ page }) => {
  const contract = changelogContract;
  const { applicationErrors, formContainer } = await openSubscriptionForm(page, contract, {
    failureEventName: 'Changelog Subscription',
  });

  await submitSubscription(formContainer, contract.email);

  await expect(formContainer.getByText('Please reload the page and try again')).toBeVisible();
  await expect(formContainer.getByTestId('success-message')).toHaveCount(0);
  await expectAnalyticsEvents(page, expectedSubscriptionEvents(contract.email));
  await expectHealthyPage(applicationErrors);
});
