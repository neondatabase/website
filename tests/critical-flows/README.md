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

| Test ID           | Priority | Journey                                 | Expected outcome                                                          |
| ----------------- | -------- | --------------------------------------- | ------------------------------------------------------------------------- |
| `TC-ACQ-001`      | P0       | Homepage signup                         | CTA targets Neon Console signup                                           |
| `TC-ACQ-002..005` | P0       | Desktop and mobile authentication entry | Login and signup destinations remain correct                              |
| `TC-ACQ-006..008` | P0       | Pricing plan selection                  | Free targets signup; Launch and Scale target billing                      |
| `TC-DOC-001..002` | P0       | Documentation onboarding                | Docs load, quickstart is reachable, search opens, init command copies     |
| `TC-LEAD-001`     | P0       | Contact sales                           | Analytics payload is sent and the final success or error state is visible |
| `TC-LEAD-002`     | P1       | Startup application                     | Analytics payload is sent and the final success state is visible          |
| `TC-LEAD-003`     | P1       | AI agent application                    | Analytics payload is sent and the final success state is visible          |
| `TC-SUB-001`      | P1       | Changelog subscription                  | Subscription analytics and final UI state are correct                     |
| `TC-SUB-002`      | P1       | Blog subscription                       | Subscription analytics and final UI state are correct                     |

Every browser test follows Arrange, Act, Assert:

1. Arrange a clean page and mock analytics or external form submission.
2. Act through the same controls a user uses.
3. Assert the final business outcome, payload, destination, and page health.

Tests must never create accounts, leads, or subscriptions. Use `@example.com` addresses and keep
all external submission boundaries mocked.

## Local commands

Install browser binaries once:

```bash
npx playwright install chromium webkit
```

Run the complete desktop/mobile Chromium and WebKit matrix:

```bash
npm run test:critical
```

Run a fast desktop Chromium check:

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

## Why Playwright for new critical flows

The existing Cypress suite remains supported as `npm run test:e2e:legacy`. Playwright is used for
new critical-flow monitoring because it provides:

- first-class Chromium and WebKit projects; Cypress WebKit support is experimental
- one declarative project matrix for desktop and mobile device profiles
- isolated browser contexts and native support for multiple pages, tabs, and popups
- trace, screenshot, and video artifacts on failure
- automatic local web server lifecycle
- close alignment with the contract-driven form suite used by the RevenueCat website

The tradeoffs are:

- Cypress has a particularly strong interactive command log and time-travel debugging experience
- Playwright's async API requires every action and assertion to be awaited consistently
- a second E2E dependency and configuration while Cypress remains
- additional browser downloads and CI time
- temporary duplication of test conventions during migration
- WebKit tests approximate Safari but do not execute the branded Safari browser

Keeping both tools is intentional during migration. New critical flows belong in Playwright;
existing Cypress tests stay unchanged until a separate decision is made about migration or
retirement.
