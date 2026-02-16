---
title: Building a Usage Dashboard with Neon's Consumption API
subtitle: Learn how to track and visualize your Neon usage programmatically using the Project Consumption metrics API.
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2026-02-15T00:00:00.000Z'
updatedOn: '2026-02-15T00:00:00.000Z'
---

Neon's usage-based pricing plans (**Launch, Scale, Agent, and Enterprise**) ensure you only pay for the resources you actually consume. To help you monitor these costs programmatically, Neon provides the [Project Consumption metrics API](https://api-docs.neon.tech/reference/getconsumptionhistoryperprojectv2). This API allows you to query detailed usage data for your projects, including compute time, storage, and data transfer.

In this guide, you'll learn how to build an internal usage dashboard using Next.js and the Neon Consumption API. By the end, you'll have a dashboard that visualizes your compute usage trends and provides insights into your resource consumption.

## Understanding the Metrics

The Consumption API provides a variety of metrics that will help you understand your usage patterns. It includes detailed information about compute time, storage, data transfer, and more:

| Metric                           | Unit    | Description                                                                         |
| :------------------------------- | :------ | :---------------------------------------------------------------------------------- |
| `compute_unit_seconds`           | Seconds | Total active compute time. This is the primary driver of compute costs.             |
| `root_branch_bytes_month`        | Bytes   | Storage consumed by your primary (root) branches.                                   |
| `child_branch_bytes_month`       | Bytes   | Storage consumed by child branches (only the delta/changes from the parent).        |
| `instant_restore_bytes_month`    | Bytes   | Storage used by the Write-Ahead Log (WAL) to support Point-in-Time Recovery (PITR). |
| `public_network_transfer_bytes`  | Bytes   | Data egress sent over the public internet.                                          |
| `private_network_transfer_bytes` | Bytes   | Data transfer over private networks (e.g., AWS PrivateLink).                        |
| `extra_branches_month`           | Count   | The number of active branches beyond your plan's included allowance.                |

## Prerequisites

- **Node.js:** Version `20` or later.
- **Neon account and project:** A Neon account on a usage-based plan (Launch, Scale, Agent, or Enterprise) with a project. Create one in the [Neon Console](https://console.neon.tech/app/projects).
- **API Key:** A valid Neon API Key. Create one in the [Neon Console](https://console.neon.tech/app/settings/api-keys).
- **Organization ID:** Your Organization ID, found under your Organization settings in the Neon Console.
  ![Neon Organization ID location](/docs/manage/orgs_id.png)

<Steps>

## Query usage with curl

To get a quick look at your consumption data, you can use the following `curl` command. This will fetch your usage metrics for the last month, aggregated daily.

1.  **Set environment variables:**

    ```bash
    export NEON_API_KEY=your_api_key_here
    export ORG_ID=your_org_id_here
    ```

    > Replace `your_api_key_here` and `your_org_id_here` with your actual Neon API Key and Organization ID.

2.  **Run the request:**

    Run the following command to fetch your consumption data for the last month. This will give you a comprehensive view of all the metrics available.

    ```bash shouldWrap
    curl --request GET \
      --url "https://console.neon.tech/api/v2/consumption_history/v2/projects?from=2026-02-01T00:00:00Z&to=2026-02-28T00:00:00Z&granularity=daily&org_id=$ORG_ID&metrics=compute_unit_seconds,root_branch_bytes_month,child_branch_bytes_month,instant_restore_bytes_month,public_network_transfer_bytes,extra_branches_month" \
      --header 'Accept: application/json' \
      --header "Authorization: Bearer $NEON_API_KEY" | jq
    ```

    > Adjust the dates to your desired range. Timestamps must be in RFC 3339 format (e.g., `2026-02-01T00:00:00Z`).

    The response will contain nested `periods` and `consumption` arrays for each project, with the requested metrics included in the `metrics` array.

    <details>
    <summary>Example Response</summary>

    ```json
    {
        "projects": [
            {
            "project_id": "delicate-dawn-54854667",
            "periods": [
                {
                "period_id": "90c7f107-3fe7-4652-b1da-c61f71043128",
                "period_plan": "launch",
                "period_start": "2026-02-02T18:04:52Z",
                "consumption": [
                    {
                    "timeframe_start": "2026-02-04T00:00:00Z",
                    "timeframe_end": "2026-02-05T00:00:00Z",
                    "metrics": [
                        {
                        "metric_name": "compute_unit_seconds",
                        "value": 84
                        },
                        {
                        "metric_name": "root_branch_bytes_month",
                        "value": 758513664
                        },
                        {
                        "metric_name": "instant_restore_bytes_month",
                        "value": 98344
                        },
                        {
                        "metric_name": "public_network_transfer_bytes",
                        "value": 1414
                        }
                    ]
                    },
                    {
                    "timeframe_start": "2026-02-05T00:00:00Z",
                    "timeframe_end": "2026-02-06T00:00:00Z",
                    "metrics": [
                        {
                        "metric_name": "compute_unit_seconds",
                        "value": 236
                        },
                        {
                        "metric_name": "root_branch_bytes_month",
                        "value": 758611968
                        },
                        {
                        "metric_name": "instant_restore_bytes_month",
                        "value": 983488
                        },
                        {
                        "metric_name": "public_network_transfer_bytes",
                        "value": 2184
                        }
                    ]
                    }
                ]
                }
            ]
            }
        ],
        "pagination": {
            "cursor": "delicate-dawn-54854667"
        }
    }
    ```

    </details>

The `granularity` parameter controls how the data is aggregated. The available options are:

- **Hourly:** Last 7 days (Best for debugging spikes)
- **Daily:** Last 60 days (Best for billing dashboards)
- **Monthly:** Last 12 months (Best for long-term trending)

In this guide, you will build a dashboard using daily granularity to visualize trends over the last month.

## Set up the Next.js project

Create a new Next.js project and install the necessary dependencies:

1.  **Initialize the app:**

    ```bash
    npx create-next-app@latest neon-dashboard --yes
    cd neon-dashboard
    ```

2.  **Initialize shadcn/ui:**

    ```bash
    npx shadcn@latest init
    ```

    Follow the prompts to set up your shadcn/ui configuration.

3.  **Install components:**
    You will need `Card` for the summary metrics and `Chart` for visualizing trends.

    ```bash
    npx shadcn@latest add card chart
    ```

4.  **Install dependencies:**
    Install `date-fns` for date manipulation and `lucide-react` for icons.

    ```bash
    npm install date-fns lucide-react
    ```

## Configure environment variables

Create a `.env.local` file in the root of your project:

```env
NEON_API_KEY="your_api_key_here"
NEXT_PUBLIC_ORG_ID="your_org_id_here"
```

> Replace `your_api_key_here` and `your_org_id_here` with your actual Neon API Key and Organization ID.

## Create the data fetching logic

Create a new file `lib/neon-api.ts` to handle fetching and transforming the data from the Neon API. This module exports two functions:

- `getProjects`: Lists all projects in the organization so users can filter by specific ones.
- `getNeonUsage`: Queries the consumption API, flattens the nested response, and aggregates the metrics by day. It accepts an optional `projectIds` parameter to scope usage data to selected projects.

```typescript shouldWrap
import { addDays, subDays } from 'date-fns';

// 1. Define types matching the V2 API
type MetricName =
    | 'compute_unit_seconds'
    | 'root_branch_bytes_month'
    | 'child_branch_bytes_month'
    | 'instant_restore_bytes_month'
    | 'public_network_transfer_bytes'
    | 'private_network_transfer_bytes'
    | 'extra_branches_month';

type MetricValue = {
    metric_name: MetricName;
    value: number;
};

// This shape is what our UI will consume
export type DailyUsage = {
    date: string;
    compute: number;         // Seconds
    storageRoot: number;     // GiB
    storageChild: number;    // GiB
    storageHistory: number;  // GiB
    dataTransfer: number;    // GiB
    extraBranches: number;   // Count
};

export type Project = {
    id: string;
    name: string;
};

export async function getProjects(orgId: string): Promise<Project[]> {
    const apiKey = process.env.NEON_API_KEY;
    if (!apiKey) throw new Error('NEON_API_KEY is not defined');

    const params = new URLSearchParams({ org_id: orgId, limit: '400' });
    const response = await fetch(
        `https://console.neon.tech/api/v2/projects?${params.toString()}`,
        {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                Accept: 'application/json',
            },
            next: { revalidate: 900 },
        }
    );

    if (!response.ok) {
        throw new Error(`Neon API Error: ${response.statusText}`);
    }

    const json = await response.json();
    return (json.projects ?? []).map((p: any) => ({ id: p.id, name: p.name }));
}

export async function getNeonUsage(orgId: string, projectIds?: string[]): Promise<DailyUsage[]> {
    const apiKey = process.env.NEON_API_KEY;

    if (!apiKey) throw new Error('NEON_API_KEY is not defined');

    // 2. Calculate Dates: Last 30 days, rounded to midnight UTC
    const today = new Date();

    // To include today in the range
    const tomorrow = addDays(today, 1);
    const thirtyDaysAgo = subDays(today, 30);

    const from = new Date(thirtyDaysAgo.setUTCHours(0, 0, 0, 0)).toISOString();
    const to = new Date(tomorrow.setUTCHours(0, 0, 0, 0)).toISOString();

    // 3. Construct URL with all metrics
    const params = new URLSearchParams({
        from,
        to,
        granularity: 'daily',
        org_id: orgId,
        metrics: [
            'compute_unit_seconds',
            'root_branch_bytes_month',
            'child_branch_bytes_month',
            'instant_restore_bytes_month',
            'public_network_transfer_bytes',
            'extra_branches_month'
        ].join(','),
    });

    if (projectIds && projectIds.length > 0) {
        params.set('project_ids', projectIds.join(','));
    }

    const response = await fetch(
        `https://console.neon.tech/api/v2/consumption_history/v2/projects?${params.toString()}`,
        {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                Accept: 'application/json',
            },
            next: { revalidate: 900 }, // Cache for 15 minutes
        }
    );

    if (!response.ok) {
        throw new Error(`Neon API Error: ${response.statusText}`);
    }

    const json = await response.json();
    const aggregatedData: Record<string, DailyUsage> = {};

    const BYTES_TO_GIB = 1024 * 1024 * 1024;

    // 4. Flatten and Aggregate Data
    json.projects.forEach((project: any) => {
        project.periods.forEach((period: any) => {
            period.consumption.forEach((day: any) => {
                const dateKey = day.timeframe_start;

                // Initialize object if new date
                if (!aggregatedData[dateKey]) {
                    aggregatedData[dateKey] = {
                        date: dateKey,
                        compute: 0,
                        storageRoot: 0,
                        storageChild: 0,
                        storageHistory: 0,
                        dataTransfer: 0,
                        extraBranches: 0
                    };
                }

                // Map and Sum Metrics
                day.metrics.forEach((m: MetricValue) => {
                    switch (m.metric_name) {
                        case 'compute_unit_seconds':
                            aggregatedData[dateKey].compute += m.value;
                            break;
                        case 'root_branch_bytes_month':
                            aggregatedData[dateKey].storageRoot += m.value / BYTES_TO_GIB;
                            break;
                        case 'child_branch_bytes_month':
                            aggregatedData[dateKey].storageChild += m.value / BYTES_TO_GIB;
                            break;
                        case 'instant_restore_bytes_month':
                            aggregatedData[dateKey].storageHistory += m.value / BYTES_TO_GIB;
                            break;
                        case 'public_network_transfer_bytes':
                        case 'private_network_transfer_bytes':
                            aggregatedData[dateKey].dataTransfer += m.value / BYTES_TO_GIB;
                            break;
                        case 'extra_branches_month':
                            aggregatedData[dateKey].extraBranches += m.value;
                            break;
                    }
                });
            });
        });
    });

    return Object.values(aggregatedData).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
}
```

The code above exports two functions:

- **`getProjects`** fetches the list of projects in your organization using the [Neon Projects API](https://api-docs.neon.tech/reference/listprojects). This allows you to display project names in the UI and filter usage data by project.
- **`getNeonUsage`** fetches usage data from the Consumption API, transforms the nested response into a flat structure, and aggregates the metrics by day. When `projectIds` are provided, only consumption data for those projects is returned - the API's `project_ids` query parameter handles this server-side.

## Create a server action for filtering

The project filter needs to re-fetch usage data from the server whenever the user selects or deselects a project. Create a [Server Action](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) in `app/actions.ts` to handle this:

```typescript shouldWrap
'use server';

import { getNeonUsage, type DailyUsage } from '@/lib/neon-api';

export async function fetchUsageByProjects(projectIds: string[]): Promise<DailyUsage[]> {
    const orgId = process.env.NEXT_PUBLIC_ORG_ID;
    if (!orgId) throw new Error('NEXT_PUBLIC_ORG_ID is not defined');
    return getNeonUsage(orgId, projectIds.length > 0 ? projectIds : undefined);
}
```

This server action calls `getNeonUsage` with the selected project IDs. When the array is empty (no filter), it fetches usage for all projects.

## Create the dashboard component

Now that you have the data fetching logic and server action in place, you can create a dashboard component to visualize this data. The dashboard will consist of:

1.  **Project Filter:** A multi-select dropdown to scope usage data to specific projects.
2.  **Summary Cards:** To show total usage for the period.
3.  **Chart:** To visualize the daily compute trend.

Create `components/usage-dashboard.tsx`:

```tsx shouldWrap
'use client';

import { useState, useTransition } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { Database, HardDrive, Activity, Network, Check, ChevronsUpDown, Loader2 } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { DailyUsage, Project } from '@/lib/neon-api';
import { fetchUsageByProjects } from '@/app/actions';

interface UsageDashboardProps {
    data: DailyUsage[];
    projects: Project[];
}

export function UsageDashboard({ data: initialData, projects }: UsageDashboardProps) {
    const [data, setData] = useState(initialData);
    const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    function toggleProject(projectId: string) {
        const next = selectedProjects.includes(projectId)
            ? selectedProjects.filter((id) => id !== projectId)
            : [...selectedProjects, projectId];
        setSelectedProjects(next);

        startTransition(async () => {
            try {
                const result = await fetchUsageByProjects(next);
                setData(result);
            } catch (e) {
                console.error('Failed to fetch filtered usage:', e);
            }
        });
    }

    function clearFilter() {
        setSelectedProjects([]);
        startTransition(async () => {
            try {
                const result = await fetchUsageByProjects([]);
                setData(result);
            } catch (e) {
                console.error('Failed to fetch usage:', e);
            }
        });
    }

    const totals = data.reduce((acc, curr) => ({
        compute: acc.compute + curr.compute,
        storage: acc.storage + (curr.storageRoot + curr.storageChild + curr.storageHistory),
        transfer: acc.transfer + curr.dataTransfer,
        branches: Math.max(acc.branches, curr.extraBranches)
    }), { compute: 0, storage: 0, transfer: 0, branches: 0 });

    const computeHours = (totals.compute / 3600).toFixed(1);

    return (
        <div className="space-y-6">

            {/* 0. Project Filter */}
            <div className="relative inline-block">
                <button
                    onClick={() => setOpen(!open)}
                    className="inline-flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-gray-50"
                >
                    {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    {selectedProjects.length === 0
                        ? 'All Projects'
                        : `${selectedProjects.length} project${selectedProjects.length > 1 ? 's' : ''} selected`}
                    <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                </button>
                {open && (
                    <div className="absolute left-0 z-50 mt-1 w-72 rounded-md border bg-white shadow-lg">
                        <div className="max-h-60 overflow-y-auto p-1">
                            {projects.map((project) => {
                                const isSelected = selectedProjects.includes(project.id);
                                return (
                                    <button
                                        key={project.id}
                                        onClick={() => toggleProject(project.id)}
                                        className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-gray-100"
                                    >
                                        <span className={`flex h-4 w-4 items-center justify-center rounded-sm border ${isSelected ? 'bg-primary border-primary text-white' : ''}`}>
                                            {isSelected && <Check className="h-3 w-3" />}
                                        </span>
                                        <span className="truncate">{project.name}</span>
                                        <span className="ml-auto font-mono text-xs text-muted-foreground">{project.id.slice(0, 12)}</span>
                                    </button>
                                );
                            })}
                            {projects.length === 0 && (
                                <div className="px-2 py-4 text-center text-sm text-muted-foreground">No projects found</div>
                            )}
                        </div>
                        {selectedProjects.length > 0 && (
                            <div className="border-t p-1">
                                <button
                                    onClick={clearFilter}
                                    className="w-full rounded-sm px-2 py-1.5 text-sm text-muted-foreground hover:bg-gray-100"
                                >
                                    Clear filter
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 1. Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SummaryCard
                    title="Total Compute"
                    value={`${computeHours} hrs`}
                    description="Active compute time"
                    icon={<Activity className="h-4 w-4 text-muted-foreground" />}
                />
                <SummaryCard
                    title="Avg Storage"
                    value={`${(totals.storage / (data.length || 1)).toFixed(2)} GiB`}
                    description="Root + Child + History"
                    icon={<Database className="h-4 w-4 text-muted-foreground" />}
                />
                <SummaryCard
                    title="Data Transfer"
                    value={`${totals.transfer.toFixed(2)} GiB`}
                    description="Public + Private Egress"
                    icon={<Network className="h-4 w-4 text-muted-foreground" />}
                />
                <SummaryCard
                    title="Peak Extra Branches"
                    value={totals.branches.toString()}
                    description="Max concurrent extra branches"
                    icon={<HardDrive className="h-4 w-4 text-muted-foreground" />}
                />
            </div>

            {/* 2. Main Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Daily Compute Usage</CardTitle>
                    <CardDescription>
                        Compute unit seconds over the last 30 days
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                                    minTickGap={30}
                                    tick={{ fontSize: 12, fill: '#6b7280' }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f3f4f6' }}
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="rounded-lg border bg-white p-2 shadow-sm">
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="flex flex-col">
                                                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                                Date
                                                            </span>
                                                            <span className="font-bold text-muted-foreground">
                                                                {format(new Date(label), 'MMM dd')}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                                Compute
                                                            </span>
                                                            <span className="font-bold text-[#00e599]">
                                                                {Number(payload[0].value).toLocaleString()} sec
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar
                                    dataKey="compute"
                                    fill="#43a2fb"
                                    radius={[4, 4, 0, 0]}
                                    name="Compute Seconds"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function SummaryCard({ title, value, description, icon }: any) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    )
}
```

## Integrate the dashboard into the app

Update `app/page.tsx` to fetch the initial usage data and projects on the server, and render the `UsageDashboard` component:

```tsx shouldWrap
import { DailyUsage, getNeonUsage, getProjects, type Project } from '@/lib/neon-api';
import { UsageDashboard } from '@/components/usage-dashboard';

export default async function DashboardPage() {
  const orgId = process.env.NEXT_PUBLIC_ORG_ID;

  if (!orgId) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-800">
          <strong>Configuration Error:</strong> NEXT_PUBLIC_ORG_ID is not defined. Please set your Organization ID in the environment variables.
        </div>
      </div>
    );
  }

  let usageData: DailyUsage[] = [];
  let projects: Project[] = [];
  let error = null;

  try {
    [usageData, projects] = await Promise.all([
      getNeonUsage(orgId),
      getProjects(orgId),
    ]);
  } catch (e: any) {
    console.error("Failed to fetch neon usage:", e);
    error = e.message || "Unknown error occurred";
  }

  return (
    <main className="min-h-screen bg-gray-50/50 p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Neon Consumption</h1>
            <p className="text-muted-foreground mt-2">
              Usage for Organization <span className="font-mono text-xs bg-gray-200 px-1 py-0.5 rounded">{orgId}</span>
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            Granularity: <strong>Daily</strong>
          </div>
        </div>

        {error ? (
          <div className="rounded-lg border border-red-200 bg-white p-6 text-center text-red-600 shadow-sm">
            <p>Failed to load consumption data.</p>
            <p className="text-sm mt-2 opacity-80">{error}</p>
          </div>
        ) : (
          <>
            {usageData.length > 0 ? (
              <UsageDashboard data={usageData} projects={projects} />
            ) : (
              <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
                No consumption data found for the last 30 days.
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
```

## Run the application

1.  Start the Next.js development server:

    ```bash
    npm run dev
    ```

2.  Open `http://localhost:3000` in your browser to see your Neon usage dashboard in action.
    ![Example Neon Usage Dashboard Consumption API](/docs/guides/neon-usage-dashboard-consumption-api.png)

You should see a summary of your total compute time, average storage usage, data transfer, and peak extra branches, along with a bar chart showing your daily compute usage over the last month. Use the project filter dropdown to scope the dashboard to specific projects.

</Steps>

## Source code

The complete source code for this example is available on GitHub.

<DetailIconCards>
<a href="https://github.com/dhanushreddy291/neon-usage-dashboard" description="Neon Usage Dashboard Example Repository" icon="github">View on GitHub</a>
</DetailIconCards>

## Resources

- [Neon API Reference](https://api-docs.neon.tech/reference/getconsumptionhistoryperprojectv2)
- [Recharts Documentation](https://recharts.org/)
- [Shadcn/ui Components](https://ui.shadcn.com/)
- [Autoscaling in Neon](/docs/introduction/autoscaling)
