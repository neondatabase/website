const { expect, test } = require('@playwright/test');

const { AGENT_FORM_CONTRACT, LEAD_FORM_CONTRACTS } = require('./contracts');
const {
  expectAnalyticsEvents,
  expectHealthyPage,
  expectManagedFormReady,
  expectNoAnalyticsEvents,
  installAnalyticsMock,
  mockExternalFormSubmissions,
  openCriticalPage,
} = require('./helpers');

async function fillLeadForm(form, contract, fieldOverrides = {}) {
  const fields = { ...contract.fields, ...fieldOverrides };

  for (const [name, value] of Object.entries(fields)) {
    await form.locator(`[name="${name}"]`).fill(value);
  }

  for (const [name, value] of Object.entries(contract.selects)) {
    await form.locator(`[name="${name}"]`).selectOption(value);
  }
}

async function submitLeadForm(form, contract) {
  await form.getByRole('button', { name: contract.submitText }).click();
}

async function openLeadForm(page, contract, analyticsOptions = {}) {
  await installAnalyticsMock(page, analyticsOptions);
  await mockExternalFormSubmissions(page);
  const applicationErrors = await openCriticalPage(page, contract.pagePath);
  const form = page.getByTestId(contract.testId);

  await expect(form).toBeVisible();
  await expectManagedFormReady(form);

  return { applicationErrors, form };
}

for (const contract of LEAD_FORM_CONTRACTS) {
  test(`[${contract.id}] ${contract.name} reaches the monitored success outcome`, async ({
    page,
  }) => {
    const { applicationErrors, form } = await openLeadForm(page, contract);

    await fillLeadForm(form, contract);
    await submitLeadForm(form, contract);

    await expect(form.getByRole('button')).toHaveText(contract.successText);
    await expectAnalyticsEvents(page, contract.expectedEvents);
    await expectHealthyPage(applicationErrors);
  });

  test(`[${contract.validation.required.id}] ${contract.name} reports every missing required field`, async ({
    page,
  }) => {
    const { applicationErrors, form } = await openLeadForm(page, contract);
    const { errorCount, errorText, seedField } = contract.validation.required;

    await form.locator(`[name="${seedField}"]`).fill(contract.fields[seedField]);
    await submitLeadForm(form, contract);

    const errors = form.getByTestId('error-field-message');
    await expect(errors).toHaveCount(errorCount);
    await expect(errors).toContainText(Array(errorCount).fill(errorText));
    await expectNoAnalyticsEvents(page);
    await expectHealthyPage(applicationErrors);
  });

  test(`[${contract.validation.invalidEmail.id}] ${contract.name} rejects an invalid email`, async ({
    page,
  }) => {
    const { applicationErrors, form } = await openLeadForm(page, contract);

    await fillLeadForm(form, contract, { email: 'invalid-email' });
    await submitLeadForm(form, contract);

    const emailInput = form.locator('[name="email"]');
    const validity = await emailInput.evaluate((input) => ({
      typeMismatch: input.validity.typeMismatch,
      valid: input.validity.valid,
      validationMessage: input.validationMessage,
    }));

    expect(validity).toMatchObject({ typeMismatch: true, valid: false });
    expect(validity.validationMessage).not.toBe('');
    await expect(form.locator('button[type="submit"]')).toHaveText(contract.submitText);
    await expectNoAnalyticsEvents(page);
    await expectHealthyPage(applicationErrors);
  });

  test(`[${contract.identifyFailureId}] ${contract.name} stops when identification fails`, async ({
    page,
  }) => {
    const { applicationErrors, form } = await openLeadForm(page, contract, {
      failureEventName: 'identify',
    });

    await fillLeadForm(form, contract);
    await submitLeadForm(form, contract);

    await expect(page.getByTestId('error-message')).toBeVisible();
    await expect(form.locator('button[type="submit"]')).not.toHaveText(contract.successText);
    await expectAnalyticsEvents(page, [contract.expectedEvents[0]]);
    await expectHealthyPage(applicationErrors);
  });
}

test('[TC-LEAD-001-ERR] contact sales does not show success when analytics fails', async ({
  page,
}) => {
  const contract = LEAD_FORM_CONTRACTS[0];
  const { applicationErrors, form } = await openLeadForm(page, contract, {
    failureEventName: 'Contact Sales Form Submitted',
  });

  await fillLeadForm(form, contract);
  await submitLeadForm(form, contract);

  await expect(page.getByTestId('error-message')).toBeVisible();
  await expect(form.getByRole('button', { name: contract.submitText })).not.toHaveText(
    contract.successText
  );
  await expectAnalyticsEvents(page, contract.expectedEvents);
  await expectHealthyPage(applicationErrors);
});

async function openAgentForm(page, analyticsOptions = {}) {
  const contract = AGENT_FORM_CONTRACT;
  await installAnalyticsMock(page, analyticsOptions);
  await mockExternalFormSubmissions(page);
  const applicationErrors = await openCriticalPage(page, contract.pagePath);
  const form = page.getByTestId(contract.testId);

  await expect(form).toBeVisible();
  await expectManagedFormReady(form.locator('form'));

  return { applicationErrors, contract, form };
}

async function submitAgentForm(form, contract, email = contract.email) {
  await form.locator('[name="url"]').fill(contract.url);
  if (email !== null) {
    await form.locator('[name="email"]').fill(email);
  }
  await form.getByRole('button', { name: 'Apply' }).click();
}

test(`[${AGENT_FORM_CONTRACT.id}] ${AGENT_FORM_CONTRACT.name} reaches the monitored success outcome`, async ({
  page,
}) => {
  const { applicationErrors, contract, form } = await openAgentForm(page);

  await submitAgentForm(form, contract);

  await expect(form.getByTestId('success-message')).toBeVisible();
  await expectAnalyticsEvents(page, contract.expectedEvents);
  await expectHealthyPage(applicationErrors);
});

test(`[${AGENT_FORM_CONTRACT.validation.required.id}] ${AGENT_FORM_CONTRACT.name} reports a missing email`, async ({
  page,
}) => {
  const { applicationErrors, contract, form } = await openAgentForm(page);

  await submitAgentForm(form, contract, null);

  const errors = form.getByTestId('error-field-message');
  await expect(errors).toHaveCount(1);
  await expect(errors).toHaveText(contract.validation.required.errorText);
  await expectNoAnalyticsEvents(page);
  await expectHealthyPage(applicationErrors);
});

test(`[${AGENT_FORM_CONTRACT.validation.invalidEmail.id}] ${AGENT_FORM_CONTRACT.name} rejects an invalid email`, async ({
  page,
}) => {
  const { applicationErrors, contract, form } = await openAgentForm(page);

  await submitAgentForm(form, contract, 'invalid-email');

  const errors = form.getByTestId('error-field-message');
  await expect(errors).toHaveCount(1);
  await expect(errors).toHaveText(contract.validation.invalidEmail.errorText);
  await expectNoAnalyticsEvents(page);
  await expectHealthyPage(applicationErrors);
});

test(`[${AGENT_FORM_CONTRACT.identifyFailureId}] ${AGENT_FORM_CONTRACT.name} stops when identification fails`, async ({
  page,
}) => {
  const { applicationErrors, contract, form } = await openAgentForm(page, {
    failureEventName: 'identify',
  });
  const submitButton = form.locator('button[type="submit"]');

  await submitAgentForm(form, contract);

  await expect(submitButton).toHaveText('Submitting...');
  await expect(submitButton).toHaveText('Apply');
  await expect(form.getByTestId('success-message')).toHaveCount(0);
  await expectAnalyticsEvents(page, [contract.expectedEvents[0]]);
  await expectHealthyPage(applicationErrors);
});
