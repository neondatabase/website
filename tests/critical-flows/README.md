# Critical user flow monitoring

This suite monitors business-critical website journeys without blocking releases. A failing run
should be investigated, but the GitHub check must not be configured as a required status check
until the release policy is agreed with the client.

## Contract model

Each flow separates three concerns:

- `priority`: user impact if the flow breaks (`P0` or `P1`)
- `mode`: how deeply the flow is exercised (`navigate`, `render`, or `submit`)
- `policy`: whether a failure only reports a regression or blocks a release (`monitor` for now)

The code-reviewed contract registry is in `contracts.js`. Update the registry, selectors, tests,
and PR description together when a critical destination or outcome changes.

## Monitored flows

| Test ID           | Priority | Journey                                 | Expected outcome                                                            |
| ----------------- | -------- | --------------------------------------- | --------------------------------------------------------------------------- |
| `TC-ACQ-001`      | P0       | Homepage signup                         | CTA targets Neon Console signup                                             |
| `TC-ACQ-002..005` | P0       | Desktop and mobile authentication entry | Login and signup destinations remain correct                                |
| `TC-ACQ-006..008` | P0       | Pricing plan selection                  | Free targets signup; Launch and Scale target billing                        |
| `TC-DOC-001..002` | P0       | Documentation onboarding                | Docs load, quickstart is reachable, search opens, init command copies       |
| `TC-LEAD-001*`    | P0       | Contact sales                           | Required fields, email, analytics payload, success, and failure states work |
| `TC-LEAD-002*`    | P1       | Startup application                     | Required fields, email, analytics payload, success, and failure states work |
| `TC-LEAD-003*`    | P1       | AI agent application                    | Required email, analytics payload, success, and failure states work         |
| `TC-SUB-001*`     | P1       | Changelog subscription                  | Email validation, subscription analytics, success, and failure states work  |
| `TC-SUB-002`      | P1       | Blog article subscription               | Subscription analytics and the final success state are correct              |

Every browser test follows Arrange, Act, Assert:

1. Arrange a clean page and mock analytics or external form submission.
2. Act through the same controls a user uses.
3. Assert the final business outcome, payload, destination, and page health.

Tests must never create accounts, leads, or subscriptions. Use `@example.com` addresses and keep
all external submission boundaries mocked.

## Cypress migration coverage

The former Cypress suite contained 21 scenarios. Before migration, only 11 still passed against the
current site. Playwright retains every passing behavior and restores useful validation checks for
the current contact sales and changelog forms.

Five obsolete expectations were intentionally retired instead of copying broken selectors:

- four `/blog` index subscription tests, because that route no longer contains the form; `TC-SUB-002`
  monitors the current blog article form instead
- one AI agent URL-format test, because the current product contract requires a non-empty value but
  does not validate its URL format

The old assertions and waits on HubSpot requests were not ported. These forms currently submit
analytics events and do not call that endpoint. Playwright still mocks external form routes
defensively so future changes cannot create real leads or subscriptions during tests.

## Local commands

Install browser binaries once:

```bash
npx playwright install chromium webkit
```

Run the complete desktop/mobile Chromium and WebKit matrix:

```bash
npm run test
```

`npm run test:critical` is an explicit alias for the same monitoring suite. Run a fast desktop
Chromium check with:

```bash
npm run test:critical:quick
```

Open Playwright UI mode or the last HTML report:

```bash
npm run test:critical:ui
npm run test:critical:report
```

Playwright starts the local Next.js server automatically. Set `PLAYWRIGHT_BASE_URL` to test an
already running local or preview deployment. Set `PLAYWRIGHT_SKIP_WEB_SERVER=1` when the target
server is managed separately.

## Why Playwright

Playwright is the project's E2E runner because it provides:

- first-class Chromium and WebKit projects; Cypress WebKit support is experimental
- one declarative project matrix for desktop and mobile device profiles
- isolated browser contexts and native support for multiple pages, tabs, and popups
- trace, screenshot, and video artifacts on failure
- automatic local web server lifecycle
- close alignment with the contract-driven form suite used by the RevenueCat website

The tradeoffs are:

- Cypress has a particularly strong interactive command log and time-travel debugging experience
- Playwright's async API requires every action and assertion to be awaited consistently
- additional browser downloads and CI time
- WebKit tests approximate Safari but do not execute the branded Safari browser

The Cypress runner, configuration, workflow, and dependencies were removed after the active form
coverage was migrated. Published Cypress integration guides remain part of the website content and
are unrelated to this repository's test runner.
