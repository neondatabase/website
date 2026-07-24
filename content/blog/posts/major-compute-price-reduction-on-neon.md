---
title: Major compute price reduction on Neon
description: Reducing cost of compute by 25% as we scale on Databricks
excerpt: >-
  Databases are often one of the biggest infrastructure expenses for any
  company. From day one, Neon’s mission has been to make databases radically
  more efficient through separation of storage and compute, allowing instant
  autoscaling and better unit economics. Now, with Neon runni...
date: '2025-11-03T19:23:07'
updatedOn: '2025-11-04T19:52:12'
category: company
categories:
  - company
authors:
  - nikita-shamgunov
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/major-compute-price-reduction-on-neon/social.jpg
  alt: null
isFeatured: false
seo:
  title: Major compute price reduction on Neon - Neon
  description: >-
    With Neon running on Databricks’ global infrastructure, we’ve taken another
    major step forward: compute on Neon is now up to 25% cheaper across all paid
    plans.
  keywords: []
  noindex: false
  ogTitle: Major compute price reduction on Neon - Neon
  ogDescription: >-
    With Neon running on Databricks’ global infrastructure, we’ve taken another
    major step forward: compute on Neon is now up to 25% cheaper across all paid
    plans.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/major-compute-price-reduction-on-neon/social.jpg
---

Databases are often one of the biggest infrastructure expenses for any company. From day one, Neon’s [mission](https://neon.com/blog/hello-world#:~:text=We%20realized%20that%20a%20modern%20Postgres%20service%20can%20be%20designed%20differently%20in%20order%20to%20be%20cheaper%20and%20more%20efficient%20in%20cloud%20environments%2C%20but%20it%20will%20require%20some%20real%20systems%20engineering.) has been to make databases radically more efficient through separation of storage and compute, allowing instant autoscaling and better unit economics.

Now, with Neon running on Databricks’ global infrastructure, we’ve taken another major step forward: compute on Neon is now up to 25% cheaper across plans.

## What’s Changing?

Starting today:

- **Launch Plan: $0.14 → $0.106 per CU-hour**
- **Scale Plan: $0.26 → $0.222 per CU-hour**

This continues a series of cost reductions since joining Databricks earlier this year:

- [August](https://neon.com/blog/new-usage-based-pricing): Minimum spend dropped to $5/mo and storage fell from $1.75 → $0.35 per GB-month.
- [September](https://neon.com/blog/why-we-no-longer-lock-premium-features): Enterprise features (Private Link, SLA, SOC 2, HIPAA, SSO, PITR) became part of the Scale Plan. No more $700/mo surcharge.
- [October](https://neon.com/docs/changelog/2025-09-19#free-plan-compute-hours-100): Free Plan compute doubled from 50 → 100 CU-hours.

With these changes, Neon now delivers the best price-performance ratio across every stage of development, from prototype (Free Plan) to production (Launch and Scale Plan).

## Real-world examples

The ownership costs of databases are notoriously difficult to compare because they are highly scenario dependent. It’s even more difficult to compare an autoscaling system like Neon (that can scale up to have larger resources and down to zero in hundreds of milliseconds) with fixed capacity databases.

In this section, we price a few real-world scenarios and compare Neon with two other popular database options on the market: Aurora Serverless v2, which has much slower autoscaling; and Supabase, which is fixed capacity.

**Scenario 1. Entry level database (0.25CU, 1GB, 9h/day usage)**: You are building an application that’s not high stakes and has relatively low usage. This database runs on the leanest compute resources available: 0.25 CU on Neon, Micro on Supabase, and 0.5 ACU on Aurora. Neon’s autoscaling capability can quickly scale the database down to zero when it’s inactive, and scale up in a few hundred milliseconds when load comes in. The cost of running this database on Neon is only $7.66/mo, less than half of Aurora Serverless and 30% of Supabase. In addition to the cost savings, you also get point-in-time recovery, snapshots, and data durability.

<div id="widget1-container">
  
  <div className="widget-wrapper">
    <div className="widget-header">
      <h3>Entry-Level Workload</h3>
      <p className="workload-description">Small, production-grade database for an internal app or side project.</p>
      <div className="view-toggle">
        <button className="view-toggle-btn active" data-view="chart">Chart</button>
        <button className="view-toggle-btn" data-view="panels">Details</button>
      </div>
    </div>

    <div className="panels-container">
      <div className="pricing-panel" data-provider="neon">
        <div className="panel-header">
          <h4>Neon</h4>
          <div className="badge best-price">Best Price</div>
          <div className="badge more-expensive"></div>
        </div>
        <div className="total-cost">
          <span className="currency">$</span>
          <span className="amount">0</span>
          <span className="period">/mo</span>
        </div>
        <div className="sparkline-container"></div>
        <div className="cost-breakdown">
          <div className="breakdown-section">
            <h5>Production</h5>
            <div className="breakdown-item">
              <span>Compute</span>
              <span className="value" data-field="prod-compute">$0</span>
            </div>
            <div className="calculation" data-field="prod-compute-calc"></div>
            <div className="breakdown-item">
              <span>Storage</span>
              <span className="value" data-field="prod-storage">$0</span>
            </div>
            <div className="calculation" data-field="prod-storage-calc"></div>
          </div>
          <div className="breakdown-section non-production-section">
            <h5>Non-Production</h5>
            <div className="breakdown-item">
              <span>Dev/Staging</span>
              <span className="value" data-field="non-prod">$0</span>
            </div>
            <div className="calculation" data-field="non-prod-calc"></div>
          </div>
          <div className="breakdown-section">
            <h5>Add-ons</h5>
            <div className="breakdown-item soc2-cost">
              <span>SOC2</span>
              <span className="value" data-field="soc2">$0</span>
            </div>
            <div className="calculation soc2-cost" data-field="soc2-calc"></div>
            <div className="breakdown-item hipaa-cost">
              <span>HIPAA</span>
              <span className="value" data-field="hipaa">$0</span>
            </div>
            <div className="calculation hipaa-cost" data-field="hipaa-calc"></div>
          </div>
        </div>
      </div>

      <div className="pricing-panel" data-provider="supabase">
        <div className="panel-header">
          <h4>Supabase</h4>
          <div className="badge best-price">Best Price</div>
          <div className="badge more-expensive"></div>
        </div>
        <div className="total-cost">
          <span className="currency">$</span>
          <span className="amount">0</span>
          <span className="period">/mo</span>
        </div>
        <div className="sparkline-container"></div>
        <div className="cost-breakdown">
          <div className="breakdown-section">
            <h5>Production</h5>
            <div className="breakdown-item">
              <span>Compute</span>
              <span className="value" data-field="prod-compute">$0</span>
            </div>
            <div className="calculation" data-field="prod-compute-calc"></div>
            <div className="breakdown-item">
              <span>Storage</span>
              <span className="value" data-field="prod-storage">$0</span>
            </div>
            <div className="calculation" data-field="prod-storage-calc"></div>
          </div>
          <div className="breakdown-section non-production-section">
            <h5>Non-Production</h5>
            <div className="breakdown-item">
              <span>Dev/Staging</span>
              <span className="value" data-field="non-prod">$0</span>
            </div>
            <div className="calculation" data-field="non-prod-calc"></div>
          </div>
          <div className="breakdown-section">
            <h5>Add-ons</h5>
            <div className="breakdown-item soc2-cost">
              <span>SOC2</span>
              <span className="value" data-field="soc2">$0</span>
            </div>
            <div className="calculation soc2-cost" data-field="soc2-calc"></div>
            <div className="breakdown-item hipaa-cost">
              <span>HIPAA</span>
              <span className="value" data-field="hipaa">$0</span>
            </div>
            <div className="calculation hipaa-cost" data-field="hipaa-calc"></div>
          </div>
        </div>
      </div>

      <div className="pricing-panel" data-provider="aurora">
        <div className="panel-header">
          <h4>Aurora Serverless</h4>
          <div className="badge best-price">Best Price</div>
          <div className="badge more-expensive"></div>
        </div>
        <div className="total-cost">
          <span className="currency">$</span>
          <span className="amount">0</span>
          <span className="period">/mo</span>
        </div>
        <div className="sparkline-container"></div>
        <div className="cost-breakdown">
          <div className="breakdown-section">
            <h5>Production</h5>
            <div className="breakdown-item">
              <span>Compute</span>
              <span className="value" data-field="prod-compute">$0</span>
            </div>
            <div className="calculation" data-field="prod-compute-calc"></div>
            <div className="breakdown-item">
              <span>Storage</span>
              <span className="value" data-field="prod-storage">$0</span>
            </div>
            <div className="calculation" data-field="prod-storage-calc"></div>
            <div className="breakdown-item io-cost">
              <span>I/O</span>
              <span className="value" data-field="io">$0</span>
            </div>
            <div className="calculation io-cost" data-field="io-calc"></div>
          </div>
          <div className="breakdown-section non-production-section">
            <h5>Non-Production</h5>
            <div className="breakdown-item">
              <span>Dev/Staging</span>
              <span className="value" data-field="non-prod">$0</span>
            </div>
            <div className="calculation" data-field="non-prod-calc"></div>
          </div>
          <div className="breakdown-section">
            <h5>Add-ons</h5>
            <div className="breakdown-item soc2-cost">
              <span>SOC2</span>
              <span className="value" data-field="soc2">$0</span>
            </div>
            <div className="calculation soc2-cost" data-field="soc2-calc"></div>
            <div className="breakdown-item hipaa-cost">
              <span>HIPAA</span>
              <span className="value" data-field="hipaa">$0</span>
            </div>
            <div className="calculation hipaa-cost" data-field="hipaa-calc"></div>
          </div>
        </div>
      </div>
    </div>

    <div className="chart-view">
      <div className="chart-content">
        <div className="chart-container">
          <svg className="bar-chart" viewBox="0 0 600 300"></svg>
        </div>
        <div className="workload-details-panel">
          <h4>Workload Details</h4>
          <p>Database needs minimal CPU and Memory, is only actively queried ~9hrs/day, and can run on smallest size on each platform: 0.25 CU on Neon, Micro on Supabase, and 0.5 ACU on Aurora.</p>
        </div>
      </div>
    </div>

    <div className="config-section">
      <div className="config-row">
        <div className="config-item">
          <label htmlFor="widget1-storage">Storage (GB)</label>
          <div className="config-values">
            <span className="config-value" id="widget1-storage-value">1 GB</span>
            <input type="range" id="widget1-storage" min="1" max="30" defaultValue="1" step="1" />
          </div>
        </div>

        <div className="config-item">
          <label htmlFor="widget1-scale-to-zero"><input type="checkbox" id="widget1-scale-to-zero" defaultChecked />Scale-to-zero enabled</label>
          <div className="config-help">Pause compute when inactive</div>
        </div>

        <div className="config-item">
          <label htmlFor="widget1-developers">Dev Branches</label>
          <div className="config-values">
            <span className="config-value" id="widget1-developers-value">0</span>
            <input type="range" id="widget1-developers" min="0" max="10" defaultValue="0" step="1" />
          </div>
        </div>

        <div className="config-item">
          <label htmlFor="widget1-soc2"><input type="checkbox" id="widget1-soc2" />SOC2</label>
        </div>

        <div className="config-item">
          <label htmlFor="widget1-hipaa"><input type="checkbox" id="widget1-hipaa" />HIPAA</label>
        </div>
      </div>
    </div>
  </div>

</div>
<link rel="stylesheet" href="data:text/css;base64,Kntib3gtc2l6aW5nOmJvcmRlci1ib3h9LndpZGdldC13cmFwcGVye2ZvbnQtZmFtaWx5Oi1hcHBsZS1zeXN0ZW0sQmxpbmtNYWNTeXN0ZW1Gb250LFNlZ29lIFVJLFJvYm90byxPeHlnZW4sVWJ1bnR1LENhbnRhcmVsbCxzYW5zLXNlcmlmO21heC13aWR0aDoxMjAwcHg7bWFyZ2luOjEwcHggYXV0bztwYWRkaW5nOjIwcHg7YmFja2dyb3VuZDojMWExYTFhO2JvcmRlcjoxcHggc29saWQgIzMzMzMzM30ud2lkZ2V0LWhlYWRlcnt0ZXh0LWFsaWduOmxlZnQ7bWFyZ2luLWJvdHRvbToyNHB4O3Bvc2l0aW9uOnJlbGF0aXZlfS53aWRnZXQtaGVhZGVyIGgze21hcmdpbjowIDAgNnB4O2ZvbnQtc2l6ZToxLjVyZW07Zm9udC13ZWlnaHQ6NjAwO2NvbG9yOiNmZmY7bGV0dGVyLXNwYWNpbmc6LS4wMmVtO3BhZGRpbmctcmlnaHQ6MTQwcHh9Lndvcmtsb2FkLWRlc2NyaXB0aW9ue21hcmdpbjowO2ZvbnQtc2l6ZTouODc1cmVtO2NvbG9yOiM5OTk7bGluZS1oZWlnaHQ6MS41O2ZvbnQtd2VpZ2h0OjQwMDtwYWRkaW5nLXJpZ2h0OjE0MHB4fS5wYW5lbHMtY29udGFpbmVye2Rpc3BsYXk6Z3JpZDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6cmVwZWF0KDMsMWZyKTtnYXA6MjBweDttYXJnaW4tYm90dG9tOjI0cHh9LnBhbmVscy1jb250YWluZXI+KnttaW4td2lkdGg6MH0ucHJpY2luZy1wYW5lbHtiYWNrZ3JvdW5kOiMyNTI1MjU7Ym9yZGVyOjFweCBzb2xpZCAjM2EzYTNhO3BhZGRpbmc6MThweDt0cmFuc2l0aW9uOm5vbmU7d2lkdGg6MTAwJX0ucHJpY2luZy1wYW5lbC5pcy1iZXN0LXByaWNle2JhY2tncm91bmQ6IzI1MjUyNTtib3JkZXItY29sb3I6I2ZmZjtib3JkZXItd2lkdGg6MnB4O3BhZGRpbmc6MTdweH0ucGFuZWwtaGVhZGVye2Rpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpiYXNlbGluZTttYXJnaW4tYm90dG9tOjhweDtwYWRkaW5nLWJvdHRvbTo4cHg7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgIzNhM2EzYX0ucHJpY2luZy1wYW5lbC5pcy1iZXN0LXByaWNlIC5wYW5lbC1oZWFkZXJ7Ym9yZGVyLWJvdHRvbS1jb2xvcjojZmZmfS5wYW5lbC1oZWFkZXIgaDR7bWFyZ2luOjA7Zm9udC1zaXplOjFyZW07Zm9udC13ZWlnaHQ6NjAwO2NvbG9yOiNmZmY7d2hpdGUtc3BhY2U6bm93cmFwO292ZXJmbG93OmhpZGRlbjt0ZXh0LW92ZXJmbG93OmVsbGlwc2lzO2xldHRlci1zcGFjaW5nOi0uMDFlbX0uYmFkZ2V7cGFkZGluZzoycHggNnB4O2ZvbnQtc2l6ZTouNjVyZW07Zm9udC13ZWlnaHQ6NjAwO3RleHQtdHJhbnNmb3JtOnVwcGVyY2FzZTtsZXR0ZXItc3BhY2luZzouMDNlbTt3aGl0ZS1zcGFjZTpub3dyYXA7Ym9yZGVyOjFweCBzb2xpZCAjZmZmZmZmfS5iYWRnZS5iZXN0LXByaWNle2JhY2tncm91bmQ6I2ZmZjtjb2xvcjojMDAwfS5iYWRnZS5tb3JlLWV4cGVuc2l2ZXtiYWNrZ3JvdW5kOnRyYW5zcGFyZW50O2NvbG9yOiM5OTk7Ym9yZGVyLWNvbG9yOiM1NTV9LnRvdGFsLWNvc3R7dGV4dC1hbGlnbjpsZWZ0O21hcmdpbjoxNnB4IDAgMTJweDtwYWRkaW5nOjhweCAwfS50b3RhbC1jb3N0IC5jdXJyZW5jeXtmb250LXNpemU6MS41cmVtO2ZvbnQtd2VpZ2h0OjQwMDtjb2xvcjojOTk5O3ZlcnRpY2FsLWFsaWduOnRvcDttYXJnaW4tcmlnaHQ6MnB4fS50b3RhbC1jb3N0IC5hbW91bnR7Zm9udC1zaXplOjMuNXJlbTtmb250LXdlaWdodDozMDA7Y29sb3I6I2ZmZjtsZXR0ZXItc3BhY2luZzotLjA0ZW07bGluZS1oZWlnaHQ6MX0udG90YWwtY29zdCAucGVyaW9ke2ZvbnQtc2l6ZToxLjEyNXJlbTtjb2xvcjojOTk5O2ZvbnQtd2VpZ2h0OjQwMDttYXJnaW4tbGVmdDoycHh9LnNwYXJrbGluZS1jb250YWluZXJ7bWFyZ2luOjEycHggYXV0byAxMHB4O2Rpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2FsaWduLWl0ZW1zOmNlbnRlcjtoZWlnaHQ6NDRweH0uc3BhcmtsaW5le2Rpc3BsYXk6YmxvY2s7d2lkdGg6MTAwJTttYXgtd2lkdGg6MjgwcHh9LmNvc3QtYnJlYWtkb3due21hcmdpbi10b3A6MTZweDtib3JkZXItdG9wOjFweCBzb2xpZCAjMzMzMzMzO3BhZGRpbmctdG9wOjEycHh9LmJyZWFrZG93bi1zZWN0aW9ue21hcmdpbi1ib3R0b206MTBweH0uYnJlYWtkb3duLXNlY3Rpb246bGFzdC1jaGlsZHttYXJnaW4tYm90dG9tOjB9LmJyZWFrZG93bi1zZWN0aW9uIGg1e2Rpc3BsYXk6bm9uZX0uYnJlYWtkb3duLWl0ZW17ZGlzcGxheTpmbGV4O2p1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2FsaWduLWl0ZW1zOmJhc2VsaW5lO3BhZGRpbmc6M3B4IDA7Zm9udC1zaXplOi44MTI1cmVtO2NvbG9yOiNmZmY7bGluZS1oZWlnaHQ6MS40fS5icmVha2Rvd24taXRlbSBzcGFuOmZpcnN0LWNoaWxke2NvbG9yOiM5OTk7Zm9udC13ZWlnaHQ6NDAwfS5icmVha2Rvd24taXRlbSAudmFsdWV7Zm9udC13ZWlnaHQ6NjAwO2NvbG9yOiNmZmY7Zm9udC12YXJpYW50LW51bWVyaWM6dGFidWxhci1udW1zO2xldHRlci1zcGFjaW5nOi0uMDFlbX0uY2FsY3VsYXRpb257Zm9udC1zaXplOi42ODc1cmVtO2NvbG9yOiM2NjY7cGFkZGluZzowIDAgOHB4O2ZvbnQtZmFtaWx5OlNGIE1vbm8sTW9uYWNvLENvbnNvbGFzLG1vbm9zcGFjZTtmb250LXN0eWxlOm5vcm1hbDtsaW5lLWhlaWdodDoxLjM7Zm9udC13ZWlnaHQ6NDAwfS5yZXNvdXJjZS1pdGVte3BhZGRpbmc6NHB4IDA7Zm9udC1zaXplOi44cmVtO2NvbG9yOiNjY2M7Zm9udC13ZWlnaHQ6NTAwfS5jb25maWctc2VjdGlvbntiYWNrZ3JvdW5kOiMxZjFmMWY7cGFkZGluZzoxNnB4O2JvcmRlcjoxcHggc29saWQgIzNhM2EzYTtib3JkZXItdG9wOjJweCBzb2xpZCAjNDQ0NDQ0fS5jb25maWctcm93e2Rpc3BsYXk6Z3JpZDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6cmVwZWF0KDUsMWZyKTtnYXA6MThweH0uY29uZmlnLWl0ZW17ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6NnB4fS5jb25maWctaXRlbSBsYWJlbHtmb250LXNpemU6LjgxMjVyZW07Zm9udC13ZWlnaHQ6NTAwO2NvbG9yOiM5OTk7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4fS5jb25maWctaXRlbSBpbnB1dFt0eXBlPXJhbmdlXXt3aWR0aDoxMDAlO2hlaWdodDozcHg7YmFja2dyb3VuZDojNDQ0O291dGxpbmU6bm9uZTstd2Via2l0LWFwcGVhcmFuY2U6bm9uZX0uY29uZmlnLWl0ZW0gaW5wdXRbdHlwZT1yYW5nZV06Oi13ZWJraXQtc2xpZGVyLXRodW1iey13ZWJraXQtYXBwZWFyYW5jZTpub25lOy1tb3otYXBwZWFyYW5jZTpub25lO2FwcGVhcmFuY2U6bm9uZTt3aWR0aDoxNHB4O2hlaWdodDoxNHB4O2JhY2tncm91bmQ6I2ZmZjtjdXJzb3I6cG9pbnRlcjtib3JkZXI6bm9uZX0uY29uZmlnLWl0ZW0gaW5wdXRbdHlwZT1yYW5nZV06Oi13ZWJraXQtc2xpZGVyLXRodW1iOmhvdmVye2JhY2tncm91bmQ6I2NjY30uY29uZmlnLWl0ZW0gaW5wdXRbdHlwZT1yYW5nZV06Oi1tb3otcmFuZ2UtdGh1bWJ7d2lkdGg6MTRweDtoZWlnaHQ6MTRweDtiYWNrZ3JvdW5kOiNmZmY7Y3Vyc29yOnBvaW50ZXI7Ym9yZGVyOm5vbmV9LmNvbmZpZy1pdGVtIGlucHV0W3R5cGU9cmFuZ2VdOjotbW96LXJhbmdlLXRodW1iOmhvdmVye2JhY2tncm91bmQ6I2NjY30uY29uZmlnLWl0ZW0gaW5wdXRbdHlwZT1jaGVja2JveF17d2lkdGg6MTRweDtoZWlnaHQ6MTRweDtjdXJzb3I6cG9pbnRlcjthY2NlbnQtY29sb3I6I2ZmZmZmZn0uY29uZmlnLXZhbHVle2ZvbnQtc2l6ZTouOTM3NXJlbTtmb250LXdlaWdodDo2MDA7Y29sb3I6I2ZmZjtmb250LXZhcmlhbnQtbnVtZXJpYzp0YWJ1bGFyLW51bXM7ZmxleC1zaHJpbms6MH0uY29uZmlnLWhlbHB7Zm9udC1zaXplOi42ODc1cmVtO2NvbG9yOiM2NjY7Zm9udC1zdHlsZTpub3JtYWw7Zm9udC13ZWlnaHQ6NDAwfUBtZWRpYSAobWF4LXdpZHRoOiAxMDI0cHgpey5wYW5lbHMtY29udGFpbmVye2dyaWQtdGVtcGxhdGUtY29sdW1uczoxZnI7Z2FwOjE2cHh9LmNvbmZpZy1yb3d7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOnJlcGVhdCgyLDFmcil9fUBtZWRpYSAobWF4LXdpZHRoOiA2NDBweCl7LndpZGdldC13cmFwcGVye3BhZGRpbmc6MTZweH0uY29uZmlnLXJvd3tncmlkLXRlbXBsYXRlLWNvbHVtbnM6MWZyfS53aWRnZXQtaGVhZGVyIGgze2ZvbnQtc2l6ZToxLjM3NXJlbX0udG90YWwtY29zdCAuYW1vdW50e2ZvbnQtc2l6ZToyLjc1cmVtfX0uY29uZmlnLXZhbHVlc3tkaXNwbGF5OmZsZXg7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHh9LnZpZXctdG9nZ2xle3Bvc2l0aW9uOmFic29sdXRlO3RvcDowO3JpZ2h0OjA7ZGlzcGxheTpmbGV4O2dhcDo0cHg7YmFja2dyb3VuZDojMjUyNTI1O3BhZGRpbmc6M3B4O2JvcmRlci1yYWRpdXM6NHB4O3dpZHRoOmZpdC1jb250ZW50fS52aWV3LXRvZ2dsZS1idG57YmFja2dyb3VuZDp0cmFuc3BhcmVudDtib3JkZXI6bm9uZTtjb2xvcjojOTRhM2I4O3BhZGRpbmc6NHB4IDEwcHg7Ym9yZGVyLXJhZGl1czozcHg7Zm9udC1zaXplOi43NXJlbTtmb250LXdlaWdodDo1MDA7Y3Vyc29yOnBvaW50ZXI7dHJhbnNpdGlvbjphbGwgLjJzfS52aWV3LXRvZ2dsZS1idG46aG92ZXJ7Y29sb3I6I2ZmZjtiYWNrZ3JvdW5kOiMzMzN9LnZpZXctdG9nZ2xlLWJ0bi5hY3RpdmV7YmFja2dyb3VuZDojM2EzYTNhO2NvbG9yOiNmZmZ9LmNoYXJ0LXZpZXd7bWFyZ2luLWJvdHRvbToyNHB4fS5jaGFydC1jb250ZW50e2Rpc3BsYXk6Z3JpZDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6MmZyIDFmcjtnYXA6MjBweDthbGlnbi1pdGVtczpzdGFydH0uY2hhcnQtY29udGFpbmVyLC53b3JrbG9hZC1kZXRhaWxzLXBhbmVse2JhY2tncm91bmQ6IzI1MjUyNTtib3JkZXI6MXB4IHNvbGlkICMzYTNhM2E7cGFkZGluZzoyMHB4fS53b3JrbG9hZC1kZXRhaWxzLXBhbmVsIGg0e21hcmdpbjowIDAgMTZweDtmb250LXNpemU6MS4xMjVyZW07Zm9udC13ZWlnaHQ6NjAwO2NvbG9yOiNmZmZ9Lndvcmtsb2FkLWRldGFpbHMtcGFuZWwgcHttYXJnaW46MDtmb250LXNpemU6LjgxMjVyZW07bGluZS1oZWlnaHQ6MS41O2NvbG9yOiNjY2N9LmJhci1jaGFydHt3aWR0aDoxMDAlO2hlaWdodDphdXRvO21heC13aWR0aDo2MDBweDttYXJnaW46MCBhdXRvO2Rpc3BsYXk6YmxvY2t9LmJhci1zZWdtZW50e2N1cnNvcjpwb2ludGVyO3RyYW5zaXRpb246b3BhY2l0eSAuMnN9LmJhci1zZWdtZW50OmhvdmVye29wYWNpdHk6LjghaW1wb3J0YW50fS5jaGFydC1kYXRhLXRhYmxle2Rpc3BsYXk6Z3JpZDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6cmVwZWF0KDMsMWZyKTtnYXA6MjBweH0udGFibGUtY29sdW1ue2JhY2tncm91bmQ6IzI1MjUyNTtib3JkZXI6MXB4IHNvbGlkICMzYTNhM2E7cGFkZGluZzoxOHB4fS50YWJsZS1jb2x1bW4gaDR7bWFyZ2luOjAgMCAxNnB4O2ZvbnQtc2l6ZToxLjEyNXJlbTtmb250LXdlaWdodDo2MDA7Y29sb3I6I2ZmZjtwYWRkaW5nLWJvdHRvbToxMnB4O2JvcmRlci1ib3R0b206MXB4IHNvbGlkICMzYTNhM2F9LnRhYmxlLXJvd3tkaXNwbGF5OmZsZXg7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6Y2VudGVyO3BhZGRpbmc6OHB4IDA7Zm9udC1zaXplOi44NzVyZW19LnRhYmxlLXJvdyAubGFiZWx7Y29sb3I6Izk0YTNiODtmb250LXdlaWdodDo0MDB9LnRhYmxlLXJvdyAudmFsdWV7Y29sb3I6I2ZmZjtmb250LXdlaWdodDo1MDB9LnRhYmxlLXJvdy50b3RhbHttYXJnaW4tdG9wOjhweDtwYWRkaW5nLXRvcDoxMnB4O2JvcmRlci10b3A6MXB4IHNvbGlkICMzYTNhM2E7Zm9udC13ZWlnaHQ6NjAwfS50YWJsZS1yb3cudG90YWwgLmxhYmVse2NvbG9yOiNmZmY7Zm9udC13ZWlnaHQ6NjAwfS50YWJsZS1yb3cudG90YWwgLnZhbHVle2ZvbnQtc2l6ZToxLjEyNXJlbTtjb2xvcjojMDBlNWEwfUBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCl7LmNoYXJ0LWNvbnRlbnR7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOjFmcn19CgoucGFuZWxzLWNvbnRhaW5lciwuYmFkZ2UsLnNvYzItY29zdCxbZGF0YS1maWVsZD0ic29jMi1jYWxjIl0sLmhpcGFhLWNvc3QsW2RhdGEtZmllbGQ9ImhpcGFhLWNhbGMiXSwuaW8tY29zdCxbZGF0YS1maWVsZD0iaW8tY2FsYyJde2Rpc3BsYXk6bm9uZX0=" />
<script src="data:text/javascript;base64,KGZ1bmN0aW9uKCl7Y29uc3Qgbz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KCJsaW5rIikucmVsTGlzdDtpZihvJiZvLnN1cHBvcnRzJiZvLnN1cHBvcnRzKCJtb2R1bGVwcmVsb2FkIikpcmV0dXJuO2Zvcihjb25zdCBTIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpbmtbcmVsPSJtb2R1bGVwcmVsb2FkIl0nKSl4KFMpO25ldyBNdXRhdGlvbk9ic2VydmVyKFM9Pntmb3IoY29uc3QgUCBvZiBTKWlmKFAudHlwZT09PSJjaGlsZExpc3QiKWZvcihjb25zdCBNIG9mIFAuYWRkZWROb2RlcylNLnRhZ05hbWU9PT0iTElOSyImJk0ucmVsPT09Im1vZHVsZXByZWxvYWQiJiZ4KE0pfSkub2JzZXJ2ZShkb2N1bWVudCx7Y2hpbGRMaXN0OiEwLHN1YnRyZWU6ITB9KTtmdW5jdGlvbiBCKFMpe2NvbnN0IFA9e307cmV0dXJuIFMuaW50ZWdyaXR5JiYoUC5pbnRlZ3JpdHk9Uy5pbnRlZ3JpdHkpLFMucmVmZXJyZXJQb2xpY3kmJihQLnJlZmVycmVyUG9saWN5PVMucmVmZXJyZXJQb2xpY3kpLFMuY3Jvc3NPcmlnaW49PT0idXNlLWNyZWRlbnRpYWxzIj9QLmNyZWRlbnRpYWxzPSJpbmNsdWRlIjpTLmNyb3NzT3JpZ2luPT09ImFub255bW91cyI/UC5jcmVkZW50aWFscz0ib21pdCI6UC5jcmVkZW50aWFscz0ic2FtZS1vcmlnaW4iLFB9ZnVuY3Rpb24geChTKXtpZihTLmVwKXJldHVybjtTLmVwPSEwO2NvbnN0IFA9QihTKTtmZXRjaChTLmhyZWYsUCl9fSkoKTsoZnVuY3Rpb24oKXtjb25zdCBnPXtuZW9uOntjb21wdXRlUGVyQ1VIb3VyOi4xMDYsc3RvcmFnZVBlckdCTW9udGg6LjM1LHNjYWxlQ29tcHV0ZVBlckNVSG91cjouMjIyfSxzdXBhYmFzZTp7cHJvQmFzZUNvc3Q6MjUsY29tcHV0ZUNyZWRpdDoxMCxtaWNyb0NvbXB1dGVQZXJNb250aDoxMCxzdG9yYWdlUGVyR0JNb250aDouMTI1fSxhdXJvcmE6e2FjdVBlckhvdXI6LjEyLHN0b3JhZ2VQZXJHQk1vbnRoOi4xfX07bGV0IG89e3N0b3JhZ2U6MSxzY2FsZVRvWmVybzohMCxkZXZlbG9wZXJzOjAsc29jMjohMSxoaXBhYTohMX07ZnVuY3Rpb24gQih4KXtjb25zdCBTPXgucXVlcnlTZWxlY3RvcigiI3dpZGdldDEtc3RvcmFnZSIpLFA9eC5xdWVyeVNlbGVjdG9yKCIjd2lkZ2V0MS1zdG9yYWdlLXZhbHVlIiksTT14LnF1ZXJ5U2VsZWN0b3IoIiN3aWRnZXQxLXNjYWxlLXRvLXplcm8iKSxXPXgucXVlcnlTZWxlY3RvcigiI3dpZGdldDEtZGV2ZWxvcGVycyIpLE49eC5xdWVyeVNlbGVjdG9yKCIjd2lkZ2V0MS1kZXZlbG9wZXJzLXZhbHVlIiksVj14LnF1ZXJ5U2VsZWN0b3IoIiN3aWRnZXQxLXNvYzIiKSxZPXgucXVlcnlTZWxlY3RvcigiI3dpZGdldDEtaGlwYWEiKTtmdW5jdGlvbiBHKCl7Y29uc3Qgbj1vLnNvYzJ8fG8uaGlwYWEsYz1uP2cubmVvbi5zY2FsZUNvbXB1dGVQZXJDVUhvdXI6Zy5uZW9uLmNvbXB1dGVQZXJDVUhvdXI7bGV0IGk7by5zY2FsZVRvWmVybz9pPTI3NiouMjUrMjc2KjArMTk4KjA6aT0yNzYqLjI1KzI3NiouMjUrMTk4Ki4yNTtjb25zdCByPWkqYyx1PW8uc3RvcmFnZSpnLm5lb24uc3RvcmFnZVBlckdCTW9udGgscz0xODIuNSxmPS4yNSxoPW8uZGV2ZWxvcGVycypzKmYqYywkPTAsbT1vLmhpcGFhPyhyK3UraCkqLjE1OjAsYT1vLnNjYWxlVG9aZXJvPzI3Njo3NTA7cmV0dXJue3Byb2RDb21wdXRlOnIscHJvZFN0b3JhZ2U6dSxub25Qcm9kOmgsc29jMjokLGhpcGFhOm0sdG90YWw6cit1K2grJCttLGNhbGN1bGF0aW9uczp7cHJvZENvbXB1dGU6YCQke2MudG9GaXhlZCgzKX0vQ1UtaG91ciDDlyAke2kudG9GaXhlZCgwKX0gQ1UtaG91cnMgKCR7YX0gaG91cnMgw5cgJHsuMjV9IENVJHtuPyIgb24gU2NhbGUiOiIifSlgLHByb2RTdG9yYWdlOmAkJHtnLm5lb24uc3RvcmFnZVBlckdCTW9udGgudG9GaXhlZCgyKX0vR0ItbW9udGggw5cgJHtvLnN0b3JhZ2V9IEdCYCxub25Qcm9kOmAke3N9aHJzIMOXICR7Zn0gQ1Ugw5cgJCR7Yy50b0ZpeGVkKDMpfS9DVS1ob3VyIMOXICR7by5kZXZlbG9wZXJzfSBkZXZlbG9wZXJzYCxoaXBhYTpvLmhpcGFhP2AxNSUgb2Ygc3VidG90YWwgKCQkeyhyK3UraCkudG9GaXhlZCgyKX0pYDoiIn0sbG9hZFBhdHRlcm46e21pbkNVOjAsbWF4Q1U6LjI1LHNjYWxlVG9aZXJvOm8uc2NhbGVUb1plcm8scGxhdGZvcm1NaW46LjI1LGluY3JlbWVudDouMjV9fX1mdW5jdGlvbiBFKCl7bGV0IGU9by5zb2MyfHxvLmhpcGFhPzU5OTpnLnN1cGFiYXNlLnByb0Jhc2VDb3N0O2NvbnN0IGw9ZStNYXRoLm1heCgwLGcuc3VwYWJhc2UubWljcm9Db21wdXRlUGVyTW9udGgtZy5zdXBhYmFzZS5jb21wdXRlQ3JlZGl0KSxuPU1hdGgubWF4KDAsby5zdG9yYWdlLTgpKmcuc3VwYWJhc2Uuc3RvcmFnZVBlckdCTW9udGgsYz0xMCxpPW8uc3RvcmFnZSpnLnN1cGFiYXNlLnN0b3JhZ2VQZXJHQk1vbnRoLHI9by5kZXZlbG9wZXJzKihjK2kpLHU9MCxzPW8uaGlwYWE/MjAwOjA7cmV0dXJue3Byb2RDb21wdXRlOmwscHJvZFN0b3JhZ2U6bixub25Qcm9kOnIsc29jMjp1LGhpcGFhOnMsdG90YWw6bCtuK3IrdStzLGNhbGN1bGF0aW9uczp7cHJvZENvbXB1dGU6YCQke2V9L21vbnRoIGJhc2UgKyAkJHtnLnN1cGFiYXNlLm1pY3JvQ29tcHV0ZVBlck1vbnRofS9tb250aCAoTWljcm8pIC0gJCR7Zy5zdXBhYmFzZS5jb21wdXRlQ3JlZGl0fSBjcmVkaXRgLHByb2RTdG9yYWdlOm8uc3RvcmFnZT44P2AkJHtnLnN1cGFiYXNlLnN0b3JhZ2VQZXJHQk1vbnRoLnRvRml4ZWQoMyl9L0dCLW1vbnRoIMOXICR7by5zdG9yYWdlLTh9IEdCYDoiOCBHQiBpbmNsdWRlZCIsbm9uUHJvZDpgKCQke2N9IGNvbXB1dGUgKyAke28uc3RvcmFnZX0gR0Igw5cgJCR7Zy5zdXBhYmFzZS5zdG9yYWdlUGVyR0JNb250aC50b0ZpeGVkKDMpfS9HQikgw5cgJHtvLmRldmVsb3BlcnN9IGRldmVsb3BlcnNgLHNvYzI6by5zb2MyPyJJbmNsdWRlZCBpbiBCdXNpbmVzcyB0aWVyIjoiIixoaXBhYTpvLmhpcGFhPyJISVBBQSBzdXJjaGFyZ2UgKCQyMDAvbW9udGgpIjoiIn0sbG9hZFBhdHRlcm46e21pbkNVOjAsbWF4Q1U6LjI1LHNjYWxlVG9aZXJvOm8uc2NhbGVUb1plcm8scGxhdGZvcm1NaW46LjI1LGlzUHJvdmlzaW9uZWQ6ITAsaW5jcmVtZW50Oi4yNX19fWZ1bmN0aW9uIEwoKXtsZXQgbDtvLnNjYWxlVG9aZXJvP2w9Mjc2Ki41KzI3NiowKzE5OCowOmw9Mjc2Ki41KzI3NiouNSsxOTgqLjU7Y29uc3Qgbj1sKmcuYXVyb3JhLmFjdVBlckhvdXIsYz1vLnNjYWxlVG9aZXJvPzI3Njo3NTAsaT0uNSxyPW8uc3RvcmFnZSpnLmF1cm9yYS5zdG9yYWdlUGVyR0JNb250aCx1PTAscz0xODIuNSxmPS41LGg9cypmKmcuYXVyb3JhLmFjdVBlckhvdXIsJD1vLnN0b3JhZ2UqZy5hdXJvcmEuc3RvcmFnZVBlckdCTW9udGgsbT1vLmRldmVsb3BlcnMqKGgrJCksYT0wLHA9MDtyZXR1cm57cHJvZENvbXB1dGU6bixwcm9kU3RvcmFnZTpyLGlvOnUsbm9uUHJvZDptLHNvYzI6YSxoaXBhYTpwLHRvdGFsOm4rcit1K20rYStwLGNhbGN1bGF0aW9uczp7cHJvZENvbXB1dGU6YCQke2cuYXVyb3JhLmFjdVBlckhvdXIudG9GaXhlZCgyKX0vQUNVLWhvdXIgw5cgJHtsLnRvRml4ZWQoMCl9IEFDVS1ob3VycyAoJHtjfSBob3VycyDDlyAke2l9IEFDVSlgLHByb2RTdG9yYWdlOmAkJHtnLmF1cm9yYS5zdG9yYWdlUGVyR0JNb250aC50b0ZpeGVkKDIpfS9HQi1tb250aCDDlyAke28uc3RvcmFnZX0gR0IgKFN0YW5kYXJkKWAsaW86IkluY2x1ZGVkIGluIHN0b3JhZ2UiLG5vblByb2Q6YCgoJHtzfWhycyDDlyAke2Z9IEFDVSDDlyAkJHtnLmF1cm9yYS5hY3VQZXJIb3VyLnRvRml4ZWQoMil9L0FDVS1ob3VyKSArICgke28uc3RvcmFnZX0gR0Igw5cgJCR7Zy5hdXJvcmEuc3RvcmFnZVBlckdCTW9udGgudG9GaXhlZCgyKX0vR0IpKSDDlyAke28uZGV2ZWxvcGVyc30gZGV2ZWxvcGVyc2B9LGxvYWRQYXR0ZXJuOnttaW5DVTowLG1heENVOi4yNSxzY2FsZVRvWmVybzpvLnNjYWxlVG9aZXJvLHBsYXRmb3JtTWluOi4yNSxpc1Byb3Zpc2lvbmVkOiExLGluY3JlbWVudDouMjV9fX1mdW5jdGlvbiBBKHQsZT0uMjUpe3JldHVybiBNYXRoLmNlaWwodC9lKSplfWZ1bmN0aW9uIFUodCl7cmV0dXJuIHQ+PTEwMD90LnRvRml4ZWQoMCk6dC50b0ZpeGVkKDIpfWZ1bmN0aW9uIGsodCl7Y29uc3QgZT1bXSxjPXQuZGlzcGxheVNjYWxlfHwxO2ZvcihsZXQgaT0wO2k8NTY7aSsrKXtjb25zdCByPWkqMyx1PU1hdGguZmxvb3Ioci8yNCkscz1yJTI0LGY9dT49NSxoPXM+PTkmJnM8MjE7bGV0ICQ7Zj8kPWg/dC5tYXhDVS8yOnQubWluQ1UvMjokPWg/dC5tYXhDVTp0Lm1pbkNVO2xldCBtO2lmKHQuaXNQcm92aXNpb25lZCltPXQubWF4Q1UqMS4yNTtlbHNle2NvbnN0IGE9dC5pbmNyZW1lbnR8fC4yNTtpZih0LnNjYWxlVG9aZXJvKW09JD4wP0EoJCxhKSsuMTowO2Vsc2V7Y29uc3QgcD1BKCQsYSk7bT1NYXRoLm1heChwLHQucGxhdGZvcm1NaW4pKy4xfX1lLnB1c2goe3g6aSxsb2FkOiQqYyxwcm92aXNpb25lZDptKmN9KX1yZXR1cm4gZX1mdW5jdGlvbiBqKHQsZSxsPW51bGwpe2NvbnN0IHM9bCE9PW51bGw/bDpNYXRoLm1heCguLi5lLm1hcCh2PT5NYXRoLm1heCh2LmxvYWQsdi5wcm92aXNpb25lZCkpKSxmPVsiTSIsIlQiLCJXIiwiVCIsIkYiLCJTIiwiUyJdLGg9KDI4MC0yKjIpLyhlLmxlbmd0aC0xKSwkPWUubGVuZ3RoLzcsbT1mLm1hcCgodixiKT0+YDx0ZXh0IHg9IiR7MitiKiQqaCskKmgvMn0iIHk9IjQ4IiBmb250LXNpemU9IjgiIGZpbGw9IiM2NDc0OGIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPiR7dn08L3RleHQ+YCkuam9pbigiIiksYT1lW2UubGVuZ3RoLTFdLHA9MisoZS5sZW5ndGgtMSkqaCxDPSgzOC0yKjIpL3MscT0zNi1hLmxvYWQqQzszNi1hLnByb3Zpc2lvbmVkKkM7Y29uc3QgeT1gCiAgICA8c3ZnIHdpZHRoPSIzMTIiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCAzMTIgNTAiIGNsYXNzPSJzcGFya2xpbmUiPgogICAgICA8ZGVmcz4KICAgICAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImxvYWRHcmFkaWVudC0ke3QuZGF0YXNldC5wcm92aWRlcn0iIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMCUiIHkyPSIxMDAlIj4KICAgICAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMzYjgyZjY7c3RvcC1vcGFjaXR5OjAuMyIgLz4KICAgICAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzNiODJmNjtzdG9wLW9wYWNpdHk6MC4wNSIgLz4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgICA8L2RlZnM+CiAgICAgICR7SShlLCJsb2FkIiwyODAsMzgsMixzLCEwKX0KICAgICAgJHtJKGUsInByb3Zpc2lvbmVkIiwyODAsMzgsMixzLCExKX0KICAgICAgJHttfQogICAgICA8dGV4dCB4PSIke3ArNH0iIHk9IiR7cS0xfSIgZm9udC1zaXplPSI4IiBmaWxsPSIjM2I4MmY2IiBmb250LXdlaWdodD0iNTAwIj5sb2FkPC90ZXh0PgogICAgICA8dGV4dCB4PSIke3AtNH0iIHk9IjUiIGZvbnQtc2l6ZT0iOCIgZmlsbD0iIzk0YTNiOCIgZm9udC13ZWlnaHQ9IjUwMCI+Y2FwYWNpdHk8L3RleHQ+CiAgICA8L3N2Zz4KICBgO3QuaW5uZXJIVE1MPXl9ZnVuY3Rpb24gSSh0LGUsbCxuLGMsaSxyKXtjb25zdCB1PShsLWMqMikvKHQubGVuZ3RoLTEpLHM9KG4tYyoyKS9pO2xldCBmPSIiO2lmKHQuZm9yRWFjaCgoaCwkKT0+e2NvbnN0IG09YyskKnUsYT1uLWMtaFtlXSpzO2YrPSQ9PT0wP2BNICR7bX0sJHthfWA6YCBMICR7bX0sJHthfWB9KSxyKXtjb25zdCBoPWMrKHQubGVuZ3RoLTEpKnU7cmV0dXJuIGYrPWAgTCAke2h9LCR7bi1jfSBMICR7Y30sJHtuLWN9IFpgLGA8cGF0aCBkPSIke2Z9IiBmaWxsPSJ1cmwoI2xvYWRHcmFkaWVudC0ke3RbMF0ucHJvdmlkZXJ8fCJkZWZhdWx0In0pIiBzdHJva2U9IiMzYjgyZjYiIHN0cm9rZS13aWR0aD0iMS41IiAvPmB9ZWxzZSByZXR1cm5gPHBhdGggZD0iJHtmfSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTRhM2I4IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWRhc2hhcnJheT0iMywzIiAvPmB9ZnVuY3Rpb24gSCh0LGUsbD1udWxsKXt2YXIgdSxzLGYsaCwkLG07Y29uc3Qgbj14LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXByb3ZpZGVyPSIke3R9Il1gKTtpZihuLnF1ZXJ5U2VsZWN0b3IoIi5hbW91bnQiKS50ZXh0Q29udGVudD1VKGUudG90YWwpLGUubG9hZFBhdHRlcm4pe2NvbnN0IGE9bi5xdWVyeVNlbGVjdG9yKCIuc3BhcmtsaW5lLWNvbnRhaW5lciIpO2lmKGEpe2EuZGF0YXNldC5wcm92aWRlcj10O2NvbnN0IHA9ayhlLmxvYWRQYXR0ZXJuKTtwLmZvckVhY2goQz0+Qy5wcm92aWRlcj10KSxqKGEscCxsKX19aWYoZS5wcm9kQ29tcHV0ZSE9PXZvaWQgMCl7bi5xdWVyeVNlbGVjdG9yKCdbZGF0YS1maWVsZD0icHJvZC1jb21wdXRlIl0nKS50ZXh0Q29udGVudD1gJCR7VShlLnByb2RDb21wdXRlKX1gO2NvbnN0IGE9bi5xdWVyeVNlbGVjdG9yKCdbZGF0YS1maWVsZD0icHJvZC1jb21wdXRlLWNhbGMiXScpO2EmJigodT1lLmNhbGN1bGF0aW9ucykhPW51bGwmJnUucHJvZENvbXB1dGUpJiYoYS50ZXh0Q29udGVudD1lLmNhbGN1bGF0aW9ucy5wcm9kQ29tcHV0ZSl9aWYoZS5wcm9kU3RvcmFnZSE9PXZvaWQgMCl7bi5xdWVyeVNlbGVjdG9yKCdbZGF0YS1maWVsZD0icHJvZC1zdG9yYWdlIl0nKS50ZXh0Q29udGVudD1gJCR7VShlLnByb2RTdG9yYWdlKX1gO2NvbnN0IGE9bi5xdWVyeVNlbGVjdG9yKCdbZGF0YS1maWVsZD0icHJvZC1zdG9yYWdlLWNhbGMiXScpO2EmJigocz1lLmNhbGN1bGF0aW9ucykhPW51bGwmJnMucHJvZFN0b3JhZ2UpJiYoYS50ZXh0Q29udGVudD1lLmNhbGN1bGF0aW9ucy5wcm9kU3RvcmFnZSl9aWYoZS5ub25Qcm9kIT09dm9pZCAwKXtuLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWZpZWxkPSJub24tcHJvZCJdJykudGV4dENvbnRlbnQ9YCQke1UoZS5ub25Qcm9kKX1gO2NvbnN0IGE9bi5xdWVyeVNlbGVjdG9yKCdbZGF0YS1maWVsZD0ibm9uLXByb2QtY2FsYyJdJyk7YSYmKChmPWUuY2FsY3VsYXRpb25zKSE9bnVsbCYmZi5ub25Qcm9kKSYmKGEudGV4dENvbnRlbnQ9ZS5jYWxjdWxhdGlvbnMubm9uUHJvZCl9aWYoZS5pbyE9PXZvaWQgMCl7Y29uc3QgYT1uLnF1ZXJ5U2VsZWN0b3JBbGwoIi5pby1jb3N0Iik7aWYoZS5pbz09PTApYS5mb3JFYWNoKHA9PnAuc3R5bGUuZGlzcGxheT0ibm9uZSIpO2Vsc2V7YS5mb3JFYWNoKEM9PkMuc3R5bGUuZGlzcGxheT0iIiksbi5xdWVyeVNlbGVjdG9yKCdbZGF0YS1maWVsZD0iaW8iXScpLnRleHRDb250ZW50PWAkJHtVKGUuaW8pfWA7Y29uc3QgcD1uLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWZpZWxkPSJpby1jYWxjIl0nKTtwJiYoKGg9ZS5jYWxjdWxhdGlvbnMpIT1udWxsJiZoLmlvKSYmKHAudGV4dENvbnRlbnQ9ZS5jYWxjdWxhdGlvbnMuaW8pfX1jb25zdCBjPW4ucXVlcnlTZWxlY3RvcigiLm5vbi1wcm9kdWN0aW9uLXNlY3Rpb24iKTtjJiYoYy5zdHlsZS5kaXNwbGF5PW8uZGV2ZWxvcGVycz09PTA/Im5vbmUiOiIiKTtjb25zdCBpPW4ucXVlcnlTZWxlY3RvcigiLnNvYzItY29zdCIpO2lmKGkpaWYoby5zb2MyKWlmKGkuc3R5bGUuZGlzcGxheT0iZmxleCIsZS5zb2MyPjApe2kucXVlcnlTZWxlY3RvcignW2RhdGEtZmllbGQ9InNvYzIiXScpLnRleHRDb250ZW50PWAkJHtVKGUuc29jMil9YDtjb25zdCBhPWkucXVlcnlTZWxlY3RvcignW2RhdGEtZmllbGQ9InNvYzItY2FsYyJdJyk7YSYmKCgkPWUuY2FsY3VsYXRpb25zKSE9bnVsbCYmJC5zb2MyKSYmKGEudGV4dENvbnRlbnQ9ZS5jYWxjdWxhdGlvbnMuc29jMil9ZWxzZXtpLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWZpZWxkPSJzb2MyIl0nKS50ZXh0Q29udGVudD0iSW5jbHVkZWQiO2NvbnN0IGE9aS5xdWVyeVNlbGVjdG9yKCdbZGF0YS1maWVsZD0ic29jMi1jYWxjIl0nKTthJiYoYS50ZXh0Q29udGVudD0iIil9ZWxzZSBpLnN0eWxlLmRpc3BsYXk9Im5vbmUiO2NvbnN0IHI9bi5xdWVyeVNlbGVjdG9yKCIuaGlwYWEtY29zdCIpO2lmKHIpaWYoby5oaXBhYSlpZihyLnN0eWxlLmRpc3BsYXk9ImZsZXgiLGUuaGlwYWE+MCl7ci5xdWVyeVNlbGVjdG9yKCdbZGF0YS1maWVsZD0iaGlwYWEiXScpLnRleHRDb250ZW50PWAkJHtVKGUuaGlwYWEpfWA7Y29uc3QgYT1yLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWZpZWxkPSJoaXBhYS1jYWxjIl0nKTthJiYoKG09ZS5jYWxjdWxhdGlvbnMpIT1udWxsJiZtLmhpcGFhKSYmKGEudGV4dENvbnRlbnQ9ZS5jYWxjdWxhdGlvbnMuaGlwYWEpfWVsc2V7ci5xdWVyeVNlbGVjdG9yKCdbZGF0YS1maWVsZD0iaGlwYWEiXScpLnRleHRDb250ZW50PSJJbmNsdWRlZCI7Y29uc3QgYT1yLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWZpZWxkPSJoaXBhYS1jYWxjIl0nKTthJiYoYS50ZXh0Q29udGVudD0iIil9ZWxzZSByLnN0eWxlLmRpc3BsYXk9Im5vbmUifWZ1bmN0aW9uIFIodCl7Y29uc3QgZT1bIm5lb24iLCJzdXBhYmFzZSIsImF1cm9yYSJdLGw9TWF0aC5taW4oLi4uT2JqZWN0LnZhbHVlcyh0KSk7ZS5mb3JFYWNoKG49Pntjb25zdCBjPXgucXVlcnlTZWxlY3RvcihgW2RhdGEtcHJvdmlkZXI9IiR7bn0iXWApLGk9Yy5xdWVyeVNlbGVjdG9yKCIuYmVzdC1wcmljZSIpLHI9Yy5xdWVyeVNlbGVjdG9yKCIubW9yZS1leHBlbnNpdmUiKTtpZih0W25dPT09bClpLnN0eWxlLmRpc3BsYXk9ImlubGluZS1ibG9jayIsci5zdHlsZS5kaXNwbGF5PSJub25lIixjLmNsYXNzTGlzdC5hZGQoImlzLWJlc3QtcHJpY2UiKTtlbHNle2kuc3R5bGUuZGlzcGxheT0ibm9uZSI7Y29uc3QgdT10W25dL2wscz11JTE9PT0wP3UudG9GaXhlZCgwKTp1LnRvRml4ZWQoMSk7ci50ZXh0Q29udGVudD1gJHtzfXggcHJpY2VgLHIuc3R5bGUuZGlzcGxheT0iaW5saW5lLWJsb2NrIixjLmNsYXNzTGlzdC5yZW1vdmUoImlzLWJlc3QtcHJpY2UiKX19KX1mdW5jdGlvbiB3KCl7Y29uc3QgdD1HKCksZT1FKCksbD1MKCksbj1rKHQubG9hZFBhdHRlcm4pLGM9ayhlLmxvYWRQYXR0ZXJuKSxpPWsobC5sb2FkUGF0dGVybikscj1bLi4ubiwuLi5jLC4uLmldLHU9TWF0aC5tYXgoLi4uci5tYXAoZj0+TWF0aC5tYXgoZi5sb2FkLGYucHJvdmlzaW9uZWQpKSk7SCgibmVvbiIsdCx1KSxIKCJzdXBhYmFzZSIsZSx1KSxIKCJhdXJvcmEiLGwsdSksUih7bmVvbjp0LnRvdGFsLHN1cGFiYXNlOmUudG90YWwsYXVyb3JhOmwudG90YWx9KTtjb25zdCBzPXgucXVlcnlTZWxlY3RvcigiLmNoYXJ0LXZpZXciKTtzJiZzLnN0eWxlLmRpc3BsYXkhPT0ibm9uZSImJlQodCxlLGwpfWZ1bmN0aW9uIFQodCxlLGwpe2NvbnN0IG49eC5xdWVyeVNlbGVjdG9yKCIuYmFyLWNoYXJ0Iik7aWYoIW4pcmV0dXJuO2NvbnN0IGM9NjAwLGk9MzAwLHI9e3RvcDo0MCxyaWdodDoyMCxib3R0b206NjAsbGVmdDo2MH0sdT1jLXIubGVmdC1yLnJpZ2h0LHM9aS1yLnRvcC1yLmJvdHRvbSxmPVt7bmFtZToiTmVvbiIscHJpY2luZzp0LGNvbG9yOiIjMDRlNTliIn0se25hbWU6IlN1cGFiYXNlIixwcmljaW5nOmUsY29sb3I6IiNhZWUxZWIifSx7bmFtZToiQXVyb3JhIFNlcnZlcmxlc3MgVjIiLHByaWNpbmc6bCxjb2xvcjoiI2YxZjA3NiJ9XSxoPU1hdGgubWF4KHQudG90YWwsZS50b3RhbCxsLnRvdGFsKSoxLjEsJD11L2YubGVuZ3RoLzEuNSxtPXUvZi5sZW5ndGg7bGV0IGE9YAogICAgPGRlZnM+CiAgICAgICR7Zi5tYXAoKHAsQyk9PmAKICAgICAgICA8cGF0dGVybiBpZD0icGF0dGVybi1zb2xpZC0ke0N9IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgICAgIDxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiR7cC5jb2xvcn0iLz4KICAgICAgICA8L3BhdHRlcm4+CiAgICAgICAgPHBhdHRlcm4gaWQ9InBhdHRlcm4tZGlhZ29uYWwtJHtDfSIgd2lkdGg9IjgiIGhlaWdodD0iOCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+CiAgICAgICAgICA8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI4IiBmaWxsPSIke3AuY29sb3J9Ii8+CiAgICAgICAgPC9wYXR0ZXJuPgogICAgICAgIDxwYXR0ZXJuIGlkPSJwYXR0ZXJuLWRvdHMtJHtDfSIgd2lkdGg9IjgiIGhlaWdodD0iOCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgICAgICA8Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMS41IiBmaWxsPSIke3AuY29sb3J9Ii8+CiAgICAgICAgICA8Y2lyY2xlIGN4PSI2IiBjeT0iNiIgcj0iMS41IiBmaWxsPSIke3AuY29sb3J9Ii8+CiAgICAgICAgPC9wYXR0ZXJuPgogICAgICAgIDxwYXR0ZXJuIGlkPSJwYXR0ZXJuLWhvcml6b250YWwtJHtDfSIgd2lkdGg9IjgiIGhlaWdodD0iOCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgICAgICA8bGluZSB4MT0iMCIgeTE9IjIiIHgyPSI4IiB5Mj0iMiIgc3Ryb2tlPSIke3AuY29sb3J9IiBzdHJva2Utd2lkdGg9IjIiLz4KICAgICAgICAgIDxsaW5lIHgxPSIwIiB5MT0iNiIgeDI9IjgiIHkyPSI2IiBzdHJva2U9IiR7cC5jb2xvcn0iIHN0cm9rZS13aWR0aD0iMiIvPgogICAgICAgIDwvcGF0dGVybj4KICAgICAgICA8cGF0dGVybiBpZD0icGF0dGVybi1jcm9zc2hhdGNoLSR7Q30iIHdpZHRoPSI4IiBoZWlnaHQ9IjgiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICAgICAgPHBhdGggZD0iTTAsMCBMOCw4IE04LDAgTDAsOCIgc3Ryb2tlPSIke3AuY29sb3J9IiBzdHJva2Utd2lkdGg9IjEuNSIvPgogICAgICAgIDwvcGF0dGVybj4KICAgICAgICA8cGF0dGVybiBpZD0icGF0dGVybi12ZXJ0aWNhbC0ke0N9IiB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgICAgIDxsaW5lIHgxPSIyIiB5MT0iMCIgeDI9IjIiIHkyPSI4IiBzdHJva2U9IiR7cC5jb2xvcn0iIHN0cm9rZS13aWR0aD0iMiIvPgogICAgICAgICAgPGxpbmUgeDE9IjYiIHkxPSIwIiB4Mj0iNiIgeTI9IjgiIHN0cm9rZT0iJHtwLmNvbG9yfSIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgICAgICAgPC9wYXR0ZXJuPgogICAgICBgKS5qb2luKCIiKX0KICAgIDwvZGVmcz4KICBgO2YuZm9yRWFjaCgocCxDKT0+e3ZhciB6O2NvbnN0IHE9ci5sZWZ0K0MqbSsobS0kKS8yLHk9cC5wcmljaW5nO2xldCB2PXIudG9wK3M7Y29uc3QgYj1bXTtpZih5LnByb2RDb21wdXRlPjApe2NvbnN0IGQ9eS5wcm9kQ29tcHV0ZS9oKnM7Yi5wdXNoKHtsYWJlbDoiQ29tcHV0ZSIsdmFsdWU6eS5wcm9kQ29tcHV0ZSx5OnYtZCxoZWlnaHQ6ZCxwYXR0ZXJuOmBwYXR0ZXJuLXNvbGlkLSR7Q31gfSksdi09ZH1pZih5LnByb2RTdG9yYWdlPjApe2NvbnN0IGQ9eS5wcm9kU3RvcmFnZS9oKnM7Yi5wdXNoKHtsYWJlbDoiU3RvcmFnZSIsdmFsdWU6eS5wcm9kU3RvcmFnZSx5OnYtZCxoZWlnaHQ6ZCxwYXR0ZXJuOmBwYXR0ZXJuLWRpYWdvbmFsLSR7Q31gfSksdi09ZH1pZih5LmlvJiZ5LmlvPjApe2NvbnN0IGQ9eS5pby9oKnM7Yi5wdXNoKHtsYWJlbDoiSS9PIix2YWx1ZTp5LmlvLHk6di1kLGhlaWdodDpkLHBhdHRlcm46YHBhdHRlcm4tZG90cy0ke0N9YH0pLHYtPWR9aWYoeS5ub25Qcm9kPjApe2NvbnN0IGQ9eS5ub25Qcm9kL2gqcztiLnB1c2goe2xhYmVsOiJEZXYvU3RhZ2luZyIsdmFsdWU6eS5ub25Qcm9kLHk6di1kLGhlaWdodDpkLHBhdHRlcm46YHBhdHRlcm4taG9yaXpvbnRhbC0ke0N9YH0pLHYtPWR9aWYoeS5zb2MyPjApe2NvbnN0IGQ9eS5zb2MyL2gqcztiLnB1c2goe2xhYmVsOiJTT0MyIix2YWx1ZTp5LnNvYzIseTp2LWQsaGVpZ2h0OmQscGF0dGVybjpgcGF0dGVybi1jcm9zc2hhdGNoLSR7Q31gfSksdi09ZH1pZih5LmhpcGFhPjApe2NvbnN0IGQ9eS5oaXBhYS9oKnM7Yi5wdXNoKHtsYWJlbDoiSElQQUEiLHZhbHVlOnkuaGlwYWEseTp2LWQsaGVpZ2h0OmQscGF0dGVybjpgcGF0dGVybi12ZXJ0aWNhbC0ke0N9YH0pLHYtPWR9Yi5mb3JFYWNoKGQ9PnthKz1gPHJlY3QgeD0iJHtxfSIgeT0iJHtkLnl9IiB3aWR0aD0iJHskfSIgaGVpZ2h0PSIke2QuaGVpZ2h0fSIgZmlsbD0idXJsKCMke2QucGF0dGVybn0pIiBzdHJva2U9IiR7cC5jb2xvcn0iIHN0cm9rZS13aWR0aD0iMSIgY2xhc3M9ImJhci1zZWdtZW50IiBkYXRhLWxhYmVsPSIke2QubGFiZWx9IiBkYXRhLXZhbHVlPSIke1UoZC52YWx1ZSl9Ij48dGl0bGU+JHtkLmxhYmVsfTogJCR7VShkLnZhbHVlKX08L3RpdGxlPjwvcmVjdD5gfSk7Y29uc3QgRD0oKHo9YlswXSk9PW51bGw/dm9pZCAwOnoueSl8fHIudG9wK3M7YSs9YDx0ZXh0IHg9IiR7cSskLzJ9IiB5PSIke0QtMzV9IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iNjAwIiBmaWxsPSIjZmZmIj4kJHtVKHkudG90YWwpfS9tb248L3RleHQ+YCxhKz1gPHRleHQgeD0iJHtxKyQvMn0iIHk9IiR7ci50b3ArcyszMH0iIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSI1MDAiIGZpbGw9IiM5NGEzYjgiPiR7cC5uYW1lfTwvdGV4dD5gfSksYSs9YDxsaW5lIHgxPSIke3IubGVmdH0iIHkxPSIke3IudG9wfSIgeDI9IiR7ci5sZWZ0fSIgeTI9IiR7ci50b3Arc30iIHN0cm9rZT0iIzQ3NTU2OSIgc3Ryb2tlLXdpZHRoPSIyIi8+YCxhKz1gPGxpbmUgeDE9IiR7ci5sZWZ0fSIgeTE9IiR7ci50b3Arc30iIHgyPSIke2Mtci5yaWdodH0iIHkyPSIke3IudG9wK3N9IiBzdHJva2U9IiM0NzU1NjkiIHN0cm9rZS13aWR0aD0iMiIvPmAsbi5pbm5lckhUTUw9YX1jb25zdCBGPXgucXVlcnlTZWxlY3RvckFsbCgiLnZpZXctdG9nZ2xlLWJ0biIpLE89eC5xdWVyeVNlbGVjdG9yKCIucGFuZWxzLWNvbnRhaW5lciIpLFo9eC5xdWVyeVNlbGVjdG9yKCIuY2hhcnQtdmlldyIpO0YuZm9yRWFjaCh0PT57dC5hZGRFdmVudExpc3RlbmVyKCJjbGljayIsKCk9Pntjb25zdCBlPXQuZGF0YXNldC52aWV3O2lmKEYuZm9yRWFjaChsPT5sLmNsYXNzTGlzdC5yZW1vdmUoImFjdGl2ZSIpKSx0LmNsYXNzTGlzdC5hZGQoImFjdGl2ZSIpLGU9PT0icGFuZWxzIilPLnN0eWxlLmRpc3BsYXk9ImdyaWQiLFouc3R5bGUuZGlzcGxheT0ibm9uZSI7ZWxzZXtPLnN0eWxlLmRpc3BsYXk9Im5vbmUiLFouc3R5bGUuZGlzcGxheT0iYmxvY2siO2NvbnN0IGw9RygpLG49RSgpLGM9TCgpO1QobCxuLGMpfX0pfSksUy5hZGRFdmVudExpc3RlbmVyKCJpbnB1dCIsdD0+e28uc3RvcmFnZT1wYXJzZUludCh0LnRhcmdldC52YWx1ZSksUC50ZXh0Q29udGVudD1gJHtvLnN0b3JhZ2V9IEdCYCx3KCl9KSxNLmFkZEV2ZW50TGlzdGVuZXIoImNoYW5nZSIsdD0+e28uc2NhbGVUb1plcm89dC50YXJnZXQuY2hlY2tlZCx3KCl9KSxXLmFkZEV2ZW50TGlzdGVuZXIoImlucHV0Iix0PT57by5kZXZlbG9wZXJzPXBhcnNlSW50KHQudGFyZ2V0LnZhbHVlKSxOLnRleHRDb250ZW50PW8uZGV2ZWxvcGVycztjb25zdCBlPXgucXVlcnlTZWxlY3RvcigiI2xvY2FsLWRldi1oZWxwIik7ZSYmKGUuc3R5bGUuZGlzcGxheT1vLmRldmVsb3BlcnM9PT0wPyJpbmxpbmUiOiJub25lIiksdygpfSksVi5hZGRFdmVudExpc3RlbmVyKCJjaGFuZ2UiLHQ9PntvLnNvYzI9dC50YXJnZXQuY2hlY2tlZCx3KCl9KSxZLmFkZEV2ZW50TGlzdGVuZXIoImNoYW5nZSIsdD0+e28uaGlwYWE9dC50YXJnZXQuY2hlY2tlZCx3KCl9KSx3KCl9d2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKXtCKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIiN3aWRnZXQxLWNvbnRhaW5lciAud2lkZ2V0LXdyYXBwZXIiKSl9LDFlMyl9KSgpOwo="></script>

**Note**: If your entry-level project needs SOC2 Compliance, the savings are extreme because [we don’t charge a high fixed fee for premium features](https://neon.com/blog/why-we-no-longer-lock-premium-features) while Supabase requires you to opt-in to their $599/month business plan.

![Post image](https://cdn.neonapi.io/public/images/pages/blog/major-compute-price-reduction-on-neon/image-f77b6b4b.png)

**Scenario 2. Launching a new product (1 to 4CU, 20GB, always on)**: You are a lean startup launching your new product, you want to guarantee your product is responsive. On Neon, you create a Launch Plan database with 1 to 4 CU autoscaling on Neon, vs 2 to 8 ACU on Aurora _(1 CU in Neon has similar resources to 2 ACU in Aurora)_, and XL instance on Supabase. In this case, Neon is less than 40% of the cost of Aurora, and less than 70% of Supabase.

<div id="widget2-container">
  
  <div className="widget-wrapper">
    <div className="widget-header">
      <h3>Startup Workload</h3>
      <p className="workload-description">Mid-size database with 24/7 variable load for a fast-moving startup.</p>
      <div className="view-toggle">
        <button className="view-toggle-btn active" data-view="chart">Chart</button>
        <button className="view-toggle-btn" data-view="panels">Details</button>
      </div>
    </div>

    <div className="panels-container">
      <div className="pricing-panel" data-provider="neon">
        <div className="panel-header">
          <h4>Neon</h4>
          <div className="badge best-price">Best Price</div>
          <div className="badge more-expensive"></div>
        </div>
        <div className="total-cost">
          <span className="currency">$</span>
          <span className="amount">0</span>
          <span className="period">/mo</span>
        </div>
        <div className="sparkline-container"></div>
        <div className="cost-breakdown">
          <div className="breakdown-section">
            <h5>Production</h5>
            <div className="breakdown-item">
              <span>Compute</span>
              <span className="value" data-field="prod-compute">$0</span>
            </div>
            <div className="calculation" data-field="prod-compute-calc"></div>
            <div className="breakdown-item">
              <span>Storage</span>
              <span className="value" data-field="prod-storage">$0</span>
            </div>
            <div className="calculation" data-field="prod-storage-calc"></div>
          </div>
          <div className="breakdown-section">
            <h5>Non-Production</h5>
            <div className="breakdown-item">
              <span>Dev/Staging</span>
              <span className="value" data-field="non-prod">$0</span>
            </div>
            <div className="calculation" data-field="non-prod-calc"></div>
          </div>
          <div className="breakdown-section">
            <h5>Add-ons</h5>
            <div className="breakdown-item soc2-cost">
              <span>SOC2</span>
              <span className="value" data-field="soc2">$0</span>
            </div>
            <div className="calculation soc2-cost" data-field="soc2-calc"></div>
            <div className="breakdown-item hipaa-cost">
              <span>HIPAA</span>
              <span className="value" data-field="hipaa">$0</span>
            </div>
            <div className="calculation hipaa-cost" data-field="hipaa-calc"></div>
          </div>
        </div>
      </div>

      <div className="pricing-panel" data-provider="supabase">
        <div className="panel-header">
          <h4>Supabase</h4>
          <div className="badge best-price">Best Price</div>
          <div className="badge more-expensive"></div>
        </div>
        <div className="total-cost">
          <span className="currency">$</span>
          <span className="amount">0</span>
          <span className="period">/mo</span>
        </div>
        <div className="sparkline-container"></div>
        <div className="cost-breakdown">
          <div className="breakdown-section">
            <h5>Production</h5>
            <div className="breakdown-item">
              <span>Compute</span>
              <span className="value" data-field="prod-compute">$0</span>
            </div>
            <div className="calculation" data-field="prod-compute-calc"></div>
            <div className="breakdown-item">
              <span>Storage</span>
              <span className="value" data-field="prod-storage">$0</span>
            </div>
            <div className="calculation" data-field="prod-storage-calc"></div>
          </div>
          <div className="breakdown-section">
            <h5>Non-Production</h5>
            <div className="breakdown-item">
              <span>Dev/Staging</span>
              <span className="value" data-field="non-prod">$0</span>
            </div>
            <div className="calculation" data-field="non-prod-calc"></div>
          </div>
          <div className="breakdown-section">
            <h5>Add-ons</h5>
            <div className="breakdown-item soc2-cost">
              <span>SOC2</span>
              <span className="value" data-field="soc2">$0</span>
            </div>
            <div className="calculation soc2-cost" data-field="soc2-calc"></div>
            <div className="breakdown-item hipaa-cost">
              <span>HIPAA</span>
              <span className="value" data-field="hipaa">$0</span>
            </div>
            <div className="calculation hipaa-cost" data-field="hipaa-calc"></div>
          </div>
        </div>
      </div>

      <div className="pricing-panel" data-provider="aurora">
        <div className="panel-header">
          <h4>Aurora Serverless</h4>
          <div className="badge best-price">Best Price</div>
          <div className="badge more-expensive"></div>
        </div>
        <div className="total-cost">
          <span className="currency">$</span>
          <span className="amount">0</span>
          <span className="period">/mo</span>
        </div>
        <div className="sparkline-container"></div>
        <div className="cost-breakdown">
          <div className="breakdown-section">
            <h5>Production</h5>
            <div className="breakdown-item">
              <span>Compute</span>
              <span className="value" data-field="prod-compute">$0</span>
            </div>
            <div className="calculation" data-field="prod-compute-calc"></div>
            <div className="breakdown-item">
              <span>Storage</span>
              <span className="value" data-field="prod-storage">$0</span>
            </div>
            <div className="calculation" data-field="prod-storage-calc"></div>
            <div className="breakdown-item io-cost">
              <span>I/O</span>
              <span className="value" data-field="io">$0</span>
            </div>
            <div className="calculation io-cost" data-field="io-calc"></div>
          </div>
          <div className="breakdown-section">
            <h5>Non-Production</h5>
            <div className="breakdown-item">
              <span>Dev/Staging</span>
              <span className="value" data-field="non-prod">$0</span>
            </div>
            <div className="calculation" data-field="non-prod-calc"></div>
          </div>
          <div className="breakdown-section">
            <h5>Add-ons</h5>
            <div className="breakdown-item soc2-cost">
              <span>SOC2</span>
              <span className="value" data-field="soc2">$0</span>
            </div>
            <div className="calculation soc2-cost" data-field="soc2-calc"></div>
            <div className="breakdown-item hipaa-cost">
              <span>HIPAA</span>
              <span className="value" data-field="hipaa">$0</span>
            </div>
            <div className="calculation hipaa-cost" data-field="hipaa-calc"></div>
          </div>
        </div>
      </div>
    </div>

    <div className="chart-view">
      <div className="chart-content">
        <div className="chart-container">
          <svg className="bar-chart" viewBox="0 0 600 300"></svg>
        </div>
        <div className="workload-details-panel">
          <h4>Workload Details</h4>
          <p>Database has non-stop load that varies throughout day/week, requires moderate compute resources with 1-4 CU on Neon, XL instance on Supabase, and 2-8 ACU on Aurora to handle typical workload demands.</p>
        </div>
      </div>
    </div>

    <div className="config-section">
      <div className="config-row">
        <div className="config-item">
          <label htmlFor="widget2-storage">Storage (GB)</label>
          <div className="config-values">
            <span className="config-value" id="widget2-storage-value">20 GB</span>
            <input type="range" id="widget2-storage" min="10" max="100" defaultValue="20" step="5" />
            </div>
        </div>

        <div className="config-item">
          <label htmlFor="widget2-developers">Dev Branches</label>
          <div className="config-values">
            <span className="config-value" id="widget2-developers-value">5</span>
            <input type="range" id="widget2-developers" min="0" max="20" defaultValue="5" step="1" />
            </div>
        </div>

        <div className="config-item">
          <label htmlFor="widget2-soc2"><input type="checkbox" id="widget2-soc2" />SOC2</label>
        </div>

        <div className="config-item">
          <label htmlFor="widget2-hipaa"><input type="checkbox" id="widget2-hipaa" />HIPAA</label>
        </div>
      </div>
    </div>
  </div>

</div>
<link rel="stylesheet" href="data:text/css;base64,Kntib3gtc2l6aW5nOmJvcmRlci1ib3h9LndpZGdldC13cmFwcGVye2ZvbnQtZmFtaWx5Oi1hcHBsZS1zeXN0ZW0sQmxpbmtNYWNTeXN0ZW1Gb250LFNlZ29lIFVJLFJvYm90byxPeHlnZW4sVWJ1bnR1LENhbnRhcmVsbCxzYW5zLXNlcmlmO21heC13aWR0aDoxMjAwcHg7bWFyZ2luOjEwcHggYXV0bztwYWRkaW5nOjIwcHg7YmFja2dyb3VuZDojMWExYTFhO2JvcmRlcjoxcHggc29saWQgIzMzMzMzM30ud2lkZ2V0LWhlYWRlcnt0ZXh0LWFsaWduOmxlZnQ7bWFyZ2luLWJvdHRvbToyNHB4O3Bvc2l0aW9uOnJlbGF0aXZlfS53aWRnZXQtaGVhZGVyIGgze21hcmdpbjowIDAgNnB4O2ZvbnQtc2l6ZToxLjVyZW07Zm9udC13ZWlnaHQ6NjAwO2NvbG9yOiNmZmY7bGV0dGVyLXNwYWNpbmc6LS4wMmVtO3BhZGRpbmctcmlnaHQ6MTQwcHh9Lndvcmtsb2FkLWRlc2NyaXB0aW9ue21hcmdpbjowO2ZvbnQtc2l6ZTouODc1cmVtO2NvbG9yOiM5OTk7bGluZS1oZWlnaHQ6MS41O2ZvbnQtd2VpZ2h0OjQwMDtwYWRkaW5nLXJpZ2h0OjE0MHB4fS5wYW5lbHMtY29udGFpbmVye2Rpc3BsYXk6Z3JpZDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6cmVwZWF0KDMsMWZyKTtnYXA6MjBweDttYXJnaW4tYm90dG9tOjI0cHh9LnBhbmVscy1jb250YWluZXI+KnttaW4td2lkdGg6MH0ucHJpY2luZy1wYW5lbHtiYWNrZ3JvdW5kOiMyNTI1MjU7Ym9yZGVyOjFweCBzb2xpZCAjM2EzYTNhO3BhZGRpbmc6MThweDt0cmFuc2l0aW9uOm5vbmU7d2lkdGg6MTAwJX0ucHJpY2luZy1wYW5lbC5pcy1iZXN0LXByaWNle2JhY2tncm91bmQ6IzI1MjUyNTtib3JkZXItY29sb3I6I2ZmZjtib3JkZXItd2lkdGg6MnB4O3BhZGRpbmc6MTdweH0ucGFuZWwtaGVhZGVye2Rpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpiYXNlbGluZTttYXJnaW4tYm90dG9tOjhweDtwYWRkaW5nLWJvdHRvbTo4cHg7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgIzNhM2EzYX0ucHJpY2luZy1wYW5lbC5pcy1iZXN0LXByaWNlIC5wYW5lbC1oZWFkZXJ7Ym9yZGVyLWJvdHRvbS1jb2xvcjojZmZmfS5wYW5lbC1oZWFkZXIgaDR7bWFyZ2luOjA7Zm9udC1zaXplOjFyZW07Zm9udC13ZWlnaHQ6NjAwO2NvbG9yOiNmZmY7d2hpdGUtc3BhY2U6bm93cmFwO292ZXJmbG93OmhpZGRlbjt0ZXh0LW92ZXJmbG93OmVsbGlwc2lzO2xldHRlci1zcGFjaW5nOi0uMDFlbX0uYmFkZ2V7cGFkZGluZzoycHggNnB4O2ZvbnQtc2l6ZTouNjVyZW07Zm9udC13ZWlnaHQ6NjAwO3RleHQtdHJhbnNmb3JtOnVwcGVyY2FzZTtsZXR0ZXItc3BhY2luZzouMDNlbTt3aGl0ZS1zcGFjZTpub3dyYXA7Ym9yZGVyOjFweCBzb2xpZCAjZmZmZmZmfS5iYWRnZS5iZXN0LXByaWNle2JhY2tncm91bmQ6I2ZmZjtjb2xvcjojMDAwfS5iYWRnZS5tb3JlLWV4cGVuc2l2ZXtiYWNrZ3JvdW5kOnRyYW5zcGFyZW50O2NvbG9yOiM5OTk7Ym9yZGVyLWNvbG9yOiM1NTV9LnRvdGFsLWNvc3R7dGV4dC1hbGlnbjpsZWZ0O21hcmdpbjoxNnB4IDAgMTJweDtwYWRkaW5nOjhweCAwfS50b3RhbC1jb3N0IC5jdXJyZW5jeXtmb250LXNpemU6MS41cmVtO2ZvbnQtd2VpZ2h0OjQwMDtjb2xvcjojOTk5O3ZlcnRpY2FsLWFsaWduOnRvcDttYXJnaW4tcmlnaHQ6MnB4fS50b3RhbC1jb3N0IC5hbW91bnR7Zm9udC1zaXplOjMuNXJlbTtmb250LXdlaWdodDozMDA7Y29sb3I6I2ZmZjtsZXR0ZXItc3BhY2luZzotLjA0ZW07bGluZS1oZWlnaHQ6MX0udG90YWwtY29zdCAucGVyaW9ke2ZvbnQtc2l6ZToxLjEyNXJlbTtjb2xvcjojOTk5O2ZvbnQtd2VpZ2h0OjQwMDttYXJnaW4tbGVmdDoycHh9LnNwYXJrbGluZS1jb250YWluZXJ7bWFyZ2luOjEycHggYXV0byAxMHB4O2Rpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2FsaWduLWl0ZW1zOmNlbnRlcjtoZWlnaHQ6NDRweH0uc3BhcmtsaW5le2Rpc3BsYXk6YmxvY2s7d2lkdGg6MTAwJTttYXgtd2lkdGg6MjgwcHh9LmNvc3QtYnJlYWtkb3due21hcmdpbi10b3A6MTZweDtib3JkZXItdG9wOjFweCBzb2xpZCAjMzMzMzMzO3BhZGRpbmctdG9wOjEycHh9LmJyZWFrZG93bi1zZWN0aW9ue21hcmdpbi1ib3R0b206MTBweH0uYnJlYWtkb3duLXNlY3Rpb246bGFzdC1jaGlsZHttYXJnaW4tYm90dG9tOjB9LmJyZWFrZG93bi1zZWN0aW9uIGg1e2Rpc3BsYXk6bm9uZX0uYnJlYWtkb3duLWl0ZW17ZGlzcGxheTpmbGV4O2p1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2FsaWduLWl0ZW1zOmJhc2VsaW5lO3BhZGRpbmc6M3B4IDA7Zm9udC1zaXplOi44MTI1cmVtO2NvbG9yOiNmZmY7bGluZS1oZWlnaHQ6MS40fS5icmVha2Rvd24taXRlbSBzcGFuOmZpcnN0LWNoaWxke2NvbG9yOiM5OTk7Zm9udC13ZWlnaHQ6NDAwfS5icmVha2Rvd24taXRlbSAudmFsdWV7Zm9udC13ZWlnaHQ6NjAwO2NvbG9yOiNmZmY7Zm9udC12YXJpYW50LW51bWVyaWM6dGFidWxhci1udW1zO2xldHRlci1zcGFjaW5nOi0uMDFlbX0uY2FsY3VsYXRpb257Zm9udC1zaXplOi42ODc1cmVtO2NvbG9yOiM2NjY7cGFkZGluZzowIDAgOHB4O2ZvbnQtZmFtaWx5OlNGIE1vbm8sTW9uYWNvLENvbnNvbGFzLG1vbm9zcGFjZTtmb250LXN0eWxlOm5vcm1hbDtsaW5lLWhlaWdodDoxLjM7Zm9udC13ZWlnaHQ6NDAwfS5yZXNvdXJjZS1pdGVte3BhZGRpbmc6NHB4IDA7Zm9udC1zaXplOi44cmVtO2NvbG9yOiNjY2M7Zm9udC13ZWlnaHQ6NTAwfS5jb25maWctc2VjdGlvbntiYWNrZ3JvdW5kOiMxZjFmMWY7cGFkZGluZzoxNnB4O2JvcmRlcjoxcHggc29saWQgIzNhM2EzYTtib3JkZXItdG9wOjJweCBzb2xpZCAjNDQ0NDQ0fS5jb25maWctcm93e2Rpc3BsYXk6Z3JpZDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6cmVwZWF0KDUsMWZyKTtnYXA6MThweH0uY29uZmlnLWl0ZW17ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6NnB4fS5jb25maWctaXRlbSBsYWJlbHtmb250LXNpemU6LjgxMjVyZW07Zm9udC13ZWlnaHQ6NTAwO2NvbG9yOiM5OTk7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4fS5jb25maWctaXRlbSBpbnB1dFt0eXBlPXJhbmdlXXt3aWR0aDoxMDAlO2hlaWdodDozcHg7YmFja2dyb3VuZDojNDQ0O291dGxpbmU6bm9uZTstd2Via2l0LWFwcGVhcmFuY2U6bm9uZX0uY29uZmlnLWl0ZW0gaW5wdXRbdHlwZT1yYW5nZV06Oi13ZWJraXQtc2xpZGVyLXRodW1iey13ZWJraXQtYXBwZWFyYW5jZTpub25lOy1tb3otYXBwZWFyYW5jZTpub25lO2FwcGVhcmFuY2U6bm9uZTt3aWR0aDoxNHB4O2hlaWdodDoxNHB4O2JhY2tncm91bmQ6I2ZmZjtjdXJzb3I6cG9pbnRlcjtib3JkZXI6bm9uZX0uY29uZmlnLWl0ZW0gaW5wdXRbdHlwZT1yYW5nZV06Oi13ZWJraXQtc2xpZGVyLXRodW1iOmhvdmVye2JhY2tncm91bmQ6I2NjY30uY29uZmlnLWl0ZW0gaW5wdXRbdHlwZT1yYW5nZV06Oi1tb3otcmFuZ2UtdGh1bWJ7d2lkdGg6MTRweDtoZWlnaHQ6MTRweDtiYWNrZ3JvdW5kOiNmZmY7Y3Vyc29yOnBvaW50ZXI7Ym9yZGVyOm5vbmV9LmNvbmZpZy1pdGVtIGlucHV0W3R5cGU9cmFuZ2VdOjotbW96LXJhbmdlLXRodW1iOmhvdmVye2JhY2tncm91bmQ6I2NjY30uY29uZmlnLWl0ZW0gaW5wdXRbdHlwZT1jaGVja2JveF17d2lkdGg6MTRweDtoZWlnaHQ6MTRweDtjdXJzb3I6cG9pbnRlcjthY2NlbnQtY29sb3I6I2ZmZmZmZn0uY29uZmlnLXZhbHVle2ZvbnQtc2l6ZTouOTM3NXJlbTtmb250LXdlaWdodDo2MDA7Y29sb3I6I2ZmZjtmb250LXZhcmlhbnQtbnVtZXJpYzp0YWJ1bGFyLW51bXM7ZmxleC1zaHJpbms6MH0uY29uZmlnLWhlbHB7Zm9udC1zaXplOi42ODc1cmVtO2NvbG9yOiM2NjY7Zm9udC1zdHlsZTpub3JtYWw7Zm9udC13ZWlnaHQ6NDAwfUBtZWRpYSAobWF4LXdpZHRoOiAxMDI0cHgpey5wYW5lbHMtY29udGFpbmVye2dyaWQtdGVtcGxhdGUtY29sdW1uczoxZnI7Z2FwOjE2cHh9LmNvbmZpZy1yb3d7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOnJlcGVhdCgyLDFmcil9fUBtZWRpYSAobWF4LXdpZHRoOiA2NDBweCl7LndpZGdldC13cmFwcGVye3BhZGRpbmc6MTZweH0uY29uZmlnLXJvd3tncmlkLXRlbXBsYXRlLWNvbHVtbnM6MWZyfS53aWRnZXQtaGVhZGVyIGgze2ZvbnQtc2l6ZToxLjM3NXJlbX0udG90YWwtY29zdCAuYW1vdW50e2ZvbnQtc2l6ZToyLjc1cmVtfX0uY29uZmlnLXZhbHVlc3tkaXNwbGF5OmZsZXg7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHh9LnZpZXctdG9nZ2xle3Bvc2l0aW9uOmFic29sdXRlO3RvcDowO3JpZ2h0OjA7ZGlzcGxheTpmbGV4O2dhcDo0cHg7YmFja2dyb3VuZDojMjUyNTI1O3BhZGRpbmc6M3B4O2JvcmRlci1yYWRpdXM6NHB4O3dpZHRoOmZpdC1jb250ZW50fS52aWV3LXRvZ2dsZS1idG57YmFja2dyb3VuZDp0cmFuc3BhcmVudDtib3JkZXI6bm9uZTtjb2xvcjojOTRhM2I4O3BhZGRpbmc6NHB4IDEwcHg7Ym9yZGVyLXJhZGl1czozcHg7Zm9udC1zaXplOi43NXJlbTtmb250LXdlaWdodDo1MDA7Y3Vyc29yOnBvaW50ZXI7dHJhbnNpdGlvbjphbGwgLjJzfS52aWV3LXRvZ2dsZS1idG46aG92ZXJ7Y29sb3I6I2ZmZjtiYWNrZ3JvdW5kOiMzMzN9LnZpZXctdG9nZ2xlLWJ0bi5hY3RpdmV7YmFja2dyb3VuZDojM2EzYTNhO2NvbG9yOiNmZmZ9LmNoYXJ0LXZpZXd7bWFyZ2luLWJvdHRvbToyNHB4fS5jaGFydC1jb250ZW50e2Rpc3BsYXk6Z3JpZDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6MmZyIDFmcjtnYXA6MjBweDthbGlnbi1pdGVtczpzdGFydH0uY2hhcnQtY29udGFpbmVyLC53b3JrbG9hZC1kZXRhaWxzLXBhbmVse2JhY2tncm91bmQ6IzI1MjUyNTtib3JkZXI6MXB4IHNvbGlkICMzYTNhM2E7cGFkZGluZzoyMHB4fS53b3JrbG9hZC1kZXRhaWxzLXBhbmVsIGg0e21hcmdpbjowIDAgMTZweDtmb250LXNpemU6MS4xMjVyZW07Zm9udC13ZWlnaHQ6NjAwO2NvbG9yOiNmZmZ9Lndvcmtsb2FkLWRldGFpbHMtcGFuZWwgcHttYXJnaW46MDtmb250LXNpemU6LjgxMjVyZW07bGluZS1oZWlnaHQ6MS41O2NvbG9yOiNjY2N9LmJhci1jaGFydHt3aWR0aDoxMDAlO2hlaWdodDphdXRvO21heC13aWR0aDo2MDBweDttYXJnaW46MCBhdXRvO2Rpc3BsYXk6YmxvY2t9LmJhci1zZWdtZW50e2N1cnNvcjpwb2ludGVyO3RyYW5zaXRpb246b3BhY2l0eSAuMnN9LmJhci1zZWdtZW50OmhvdmVye29wYWNpdHk6LjghaW1wb3J0YW50fS5jaGFydC1kYXRhLXRhYmxle2Rpc3BsYXk6Z3JpZDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6cmVwZWF0KDMsMWZyKTtnYXA6MjBweH0udGFibGUtY29sdW1ue2JhY2tncm91bmQ6IzI1MjUyNTtib3JkZXI6MXB4IHNvbGlkICMzYTNhM2E7cGFkZGluZzoxOHB4fS50YWJsZS1jb2x1bW4gaDR7bWFyZ2luOjAgMCAxNnB4O2ZvbnQtc2l6ZToxLjEyNXJlbTtmb250LXdlaWdodDo2MDA7Y29sb3I6I2ZmZjtwYWRkaW5nLWJvdHRvbToxMnB4O2JvcmRlci1ib3R0b206MXB4IHNvbGlkICMzYTNhM2F9LnRhYmxlLXJvd3tkaXNwbGF5OmZsZXg7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6Y2VudGVyO3BhZGRpbmc6OHB4IDA7Zm9udC1zaXplOi44NzVyZW19LnRhYmxlLXJvdyAubGFiZWx7Y29sb3I6Izk0YTNiODtmb250LXdlaWdodDo0MDB9LnRhYmxlLXJvdyAudmFsdWV7Y29sb3I6I2ZmZjtmb250LXdlaWdodDo1MDB9LnRhYmxlLXJvdy50b3RhbHttYXJnaW4tdG9wOjhweDtwYWRkaW5nLXRvcDoxMnB4O2JvcmRlci10b3A6MXB4IHNvbGlkICMzYTNhM2E7Zm9udC13ZWlnaHQ6NjAwfS50YWJsZS1yb3cudG90YWwgLmxhYmVse2NvbG9yOiNmZmY7Zm9udC13ZWlnaHQ6NjAwfS50YWJsZS1yb3cudG90YWwgLnZhbHVle2ZvbnQtc2l6ZToxLjEyNXJlbTtjb2xvcjojMDBlNWEwfUBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCl7LmNoYXJ0LWNvbnRlbnR7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOjFmcn19CgoucGFuZWxzLWNvbnRhaW5lciwuYmFkZ2UsLnNvYzItY29zdCxbZGF0YS1maWVsZD0ic29jMi1jYWxjIl0sLmhpcGFhLWNvc3QsW2RhdGEtZmllbGQ9ImhpcGFhLWNhbGMiXSwuaW8tY29zdCxbZGF0YS1maWVsZD0iaW8tY2FsYyJde2Rpc3BsYXk6bm9uZX0=" />
<script src="data:text/javascript;base64,KGZ1bmN0aW9uKCl7Y29uc3Qgbj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KCJsaW5rIikucmVsTGlzdDtpZihuJiZuLnN1cHBvcnRzJiZuLnN1cHBvcnRzKCJtb2R1bGVwcmVsb2FkIikpcmV0dXJuO2Zvcihjb25zdCBTIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpbmtbcmVsPSJtb2R1bGVwcmVsb2FkIl0nKSlDKFMpO25ldyBNdXRhdGlvbk9ic2VydmVyKFM9Pntmb3IoY29uc3QgUCBvZiBTKWlmKFAudHlwZT09PSJjaGlsZExpc3QiKWZvcihjb25zdCB3IG9mIFAuYWRkZWROb2Rlcyl3LnRhZ05hbWU9PT0iTElOSyImJncucmVsPT09Im1vZHVsZXByZWxvYWQiJiZDKHcpfSkub2JzZXJ2ZShkb2N1bWVudCx7Y2hpbGRMaXN0OiEwLHN1YnRyZWU6ITB9KTtmdW5jdGlvbiBCKFMpe2NvbnN0IFA9e307cmV0dXJuIFMuaW50ZWdyaXR5JiYoUC5pbnRlZ3JpdHk9Uy5pbnRlZ3JpdHkpLFMucmVmZXJyZXJQb2xpY3kmJihQLnJlZmVycmVyUG9saWN5PVMucmVmZXJyZXJQb2xpY3kpLFMuY3Jvc3NPcmlnaW49PT0idXNlLWNyZWRlbnRpYWxzIj9QLmNyZWRlbnRpYWxzPSJpbmNsdWRlIjpTLmNyb3NzT3JpZ2luPT09ImFub255bW91cyI/UC5jcmVkZW50aWFscz0ib21pdCI6UC5jcmVkZW50aWFscz0ic2FtZS1vcmlnaW4iLFB9ZnVuY3Rpb24gQyhTKXtpZihTLmVwKXJldHVybjtTLmVwPSEwO2NvbnN0IFA9QihTKTtmZXRjaChTLmhyZWYsUCl9fSkoKTsoZnVuY3Rpb24oKXtjb25zdCBnPXtuZW9uOntjb21wdXRlUGVyQ1VIb3VyOi4xMDYsc3RvcmFnZVBlckdCTW9udGg6LjM1LHNjYWxlQ29tcHV0ZVBlckNVSG91cjouMjIyfSxzdXBhYmFzZTp7cHJvQmFzZUNvc3Q6MjUsY29tcHV0ZUNyZWRpdDoxMCx4bENvbXB1dGVQZXJNb250aDoyMTAsc3RvcmFnZVBlckdCTW9udGg6LjEyNX0sYXVyb3JhOnthY3VQZXJIb3VyOi4xMixzdG9yYWdlUGVyR0JNb250aDouMjI1LHJkc1Byb3h5UGVyQUNVSG91cjouMDE1fX07bGV0IG49e3N0b3JhZ2U6MjAsZGV2ZWxvcGVyczo1LHNvYzI6ITEsaGlwYWE6ITF9O2Z1bmN0aW9uIEIoQyl7Y29uc3QgUz1DLnF1ZXJ5U2VsZWN0b3IoIiN3aWRnZXQyLXN0b3JhZ2UiKSxQPUMucXVlcnlTZWxlY3RvcigiI3dpZGdldDItc3RvcmFnZS12YWx1ZSIpLHc9Qy5xdWVyeVNlbGVjdG9yKCIjd2lkZ2V0Mi1kZXZlbG9wZXJzIiksTj1DLnF1ZXJ5U2VsZWN0b3IoIiN3aWRnZXQyLWRldmVsb3BlcnMtdmFsdWUiKSxWPUMucXVlcnlTZWxlY3RvcigiI3dpZGdldDItc29jMiIpLFk9Qy5xdWVyeVNlbGVjdG9yKCIjd2lkZ2V0Mi1oaXBhYSIpO2Z1bmN0aW9uIEkoKXtjb25zdCBjPW4uc29jMnx8bi5oaXBhYSxyPWM/Zy5uZW9uLnNjYWxlQ29tcHV0ZVBlckNVSG91cjpnLm5lb24uY29tcHV0ZVBlckNVSG91cixpPTI3Nio0KzI3NioxKzE5OCoxLGw9aSpyLG89bi5zdG9yYWdlKmcubmVvbi5zdG9yYWdlUGVyR0JNb250aCxwPTE4Mi41LHM9LjI1LGg9bi5kZXZlbG9wZXJzKnAqcypyLHk9MCxmPW4uaGlwYWE/KGwrbytoKSouMTU6MDtyZXR1cm57cHJvZENvbXB1dGU6bCxwcm9kU3RvcmFnZTpvLG5vblByb2Q6aCxzb2MyOnksaGlwYWE6Zix0b3RhbDpsK28raCt5K2YsY2FsY3VsYXRpb25zOntwcm9kQ29tcHV0ZTpgJCR7ci50b0ZpeGVkKDMpfS9DVS1ob3VyIMOXICR7aS50b0ZpeGVkKDApfSBDVS1ob3VycyAodmFyaWFibGUgbG9hZDogMS00IENVJHtjPyIgb24gU2NhbGUiOiIifSlgLHByb2RTdG9yYWdlOmAkJHtnLm5lb24uc3RvcmFnZVBlckdCTW9udGgudG9GaXhlZCgyKX0vR0ItbW9udGggw5cgJHtuLnN0b3JhZ2V9IEdCYCxub25Qcm9kOmAke3B9aHJzIMOXICR7c30gQ1Ugw5cgJCR7ci50b0ZpeGVkKDMpfS9DVS1ob3VyIMOXICR7bi5kZXZlbG9wZXJzfSBkZXZlbG9wZXJzYCxoaXBhYTpuLmhpcGFhP2AxNSUgb2Ygc3VidG90YWwgKCQkeyhsK28raCkudG9GaXhlZCgyKX0pYDoiIn0sbG9hZFBhdHRlcm46e21pbkNVOjEsbWF4Q1U6NCxzY2FsZVRvWmVybzohMSxwbGF0Zm9ybU1pbjouMjUsaW5jcmVtZW50Oi4yNX19fWZ1bmN0aW9uIEwoKXtsZXQgZT1uLnNvYzJ8fG4uaGlwYWE/NTk5Omcuc3VwYWJhc2UucHJvQmFzZUNvc3Q7Y29uc3QgYz1lK01hdGgubWF4KDAsZy5zdXBhYmFzZS54bENvbXB1dGVQZXJNb250aC1nLnN1cGFiYXNlLmNvbXB1dGVDcmVkaXQpLHI9TWF0aC5tYXgoMCxuLnN0b3JhZ2UtOCkqZy5zdXBhYmFzZS5zdG9yYWdlUGVyR0JNb250aCxpPTEwLGw9bi5zdG9yYWdlKmcuc3VwYWJhc2Uuc3RvcmFnZVBlckdCTW9udGgsbz1uLmRldmVsb3BlcnMqKGkrbCkscD0wLHM9bi5oaXBhYT8yMDA6MDtyZXR1cm57cHJvZENvbXB1dGU6Yyxwcm9kU3RvcmFnZTpyLG5vblByb2Q6byxzb2MyOnAsaGlwYWE6cyx0b3RhbDpjK3IrbytwK3MsY2FsY3VsYXRpb25zOntwcm9kQ29tcHV0ZTpgJCR7ZX0vbW9udGggYmFzZSArICQke2cuc3VwYWJhc2UueGxDb21wdXRlUGVyTW9udGh9L21vbnRoIChYTCkgLSAkJHtnLnN1cGFiYXNlLmNvbXB1dGVDcmVkaXR9IGNyZWRpdGAscHJvZFN0b3JhZ2U6bi5zdG9yYWdlPjg/YCQke2cuc3VwYWJhc2Uuc3RvcmFnZVBlckdCTW9udGgudG9GaXhlZCgzKX0vR0ItbW9udGggw5cgJHtuLnN0b3JhZ2UtOH0gR0JgOiI4IEdCIGluY2x1ZGVkIixub25Qcm9kOmAoJCR7aX0gY29tcHV0ZSArICR7bi5zdG9yYWdlfSBHQiDDlyAkJHtnLnN1cGFiYXNlLnN0b3JhZ2VQZXJHQk1vbnRoLnRvRml4ZWQoMyl9L0dCKSDDlyAke24uZGV2ZWxvcGVyc30gZGV2ZWxvcGVyc2Asc29jMjpuLnNvYzI/IkluY2x1ZGVkIGluIEJ1c2luZXNzIHRpZXIiOiIiLGhpcGFhOm4uaGlwYWE/IkhJUEFBIHN1cmNoYXJnZSAoJDIwMC9tb250aCkiOiIifSxsb2FkUGF0dGVybjp7bWluQ1U6MSxtYXhDVTozLHNjYWxlVG9aZXJvOiExLHBsYXRmb3JtTWluOi4yNSxpc1Byb3Zpc2lvbmVkOiEwLGluY3JlbWVudDouMjV9fX1mdW5jdGlvbiBFKCl7Y29uc3Qgcj0zMTU2KmcuYXVyb3JhLmFjdVBlckhvdXIsaT0zMTU2KmcuYXVyb3JhLnJkc1Byb3h5UGVyQUNVSG91cixsPW4uc3RvcmFnZSpnLmF1cm9yYS5zdG9yYWdlUGVyR0JNb250aCxvPTAscD0xODIuNSxzPS41LGg9cCpzKmcuYXVyb3JhLmFjdVBlckhvdXIseT1uLnN0b3JhZ2UqZy5hdXJvcmEuc3RvcmFnZVBlckdCTW9udGgsZj1uLmRldmVsb3BlcnMqKGgreSkseD0wLGE9MCxkPTA7cmV0dXJue3Byb2RDb21wdXRlOnIraSxwcm9kU3RvcmFnZTpsLGlvOm8sbm9uUHJvZDpmK3gsc29jMjphLGhpcGFhOmQsdG90YWw6citpK2wrbytmK3grYStkLGNhbGN1bGF0aW9uczp7cHJvZENvbXB1dGU6YCQke2cuYXVyb3JhLmFjdVBlckhvdXIudG9GaXhlZCgyKX0vQUNVLWhvdXIgw5cgJHszMTU2IC50b0ZpeGVkKDApfSBBQ1UtaG91cnMgKHZhcmlhYmxlIGxvYWQ6IDItOCBBQ1UpICsgUkRTIFByb3h5YCxwcm9kU3RvcmFnZTpgJCR7Zy5hdXJvcmEuc3RvcmFnZVBlckdCTW9udGgudG9GaXhlZCgzKX0vR0ItbW9udGggw5cgJHtuLnN0b3JhZ2V9IEdCIChJL08gT3B0aW1pemVkKWAsaW86IkluY2x1ZGVkIGluIEkvTyBPcHRpbWl6ZWQgU3RvcmFnZSIsbm9uUHJvZDpgKCgke3B9aHJzIMOXICR7c30gQUNVIMOXICQke2cuYXVyb3JhLmFjdVBlckhvdXIudG9GaXhlZCgyKX0vQUNVLWhvdXIpICsgKCR7bi5zdG9yYWdlfSBHQiDDlyAkJHtnLmF1cm9yYS5zdG9yYWdlUGVyR0JNb250aC50b0ZpeGVkKDMpfS9HQikpIMOXICR7bi5kZXZlbG9wZXJzfSBkZXZlbG9wZXJzYH0sbG9hZFBhdHRlcm46e21pbkNVOjIsbWF4Q1U6OCxzY2FsZVRvWmVybzohMSxwbGF0Zm9ybU1pbjouNSxpc1Byb3Zpc2lvbmVkOiExLGluY3JlbWVudDouNSxkaXNwbGF5U2NhbGU6LjV9fX1mdW5jdGlvbiBPKHQsZT0uMjUpe3JldHVybiBNYXRoLmNlaWwodC9lKSplfWZ1bmN0aW9uIGIodCl7cmV0dXJuIHQ+PTEwMD90LnRvRml4ZWQoMCk6dC50b0ZpeGVkKDIpfWZ1bmN0aW9uIGsodCl7Y29uc3QgZT1bXSxpPXQuZGlzcGxheVNjYWxlfHwxO2ZvcihsZXQgbD0wO2w8NTY7bCsrKXtjb25zdCBvPWwqMyxwPU1hdGguZmxvb3Ioby8yNCkscz1vJTI0LGg9cD49NSx5PXM+PTkmJnM8MjE7bGV0IGY7aD9mPXk/dC5tYXhDVS8yOnQubWluQ1UvMjpmPXk/dC5tYXhDVTp0Lm1pbkNVO2xldCB4O2lmKHQuaXNQcm92aXNpb25lZCl4PXQubWF4Q1UqMS4yNTtlbHNle2NvbnN0IGE9dC5pbmNyZW1lbnR8fC4yNTtpZih0LnNjYWxlVG9aZXJvKXg9Zj4wP08oZixhKSsuMTowO2Vsc2V7Y29uc3QgZD1PKGYsYSkrLjE7eD1NYXRoLm1heChkLHQucGxhdGZvcm1NaW4pfX1lLnB1c2goe3g6bCxsb2FkOmYqaSxwcm92aXNpb25lZDp4Kml9KX1yZXR1cm4gZX1mdW5jdGlvbiBaKHQsZSxjPW51bGwpe2NvbnN0IHM9YyE9PW51bGw/YzpNYXRoLm1heCguLi5lLm1hcChVPT5NYXRoLm1heChVLmxvYWQsVS5wcm92aXNpb25lZCkpKSxoPVsiTSIsIlQiLCJXIiwiVCIsIkYiLCJTIiwiUyJdLHk9KDI4MC0yKjIpLyhlLmxlbmd0aC0xKSxmPWUubGVuZ3RoLzcseD1oLm1hcCgoVSxHKT0+YDx0ZXh0IHg9IiR7MitHKmYqeStmKnkvMn0iIHk9IjQ4IiBmb250LXNpemU9IjgiIGZpbGw9IiM2NDc0OGIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPiR7VX08L3RleHQ+YCkuam9pbigiIiksYT1lW2UubGVuZ3RoLTFdLGQ9MisoZS5sZW5ndGgtMSkqeSxtPSgzOC0yKjIpL3MsTT0zNi1hLmxvYWQqbSwkPTM2LWEucHJvdmlzaW9uZWQqbSx2PWAKICAgIDxzdmcgd2lkdGg9IjMxMCIgaGVpZ2h0PSI1MCIgdmlld0JveD0iMCAwIDMxMCA1MCIgY2xhc3M9InNwYXJrbGluZSI+CiAgICAgIDxkZWZzPgogICAgICAgIDxsaW5lYXJHcmFkaWVudCBpZD0ibG9hZEdyYWRpZW50LSR7dC5kYXRhc2V0LnByb3ZpZGVyfSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPgogICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzNiODJmNjtzdG9wLW9wYWNpdHk6MC4zIiAvPgogICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojM2I4MmY2O3N0b3Atb3BhY2l0eTowLjA1IiAvPgogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICAgIDwvZGVmcz4KICAgICAgJHtGKGUsImxvYWQiLDI4MCwzOCwyLHMsITApfQogICAgICAke0YoZSwicHJvdmlzaW9uZWQiLDI4MCwzOCwyLHMsITEpfQogICAgICAke3h9CiAgICAgIDx0ZXh0IHg9IiR7ZCs0fSIgeT0iJHtNKzN9IiBmb250LXNpemU9IjgiIGZpbGw9IiMzYjgyZjYiIGZvbnQtd2VpZ2h0PSI1MDAiPmxvYWQ8L3RleHQ+CiAgICAgIDx0ZXh0IHg9IiR7ZC00fSIgeT0iJHtNYXRoLm1heCgkLTEwLDEwKX0iIGZvbnQtc2l6ZT0iOCIgZmlsbD0iIzk0YTNiOCIgZm9udC13ZWlnaHQ9IjUwMCI+Y2FwYWNpdHk8L3RleHQ+CiAgICA8L3N2Zz4KICBgO3QuaW5uZXJIVE1MPXZ9ZnVuY3Rpb24gRih0LGUsYyxyLGksbCxvKXtjb25zdCBwPShjLWkqMikvKHQubGVuZ3RoLTEpLHM9KHItaSoyKS9sO2xldCBoPSIiO2lmKHQuZm9yRWFjaCgoeSxmKT0+e2NvbnN0IHg9aStmKnAsYT1yLWkteVtlXSpzO2grPWY9PT0wP2BNICR7eH0sJHthfWA6YCBMICR7eH0sJHthfWB9KSxvKXtjb25zdCB5PWkrKHQubGVuZ3RoLTEpKnA7cmV0dXJuIGgrPWAgTCAke3l9LCR7ci1pfSBMICR7aX0sJHtyLWl9IFpgLGA8cGF0aCBkPSIke2h9IiBmaWxsPSJ1cmwoI2xvYWRHcmFkaWVudC0ke3RbMF0ucHJvdmlkZXJ8fCJkZWZhdWx0In0pIiBzdHJva2U9IiMzYjgyZjYiIHN0cm9rZS13aWR0aD0iMS41IiAvPmB9ZWxzZSByZXR1cm5gPHBhdGggZD0iJHtofSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTRhM2I4IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWRhc2hhcnJheT0iMywzIiAvPmB9ZnVuY3Rpb24gSCh0LGUsYz1udWxsKXt2YXIgcCxzLGgseSxmLHg7Y29uc3Qgcj1DLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXByb3ZpZGVyPSIke3R9Il1gKTtpZihyLnF1ZXJ5U2VsZWN0b3IoIi5hbW91bnQiKS50ZXh0Q29udGVudD1iKGUudG90YWwpLGUubG9hZFBhdHRlcm4pe2NvbnN0IGE9ci5xdWVyeVNlbGVjdG9yKCIuc3BhcmtsaW5lLWNvbnRhaW5lciIpO2lmKGEpe2EuZGF0YXNldC5wcm92aWRlcj10O2NvbnN0IGQ9ayhlLmxvYWRQYXR0ZXJuKTtkLmZvckVhY2gobT0+bS5wcm92aWRlcj10KSxaKGEsZCxjKX19aWYoZS5wcm9kQ29tcHV0ZSE9PXZvaWQgMCl7ci5xdWVyeVNlbGVjdG9yKCdbZGF0YS1maWVsZD0icHJvZC1jb21wdXRlIl0nKS50ZXh0Q29udGVudD1gJCR7YihlLnByb2RDb21wdXRlKX1gO2NvbnN0IGE9ci5xdWVyeVNlbGVjdG9yKCdbZGF0YS1maWVsZD0icHJvZC1jb21wdXRlLWNhbGMiXScpO2EmJigocD1lLmNhbGN1bGF0aW9ucykhPW51bGwmJnAucHJvZENvbXB1dGUpJiYoYS50ZXh0Q29udGVudD1lLmNhbGN1bGF0aW9ucy5wcm9kQ29tcHV0ZSl9aWYoZS5wcm9kU3RvcmFnZSE9PXZvaWQgMCl7ci5xdWVyeVNlbGVjdG9yKCdbZGF0YS1maWVsZD0icHJvZC1zdG9yYWdlIl0nKS50ZXh0Q29udGVudD1gJCR7YihlLnByb2RTdG9yYWdlKX1gO2NvbnN0IGE9ci5xdWVyeVNlbGVjdG9yKCdbZGF0YS1maWVsZD0icHJvZC1zdG9yYWdlLWNhbGMiXScpO2EmJigocz1lLmNhbGN1bGF0aW9ucykhPW51bGwmJnMucHJvZFN0b3JhZ2UpJiYoYS50ZXh0Q29udGVudD1lLmNhbGN1bGF0aW9ucy5wcm9kU3RvcmFnZSl9aWYoZS5ub25Qcm9kIT09dm9pZCAwKXtyLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWZpZWxkPSJub24tcHJvZCJdJykudGV4dENvbnRlbnQ9YCQke2IoZS5ub25Qcm9kKX1gO2NvbnN0IGE9ci5xdWVyeVNlbGVjdG9yKCdbZGF0YS1maWVsZD0ibm9uLXByb2QtY2FsYyJdJyk7YSYmKChoPWUuY2FsY3VsYXRpb25zKSE9bnVsbCYmaC5ub25Qcm9kKSYmKGEudGV4dENvbnRlbnQ9ZS5jYWxjdWxhdGlvbnMubm9uUHJvZCl9aWYoZS5pbyE9PXZvaWQgMCl7Y29uc3QgYT1yLnF1ZXJ5U2VsZWN0b3JBbGwoIi5pby1jb3N0Iik7aWYoZS5pbz09PTApYS5mb3JFYWNoKGQ9PmQuc3R5bGUuZGlzcGxheT0ibm9uZSIpO2Vsc2V7YS5mb3JFYWNoKG09Pm0uc3R5bGUuZGlzcGxheT0iIiksci5xdWVyeVNlbGVjdG9yKCdbZGF0YS1maWVsZD0iaW8iXScpLnRleHRDb250ZW50PWAkJHtiKGUuaW8pfWA7Y29uc3QgZD1yLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWZpZWxkPSJpby1jYWxjIl0nKTtkJiYoKHk9ZS5jYWxjdWxhdGlvbnMpIT1udWxsJiZ5LmlvKSYmKGQudGV4dENvbnRlbnQ9ZS5jYWxjdWxhdGlvbnMuaW8pfX1jb25zdCBpPXIucXVlcnlTZWxlY3RvcigiLm5vbi1wcm9kdWN0aW9uLXNlY3Rpb24iKTtpJiYoaS5zdHlsZS5kaXNwbGF5PW4uZGV2ZWxvcGVycz09PTA/Im5vbmUiOiIiKTtjb25zdCBsPXIucXVlcnlTZWxlY3RvcigiLnNvYzItY29zdCIpO2lmKGwpaWYobi5zb2MyKWlmKGwuc3R5bGUuZGlzcGxheT0iZmxleCIsZS5zb2MyPjApe2wucXVlcnlTZWxlY3RvcignW2RhdGEtZmllbGQ9InNvYzIiXScpLnRleHRDb250ZW50PWAkJHtiKGUuc29jMil9YDtjb25zdCBhPWwucXVlcnlTZWxlY3RvcignW2RhdGEtZmllbGQ9InNvYzItY2FsYyJdJyk7YSYmKChmPWUuY2FsY3VsYXRpb25zKSE9bnVsbCYmZi5zb2MyKSYmKGEudGV4dENvbnRlbnQ9ZS5jYWxjdWxhdGlvbnMuc29jMil9ZWxzZXtsLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWZpZWxkPSJzb2MyIl0nKS50ZXh0Q29udGVudD0iSW5jbHVkZWQiO2NvbnN0IGE9bC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1maWVsZD0ic29jMi1jYWxjIl0nKTthJiYoYS50ZXh0Q29udGVudD0iIil9ZWxzZSBsLnN0eWxlLmRpc3BsYXk9Im5vbmUiO2NvbnN0IG89ci5xdWVyeVNlbGVjdG9yKCIuaGlwYWEtY29zdCIpO2lmKG8paWYobi5oaXBhYSlpZihvLnN0eWxlLmRpc3BsYXk9ImZsZXgiLGUuaGlwYWE+MCl7by5xdWVyeVNlbGVjdG9yKCdbZGF0YS1maWVsZD0iaGlwYWEiXScpLnRleHRDb250ZW50PWAkJHtiKGUuaGlwYWEpfWA7Y29uc3QgYT1vLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWZpZWxkPSJoaXBhYS1jYWxjIl0nKTthJiYoKHg9ZS5jYWxjdWxhdGlvbnMpIT1udWxsJiZ4LmhpcGFhKSYmKGEudGV4dENvbnRlbnQ9ZS5jYWxjdWxhdGlvbnMuaGlwYWEpfWVsc2V7by5xdWVyeVNlbGVjdG9yKCdbZGF0YS1maWVsZD0iaGlwYWEiXScpLnRleHRDb250ZW50PSJJbmNsdWRlZCI7Y29uc3QgYT1vLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWZpZWxkPSJoaXBhYS1jYWxjIl0nKTthJiYoYS50ZXh0Q29udGVudD0iIil9ZWxzZSBvLnN0eWxlLmRpc3BsYXk9Im5vbmUifWZ1bmN0aW9uIGoodCl7Y29uc3QgZT1bIm5lb24iLCJzdXBhYmFzZSIsImF1cm9yYSJdLGM9TWF0aC5taW4oLi4uT2JqZWN0LnZhbHVlcyh0KSk7ZS5mb3JFYWNoKHI9Pntjb25zdCBpPUMucXVlcnlTZWxlY3RvcihgW2RhdGEtcHJvdmlkZXI9IiR7cn0iXWApLGw9aS5xdWVyeVNlbGVjdG9yKCIuYmVzdC1wcmljZSIpLG89aS5xdWVyeVNlbGVjdG9yKCIubW9yZS1leHBlbnNpdmUiKTtpZih0W3JdPT09YylsLnN0eWxlLmRpc3BsYXk9ImlubGluZS1ibG9jayIsby5zdHlsZS5kaXNwbGF5PSJub25lIixpLmNsYXNzTGlzdC5hZGQoImlzLWJlc3QtcHJpY2UiKTtlbHNle2wuc3R5bGUuZGlzcGxheT0ibm9uZSI7Y29uc3QgcD10W3JdL2Mscz1wJTE9PT0wP3AudG9GaXhlZCgwKTpwLnRvRml4ZWQoMSk7by50ZXh0Q29udGVudD1gJHtzfXggcHJpY2VgLG8uc3R5bGUuZGlzcGxheT0iaW5saW5lLWJsb2NrIixpLmNsYXNzTGlzdC5yZW1vdmUoImlzLWJlc3QtcHJpY2UiKX19KX1mdW5jdGlvbiBxKCl7Y29uc3QgdD1JKCksZT1MKCksYz1FKCkscj1rKHQubG9hZFBhdHRlcm4pLGk9ayhlLmxvYWRQYXR0ZXJuKSxsPWsoYy5sb2FkUGF0dGVybiksbz1bLi4uciwuLi5pLC4uLmxdLHA9TWF0aC5tYXgoLi4uby5tYXAoaD0+TWF0aC5tYXgoaC5sb2FkLGgucHJvdmlzaW9uZWQpKSk7SCgibmVvbiIsdCxwKSxIKCJzdXBhYmFzZSIsZSxwKSxIKCJhdXJvcmEiLGMscCksaih7bmVvbjp0LnRvdGFsLHN1cGFiYXNlOmUudG90YWwsYXVyb3JhOmMudG90YWx9KTtjb25zdCBzPUMucXVlcnlTZWxlY3RvcigiLmNoYXJ0LXZpZXciKTtzJiZzLnN0eWxlLmRpc3BsYXkhPT0ibm9uZSImJkQodCxlLGMpfWZ1bmN0aW9uIEQodCxlLGMpe2NvbnN0IHI9Qy5xdWVyeVNlbGVjdG9yKCIuYmFyLWNoYXJ0Iik7aWYoIXIpcmV0dXJuO2NvbnN0IGk9NjAwLGw9MzAwLG89e3RvcDo0MCxyaWdodDoyMCxib3R0b206NjAsbGVmdDo2MH0scD1pLW8ubGVmdC1vLnJpZ2h0LHM9bC1vLnRvcC1vLmJvdHRvbSxoPVt7bmFtZToiTmVvbiIscHJpY2luZzp0LGNvbG9yOiIjMDRlNTliIn0se25hbWU6IlN1cGFiYXNlIixwcmljaW5nOmUsY29sb3I6IiNhZWUxZWIifSx7bmFtZToiQXVyb3JhIFNlcnZlcmxlc3MgVjIiLHByaWNpbmc6Yyxjb2xvcjoiI2YxZjA3NiJ9XSx5PU1hdGgubWF4KHQudG90YWwsZS50b3RhbCxjLnRvdGFsKSoxLjEsZj1wL2gubGVuZ3RoLzEuNSx4PXAvaC5sZW5ndGg7bGV0IGE9YAogICAgPGRlZnM+CiAgICAgICR7aC5tYXAoKGQsbSk9PmAKICAgICAgICA8cGF0dGVybiBpZD0icGF0dGVybi1zb2xpZC0ke219IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgICAgIDxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiR7ZC5jb2xvcn0iLz4KICAgICAgICA8L3BhdHRlcm4+CiAgICAgICAgPHBhdHRlcm4gaWQ9InBhdHRlcm4tZGlhZ29uYWwtJHttfSIgd2lkdGg9IjgiIGhlaWdodD0iOCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+CiAgICAgICAgICA8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI4IiBmaWxsPSIke2QuY29sb3J9Ii8+CiAgICAgICAgPC9wYXR0ZXJuPgogICAgICAgIDxwYXR0ZXJuIGlkPSJwYXR0ZXJuLWRvdHMtJHttfSIgd2lkdGg9IjgiIGhlaWdodD0iOCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgICAgICA8Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMS41IiBmaWxsPSIke2QuY29sb3J9Ii8+CiAgICAgICAgICA8Y2lyY2xlIGN4PSI2IiBjeT0iNiIgcj0iMS41IiBmaWxsPSIke2QuY29sb3J9Ii8+CiAgICAgICAgPC9wYXR0ZXJuPgogICAgICAgIDxwYXR0ZXJuIGlkPSJwYXR0ZXJuLWhvcml6b250YWwtJHttfSIgd2lkdGg9IjgiIGhlaWdodD0iOCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgICAgICA8bGluZSB4MT0iMCIgeTE9IjIiIHgyPSI4IiB5Mj0iMiIgc3Ryb2tlPSIke2QuY29sb3J9IiBzdHJva2Utd2lkdGg9IjIiLz4KICAgICAgICAgIDxsaW5lIHgxPSIwIiB5MT0iNiIgeDI9IjgiIHkyPSI2IiBzdHJva2U9IiR7ZC5jb2xvcn0iIHN0cm9rZS13aWR0aD0iMiIvPgogICAgICAgIDwvcGF0dGVybj4KICAgICAgICA8cGF0dGVybiBpZD0icGF0dGVybi1jcm9zc2hhdGNoLSR7bX0iIHdpZHRoPSI4IiBoZWlnaHQ9IjgiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICAgICAgPHBhdGggZD0iTTAsMCBMOCw4IE04LDAgTDAsOCIgc3Ryb2tlPSIke2QuY29sb3J9IiBzdHJva2Utd2lkdGg9IjEuNSIvPgogICAgICAgIDwvcGF0dGVybj4KICAgICAgICA8cGF0dGVybiBpZD0icGF0dGVybi12ZXJ0aWNhbC0ke219IiB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgICAgIDxsaW5lIHgxPSIyIiB5MT0iMCIgeDI9IjIiIHkyPSI4IiBzdHJva2U9IiR7ZC5jb2xvcn0iIHN0cm9rZS13aWR0aD0iMiIvPgogICAgICAgICAgPGxpbmUgeDE9IjYiIHkxPSIwIiB4Mj0iNiIgeTI9IjgiIHN0cm9rZT0iJHtkLmNvbG9yfSIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgICAgICAgPC9wYXR0ZXJuPgogICAgICBgKS5qb2luKCIiKX0KICAgIDwvZGVmcz4KICBgO2guZm9yRWFjaCgoZCxtKT0+e3ZhciBBO2NvbnN0IE09by5sZWZ0K20qeCsoeC1mKS8yLCQ9ZC5wcmljaW5nO2xldCB2PW8udG9wK3M7Y29uc3QgVT1bXTtpZigkLnByb2RDb21wdXRlPjApe2NvbnN0IHU9JC5wcm9kQ29tcHV0ZS95KnM7VS5wdXNoKHtsYWJlbDoiQ29tcHV0ZSIsdmFsdWU6JC5wcm9kQ29tcHV0ZSx5OnYtdSxoZWlnaHQ6dSxwYXR0ZXJuOmBwYXR0ZXJuLXNvbGlkLSR7bX1gfSksdi09dX1pZigkLnByb2RTdG9yYWdlPjApe2NvbnN0IHU9JC5wcm9kU3RvcmFnZS95KnM7VS5wdXNoKHtsYWJlbDoiU3RvcmFnZSIsdmFsdWU6JC5wcm9kU3RvcmFnZSx5OnYtdSxoZWlnaHQ6dSxwYXR0ZXJuOmBwYXR0ZXJuLWRpYWdvbmFsLSR7bX1gfSksdi09dX1pZigkLmlvJiYkLmlvPjApe2NvbnN0IHU9JC5pby95KnM7VS5wdXNoKHtsYWJlbDoiSS9PIix2YWx1ZTokLmlvLHk6di11LGhlaWdodDp1LHBhdHRlcm46YHBhdHRlcm4tZG90cy0ke219YH0pLHYtPXV9aWYoJC5ub25Qcm9kPjApe2NvbnN0IHU9JC5ub25Qcm9kL3kqcztVLnB1c2goe2xhYmVsOiJEZXYvU3RhZ2luZyIsdmFsdWU6JC5ub25Qcm9kLHk6di11LGhlaWdodDp1LHBhdHRlcm46YHBhdHRlcm4taG9yaXpvbnRhbC0ke219YH0pLHYtPXV9aWYoJC5zb2MyPjApe2NvbnN0IHU9JC5zb2MyL3kqcztVLnB1c2goe2xhYmVsOiJTT0MyIix2YWx1ZTokLnNvYzIseTp2LXUsaGVpZ2h0OnUscGF0dGVybjpgcGF0dGVybi1jcm9zc2hhdGNoLSR7bX1gfSksdi09dX1pZigkLmhpcGFhPjApe2NvbnN0IHU9JC5oaXBhYS95KnM7VS5wdXNoKHtsYWJlbDoiSElQQUEiLHZhbHVlOiQuaGlwYWEseTp2LXUsaGVpZ2h0OnUscGF0dGVybjpgcGF0dGVybi12ZXJ0aWNhbC0ke219YH0pLHYtPXV9VS5mb3JFYWNoKHU9PnthKz1gPHJlY3QgeD0iJHtNfSIgeT0iJHt1Lnl9IiB3aWR0aD0iJHtmfSIgaGVpZ2h0PSIke3UuaGVpZ2h0fSIgZmlsbD0idXJsKCMke3UucGF0dGVybn0pIiBzdHJva2U9IiR7ZC5jb2xvcn0iIHN0cm9rZS13aWR0aD0iMSIgY2xhc3M9ImJhci1zZWdtZW50Ij48dGl0bGU+JHt1LmxhYmVsfTogJCR7Yih1LnZhbHVlKX08L3RpdGxlPjwvcmVjdD5gfSk7Y29uc3QgRz0oKEE9VVswXSk9PW51bGw/dm9pZCAwOkEueSl8fG8udG9wK3M7YSs9YDx0ZXh0IHg9IiR7TStmLzJ9IiB5PSIke0ctMzV9IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iNjAwIiBmaWxsPSIjZmZmIj4kJHtiKCQudG90YWwpfS9tb248L3RleHQ+YCxhKz1gPHRleHQgeD0iJHtNK2YvMn0iIHk9IiR7by50b3ArcyszMH0iIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSI1MDAiIGZpbGw9IiM5NGEzYjgiPiR7ZC5uYW1lfTwvdGV4dD5gfSksYSs9YDxsaW5lIHgxPSIke28ubGVmdH0iIHkxPSIke28udG9wfSIgeDI9IiR7by5sZWZ0fSIgeTI9IiR7by50b3Arc30iIHN0cm9rZT0iIzQ3NTU2OSIgc3Ryb2tlLXdpZHRoPSIyIi8+YCxhKz1gPGxpbmUgeDE9IiR7by5sZWZ0fSIgeTE9IiR7by50b3Arc30iIHgyPSIke2ktby5yaWdodH0iIHkyPSIke28udG9wK3N9IiBzdHJva2U9IiM0NzU1NjkiIHN0cm9rZS13aWR0aD0iMiIvPmAsci5pbm5lckhUTUw9YX1jb25zdCBUPUMucXVlcnlTZWxlY3RvckFsbCgiLnZpZXctdG9nZ2xlLWJ0biIpLHo9Qy5xdWVyeVNlbGVjdG9yKCIucGFuZWxzLWNvbnRhaW5lciIpLFc9Qy5xdWVyeVNlbGVjdG9yKCIuY2hhcnQtdmlldyIpO1QuZm9yRWFjaCh0PT57dC5hZGRFdmVudExpc3RlbmVyKCJjbGljayIsKCk9Pntjb25zdCBlPXQuZGF0YXNldC52aWV3O2lmKFQuZm9yRWFjaChjPT5jLmNsYXNzTGlzdC5yZW1vdmUoImFjdGl2ZSIpKSx0LmNsYXNzTGlzdC5hZGQoImFjdGl2ZSIpLGU9PT0icGFuZWxzIil6LnN0eWxlLmRpc3BsYXk9ImdyaWQiLFcuc3R5bGUuZGlzcGxheT0ibm9uZSI7ZWxzZXt6LnN0eWxlLmRpc3BsYXk9Im5vbmUiLFcuc3R5bGUuZGlzcGxheT0iYmxvY2siO2NvbnN0IGM9SSgpLHI9TCgpLGk9RSgpO0QoYyxyLGkpfX0pfSksUy5hZGRFdmVudExpc3RlbmVyKCJpbnB1dCIsdD0+e24uc3RvcmFnZT1wYXJzZUludCh0LnRhcmdldC52YWx1ZSksUC50ZXh0Q29udGVudD1gJHtuLnN0b3JhZ2V9IEdCYCxxKCl9KSx3LmFkZEV2ZW50TGlzdGVuZXIoImlucHV0Iix0PT57bi5kZXZlbG9wZXJzPXBhcnNlSW50KHQudGFyZ2V0LnZhbHVlKSxOLnRleHRDb250ZW50PW4uZGV2ZWxvcGVycztjb25zdCBlPUMucXVlcnlTZWxlY3RvcigiI2xvY2FsLWRldi1oZWxwIik7ZSYmKGUuc3R5bGUuZGlzcGxheT1uLmRldmVsb3BlcnM9PT0wPyJpbmxpbmUiOiJub25lIikscSgpfSksVi5hZGRFdmVudExpc3RlbmVyKCJjaGFuZ2UiLHQ9PntuLnNvYzI9dC50YXJnZXQuY2hlY2tlZCxxKCl9KSxZLmFkZEV2ZW50TGlzdGVuZXIoImNoYW5nZSIsdD0+e24uaGlwYWE9dC50YXJnZXQuY2hlY2tlZCxxKCl9KSxxKCl9d2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKXtCKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIiN3aWRnZXQyLWNvbnRhaW5lciAud2lkZ2V0LXdyYXBwZXIiKSl9LDFlMyl9KSgpOwo="></script>

**Scenario 3. Scaling your business (4 to 10CU, 100GB, always on)**: You’ve found product-market fit for your new product and now is investing in scaling both the company and the product. You start to get compliance requirements because you are getting into that segment of the market. You upgrade to the most expensive tier on Neon that is “all features included”. Even in this case, Neon is substantially cheaper than the other two alternatives.

<div id="widget3-container">
  
  <div className="widget-wrapper">
    <div className="widget-header">
      <h3>Scaling Workload</h3>
      <p className="workload-description">Large database with high traffic and enterprise requirements for a scaling company.</p>
      <div className="view-toggle">
        <button className="view-toggle-btn active" data-view="chart">Chart</button>
        <button className="view-toggle-btn" data-view="panels">Details</button>
      </div>
    </div>

    <div className="panels-container">
      <div className="pricing-panel" data-provider="neon">
        <div className="panel-header">
          <h4>Neon</h4>
          <div className="badge best-price">Best Price</div>
          <div className="badge more-expensive"></div>
        </div>
        <div className="total-cost">
          <span className="currency">$</span>
          <span className="amount">0</span>
          <span className="period">/mo</span>
        </div>
        <div className="sparkline-container"></div>
        <div className="cost-breakdown">
          <div className="breakdown-section">
            <h5>Production</h5>
            <div className="breakdown-item">
              <span>Compute</span>
              <span className="value" data-field="prod-compute">$0</span>
            </div>
            <div className="calculation" data-field="prod-compute-calc"></div>
            <div className="breakdown-item">
              <span>Storage</span>
              <span className="value" data-field="prod-storage">$0</span>
            </div>
            <div className="calculation" data-field="prod-storage-calc"></div>
          </div>
          <div className="breakdown-section">
            <h5>Non-Production</h5>
            <div className="breakdown-item">
              <span>Dev/Staging</span>
              <span className="value" data-field="non-prod">$0</span>
            </div>
            <div className="calculation" data-field="non-prod-calc"></div>
          </div>
          <div className="breakdown-section">
            <h5>Add-ons</h5>
            <div className="breakdown-item soc2-cost">
              <span>SOC2</span>
              <span className="value" data-field="soc2">$0</span>
            </div>
            <div className="calculation soc2-cost" data-field="soc2-calc"></div>
            <div className="breakdown-item hipaa-cost">
              <span>HIPAA</span>
              <span className="value" data-field="hipaa">$0</span>
            </div>
            <div className="calculation hipaa-cost" data-field="hipaa-calc"></div>
          </div>
        </div>
      </div>

      <div className="pricing-panel" data-provider="supabase">
        <div className="panel-header">
          <h4>Supabase</h4>
          <div className="badge best-price">Best Price</div>
          <div className="badge more-expensive"></div>
        </div>
        <div className="total-cost">
          <span className="currency">$</span>
          <span className="amount">0</span>
          <span className="period">/mo</span>
        </div>
        <div className="sparkline-container"></div>
        <div className="cost-breakdown">
          <div className="breakdown-section">
            <h5>Production</h5>
            <div className="breakdown-item">
              <span>Compute</span>
              <span className="value" data-field="prod-compute">$0</span>
            </div>
            <div className="calculation" data-field="prod-compute-calc"></div>
            <div className="breakdown-item">
              <span>Storage</span>
              <span className="value" data-field="prod-storage">$0</span>
            </div>
            <div className="calculation" data-field="prod-storage-calc"></div>
          </div>
          <div className="breakdown-section">
            <h5>Non-Production</h5>
            <div className="breakdown-item">
              <span>Dev/Staging</span>
              <span className="value" data-field="non-prod">$0</span>
            </div>
            <div className="calculation" data-field="non-prod-calc"></div>
          </div>
          <div className="breakdown-section">
            <h5>Add-ons</h5>
            <div className="breakdown-item soc2-cost">
              <span>SOC2</span>
              <span className="value" data-field="soc2">$0</span>
            </div>
            <div className="calculation soc2-cost" data-field="soc2-calc"></div>
            <div className="breakdown-item hipaa-cost">
              <span>HIPAA</span>
              <span className="value" data-field="hipaa">$0</span>
            </div>
            <div className="calculation hipaa-cost" data-field="hipaa-calc"></div>
          </div>
        </div>
      </div>

      <div className="pricing-panel" data-provider="aurora">
        <div className="panel-header">
          <h4>Aurora Serverless</h4>
          <div className="badge best-price">Best Price</div>
          <div className="badge more-expensive"></div>
        </div>
        <div className="total-cost">
          <span className="currency">$</span>
          <span className="amount">0</span>
          <span className="period">/mo</span>
        </div>
        <div className="sparkline-container"></div>
        <div className="cost-breakdown">
          <div className="breakdown-section">
            <h5>Production</h5>
            <div className="breakdown-item">
              <span>Compute</span>
              <span className="value" data-field="prod-compute">$0</span>
            </div>
            <div className="calculation" data-field="prod-compute-calc"></div>
            <div className="breakdown-item">
              <span>Storage</span>
              <span className="value" data-field="prod-storage">$0</span>
            </div>
            <div className="calculation" data-field="prod-storage-calc"></div>
            <div className="breakdown-item io-cost">
              <span>I/O</span>
              <span className="value" data-field="io">$0</span>
            </div>
            <div className="calculation io-cost" data-field="io-calc"></div>
          </div>
          <div className="breakdown-section">
            <h5>Non-Production</h5>
            <div className="breakdown-item">
              <span>Dev/Staging</span>
              <span className="value" data-field="non-prod">$0</span>
            </div>
            <div className="calculation" data-field="non-prod-calc"></div>
          </div>
          <div className="breakdown-section">
            <h5>Add-ons</h5>
            <div className="breakdown-item soc2-cost">
              <span>SOC2</span>
              <span className="value" data-field="soc2">$0</span>
            </div>
            <div className="calculation soc2-cost" data-field="soc2-calc"></div>
            <div className="breakdown-item hipaa-cost">
              <span>HIPAA</span>
              <span className="value" data-field="hipaa">$0</span>
            </div>
            <div className="calculation hipaa-cost" data-field="hipaa-calc"></div>
          </div>
        </div>
      </div>
    </div>

    <div className="chart-view">
      <div className="chart-content">
        <div className="chart-container">
          <svg className="bar-chart" viewBox="0 0 600 300"></svg>
        </div>
        <div className="workload-details-panel">
          <h4>Workload Details</h4>
          <p>Database has non-stop load that varies across day/week. Needs substantial compute capacity with 4-10 CU on Neon, 4XL instance on Supabase, and 8-20 ACU on Aurora to support growing user demands.</p>
        </div>
      </div>
    </div>

    <div className="config-section">
      <div className="config-row">
        <div className="config-item">
          <label htmlFor="widget3-storage">Storage (GB)</label>
          <div className="config-values">
            <span className="config-value" id="widget3-storage-value">100 GB</span>
            <input type="range" id="widget3-storage" min="100" max="500" defaultValue="100" step="25" />
          </div>
        </div>

        <div className="config-item">
          <label htmlFor="widget3-developers">Dev Branches</label>
          <div className="config-values">
            <span className="config-value" id="widget3-developers-value">15</span>
            <input type="range" id="widget3-developers" min="0" max="50" defaultValue="15" step="5" />
          </div>
        </div>

        <div className="config-item">
          <label htmlFor="widget3-soc2"><input type="checkbox" id="widget3-soc2" defaultChecked />SOC2</label>
        </div>

        <div className="config-item">
          <label htmlFor="widget3-hipaa"><input type="checkbox" id="widget3-hipaa" defaultChecked />HIPAA</label>
        </div>
      </div>
    </div>
  </div>

</div>
<link rel="stylesheet" href="data:text/css;base64,Kntib3gtc2l6aW5nOmJvcmRlci1ib3h9LndpZGdldC13cmFwcGVye2ZvbnQtZmFtaWx5Oi1hcHBsZS1zeXN0ZW0sQmxpbmtNYWNTeXN0ZW1Gb250LFNlZ29lIFVJLFJvYm90byxPeHlnZW4sVWJ1bnR1LENhbnRhcmVsbCxzYW5zLXNlcmlmO21heC13aWR0aDoxMjAwcHg7bWFyZ2luOjEwcHggYXV0bztwYWRkaW5nOjIwcHg7YmFja2dyb3VuZDojMWExYTFhO2JvcmRlcjoxcHggc29saWQgIzMzMzMzM30ud2lkZ2V0LWhlYWRlcnt0ZXh0LWFsaWduOmxlZnQ7bWFyZ2luLWJvdHRvbToyNHB4O3Bvc2l0aW9uOnJlbGF0aXZlfS53aWRnZXQtaGVhZGVyIGgze21hcmdpbjowIDAgNnB4O2ZvbnQtc2l6ZToxLjVyZW07Zm9udC13ZWlnaHQ6NjAwO2NvbG9yOiNmZmY7bGV0dGVyLXNwYWNpbmc6LS4wMmVtO3BhZGRpbmctcmlnaHQ6MTQwcHh9Lndvcmtsb2FkLWRlc2NyaXB0aW9ue21hcmdpbjowO2ZvbnQtc2l6ZTouODc1cmVtO2NvbG9yOiM5OTk7bGluZS1oZWlnaHQ6MS41O2ZvbnQtd2VpZ2h0OjQwMDtwYWRkaW5nLXJpZ2h0OjE0MHB4fS5wYW5lbHMtY29udGFpbmVye2Rpc3BsYXk6Z3JpZDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6cmVwZWF0KDMsMWZyKTtnYXA6MjBweDttYXJnaW4tYm90dG9tOjI0cHh9LnBhbmVscy1jb250YWluZXI+KnttaW4td2lkdGg6MH0ucHJpY2luZy1wYW5lbHtiYWNrZ3JvdW5kOiMyNTI1MjU7Ym9yZGVyOjFweCBzb2xpZCAjM2EzYTNhO3BhZGRpbmc6MThweDt0cmFuc2l0aW9uOm5vbmU7d2lkdGg6MTAwJX0ucHJpY2luZy1wYW5lbC5pcy1iZXN0LXByaWNle2JhY2tncm91bmQ6IzI1MjUyNTtib3JkZXItY29sb3I6I2ZmZjtib3JkZXItd2lkdGg6MnB4O3BhZGRpbmc6MTdweH0ucGFuZWwtaGVhZGVye2Rpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpiYXNlbGluZTttYXJnaW4tYm90dG9tOjhweDtwYWRkaW5nLWJvdHRvbTo4cHg7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgIzNhM2EzYX0ucHJpY2luZy1wYW5lbC5pcy1iZXN0LXByaWNlIC5wYW5lbC1oZWFkZXJ7Ym9yZGVyLWJvdHRvbS1jb2xvcjojZmZmfS5wYW5lbC1oZWFkZXIgaDR7bWFyZ2luOjA7Zm9udC1zaXplOjFyZW07Zm9udC13ZWlnaHQ6NjAwO2NvbG9yOiNmZmY7d2hpdGUtc3BhY2U6bm93cmFwO292ZXJmbG93OmhpZGRlbjt0ZXh0LW92ZXJmbG93OmVsbGlwc2lzO2xldHRlci1zcGFjaW5nOi0uMDFlbX0uYmFkZ2V7cGFkZGluZzoycHggNnB4O2ZvbnQtc2l6ZTouNjVyZW07Zm9udC13ZWlnaHQ6NjAwO3RleHQtdHJhbnNmb3JtOnVwcGVyY2FzZTtsZXR0ZXItc3BhY2luZzouMDNlbTt3aGl0ZS1zcGFjZTpub3dyYXA7Ym9yZGVyOjFweCBzb2xpZCAjZmZmZmZmfS5iYWRnZS5iZXN0LXByaWNle2JhY2tncm91bmQ6I2ZmZjtjb2xvcjojMDAwfS5iYWRnZS5tb3JlLWV4cGVuc2l2ZXtiYWNrZ3JvdW5kOnRyYW5zcGFyZW50O2NvbG9yOiM5OTk7Ym9yZGVyLWNvbG9yOiM1NTV9LnRvdGFsLWNvc3R7dGV4dC1hbGlnbjpsZWZ0O21hcmdpbjoxNnB4IDAgMTJweDtwYWRkaW5nOjhweCAwfS50b3RhbC1jb3N0IC5jdXJyZW5jeXtmb250LXNpemU6MS41cmVtO2ZvbnQtd2VpZ2h0OjQwMDtjb2xvcjojOTk5O3ZlcnRpY2FsLWFsaWduOnRvcDttYXJnaW4tcmlnaHQ6MnB4fS50b3RhbC1jb3N0IC5hbW91bnR7Zm9udC1zaXplOjMuNXJlbTtmb250LXdlaWdodDozMDA7Y29sb3I6I2ZmZjtsZXR0ZXItc3BhY2luZzotLjA0ZW07bGluZS1oZWlnaHQ6MX0udG90YWwtY29zdCAucGVyaW9ke2ZvbnQtc2l6ZToxLjEyNXJlbTtjb2xvcjojOTk5O2ZvbnQtd2VpZ2h0OjQwMDttYXJnaW4tbGVmdDoycHh9LnNwYXJrbGluZS1jb250YWluZXJ7bWFyZ2luOjEycHggYXV0byAxMHB4O2Rpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2FsaWduLWl0ZW1zOmNlbnRlcjtoZWlnaHQ6NDRweH0uc3BhcmtsaW5le2Rpc3BsYXk6YmxvY2s7d2lkdGg6MTAwJTttYXgtd2lkdGg6MjgwcHh9LmNvc3QtYnJlYWtkb3due21hcmdpbi10b3A6MTZweDtib3JkZXItdG9wOjFweCBzb2xpZCAjMzMzMzMzO3BhZGRpbmctdG9wOjEycHh9LmJyZWFrZG93bi1zZWN0aW9ue21hcmdpbi1ib3R0b206MTBweH0uYnJlYWtkb3duLXNlY3Rpb246bGFzdC1jaGlsZHttYXJnaW4tYm90dG9tOjB9LmJyZWFrZG93bi1zZWN0aW9uIGg1e2Rpc3BsYXk6bm9uZX0uYnJlYWtkb3duLWl0ZW17ZGlzcGxheTpmbGV4O2p1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2FsaWduLWl0ZW1zOmJhc2VsaW5lO3BhZGRpbmc6M3B4IDA7Zm9udC1zaXplOi44MTI1cmVtO2NvbG9yOiNmZmY7bGluZS1oZWlnaHQ6MS40fS5icmVha2Rvd24taXRlbSBzcGFuOmZpcnN0LWNoaWxke2NvbG9yOiM5OTk7Zm9udC13ZWlnaHQ6NDAwfS5icmVha2Rvd24taXRlbSAudmFsdWV7Zm9udC13ZWlnaHQ6NjAwO2NvbG9yOiNmZmY7Zm9udC12YXJpYW50LW51bWVyaWM6dGFidWxhci1udW1zO2xldHRlci1zcGFjaW5nOi0uMDFlbX0uY2FsY3VsYXRpb257Zm9udC1zaXplOi42ODc1cmVtO2NvbG9yOiM2NjY7cGFkZGluZzowIDAgOHB4O2ZvbnQtZmFtaWx5OlNGIE1vbm8sTW9uYWNvLENvbnNvbGFzLG1vbm9zcGFjZTtmb250LXN0eWxlOm5vcm1hbDtsaW5lLWhlaWdodDoxLjM7Zm9udC13ZWlnaHQ6NDAwfS5yZXNvdXJjZS1pdGVte3BhZGRpbmc6NHB4IDA7Zm9udC1zaXplOi44cmVtO2NvbG9yOiNjY2M7Zm9udC13ZWlnaHQ6NTAwfS5jb25maWctc2VjdGlvbntiYWNrZ3JvdW5kOiMxZjFmMWY7cGFkZGluZzoxNnB4O2JvcmRlcjoxcHggc29saWQgIzNhM2EzYTtib3JkZXItdG9wOjJweCBzb2xpZCAjNDQ0NDQ0fS5jb25maWctcm93e2Rpc3BsYXk6Z3JpZDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6cmVwZWF0KDUsMWZyKTtnYXA6MThweH0uY29uZmlnLWl0ZW17ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6NnB4fS5jb25maWctaXRlbSBsYWJlbHtmb250LXNpemU6LjgxMjVyZW07Zm9udC13ZWlnaHQ6NTAwO2NvbG9yOiM5OTk7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4fS5jb25maWctaXRlbSBpbnB1dFt0eXBlPXJhbmdlXXt3aWR0aDoxMDAlO2hlaWdodDozcHg7YmFja2dyb3VuZDojNDQ0O291dGxpbmU6bm9uZTstd2Via2l0LWFwcGVhcmFuY2U6bm9uZX0uY29uZmlnLWl0ZW0gaW5wdXRbdHlwZT1yYW5nZV06Oi13ZWJraXQtc2xpZGVyLXRodW1iey13ZWJraXQtYXBwZWFyYW5jZTpub25lOy1tb3otYXBwZWFyYW5jZTpub25lO2FwcGVhcmFuY2U6bm9uZTt3aWR0aDoxNHB4O2hlaWdodDoxNHB4O2JhY2tncm91bmQ6I2ZmZjtjdXJzb3I6cG9pbnRlcjtib3JkZXI6bm9uZX0uY29uZmlnLWl0ZW0gaW5wdXRbdHlwZT1yYW5nZV06Oi13ZWJraXQtc2xpZGVyLXRodW1iOmhvdmVye2JhY2tncm91bmQ6I2NjY30uY29uZmlnLWl0ZW0gaW5wdXRbdHlwZT1yYW5nZV06Oi1tb3otcmFuZ2UtdGh1bWJ7d2lkdGg6MTRweDtoZWlnaHQ6MTRweDtiYWNrZ3JvdW5kOiNmZmY7Y3Vyc29yOnBvaW50ZXI7Ym9yZGVyOm5vbmV9LmNvbmZpZy1pdGVtIGlucHV0W3R5cGU9cmFuZ2VdOjotbW96LXJhbmdlLXRodW1iOmhvdmVye2JhY2tncm91bmQ6I2NjY30uY29uZmlnLWl0ZW0gaW5wdXRbdHlwZT1jaGVja2JveF17d2lkdGg6MTRweDtoZWlnaHQ6MTRweDtjdXJzb3I6cG9pbnRlcjthY2NlbnQtY29sb3I6I2ZmZmZmZn0uY29uZmlnLXZhbHVle2ZvbnQtc2l6ZTouOTM3NXJlbTtmb250LXdlaWdodDo2MDA7Y29sb3I6I2ZmZjtmb250LXZhcmlhbnQtbnVtZXJpYzp0YWJ1bGFyLW51bXM7ZmxleC1zaHJpbms6MH0uY29uZmlnLWhlbHB7Zm9udC1zaXplOi42ODc1cmVtO2NvbG9yOiM2NjY7Zm9udC1zdHlsZTpub3JtYWw7Zm9udC13ZWlnaHQ6NDAwfUBtZWRpYSAobWF4LXdpZHRoOiAxMDI0cHgpey5wYW5lbHMtY29udGFpbmVye2dyaWQtdGVtcGxhdGUtY29sdW1uczoxZnI7Z2FwOjE2cHh9LmNvbmZpZy1yb3d7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOnJlcGVhdCgyLDFmcil9fUBtZWRpYSAobWF4LXdpZHRoOiA2NDBweCl7LndpZGdldC13cmFwcGVye3BhZGRpbmc6MTZweH0uY29uZmlnLXJvd3tncmlkLXRlbXBsYXRlLWNvbHVtbnM6MWZyfS53aWRnZXQtaGVhZGVyIGgze2ZvbnQtc2l6ZToxLjM3NXJlbX0udG90YWwtY29zdCAuYW1vdW50e2ZvbnQtc2l6ZToyLjc1cmVtfX0uY29uZmlnLXZhbHVlc3tkaXNwbGF5OmZsZXg7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHh9LnZpZXctdG9nZ2xle3Bvc2l0aW9uOmFic29sdXRlO3RvcDowO3JpZ2h0OjA7ZGlzcGxheTpmbGV4O2dhcDo0cHg7YmFja2dyb3VuZDojMjUyNTI1O3BhZGRpbmc6M3B4O2JvcmRlci1yYWRpdXM6NHB4O3dpZHRoOmZpdC1jb250ZW50fS52aWV3LXRvZ2dsZS1idG57YmFja2dyb3VuZDp0cmFuc3BhcmVudDtib3JkZXI6bm9uZTtjb2xvcjojOTRhM2I4O3BhZGRpbmc6NHB4IDEwcHg7Ym9yZGVyLXJhZGl1czozcHg7Zm9udC1zaXplOi43NXJlbTtmb250LXdlaWdodDo1MDA7Y3Vyc29yOnBvaW50ZXI7dHJhbnNpdGlvbjphbGwgLjJzfS52aWV3LXRvZ2dsZS1idG46aG92ZXJ7Y29sb3I6I2ZmZjtiYWNrZ3JvdW5kOiMzMzN9LnZpZXctdG9nZ2xlLWJ0bi5hY3RpdmV7YmFja2dyb3VuZDojM2EzYTNhO2NvbG9yOiNmZmZ9LmNoYXJ0LXZpZXd7bWFyZ2luLWJvdHRvbToyNHB4fS5jaGFydC1jb250ZW50e2Rpc3BsYXk6Z3JpZDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6MmZyIDFmcjtnYXA6MjBweDthbGlnbi1pdGVtczpzdGFydH0uY2hhcnQtY29udGFpbmVyLC53b3JrbG9hZC1kZXRhaWxzLXBhbmVse2JhY2tncm91bmQ6IzI1MjUyNTtib3JkZXI6MXB4IHNvbGlkICMzYTNhM2E7cGFkZGluZzoyMHB4fS53b3JrbG9hZC1kZXRhaWxzLXBhbmVsIGg0e21hcmdpbjowIDAgMTZweDtmb250LXNpemU6MS4xMjVyZW07Zm9udC13ZWlnaHQ6NjAwO2NvbG9yOiNmZmZ9Lndvcmtsb2FkLWRldGFpbHMtcGFuZWwgcHttYXJnaW46MDtmb250LXNpemU6LjgxMjVyZW07bGluZS1oZWlnaHQ6MS41O2NvbG9yOiNjY2N9LmJhci1jaGFydHt3aWR0aDoxMDAlO2hlaWdodDphdXRvO21heC13aWR0aDo2MDBweDttYXJnaW46MCBhdXRvO2Rpc3BsYXk6YmxvY2t9LmJhci1zZWdtZW50e2N1cnNvcjpwb2ludGVyO3RyYW5zaXRpb246b3BhY2l0eSAuMnN9LmJhci1zZWdtZW50OmhvdmVye29wYWNpdHk6LjghaW1wb3J0YW50fS5jaGFydC1kYXRhLXRhYmxle2Rpc3BsYXk6Z3JpZDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6cmVwZWF0KDMsMWZyKTtnYXA6MjBweH0udGFibGUtY29sdW1ue2JhY2tncm91bmQ6IzI1MjUyNTtib3JkZXI6MXB4IHNvbGlkICMzYTNhM2E7cGFkZGluZzoxOHB4fS50YWJsZS1jb2x1bW4gaDR7bWFyZ2luOjAgMCAxNnB4O2ZvbnQtc2l6ZToxLjEyNXJlbTtmb250LXdlaWdodDo2MDA7Y29sb3I6I2ZmZjtwYWRkaW5nLWJvdHRvbToxMnB4O2JvcmRlci1ib3R0b206MXB4IHNvbGlkICMzYTNhM2F9LnRhYmxlLXJvd3tkaXNwbGF5OmZsZXg7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6Y2VudGVyO3BhZGRpbmc6OHB4IDA7Zm9udC1zaXplOi44NzVyZW19LnRhYmxlLXJvdyAubGFiZWx7Y29sb3I6Izk0YTNiODtmb250LXdlaWdodDo0MDB9LnRhYmxlLXJvdyAudmFsdWV7Y29sb3I6I2ZmZjtmb250LXdlaWdodDo1MDB9LnRhYmxlLXJvdy50b3RhbHttYXJnaW4tdG9wOjhweDtwYWRkaW5nLXRvcDoxMnB4O2JvcmRlci10b3A6MXB4IHNvbGlkICMzYTNhM2E7Zm9udC13ZWlnaHQ6NjAwfS50YWJsZS1yb3cudG90YWwgLmxhYmVse2NvbG9yOiNmZmY7Zm9udC13ZWlnaHQ6NjAwfS50YWJsZS1yb3cudG90YWwgLnZhbHVle2ZvbnQtc2l6ZToxLjEyNXJlbTtjb2xvcjojMDBlNWEwfUBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCl7LmNoYXJ0LWNvbnRlbnR7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOjFmcn19CgoucGFuZWxzLWNvbnRhaW5lciwuYmFkZ2UsLnNvYzItY29zdCxbZGF0YS1maWVsZD0ic29jMi1jYWxjIl0sLmhpcGFhLWNvc3QsW2RhdGEtZmllbGQ9ImhpcGFhLWNhbGMiXSwuaW8tY29zdCxbZGF0YS1maWVsZD0iaW8tY2FsYyJde2Rpc3BsYXk6bm9uZX0=" />
<script src="data:text/javascript;base64,KGZ1bmN0aW9uKCl7Y29uc3Qgbj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KCJsaW5rIikucmVsTGlzdDtpZihuJiZuLnN1cHBvcnRzJiZuLnN1cHBvcnRzKCJtb2R1bGVwcmVsb2FkIikpcmV0dXJuO2Zvcihjb25zdCBTIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpbmtbcmVsPSJtb2R1bGVwcmVsb2FkIl0nKSlDKFMpO25ldyBNdXRhdGlvbk9ic2VydmVyKFM9Pntmb3IoY29uc3QgUCBvZiBTKWlmKFAudHlwZT09PSJjaGlsZExpc3QiKWZvcihjb25zdCB3IG9mIFAuYWRkZWROb2Rlcyl3LnRhZ05hbWU9PT0iTElOSyImJncucmVsPT09Im1vZHVsZXByZWxvYWQiJiZDKHcpfSkub2JzZXJ2ZShkb2N1bWVudCx7Y2hpbGRMaXN0OiEwLHN1YnRyZWU6ITB9KTtmdW5jdGlvbiBrKFMpe2NvbnN0IFA9e307cmV0dXJuIFMuaW50ZWdyaXR5JiYoUC5pbnRlZ3JpdHk9Uy5pbnRlZ3JpdHkpLFMucmVmZXJyZXJQb2xpY3kmJihQLnJlZmVycmVyUG9saWN5PVMucmVmZXJyZXJQb2xpY3kpLFMuY3Jvc3NPcmlnaW49PT0idXNlLWNyZWRlbnRpYWxzIj9QLmNyZWRlbnRpYWxzPSJpbmNsdWRlIjpTLmNyb3NzT3JpZ2luPT09ImFub255bW91cyI/UC5jcmVkZW50aWFscz0ib21pdCI6UC5jcmVkZW50aWFscz0ic2FtZS1vcmlnaW4iLFB9ZnVuY3Rpb24gQyhTKXtpZihTLmVwKXJldHVybjtTLmVwPSEwO2NvbnN0IFA9ayhTKTtmZXRjaChTLmhyZWYsUCl9fSkoKTsoZnVuY3Rpb24oKXtjb25zdCBnPXtuZW9uOntjb21wdXRlUGVyQ1VIb3VyOi4xMDYsc3RvcmFnZVBlckdCTW9udGg6LjM1LHNjYWxlQ29tcHV0ZVBlckNVSG91cjouMjIyfSxzdXBhYmFzZTp7cHJvQmFzZUNvc3Q6MjUsdGVhbUJhc2VDb3N0OjU5OSx4eHh4bENvbXB1dGVQZXJNb250aDo5NjAsc3RvcmFnZVBlckdCTW9udGg6LjEyNX0sYXVyb3JhOnthY3VQZXJIb3VyOi4xMixzdG9yYWdlUGVyR0JNb250aDouMjI1LHJkc1Byb3h5UGVyQUNVSG91cjouMDE1fX07bGV0IG49e3N0b3JhZ2U6MTAwLGRldmVsb3BlcnM6MTUsc29jMjohMCxoaXBhYTohMH07ZnVuY3Rpb24gayhDKXtjb25zdCBTPUMucXVlcnlTZWxlY3RvcigiI3dpZGdldDMtc3RvcmFnZSIpLFA9Qy5xdWVyeVNlbGVjdG9yKCIjd2lkZ2V0My1zdG9yYWdlLXZhbHVlIiksdz1DLnF1ZXJ5U2VsZWN0b3IoIiN3aWRnZXQzLWRldmVsb3BlcnMiKSxOPUMucXVlcnlTZWxlY3RvcigiI3dpZGdldDMtZGV2ZWxvcGVycy12YWx1ZSIpLFY9Qy5xdWVyeVNlbGVjdG9yKCIjd2lkZ2V0My1zb2MyIiksWT1DLnF1ZXJ5U2VsZWN0b3IoIiN3aWRnZXQzLWhpcGFhIik7ZnVuY3Rpb24gSSgpe2NvbnN0IGM9bi5zb2MyfHxuLmhpcGFhLHI9Yz9nLm5lb24uc2NhbGVDb21wdXRlUGVyQ1VIb3VyOmcubmVvbi5jb21wdXRlUGVyQ1VIb3VyLGw9Mjc2KjEwKzI3Nio0KzE5OCo0LGk9bCpyLG89bi5zdG9yYWdlKmcubmVvbi5zdG9yYWdlUGVyR0JNb250aCxwPTE4Mi41LHM9LjI1LGg9bi5kZXZlbG9wZXJzKnAqcypyLHk9MCxmPW4uaGlwYWE/KGkrbytoKSouMTU6MDtyZXR1cm57cHJvZENvbXB1dGU6aSxwcm9kU3RvcmFnZTpvLG5vblByb2Q6aCxzb2MyOnksaGlwYWE6Zix0b3RhbDppK28raCt5K2YsY2FsY3VsYXRpb25zOntwcm9kQ29tcHV0ZTpgJCR7ci50b0ZpeGVkKDMpfS9DVS1ob3VyIMOXICR7bC50b0ZpeGVkKDApfSBDVS1ob3VycyAodmFyaWFibGUgbG9hZDogNC0xMCBDVSR7Yz8iIG9uIFNjYWxlIjoiIn0pYCxwcm9kU3RvcmFnZTpgJCR7Zy5uZW9uLnN0b3JhZ2VQZXJHQk1vbnRoLnRvRml4ZWQoMil9L0dCLW1vbnRoIMOXICR7bi5zdG9yYWdlfSBHQmAsbm9uUHJvZDpgJHtwfWhycyDDlyAke3N9IENVIMOXICQke3IudG9GaXhlZCgzKX0vQ1UtaG91ciDDlyAke24uZGV2ZWxvcGVyc30gZGV2ZWxvcGVyc2AsaGlwYWE6bi5oaXBhYT9gMTUlIG9mIHN1YnRvdGFsICgkJHsoaStvK2gpLnRvRml4ZWQoMil9KWA6IiJ9LGxvYWRQYXR0ZXJuOnttaW5DVTo0LG1heENVOjEwLHNjYWxlVG9aZXJvOiExLHBsYXRmb3JtTWluOi4yNSxpbmNyZW1lbnQ6LjI1fX19ZnVuY3Rpb24gTCgpe2xldCBlPW4uc29jMnx8bi5oaXBhYT9nLnN1cGFiYXNlLnRlYW1CYXNlQ29zdDpnLnN1cGFiYXNlLnByb0Jhc2VDb3N0O2NvbnN0IGM9ZStnLnN1cGFiYXNlLnh4eHhsQ29tcHV0ZVBlck1vbnRoLHI9TWF0aC5tYXgoMCxuLnN0b3JhZ2UtOCkqZy5zdXBhYmFzZS5zdG9yYWdlUGVyR0JNb250aCxsPTEwLGk9bi5zdG9yYWdlKmcuc3VwYWJhc2Uuc3RvcmFnZVBlckdCTW9udGgsbz1uLmRldmVsb3BlcnMqKGwraSkscD0wLHM9bi5oaXBhYT8yMDA6MDtyZXR1cm57cHJvZENvbXB1dGU6Yyxwcm9kU3RvcmFnZTpyLG5vblByb2Q6byxzb2MyOnAsaGlwYWE6cyx0b3RhbDpjK3IrbytwK3MsY2FsY3VsYXRpb25zOntwcm9kQ29tcHV0ZTpgJCR7ZX0vbW9udGggYmFzZSArICQke2cuc3VwYWJhc2UueHh4eGxDb21wdXRlUGVyTW9udGh9L21vbnRoICg0WEwpYCxwcm9kU3RvcmFnZTpuLnN0b3JhZ2U+OD9gJCR7Zy5zdXBhYmFzZS5zdG9yYWdlUGVyR0JNb250aC50b0ZpeGVkKDMpfS9HQi1tb250aCDDlyAke24uc3RvcmFnZS04fSBHQmA6IjggR0IgaW5jbHVkZWQiLG5vblByb2Q6YCgkJHtsfSBjb21wdXRlICsgJHtuLnN0b3JhZ2V9IEdCIMOXICQke2cuc3VwYWJhc2Uuc3RvcmFnZVBlckdCTW9udGgudG9GaXhlZCgzKX0vR0IpIMOXICR7bi5kZXZlbG9wZXJzfSBkZXZlbG9wZXJzYCxzb2MyOm4uc29jMj8iSW5jbHVkZWQgaW4gQnVzaW5lc3MgdGllciI6IiIsaGlwYWE6bi5oaXBhYT8iSElQQUEgc3VyY2hhcmdlICgkMjAwL21vbnRoKSI6IiJ9LGxvYWRQYXR0ZXJuOnttaW5DVTo0LG1heENVOjEwLHNjYWxlVG9aZXJvOiExLHBsYXRmb3JtTWluOi4yNSxpc1Byb3Zpc2lvbmVkOiEwLGluY3JlbWVudDouMjV9fX1mdW5jdGlvbiBFKCl7Y29uc3Qgcj05MzEyKmcuYXVyb3JhLmFjdVBlckhvdXIsbD05MzEyKmcuYXVyb3JhLnJkc1Byb3h5UGVyQUNVSG91cixpPW4uc3RvcmFnZSpnLmF1cm9yYS5zdG9yYWdlUGVyR0JNb250aCxvPTAscD0xODIuNSxzPS41LGg9cCpzKmcuYXVyb3JhLmFjdVBlckhvdXIseT1uLnN0b3JhZ2UqZy5hdXJvcmEuc3RvcmFnZVBlckdCTW9udGgsZj1uLmRldmVsb3BlcnMqKGgreSkseD0wLGE9MCxkPTA7cmV0dXJue3Byb2RDb21wdXRlOnIrbCxwcm9kU3RvcmFnZTppLGlvOm8sbm9uUHJvZDpmK3gsc29jMjphLGhpcGFhOmQsdG90YWw6citsK2krbytmK3grYStkLGNhbGN1bGF0aW9uczp7cHJvZENvbXB1dGU6YCQke2cuYXVyb3JhLmFjdVBlckhvdXIudG9GaXhlZCgyKX0vQUNVLWhvdXIgw5cgJHs5MzEyIC50b0ZpeGVkKDApfSBBQ1UtaG91cnMgKHZhcmlhYmxlIGxvYWQ6IDgtMjAgQUNVKSArIFJEUyBQcm94eWAscHJvZFN0b3JhZ2U6YCQke2cuYXVyb3JhLnN0b3JhZ2VQZXJHQk1vbnRoLnRvRml4ZWQoMyl9L0dCLW1vbnRoIMOXICR7bi5zdG9yYWdlfSBHQiAoSS9PIE9wdGltaXplZClgLGlvOiJJbmNsdWRlZCBpbiBJL08gT3B0aW1pemVkIFN0b3JhZ2UiLG5vblByb2Q6YCgoJHtwfWhycyDDlyAke3N9IEFDVSDDlyAkJHtnLmF1cm9yYS5hY3VQZXJIb3VyLnRvRml4ZWQoMil9L0FDVS1ob3VyKSArICgke24uc3RvcmFnZX0gR0Igw5cgJCR7Zy5hdXJvcmEuc3RvcmFnZVBlckdCTW9udGgudG9GaXhlZCgzKX0vR0IpKSDDlyAke24uZGV2ZWxvcGVyc30gZGV2ZWxvcGVyc2B9LGxvYWRQYXR0ZXJuOnttaW5DVTo4LG1heENVOjIwLHNjYWxlVG9aZXJvOiExLHBsYXRmb3JtTWluOi41LGlzUHJvdmlzaW9uZWQ6ITEsaW5jcmVtZW50Oi41LGRpc3BsYXlTY2FsZTouNX19fWZ1bmN0aW9uIE8odCxlPS41KXtyZXR1cm4gTWF0aC5jZWlsKHQvZSkqZX1mdW5jdGlvbiBiKHQpe3JldHVybiB0Pj0xMDA/dC50b0ZpeGVkKDApOnQudG9GaXhlZCgyKX1mdW5jdGlvbiBNKHQpe2NvbnN0IGU9W10sbD10LmRpc3BsYXlTY2FsZXx8MTtmb3IobGV0IGk9MDtpPDU2O2krKyl7Y29uc3Qgbz1pKjMscD1NYXRoLmZsb29yKG8vMjQpLHM9byUyNCxoPXA+PTUseT1zPj05JiZzPDIxO2xldCBmO2g/Zj15P3QubWF4Q1UvMjp0Lm1pbkNVLzI6Zj15P3QubWF4Q1U6dC5taW5DVTtsZXQgeDtpZih0LmlzUHJvdmlzaW9uZWQpeD10Lm1heENVKjEuMjU7ZWxzZXtjb25zdCBhPXQuaW5jcmVtZW50fHwuMjU7aWYodC5zY2FsZVRvWmVybyl4PWY+MD9PKGYsYSkrLjE6MDtlbHNle2NvbnN0IGQ9TyhmLGEpKy4xO3g9TWF0aC5tYXgoZCx0LnBsYXRmb3JtTWluKX19ZS5wdXNoKHt4OmksbG9hZDpmKmwscHJvdmlzaW9uZWQ6eCpsfSl9cmV0dXJuIGV9ZnVuY3Rpb24gWih0LGUsYz1udWxsKXtjb25zdCBzPWMhPT1udWxsP2M6TWF0aC5tYXgoLi4uZS5tYXAoVT0+TWF0aC5tYXgoVS5sb2FkLFUucHJvdmlzaW9uZWQpKSksaD1bIk0iLCJUIiwiVyIsIlQiLCJGIiwiUyIsIlMiXSx5PSgyODAtMioyKS8oZS5sZW5ndGgtMSksZj1lLmxlbmd0aC83LHg9aC5tYXAoKFUsRyk9PmA8dGV4dCB4PSIkezIrRypmKnkrZip5LzJ9IiB5PSI0OCIgZm9udC1zaXplPSI4IiBmaWxsPSIjNjQ3NDhiIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4ke1V9PC90ZXh0PmApLmpvaW4oIiIpLGE9ZVtlLmxlbmd0aC0xXSxkPTIrKGUubGVuZ3RoLTEpKnksbT0oMzgtMioyKS9zLEI9MzYtYS5sb2FkKm0sJD0zNi1hLnByb3Zpc2lvbmVkKm0sdj1gCiAgICA8c3ZnIHdpZHRoPSIzMTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCAzMTAgNTAiIGNsYXNzPSJzcGFya2xpbmUiPgogICAgICA8ZGVmcz4KICAgICAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImxvYWRHcmFkaWVudC0ke3QuZGF0YXNldC5wcm92aWRlcn0iIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMCUiIHkyPSIxMDAlIj4KICAgICAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMzYjgyZjY7c3RvcC1vcGFjaXR5OjAuMyIgLz4KICAgICAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzNiODJmNjtzdG9wLW9wYWNpdHk6MC4wNSIgLz4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgICA8L2RlZnM+CiAgICAgICR7RihlLCJsb2FkIiwyODAsMzgsMixzLCEwKX0KICAgICAgJHtGKGUsInByb3Zpc2lvbmVkIiwyODAsMzgsMixzLCExKX0KICAgICAgJHt4fQogICAgICA8dGV4dCB4PSIke2QrNH0iIHk9IiR7QiszfSIgZm9udC1zaXplPSI4IiBmaWxsPSIjM2I4MmY2IiBmb250LXdlaWdodD0iNTAwIj5sb2FkPC90ZXh0PgogICAgICA8dGV4dCB4PSIke2QtNH0iIHk9IiR7JC0xMH0iIGZvbnQtc2l6ZT0iOCIgZmlsbD0iIzk0YTNiOCIgZm9udC13ZWlnaHQ9IjUwMCI+Y2FwYWNpdHk8L3RleHQ+CiAgICA8L3N2Zz4KICBgO3QuaW5uZXJIVE1MPXZ9ZnVuY3Rpb24gRih0LGUsYyxyLGwsaSxvKXtjb25zdCBwPShjLWwqMikvKHQubGVuZ3RoLTEpLHM9KHItbCoyKS9pO2xldCBoPSIiO2lmKHQuZm9yRWFjaCgoeSxmKT0+e2NvbnN0IHg9bCtmKnAsYT1yLWwteVtlXSpzO2grPWY9PT0wP2BNICR7eH0sJHthfWA6YCBMICR7eH0sJHthfWB9KSxvKXtjb25zdCB5PWwrKHQubGVuZ3RoLTEpKnA7cmV0dXJuIGgrPWAgTCAke3l9LCR7ci1sfSBMICR7bH0sJHtyLWx9IFpgLGA8cGF0aCBkPSIke2h9IiBmaWxsPSJ1cmwoI2xvYWRHcmFkaWVudC0ke3RbMF0ucHJvdmlkZXJ8fCJkZWZhdWx0In0pIiBzdHJva2U9IiMzYjgyZjYiIHN0cm9rZS13aWR0aD0iMS41IiAvPmB9ZWxzZSByZXR1cm5gPHBhdGggZD0iJHtofSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTRhM2I4IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWRhc2hhcnJheT0iMywzIiAvPmB9ZnVuY3Rpb24gSCh0LGUsYz1udWxsKXt2YXIgcCxzLGgseSxmLHg7Y29uc3Qgcj1DLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXByb3ZpZGVyPSIke3R9Il1gKTtpZihyLnF1ZXJ5U2VsZWN0b3IoIi5hbW91bnQiKS50ZXh0Q29udGVudD1iKGUudG90YWwpLGUubG9hZFBhdHRlcm4pe2NvbnN0IGE9ci5xdWVyeVNlbGVjdG9yKCIuc3BhcmtsaW5lLWNvbnRhaW5lciIpO2lmKGEpe2EuZGF0YXNldC5wcm92aWRlcj10O2NvbnN0IGQ9TShlLmxvYWRQYXR0ZXJuKTtkLmZvckVhY2gobT0+bS5wcm92aWRlcj10KSxaKGEsZCxjKX19aWYoZS5wcm9kQ29tcHV0ZSE9PXZvaWQgMCl7ci5xdWVyeVNlbGVjdG9yKCdbZGF0YS1maWVsZD0icHJvZC1jb21wdXRlIl0nKS50ZXh0Q29udGVudD1gJCR7YihlLnByb2RDb21wdXRlKX1gO2NvbnN0IGE9ci5xdWVyeVNlbGVjdG9yKCdbZGF0YS1maWVsZD0icHJvZC1jb21wdXRlLWNhbGMiXScpO2EmJigocD1lLmNhbGN1bGF0aW9ucykhPW51bGwmJnAucHJvZENvbXB1dGUpJiYoYS50ZXh0Q29udGVudD1lLmNhbGN1bGF0aW9ucy5wcm9kQ29tcHV0ZSl9aWYoZS5wcm9kU3RvcmFnZSE9PXZvaWQgMCl7ci5xdWVyeVNlbGVjdG9yKCdbZGF0YS1maWVsZD0icHJvZC1zdG9yYWdlIl0nKS50ZXh0Q29udGVudD1gJCR7YihlLnByb2RTdG9yYWdlKX1gO2NvbnN0IGE9ci5xdWVyeVNlbGVjdG9yKCdbZGF0YS1maWVsZD0icHJvZC1zdG9yYWdlLWNhbGMiXScpO2EmJigocz1lLmNhbGN1bGF0aW9ucykhPW51bGwmJnMucHJvZFN0b3JhZ2UpJiYoYS50ZXh0Q29udGVudD1lLmNhbGN1bGF0aW9ucy5wcm9kU3RvcmFnZSl9aWYoZS5ub25Qcm9kIT09dm9pZCAwKXtyLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWZpZWxkPSJub24tcHJvZCJdJykudGV4dENvbnRlbnQ9YCQke2IoZS5ub25Qcm9kKX1gO2NvbnN0IGE9ci5xdWVyeVNlbGVjdG9yKCdbZGF0YS1maWVsZD0ibm9uLXByb2QtY2FsYyJdJyk7YSYmKChoPWUuY2FsY3VsYXRpb25zKSE9bnVsbCYmaC5ub25Qcm9kKSYmKGEudGV4dENvbnRlbnQ9ZS5jYWxjdWxhdGlvbnMubm9uUHJvZCl9aWYoZS5pbyE9PXZvaWQgMCl7Y29uc3QgYT1yLnF1ZXJ5U2VsZWN0b3JBbGwoIi5pby1jb3N0Iik7aWYoZS5pbz09PTApYS5mb3JFYWNoKGQ9PmQuc3R5bGUuZGlzcGxheT0ibm9uZSIpO2Vsc2V7YS5mb3JFYWNoKG09Pm0uc3R5bGUuZGlzcGxheT0iIiksci5xdWVyeVNlbGVjdG9yKCdbZGF0YS1maWVsZD0iaW8iXScpLnRleHRDb250ZW50PWAkJHtiKGUuaW8pfWA7Y29uc3QgZD1yLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWZpZWxkPSJpby1jYWxjIl0nKTtkJiYoKHk9ZS5jYWxjdWxhdGlvbnMpIT1udWxsJiZ5LmlvKSYmKGQudGV4dENvbnRlbnQ9ZS5jYWxjdWxhdGlvbnMuaW8pfX1jb25zdCBsPXIucXVlcnlTZWxlY3RvcigiLm5vbi1wcm9kdWN0aW9uLXNlY3Rpb24iKTtsJiYobC5zdHlsZS5kaXNwbGF5PW4uZGV2ZWxvcGVycz09PTA/Im5vbmUiOiIiKTtjb25zdCBpPXIucXVlcnlTZWxlY3RvcigiLnNvYzItY29zdCIpO2lmKGkpaWYobi5zb2MyKWlmKGkuc3R5bGUuZGlzcGxheT0iZmxleCIsZS5zb2MyPjApe2kucXVlcnlTZWxlY3RvcignW2RhdGEtZmllbGQ9InNvYzIiXScpLnRleHRDb250ZW50PWAkJHtiKGUuc29jMil9YDtjb25zdCBhPWkucXVlcnlTZWxlY3RvcignW2RhdGEtZmllbGQ9InNvYzItY2FsYyJdJyk7YSYmKChmPWUuY2FsY3VsYXRpb25zKSE9bnVsbCYmZi5zb2MyKSYmKGEudGV4dENvbnRlbnQ9ZS5jYWxjdWxhdGlvbnMuc29jMil9ZWxzZXtpLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWZpZWxkPSJzb2MyIl0nKS50ZXh0Q29udGVudD0iSW5jbHVkZWQiO2NvbnN0IGE9aS5xdWVyeVNlbGVjdG9yKCdbZGF0YS1maWVsZD0ic29jMi1jYWxjIl0nKTthJiYoYS50ZXh0Q29udGVudD0iIil9ZWxzZSBpLnN0eWxlLmRpc3BsYXk9Im5vbmUiO2NvbnN0IG89ci5xdWVyeVNlbGVjdG9yKCIuaGlwYWEtY29zdCIpO2lmKG8paWYobi5oaXBhYSlpZihvLnN0eWxlLmRpc3BsYXk9ImZsZXgiLGUuaGlwYWE+MCl7by5xdWVyeVNlbGVjdG9yKCdbZGF0YS1maWVsZD0iaGlwYWEiXScpLnRleHRDb250ZW50PWAkJHtiKGUuaGlwYWEpfWA7Y29uc3QgYT1vLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWZpZWxkPSJoaXBhYS1jYWxjIl0nKTthJiYoKHg9ZS5jYWxjdWxhdGlvbnMpIT1udWxsJiZ4LmhpcGFhKSYmKGEudGV4dENvbnRlbnQ9ZS5jYWxjdWxhdGlvbnMuaGlwYWEpfWVsc2V7by5xdWVyeVNlbGVjdG9yKCdbZGF0YS1maWVsZD0iaGlwYWEiXScpLnRleHRDb250ZW50PSJJbmNsdWRlZCI7Y29uc3QgYT1vLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWZpZWxkPSJoaXBhYS1jYWxjIl0nKTthJiYoYS50ZXh0Q29udGVudD0iIil9ZWxzZSBvLnN0eWxlLmRpc3BsYXk9Im5vbmUifWZ1bmN0aW9uIGoodCl7Y29uc3QgZT1bIm5lb24iLCJzdXBhYmFzZSIsImF1cm9yYSJdLGM9TWF0aC5taW4oLi4uT2JqZWN0LnZhbHVlcyh0KSk7ZS5mb3JFYWNoKHI9Pntjb25zdCBsPUMucXVlcnlTZWxlY3RvcihgW2RhdGEtcHJvdmlkZXI9IiR7cn0iXWApLGk9bC5xdWVyeVNlbGVjdG9yKCIuYmVzdC1wcmljZSIpLG89bC5xdWVyeVNlbGVjdG9yKCIubW9yZS1leHBlbnNpdmUiKTtpZih0W3JdPT09YylpLnN0eWxlLmRpc3BsYXk9ImlubGluZS1ibG9jayIsby5zdHlsZS5kaXNwbGF5PSJub25lIixsLmNsYXNzTGlzdC5hZGQoImlzLWJlc3QtcHJpY2UiKTtlbHNle2kuc3R5bGUuZGlzcGxheT0ibm9uZSI7Y29uc3QgcD10W3JdL2Mscz1wJTE9PT0wP3AudG9GaXhlZCgwKTpwLnRvRml4ZWQoMSk7by50ZXh0Q29udGVudD1gJHtzfXggcHJpY2VgLG8uc3R5bGUuZGlzcGxheT0iaW5saW5lLWJsb2NrIixsLmNsYXNzTGlzdC5yZW1vdmUoImlzLWJlc3QtcHJpY2UiKX19KX1mdW5jdGlvbiBxKCl7Y29uc3QgdD1JKCksZT1MKCksYz1FKCkscj1NKHQubG9hZFBhdHRlcm4pLGw9TShlLmxvYWRQYXR0ZXJuKSxpPU0oYy5sb2FkUGF0dGVybiksbz1bLi4uciwuLi5sLC4uLmldLHA9TWF0aC5tYXgoLi4uby5tYXAoaD0+TWF0aC5tYXgoaC5sb2FkLGgucHJvdmlzaW9uZWQpKSk7SCgibmVvbiIsdCxwKSxIKCJzdXBhYmFzZSIsZSxwKSxIKCJhdXJvcmEiLGMscCksaih7bmVvbjp0LnRvdGFsLHN1cGFiYXNlOmUudG90YWwsYXVyb3JhOmMudG90YWx9KTtjb25zdCBzPUMucXVlcnlTZWxlY3RvcigiLmNoYXJ0LXZpZXciKTtzJiZzLnN0eWxlLmRpc3BsYXkhPT0ibm9uZSImJkQodCxlLGMpfWZ1bmN0aW9uIEQodCxlLGMpe2NvbnN0IHI9Qy5xdWVyeVNlbGVjdG9yKCIuYmFyLWNoYXJ0Iik7aWYoIXIpcmV0dXJuO2NvbnN0IGw9NjAwLGk9MzAwLG89e3RvcDo0MCxyaWdodDoyMCxib3R0b206NjAsbGVmdDo2MH0scD1sLW8ubGVmdC1vLnJpZ2h0LHM9aS1vLnRvcC1vLmJvdHRvbSxoPVt7bmFtZToiTmVvbiIscHJpY2luZzp0LGNvbG9yOiIjMDRlNTliIn0se25hbWU6IlN1cGFiYXNlIixwcmljaW5nOmUsY29sb3I6IiNhZWUxZWIifSx7bmFtZToiQXVyb3JhIFNlcnZlcmxlc3MgVjIiLHByaWNpbmc6Yyxjb2xvcjoiI2YxZjA3NiJ9XSx5PU1hdGgubWF4KHQudG90YWwsZS50b3RhbCxjLnRvdGFsKSoxLjEsZj1wL2gubGVuZ3RoLzEuNSx4PXAvaC5sZW5ndGg7bGV0IGE9YAogICAgPGRlZnM+CiAgICAgICR7aC5tYXAoKGQsbSk9PmAKICAgICAgICA8cGF0dGVybiBpZD0icGF0dGVybi1zb2xpZC0ke219IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgICAgIDxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiR7ZC5jb2xvcn0iLz4KICAgICAgICA8L3BhdHRlcm4+CiAgICAgICAgPHBhdHRlcm4gaWQ9InBhdHRlcm4tZGlhZ29uYWwtJHttfSIgd2lkdGg9IjgiIGhlaWdodD0iOCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+CiAgICAgICAgICA8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI4IiBmaWxsPSIke2QuY29sb3J9Ii8+CiAgICAgICAgPC9wYXR0ZXJuPgogICAgICAgIDxwYXR0ZXJuIGlkPSJwYXR0ZXJuLWRvdHMtJHttfSIgd2lkdGg9IjgiIGhlaWdodD0iOCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgICAgICA8Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMS41IiBmaWxsPSIke2QuY29sb3J9Ii8+CiAgICAgICAgICA8Y2lyY2xlIGN4PSI2IiBjeT0iNiIgcj0iMS41IiBmaWxsPSIke2QuY29sb3J9Ii8+CiAgICAgICAgPC9wYXR0ZXJuPgogICAgICAgIDxwYXR0ZXJuIGlkPSJwYXR0ZXJuLWhvcml6b250YWwtJHttfSIgd2lkdGg9IjgiIGhlaWdodD0iOCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgICAgICA8bGluZSB4MT0iMCIgeTE9IjIiIHgyPSI4IiB5Mj0iMiIgc3Ryb2tlPSIke2QuY29sb3J9IiBzdHJva2Utd2lkdGg9IjIiLz4KICAgICAgICAgIDxsaW5lIHgxPSIwIiB5MT0iNiIgeDI9IjgiIHkyPSI2IiBzdHJva2U9IiR7ZC5jb2xvcn0iIHN0cm9rZS13aWR0aD0iMiIvPgogICAgICAgIDwvcGF0dGVybj4KICAgICAgICA8cGF0dGVybiBpZD0icGF0dGVybi1jcm9zc2hhdGNoLSR7bX0iIHdpZHRoPSI4IiBoZWlnaHQ9IjgiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICAgICAgPHBhdGggZD0iTTAsMCBMOCw4IE04LDAgTDAsOCIgc3Ryb2tlPSIke2QuY29sb3J9IiBzdHJva2Utd2lkdGg9IjEuNSIvPgogICAgICAgIDwvcGF0dGVybj4KICAgICAgICA8cGF0dGVybiBpZD0icGF0dGVybi12ZXJ0aWNhbC0ke219IiB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgICAgIDxsaW5lIHgxPSIyIiB5MT0iMCIgeDI9IjIiIHkyPSI4IiBzdHJva2U9IiR7ZC5jb2xvcn0iIHN0cm9rZS13aWR0aD0iMiIvPgogICAgICAgICAgPGxpbmUgeDE9IjYiIHkxPSIwIiB4Mj0iNiIgeTI9IjgiIHN0cm9rZT0iJHtkLmNvbG9yfSIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgICAgICAgPC9wYXR0ZXJuPgogICAgICBgKS5qb2luKCIiKX0KICAgIDwvZGVmcz4KICBgO2guZm9yRWFjaCgoZCxtKT0+e3ZhciBBO2NvbnN0IEI9by5sZWZ0K20qeCsoeC1mKS8yLCQ9ZC5wcmljaW5nO2xldCB2PW8udG9wK3M7Y29uc3QgVT1bXTtpZigkLnByb2RDb21wdXRlPjApe2NvbnN0IHU9JC5wcm9kQ29tcHV0ZS95KnM7VS5wdXNoKHtsYWJlbDoiQ29tcHV0ZSIsdmFsdWU6JC5wcm9kQ29tcHV0ZSx5OnYtdSxoZWlnaHQ6dSxwYXR0ZXJuOmBwYXR0ZXJuLXNvbGlkLSR7bX1gfSksdi09dX1pZigkLnByb2RTdG9yYWdlPjApe2NvbnN0IHU9JC5wcm9kU3RvcmFnZS95KnM7VS5wdXNoKHtsYWJlbDoiU3RvcmFnZSIsdmFsdWU6JC5wcm9kU3RvcmFnZSx5OnYtdSxoZWlnaHQ6dSxwYXR0ZXJuOmBwYXR0ZXJuLWRpYWdvbmFsLSR7bX1gfSksdi09dX1pZigkLmlvJiYkLmlvPjApe2NvbnN0IHU9JC5pby95KnM7VS5wdXNoKHtsYWJlbDoiSS9PIix2YWx1ZTokLmlvLHk6di11LGhlaWdodDp1LHBhdHRlcm46YHBhdHRlcm4tZG90cy0ke219YH0pLHYtPXV9aWYoJC5ub25Qcm9kPjApe2NvbnN0IHU9JC5ub25Qcm9kL3kqcztVLnB1c2goe2xhYmVsOiJEZXYvU3RhZ2luZyIsdmFsdWU6JC5ub25Qcm9kLHk6di11LGhlaWdodDp1LHBhdHRlcm46YHBhdHRlcm4taG9yaXpvbnRhbC0ke219YH0pLHYtPXV9aWYoJC5zb2MyPjApe2NvbnN0IHU9JC5zb2MyL3kqcztVLnB1c2goe2xhYmVsOiJTT0MyIix2YWx1ZTokLnNvYzIseTp2LXUsaGVpZ2h0OnUscGF0dGVybjpgcGF0dGVybi1jcm9zc2hhdGNoLSR7bX1gfSksdi09dX1pZigkLmhpcGFhPjApe2NvbnN0IHU9JC5oaXBhYS95KnM7VS5wdXNoKHtsYWJlbDoiSElQQUEiLHZhbHVlOiQuaGlwYWEseTp2LXUsaGVpZ2h0OnUscGF0dGVybjpgcGF0dGVybi12ZXJ0aWNhbC0ke219YH0pLHYtPXV9VS5mb3JFYWNoKHU9PnthKz1gPHJlY3QgeD0iJHtCfSIgeT0iJHt1Lnl9IiB3aWR0aD0iJHtmfSIgaGVpZ2h0PSIke3UuaGVpZ2h0fSIgZmlsbD0idXJsKCMke3UucGF0dGVybn0pIiBzdHJva2U9IiR7ZC5jb2xvcn0iIHN0cm9rZS13aWR0aD0iMSIgY2xhc3M9ImJhci1zZWdtZW50Ij48dGl0bGU+JHt1LmxhYmVsfTogJCR7Yih1LnZhbHVlKX08L3RpdGxlPjwvcmVjdD5gfSk7Y29uc3QgRz0oKEE9VVswXSk9PW51bGw/dm9pZCAwOkEueSl8fG8udG9wK3M7YSs9YDx0ZXh0IHg9IiR7QitmLzJ9IiB5PSIke0ctMzV9IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iNjAwIiBmaWxsPSIjZmZmIj4kJHtiKCQudG90YWwpfS9tb248L3RleHQ+YCxhKz1gPHRleHQgeD0iJHtCK2YvMn0iIHk9IiR7by50b3ArcyszMH0iIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSI1MDAiIGZpbGw9IiM5NGEzYjgiPiR7ZC5uYW1lfTwvdGV4dD5gfSksYSs9YDxsaW5lIHgxPSIke28ubGVmdH0iIHkxPSIke28udG9wfSIgeDI9IiR7by5sZWZ0fSIgeTI9IiR7by50b3Arc30iIHN0cm9rZT0iIzQ3NTU2OSIgc3Ryb2tlLXdpZHRoPSIyIi8+YCxhKz1gPGxpbmUgeDE9IiR7by5sZWZ0fSIgeTE9IiR7by50b3Arc30iIHgyPSIke2wtby5yaWdodH0iIHkyPSIke28udG9wK3N9IiBzdHJva2U9IiM0NzU1NjkiIHN0cm9rZS13aWR0aD0iMiIvPmAsci5pbm5lckhUTUw9YX1jb25zdCBUPUMucXVlcnlTZWxlY3RvckFsbCgiLnZpZXctdG9nZ2xlLWJ0biIpLHo9Qy5xdWVyeVNlbGVjdG9yKCIucGFuZWxzLWNvbnRhaW5lciIpLFc9Qy5xdWVyeVNlbGVjdG9yKCIuY2hhcnQtdmlldyIpO1QuZm9yRWFjaCh0PT57dC5hZGRFdmVudExpc3RlbmVyKCJjbGljayIsKCk9Pntjb25zdCBlPXQuZGF0YXNldC52aWV3O2lmKFQuZm9yRWFjaChjPT5jLmNsYXNzTGlzdC5yZW1vdmUoImFjdGl2ZSIpKSx0LmNsYXNzTGlzdC5hZGQoImFjdGl2ZSIpLGU9PT0icGFuZWxzIil6LnN0eWxlLmRpc3BsYXk9ImdyaWQiLFcuc3R5bGUuZGlzcGxheT0ibm9uZSI7ZWxzZXt6LnN0eWxlLmRpc3BsYXk9Im5vbmUiLFcuc3R5bGUuZGlzcGxheT0iYmxvY2siO2NvbnN0IGM9SSgpLHI9TCgpLGw9RSgpO0QoYyxyLGwpfX0pfSksUy5hZGRFdmVudExpc3RlbmVyKCJpbnB1dCIsdD0+e24uc3RvcmFnZT1wYXJzZUludCh0LnRhcmdldC52YWx1ZSksUC50ZXh0Q29udGVudD1gJHtuLnN0b3JhZ2V9IEdCYCxxKCl9KSx3LmFkZEV2ZW50TGlzdGVuZXIoImlucHV0Iix0PT57bi5kZXZlbG9wZXJzPXBhcnNlSW50KHQudGFyZ2V0LnZhbHVlKSxOLnRleHRDb250ZW50PW4uZGV2ZWxvcGVycztjb25zdCBlPUMucXVlcnlTZWxlY3RvcigiI2xvY2FsLWRldi1oZWxwIik7ZSYmKGUuc3R5bGUuZGlzcGxheT1uLmRldmVsb3BlcnM9PT0wPyJpbmxpbmUiOiJub25lIikscSgpfSksVi5hZGRFdmVudExpc3RlbmVyKCJjaGFuZ2UiLHQ9PntuLnNvYzI9dC50YXJnZXQuY2hlY2tlZCxxKCl9KSxZLmFkZEV2ZW50TGlzdGVuZXIoImNoYW5nZSIsdD0+e24uaGlwYWE9dC50YXJnZXQuY2hlY2tlZCxxKCl9KSxxKCl9d2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKXtrKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIiN3aWRnZXQzLWNvbnRhaW5lciAud2lkZ2V0LXdyYXBwZXIiKSl9LDFlMyl9KSgpOwo="></script>

The scenarios in this section demonstrates that Neon offers the lowest cost no matter where you are. Even better, you can easily transition among these different scenarios with just a few clicks.

## Why we can afford to lower price

You might wonder: How can we make databases this affordable? There’s no catch. As alluded to earlier, there are two fundamental reasons why we can offer the best price-performance.

First, Neon’s separation of storage and compute means your database scales up when it’s busy and down to zero when it’s idle. Data stays safely stored on durable cloud object storage, while compute spins up in milliseconds. You only pay for what you use. Contrast this with other database providers who offer fixed capacity, where you need to provision for your peak workloads and pay for a lot of idle time.

Second, since joining Databricks, Neon runs on one of the world’s largest and most efficient multi-cloud infrastructures. Databricks launches tens of millions of VMs daily, and that scale translates directly into lower costs for Neon users.

## What’s next

Choosing a database is one of the most important architectural decisions. We are humbled by the trust the Neon users have placed on us. With autoscaling, instant branching, and point-in-time recovery, we provide the best developer experience and can dramatically reduce your databases’ operational complexity. With the consecutive price reductions, we now offer the best price-performance option on the database market.

Our work is never finished. We’re building Neon not just to be the best in one metric, but to be the best in all aspects bar none, making Neon and Databricks synonymous with OLTP innovation for years to come.
