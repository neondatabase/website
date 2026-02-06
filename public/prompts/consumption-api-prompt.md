Help me build a curl command to query my Neon usage using the Consumption History API for usage-based plans.

IMPORTANT: Use the correct API endpoint for usage-based plans, NOT the legacy endpoint.
- Usage-based plans: /api/v2/consumption_history/v2/projects — for Launch, Scale, Agent, and Enterprise plans
- Legacy plans: /api/v2/consumption_history/projects — do NOT use for usage-based plans

Ask me what time period I want to query (see examples below), then generate a curl command with these placeholders that I'll replace when I run it:
- $NEON_API_KEY — my API key (create at https://console.neon.tech/app/settings/api-keys)
- $ORG_ID — my organization ID (found in Organization Settings in the Neon Console)

SECURITY: Do not enter your API key or organization ID in this chat. Replace the placeholders in the generated command when you run it yourself.

API endpoint: GET https://console.neon.tech/api/v2/consumption_history/v2/projects

Required parameters:
- from: Start date-time in ISO 8601 format (e.g., 2026-02-01T00:00:00Z)
- to: End date-time in ISO 8601 format
- granularity: One of "hourly", "daily", or "monthly"
- org_id: My organization ID
- metrics: compute_unit_seconds,root_branch_bytes_month,child_branch_bytes_month,instant_restore_bytes_month,public_network_transfer_bytes,private_network_transfer_bytes,extra_branches_month

IMPORTANT - Granularity constraints:
Each granularity level has a maximum time range. The API will return an error if exceeded.

| Granularity | Max range     | Best for                                      | Example from/to                              |
|-------------|---------------|-----------------------------------------------|----------------------------------------------|
| hourly      | Last 168 hours (7 days) | Debugging recent spikes, real-time monitoring | Last 24 hours, last 3 days                  |
| daily       | Last 60 days  | Month-to-date billing, weekly trends          | Current month, last 30 days                  |
| monthly     | Last 12 months | Year-over-year comparisons, annual reviews   | Last 6 months, full year                     |

Tips for setting from/to dates:
- Dates are rounded to match the granularity (e.g., hourly rounds to the hour, daily to midnight UTC)
- For month-to-date usage, use granularity=daily with from=first day of month and to=today
- For yesterday's hourly breakdown, use granularity=hourly with from/to spanning 24 hours
- History is available starting from March 1, 2024

Example time period requests (I can say things like):
- "Month to date" — from the 1st of this month to today
- "For the month of January" — January 1 to January 31
- "Last 7 days" — from 7 days ago to today
- "Last 24 hours" — hourly breakdown for the past day
- "Year to date" — from January 1 to today (use monthly granularity)
- "Q4 2025" — October 1 to December 31, 2025
- "Last billing period" — previous full month

Please ask me what time period I want to query (see examples above), then generate the complete curl command with $NEON_API_KEY and $ORG_ID as placeholders. I'll replace those values and run it myself.
