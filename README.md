# Meesho DICE — MEERA Business Dashboard

**Track manufacturer onboarding, programme performance and selling activity after support ends.**

A Meesho DICE challenge concept dashboard for the Project MEERA programme team. It brings together pilot KPIs, manufacturer funnel analysis, graduation choices, post-assistance retention and sales outcomes in three connected views.

[Live prototype](https://null-three-sable.vercel.app/) · [GitHub repository](https://github.com/mahim-dungarwal/Meesho-Dice-Dashboard)

> **Prototype status:** All displayed data is synthetic. The inspected frontend uses embedded fixtures and illustrative calculations, not a live Meesho analytics feed. It is a competition concept, not an official Meesho reporting product. Metric definitions describe intended measurement; the demo is not a validated reporting or reconciliation system.

## Frontend preview

### Pilot Pulse

![MEERA Pilot Pulse showing churn, manufacturer KPIs, filters and trend charts](docs/images/pilot-pulse.jpg)

<details>
<summary>Manufacturer Journey</summary>

![Manufacturer journey funnel, drop-off reasons, segment heatmap and supporting records](docs/images/manufacturer-journey.jpg)

</details>

<details>
<summary>After Support & Sales</summary>

![Post-assistance retention heatmap and graduation-path trends](docs/images/after-support-sales.jpg)

</details>

*Screenshots from the deployed demo. The all-category filter was explicitly selected before capture; see the initial-filter limitation below.*

## Contents

- [Project overview](#project-overview)
- [Dashboard views](#dashboard-views)
- [Filters and interactions](#filters-and-interactions)
- [Metric dictionary](#metric-dictionary)
- [Data and calculation model](#data-and-calculation-model)
- [Architecture and technology](#architecture-and-technology)
- [Getting started](#getting-started)
- [Customisation](#customisation)
- [Deployment](#deployment)
- [Validation](#validation)
- [Known limitations](#known-limitations)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Maintainers and licence](#maintainers-and-licence)

## Project overview

Project MEERA proposes operational and growth support to help manufacturers develop a direct-to-consumer channel alongside their existing B2B business. Its programme team needs to understand whether manufacturers progress to selling, where they drop out, and whether selling continues after assistance ends.

This dashboard organises that review around three questions:

1. **Is MEERA working?** Review pilot performance and headline outcomes.
2. **Where is the drop-off?** Trace the manufacturer journey and inspect supporting records.
3. **Do manufacturers keep selling?** Compare post-support retention, graduation paths and sales.

The intended measurement design uses three anchors: **identification**, **scheduled support end**, and **settled manufacturer order-line outcome**. These distinguish acquisition progress, post-assistance behaviour and realised sales.

| Related component | Role in the wider proposal |
| --- | --- |
| **MOR — Manufacturer Opportunity Report** | Help potential manufacturers explore product opportunity before onboarding. |
| **Meesho Saarthi** | Provide conversational awareness, onboarding and commerce guidance. |
| **Project MEERA** | Provide fulfilment, demand-generation and wider manufacturer enablement support. |
| **This dashboard** | Demonstrate programme-level monitoring and diagnosis of manufacturer outcomes. |

MOR, Saarthi, warehouse systems and seller-platform feeds are not connected to the inspected dashboard.

## Dashboard views

### 1. Pilot Pulse

A programme summary with:

- A **90-day post-assistance churn** headline and its definition.
- Activated and active manufacturer counts.
- Successful orders, NMV and broad unsuccessful-order rate.
- Monthly churn, order and NMV trend charts.
- Illustrative observations about funnel leakage, graduation paths and sales changes.

The observations and comparison text are predefined copy, not generated analysis of a live dataset.

### 2. Manufacturer Journey

An identification-anchored funnel covering:

1. Identified.
2. Approached.
3. Agreed.
4. Eligibility passed.
5. Registered.
6. Live catalogue.
7. First successful delivery.

Each stage displays its count, conversion from the preceding stage, share of identified manufacturers and absolute drop. The interface states that first delivery does not restart assistance.

Additional panels show:

- Graduation choices: self-service, continued assistance, and exited/undecided.
- Ranked drop-off reasons.
- A **Segment × Stage** heatmap for Large and Emerging manufacturers.
- A supporting table with manufacturer ID, operating segment, category, stage, graduation choice and reason.
- A clickable stage drill-down with search by manufacturer ID, segment or category.

The drill-down demonstrates the intended investigation workflow; its records do not fully reconcile to the aggregate funnel in the current implementation.

### 3. After Support & Sales

A support-end-anchored view with:

- An illustrative 90-day retention headline.
- A cohort heatmap for 30-, 60- and 90-day outcomes.
- Retention trends for self-service and continued-assistance paths.
- Graduation-choice composition.
- Activation failures and early exits.
- Successful orders, NMV, average order value and unsuccessful-order reasons.

Recent cohort cells demonstrate **N/A**, **Immature** and **Not yet available** states. These labels are fixed demo fixtures; maturity is not calculated from the current date.

## Filters and interactions

| Control | Available options or behaviour |
| --- | --- |
| Date range | Last 90 days, Last 180 days, Year to date. |
| Identification cohort | All cohorts, Q1 2026, Q2 2026. |
| Operating cohort | All operating cohorts, Yet-to-Try, Dormant, Churned, Not Interested, Not Informed. |
| Category | All approved categories, Apparel & accessories, Home & kitchen, Personal care. |
| Sidebar | Switch among the three views without a full-page reload. |
| Metric information buttons | Open a definition popover. |
| Funnel stage | Select a stage, filter the supporting table and open a drill-down. |
| Drill-down search | Search the demo records by ID, segment or category. |
| Clear stage | Remove the stage selection. |
| Reset | Restore initial filter state; currently also restores the category mismatch described below. |
| Export CSV | Show a confirmation-style alert; **no CSV file is generated or downloaded**. |

The ten embedded manufacturer records cover **Yet-to-Try** and **Dormant** only. Other operating-cohort options can therefore produce an empty supporting table.

### Suggested demo walkthrough

1. Open the prototype and review **Pilot Pulse**.
2. Select a specific category, then select **All approved categories**. This avoids the current initial-category mismatch.
3. Open an information button to review a metric definition.
4. Switch to **Manufacturer Journey** and select a stage.
5. Search the drill-down by a sample ID such as `M-1042`, then close it and clear the stage.
6. Switch to **After Support & Sales** to compare retention windows and graduation paths.
7. Try cohort/category filters and observe which elements change and which remain fixed.

## Metric dictionary

These definitions summarise the intended dictionary included in the demo; they are not proof that the displayed values are calculated from those events.

| Metric | Intended definition |
| --- | --- |
| **Activated manufacturer** | Assistance has started and the manufacturer has at least one successful delivery during the initial assisted period. |
| **Active manufacturer** | At least one settled successful order in the trailing 30 days. |
| **Successful orders** | Manufacturer order-line IDs delivered and not subsequently returned within the applicable return window. |
| **NMV — Net Merchandise Value** | Customer-paid merchandise value after returns/refunds, excluding shipping and tax. |
| **90-day post-assistance churn** | Among activated manufacturers with 90 days of follow-up, the share who formally exit or have no successful order in days 61–90 after scheduled support end. Never-activated manufacturers are excluded. |
| **Broad unsuccessful-order rate** | A combined measure covering unaccepted, rejected, not-collected and returned order lines, intended to count each line once. |
| **Post-support retention** | Retained manufacturers divided by the eligible base for the specified follow-up window; the exact retained-event rule needs to be implemented consistently with the dictionary. |

A production calculation for churn should be:

```text
90-day churn (%) =
  100 × qualifying churned activated manufacturers
      / activated manufacturers with 90 days of follow-up
```

For funnel stages:

```text
Stage conversion (%) = 100 × current-stage count / previous-stage count
Share of identified (%) = 100 × current-stage count / identified count
Stage drop = previous-stage count − current-stage count
```

Return-to-origin and post-delivery returns are distinct events. The demo's broad unsuccessful metric combines several outcomes; it should not be interpreted as a narrow logistics RTO rate.

## Data and calculation model

The inspected application embeds ten representative manufacturer records with fields including:

| Field group | Examples |
| --- | --- |
| Identity and segmentation | `id`, `segment`, `category`, `cohort`. |
| Programme state | `stage`, `supportEnd`, `graduation`, `retained90`, `reason`. |
| Sales fixtures | `orders`, `nmv`. |

There is no transaction-level order-line dataset in the inspected application logic. Aggregate charts and KPIs are based on separate fixture constants rather than sums of these ten records.

The cohort, category and operating filters select matching records. Their count drives a demonstration scale factor:

```text
factor = max(0.35, matching manufacturer records / 10) × range multiplier

Range multipliers:
Last 90 days  = 1.00
Last 180 days = 1.18
Year to date  = 0.86
```

Selected KPIs use illustrative formulas:

```text
Activated = round(86 × factor)
Active = round(67 × factor)
Successful orders = round(1476 × factor)
NMV (₹ lakh) = 68.4 × factor
Churn (%) = 18.4 × (1.1 − 0.12 × factor)
Unsuccessful (%) = 11.8 / factor
```

The date-range control changes a multiplier; it does not filter dated transactions. The 35% floor keeps KPI values non-zero even when no manufacturer records match. Several other panels use fixed percentages, counts and labels.

The intended zero-denominator policy is to show N/A, but the present scale-factor implementation does not enforce that policy throughout the dashboard.

## Architecture and technology

| Layer | Observed implementation |
| --- | --- |
| Application | Next.js and React. |
| Navigation and state | Client-side React state for views, filters, stage selection, search and popovers. |
| Data preparation | In-memory fixtures, filtering and illustrative arithmetic. |
| Charts | Inline SVG line charts, CSS bars and heatmaps. |
| Styling | Custom CSS classes, plum/lavender/pink colours and panel layouts. |
| Hosting | Vercel. |

Conceptually, the frontend consists of a shared shell, filters, metric definitions, chart helpers, three dashboard views, a manufacturer table and a drill-down modal.

No application data-fetching or persistent storage calls were observed in the inspected dashboard logic. View and filter state are held in memory and reset on reload. This observation does not establish the absence of every hosting-level service or analytics integration.

**Documentation scope:** The live prototype and publicly served application bundle were inspected. The supplied GitHub repository could not be read without authentication. Exact dependency versions, source-file paths, scripts, environment variables, build settings, tests and licence require verification against the repository. They are not inferred from the other Meesho DICE projects.

## Getting started

### Prerequisites

- Git and authorised access to the repository.
- A Node.js runtime compatible with the repository's requirements.
- The package manager declared by its manifest and lockfile.

### Clone and inspect

```bash
git clone https://github.com/mahim-dungarwal/Meesho-Dice-Dashboard.git
cd Meesho-Dice-Dashboard
cat package.json
```

If authentication is required, use your authorised GitHub account or SSH configuration. Do not embed access tokens in commands or commit them.

Check `packageManager`, `engines` and `scripts`, then use the appropriate installation method:

| Repository configuration | Install command |
| --- | --- |
| pnpm with `pnpm-lock.yaml` | `pnpm install --frozen-lockfile` |
| npm with `package-lock.json` | `npm ci` |
| Yarn | Use the declared Yarn version and its lockfile-preserving install command. |

Run the development script with the selected package manager. For example, **if `dev` is declared**, use `pnpm dev` or `npm run dev`. Open the local URL printed by the server.

Use the repository's declared build, production-start, lint, type-check and test commands where available. Their exact names and successful local execution were not verified for this documentation pass.

### Environment variables

Inspect any `.env.example`, server routes and project configuration for requirements. The observed dashboard logic uses embedded data; no marketplace API, database or authentication credentials are demonstrated. Do not invent environment variables based on planned integrations.

## Customisation

After locating the relevant source modules, useful extension points include:

- Manufacturer fixtures and operating/category/cohort labels.
- Funnel stages and aggregate fixture counts.
- KPI formulas and metric definitions.
- Retention windows, graduation paths and maturity states.
- Trend series, return-reason fixtures and recommendation copy.
- Drill-down record selection and search.
- CSV export and error/empty-state handling.
- Colours, chart styles and responsive layout.

The observed design uses plum `#62124F`, supporting purples `#9565B8` and `#B585CB`, lavender `#E4DDFB`, and pink `#FFC3E8` in several chart elements. Check the stylesheet for the complete design-token palette.

## Deployment

The live demo is **[null-three-sable.vercel.app](https://null-three-sable.vercel.app/)**.

For a separate Vercel deployment:

1. Import the repository using an account with access.
2. Select the Next.js framework preset.
3. Set the root directory, Node.js version, package manager and build command from the actual repository configuration.
4. Add only environment variables required by the implementation.
5. Deploy and verify navigation, filters, charts, tables and modal behaviour.

Automatic deployment triggers and the current Vercel/Git configuration were not verified.

## Validation

Manual checks should cover:

- Switching among all three views.
- Each filter individually and in combination.
- Initial state, Reset, empty matches and explicit all-category selection.
- Opening and closing metric definitions, including Escape.
- Selecting and clearing funnel stages.
- Drill-down search, no-match results and backdrop/close-button behaviour.
- Consistency between totals, denominators, charts and supporting records.
- Correct treatment of immature cohorts and zero denominators.
- Export behaviour and readable layouts at different screen sizes.

The live views, category filtering and stage drill-down were inspected during this documentation pass. Local builds and automated tests were not run because repository source access was unavailable.

## Known limitations

- **Initial category mismatch:** the initial and Reset state use `All categories`, while the filter logic expects `All approved categories`. This produces zero matching records despite the dropdown appearing to show the all-category option. Select a specific category and then All approved categories as a demo workaround.
- **Illustrative aggregates:** KPI scaling, fixed comparisons and separate fixtures do not form a reconciled analytics dataset. For example, the churn numerator/denominator remain 7/38 while the headline changes independently.
- **Incomplete drill-down reconciliation:** the modal uses a slice of representative records for some stages, and placeholder stage-duration fields. Its reconciliation wording is an intended experience, not a validated guarantee.
- **Static maturity and retention:** cohort availability, several retention values and the update timestamp are fixed copy rather than runtime calculations.
- **Empty-filter handling:** the scale-factor floor leaves non-zero summaries for zero matching manufacturers.
- **Export placeholder:** Export CSV displays an alert without creating a file.
- **No live programme integration:** no demonstrated seller authentication, warehouse feed, manufacturer CRM or order-line API.

## Roadmap

Potential next steps, not implemented in the inspected demo:

- Correct filter defaults and implement consistent empty/zero-denominator states.
- Replace scaled aggregates with calculations from one authoritative manufacturer and order-line dataset.
- Derive cohort maturity and follow-up windows from actual event dates.
- Reconcile funnel transitions, drill-down records, churn and retention denominators.
- Separate logistics RTO from returns after delivery.
- Connect authorised programme, seller and fulfilment data sources.
- Implement actual filtered CSV export.
- Add authentication, role-based access and appropriate access logging for real records.
- Add automated metric, filter, reconciliation and accessibility tests.
- Connect relevant MOR/Saarthi/MEERA workflows where authorised.

## Contributing

Use [repository issues](https://github.com/mahim-dungarwal/Meesho-Dice-Dashboard/issues) for bugs or proposals, or submit a focused pull request if you have access.

1. Create a branch, for example `fix/category-filter-default`.
2. Make the change and update relevant documentation.
3. Run repository-defined checks and the applicable manual flows.
4. Explain behaviour changes, metric assumptions and validation.
5. Include screenshots for UI changes and reconciliation examples for metric changes.

Do not commit credentials or real manufacturer/customer records. Preserve synthetic-data labels until live integrations and calculations are verified.

## Maintainers and licence

Repository owner: [@mahim-dungarwal](https://github.com/mahim-dungarwal).

Check the repository's `LICENSE` file for reuse terms. No licence was verified during this documentation pass; this README does not grant redistribution permission.

Meesho and MEERA naming describes the competition proposal and prototype. It does not establish official affiliation or access to Meesho internal data.
