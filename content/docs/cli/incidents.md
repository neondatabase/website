---
title: 'Neon CLI command: incidents'
subtitle: 'Check open Neon incidents and maintenance from the terminal'
summary: >-
  The Neon CLI `neon incidents` command reads the public Neon status page
  (neonstatus.com) and prints the overall status, open incidents, components
  that aren't operational, and active or upcoming maintenance. It needs no
  login or linked project, so you can run it when something looks wrong to
  check whether Neon is having an issue. Pass `-o json` for the full report.
enableTableOfContents: true
---

The `incidents` command shows what the [Neon status page](/docs/introduction/status) reports right now: the overall status, open incidents, components that aren't operational, and active or upcoming maintenance posted on the status page. Run it when a connection fails or a command errors and you want to know whether the problem is on Neon's side.

It reads the public status API behind [neonstatus.com](https://neonstatus.com), so it needs no login, API key, or linked project.

## Usage

<CliUsage command="incidents" />

## Options

Takes only the [global options](/docs/cli#global-options).

## Examples

```bash
neon incidents
```

When nothing is open, it prints the overall status and stops:

```text filename="Output"
Status           operational
Updated At       2026-11-02T22:27:18.595Z
Status Page URL  https://neonstatus.com

No open incidents or maintenance.
```

The overall `Status` is one of `operational`, `maintenance`, `degraded_performance`, `partial_disruption`, `disruption`, or `security_event`. When something is open, up to three tables follow:

- **Incidents**: each open incident's name, state (`investigating`, `identified`, `monitoring`, or `resolved`), status, start time, affected components and regions, latest update, and link.
- **Affected components**: each component that isn't operational, with its status and regions.
- **Maintenance**: active maintenance first, then upcoming, with the planned window, components, regions, latest update, and link.

Print the full report as JSON:

```bash
neon incidents -o json
```

```json filename="Output"
{
  "status": "operational",
  "updated_at": "2026-11-02T22:27:18.595Z",
  "status_page_url": "https://neonstatus.com",
  "incidents": [],
  "maintenance": [],
  "affected_components": []
}
```

The JSON and YAML output always include the `incidents`, `maintenance`, and `affected_components` arrays, so a script can check `status` or the array lengths. If the command can't reach neonstatus.com within 10 seconds, it fails with an error that names the cause.
