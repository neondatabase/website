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

// The changelog and blog pages are heavy routes: first paint plus hydration
// regularly runs past the 10s default expect timeout on CI, which showed up as
// TC-SUB-001 failing at 25-32s and then passing on retry in 13s. Give this file
// room to hydrate rather than racing it.
test.describe.configure({ timeout: 180000 });

const SUBSCRIPTION_EXPECT_TIMEOUT = 30000;

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

  await expect(formContainer).toHaveCount(1, { timeout: SUBSCRIPTION_EXPECT_TIMEOUT });
  await expectManagedFormReady(formContainer.locator('form'), SUBSCRIPTION_EXPECT_TIMEOUT);

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

    await expect(formContainer.getByTestId('success-message')).toBeVisible({
      timeout: SUBSCRIPTION_EXPECT_TIMEOUT,
    });
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

test(`[${changelogContract.analyticsFailureId}] changelog subscription reports analytics failure`, async ({
  page,
}) => {
  const contract = changelogContract;
  const { applicationErrors, formContainer } = await openSubscriptionForm(page, contract, {
    failureEventName: 'Changelog Subscription',
  });

  await submitSubscription(formContainer, contract.email);

  await expect(formContainer.getByText('Please reload the page and try again')).toBeVisible({
    timeout: SUBSCRIPTION_EXPECT_TIMEOUT,
  });
  await expect(formContainer.getByTestId('success-message')).toHaveCount(0);
  await expectAnalyticsEvents(page, expectedSubscriptionEvents(contract.email));
  await expectHealthyPage(applicationErrors);
});
