const DESTINATIONS = {
  billing: 'https://console.neon.tech/app/billing#plans',
  docs: '/docs/introduction',
  login: 'https://console.neon.tech/login',
  signup: 'https://console.neon.tech/signup',
  startupsApply: 'https://sites.google.com/databricks.com/startup-program-apply',
};

const HOME_LINK_CONTRACTS = [
  {
    id: 'TC-ACQ-001',
    key: 'home-signup',
    name: 'Homepage signup',
    priority: 'P0',
    mode: 'navigate',
    policy: 'monitor',
    testId: 'home-signup',
    expectedHref: DESTINATIONS.signup,
  },
  {
    id: 'TC-DOC-001',
    key: 'home-docs',
    name: 'Homepage docs entry',
    priority: 'P0',
    mode: 'navigate',
    policy: 'monitor',
    testId: 'home-docs',
    expectedHref: DESTINATIONS.docs,
  },
];

const HEADER_LINK_CONTRACTS = {
  desktop: [
    {
      id: 'TC-ACQ-002',
      key: 'header-login',
      name: 'Desktop header login',
      priority: 'P0',
      mode: 'navigate',
      policy: 'monitor',
      testId: 'header-login',
      expectedHref: DESTINATIONS.login,
    },
    {
      id: 'TC-ACQ-003',
      key: 'header-signup',
      name: 'Desktop header signup',
      priority: 'P0',
      mode: 'navigate',
      policy: 'monitor',
      testId: 'header-signup',
      expectedHref: DESTINATIONS.signup,
    },
  ],
  mobile: [
    {
      id: 'TC-ACQ-004',
      key: 'mobile-login',
      name: 'Mobile menu login',
      priority: 'P0',
      mode: 'navigate',
      policy: 'monitor',
      testId: 'mobile-login',
      expectedHref: DESTINATIONS.login,
    },
    {
      id: 'TC-ACQ-005',
      key: 'mobile-signup',
      name: 'Mobile menu signup',
      priority: 'P0',
      mode: 'navigate',
      policy: 'monitor',
      testId: 'mobile-signup',
      expectedHref: DESTINATIONS.signup,
    },
  ],
};

const PRICING_LINK_CONTRACTS = [
  {
    id: 'TC-ACQ-006',
    key: 'pricing-free',
    name: 'Free plan signup',
    priority: 'P0',
    mode: 'navigate',
    policy: 'monitor',
    testId: 'pricing-free-cta',
    expectedHref: DESTINATIONS.signup,
  },
  {
    id: 'TC-ACQ-007',
    key: 'pricing-launch',
    name: 'Launch plan billing',
    priority: 'P0',
    mode: 'navigate',
    policy: 'monitor',
    testId: 'pricing-launch-cta',
    expectedHref: DESTINATIONS.billing,
  },
  {
    id: 'TC-ACQ-008',
    key: 'pricing-scale',
    name: 'Scale plan billing',
    priority: 'P0',
    mode: 'navigate',
    policy: 'monitor',
    testId: 'pricing-scale-cta',
    expectedHref: DESTINATIONS.billing,
  },
];

const DOCS_ONBOARDING_CONTRACT = {
  id: 'TC-DOC-002',
  key: 'docs-onboarding',
  name: 'Documentation onboarding',
  priority: 'P0',
  mode: 'render',
  policy: 'monitor',
  pagePath: DESTINATIONS.docs,
};

const LEAD_FORM_CONTRACTS = [
  {
    id: 'TC-LEAD-001',
    key: 'contact-sales',
    name: 'Contact sales',
    priority: 'P0',
    mode: 'submit',
    policy: 'monitor',
    pagePath: '/contact-sales',
    testId: 'contact-sales-form',
    submitText: 'Submit',
    successText: 'Sent!',
    fields: {
      firstname: 'Alex',
      lastname: 'Lopez',
      email: 'critical-flow-contact@example.com',
      companyWebsite: 'https://example.com',
      message: 'Critical user flow monitoring',
    },
    selects: {
      companySize: '0_1',
      reasonForContact: 'Demo/POC',
    },
    expectedEvents: [
      {
        name: 'identify',
        properties: { email: 'critical-flow-contact@example.com' },
      },
      {
        name: 'Contact Sales Form Submitted',
        properties: {
          email: 'critical-flow-contact@example.com',
          first_name: 'Alex',
          last_name: 'Lopez',
          company_website: 'https://example.com',
          company_size: '0_1',
          reason_for_contact: 'Demo/POC',
          message: 'Critical user flow monitoring',
        },
      },
    ],
    analyticsFailureId: 'TC-LEAD-001-ERR',
    identifyFailureId: 'TC-LEAD-001-ERR-IDENTIFY',
    validation: {
      required: {
        id: 'TC-LEAD-001-VAL-REQUIRED',
        seedField: 'firstname',
        errorCount: 5,
        errorText: /Required [Ff]ield/,
      },
      invalidEmail: {
        id: 'TC-LEAD-001-VAL-EMAIL',
        errorText: 'Please enter a valid email',
      },
    },
  },
];

// The startups application no longer submits an inline form. The Apply Now CTA
// links out to the external Google Sites application, so the contract checks
// the destination instead of a submit flow.
const STARTUPS_APPLY_CONTRACT = {
  id: 'TC-LEAD-002',
  key: 'startups-apply',
  name: 'Startups application link',
  priority: 'P1',
  mode: 'navigate',
  policy: 'monitor',
  pagePath: '/startups',
  containerSelector: '#startups-form',
  linkText: 'Apply Now',
  expectedHref: DESTINATIONS.startupsApply,
  expectedTarget: '_blank',
  expectedRel: 'noopener noreferrer',
};

const AGENT_FORM_CONTRACT = {
  id: 'TC-LEAD-003',
  key: 'agent-program',
  name: 'AI agent program application',
  priority: 'P1',
  mode: 'submit',
  policy: 'monitor',
  pagePath: '/use-cases/ai-agents',
  testId: 'agent-program-form',
  email: 'critical-flow-agent@example.com',
  url: 'https://example.com/agent',
  expectedEvents: [
    {
      name: 'identify',
      properties: { email: 'critical-flow-agent@example.com' },
    },
    {
      name: 'Agent Plan Application Submitted',
      properties: {
        email: 'critical-flow-agent@example.com',
        url: 'https://example.com/agent',
      },
    },
  ],
  identifyFailureId: 'TC-LEAD-003-ERR-IDENTIFY',
  validation: {
    required: {
      id: 'TC-LEAD-003-VAL-REQUIRED',
      errorText: 'This field is required',
    },
    invalidEmail: {
      id: 'TC-LEAD-003-VAL-EMAIL',
      errorText: 'Please enter a valid email address',
    },
  },
};

const SUBSCRIPTION_CONTRACTS = [
  {
    id: 'TC-SUB-001',
    key: 'changelog-subscription',
    name: 'Changelog subscription',
    priority: 'P1',
    mode: 'submit',
    policy: 'monitor',
    pagePath: '/docs/changelog',
    email: 'critical-flow-changelog@example.com',
    analyticsFailureId: 'TC-SUB-001-ERR',
    validation: {
      required: {
        id: 'TC-SUB-001-VAL-REQUIRED',
        errorText: 'Please enter your email',
      },
      invalidEmail: {
        id: 'TC-SUB-001-VAL-EMAIL',
        email: 'invalid-email',
        errorText: 'Please enter a valid email',
      },
    },
  },
  {
    id: 'TC-SUB-002',
    key: 'blog-subscription',
    name: 'Blog subscription',
    priority: 'P1',
    mode: 'submit',
    policy: 'monitor',
    pagePath: '/blog/aws-cni-lessons-from-a-production-outage',
    email: 'critical-flow-blog@example.com',
  },
];

module.exports = {
  AGENT_FORM_CONTRACT,
  DESTINATIONS,
  DOCS_ONBOARDING_CONTRACT,
  HEADER_LINK_CONTRACTS,
  HOME_LINK_CONTRACTS,
  LEAD_FORM_CONTRACTS,
  PRICING_LINK_CONTRACTS,
  STARTUPS_APPLY_CONTRACT,
  SUBSCRIPTION_CONTRACTS,
};
