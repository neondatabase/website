const { expect, test } = require('@playwright/test');

const { AGENT_FORM_CONTRACT, LEAD_FORM_CONTRACTS } = require('./contracts');
const {
  expectAnalyticsEvents,
  expectHealthyPage,
  expectManagedFormReady,
  installAnalyticsMock,
  mockExternalFormSubmissions,
  openCriticalPage,
} = require('./helpers');

async function fillLeadForm(form, contract) {
  for (const [name, value] of Object.entries(contract.fields)) {
    await form.locator(`[name="${name}"]`).fill(value);
  }

  for (const [name, value] of Object.entries(contract.selects)) {
    await form.locator(`[name="${name}"]`).selectOption(value);
  }
}

for (const contract of LEAD_FORM_CONTRACTS) {
  test(`[${contract.id}] ${contract.name} reaches the monitored success outcome`, async ({
    page,
  }) => {
    await installAnalyticsMock(page);
    await mockExternalFormSubmissions(page);
    const applicationErrors = await openCriticalPage(page, contract.pagePath);
    const form = page.getByTestId(contract.testId);

    await expect(form).toBeVisible();
    await expectManagedFormReady(form);
    await fillLeadForm(form, contract);
    await form.getByRole('button', { name: contract.submitText }).click();

    await expect(form.getByRole('button')).toHaveText(contract.successText);
    await expectAnalyticsEvents(page, contract.expectedEvents);
    await expectHealthyPage(applicationErrors);
  });
}

test('[TC-LEAD-001-ERR] contact sales does not show success when analytics fails', async ({
  page,
}) => {
  const contract = LEAD_FORM_CONTRACTS[0];
  await installAnalyticsMock(page, { failureEventName: 'Contact Sales Form Submitted' });
  await mockExternalFormSubmissions(page);
  const applicationErrors = await openCriticalPage(page, contract.pagePath);
  const form = page.getByTestId(contract.testId);

  await expectManagedFormReady(form);
  await fillLeadForm(form, contract);
  await form.getByRole('button', { name: contract.submitText }).click();

  await expect(page.getByTestId('error-message')).toBeVisible();
  await expect(form.getByRole('button', { name: contract.submitText })).not.toHaveText(
    contract.successText
  );
  await expectAnalyticsEvents(page, contract.expectedEvents);
  await expectHealthyPage(applicationErrors);
});

test(`[${AGENT_FORM_CONTRACT.id}] ${AGENT_FORM_CONTRACT.name} reaches the monitored success outcome`, async ({
  page,
}) => {
  const contract = AGENT_FORM_CONTRACT;
  await installAnalyticsMock(page);
  await mockExternalFormSubmissions(page);
  const applicationErrors = await openCriticalPage(page, contract.pagePath);
  const form = page.getByTestId(contract.testId);

  await expect(form).toBeVisible();
  await expectManagedFormReady(form.locator('form'));
  await form.locator('[name="url"]').fill(contract.url);
  await form.locator('[name="email"]').fill(contract.email);
  await form.getByRole('button', { name: 'Apply' }).click();

  await expect(form.getByTestId('success-message')).toBeVisible();
  await expectAnalyticsEvents(page, contract.expectedEvents);
  await expectHealthyPage(applicationErrors);
});
