# Architecture Decision Record

> Log every significant technical or design decision here.
> This file is **append-only** — never edit or remove past decisions.
> A decision is significant if a future session would benefit from knowing why it was made.

**Format for each entry:**

```
## Decision NNN — [Short title]
**Date**: YYYY-MM-DD
**Decision**: [What was decided, in one sentence]
**Rationale**: [Why this was the right choice for this project]
**Alternatives considered**: [What else was on the table]
**Trade-offs**: [What we gain, what we give up]
```

---

## Decision 001 — Vanilla HTML/CSS/JS, no framework

**Date**: [YYYY-MM-DD]
**Decision**: Use plain HTML, CSS, and JavaScript with no build step and no framework.
**Rationale**: GitHub Pages hosts static files directly. No framework means no build pipeline, no dependencies to update, no abstraction between the code and the browser. The project remains readable and modifiable by anyone with basic web knowledge, which aligns with the learning-orientation principle of clarity over cleverness.
**Alternatives considered**: React, Vue, Svelte — all require a build step or CDN dependency; Astro — adds complexity for a single-page app
**Trade-offs**: We lose component reuse patterns and reactive state management. We gain zero setup friction, full control over output, and a codebase that doesn't rot when npm packages break.

<!-- Add new decisions below, incrementing the number. -->

## Decision 002 — Embedded JSON data, no external API

**Date**: 2026-02-27
**Decision**: Scholarship data is embedded directly in `js/data.js` as a JavaScript array of objects, loaded as a script tag before `app.js`.
**Rationale**: GitHub Pages is static-only. No server to proxy an API, no CORS workarounds, no build step. Embedding data keeps deployment dead simple and load times instant — no fetch latency, no network errors.
**Alternatives considered**: Fetching from a public scholarships API (Scholarships360, Scholly) — none offer free, CORS-permissive, stable APIs. Using a JSON file loaded via fetch — adds async complexity for no meaningful benefit at this scale.
**Trade-offs**: Data must be updated manually as scholarship details change. We gain zero-dependency operation and offline capability.

## Decision 003 — Dark color palette with purple accent

**Date**: 2026-02-27
**Decision**: App uses a dark (#0f0f13) background with purple (#8b5cf6) as the primary accent and vibrant badge colors per scholarship type.
**Rationale**: The primary audience is Gen Z students who live in dark-mode environments (Discord, TikTok, YouTube, Notion). A dark palette immediately signals "this is for you, not your parents' FAFSA portal." Purple is distinct from the blues (FAFSA, College Board) and greens (financial services) that dominate this space.
**Alternatives considered**: Light mode with blue/green accents — feels institutional and dated. Automatic light/dark OS-level switching — adds complexity; M3 is the right milestone to add a theme toggle.
**Trade-offs**: Dark mode can reduce readability for some users in bright environments. We accept this for M1; a theme toggle can be added in M3.

## Decision 004 — Likelihood field communicates odds, not rank

**Date**: 2026-02-27
**Decision**: Each scholarship has a `likelihood` field (high/medium/low) representing rough odds of any given student winning, based on applicant pool size and selectivity.
**Rationale**: Dollar amount alone is a poor guide — a $1,000 scholarship with 50 applicants may be more worth pursuing than a $10,000 scholarship with 50,000 applicants. Surfacing likelihood teaches students to think strategically about where to invest their effort.
**Alternatives considered**: Not including odds at all — omits strategically important information. Including exact acceptance rates — not reliably available for most scholarships.
**Trade-offs**: Likelihood assessments are approximate and can't account for individual fit. We label them clearly as "odds" not guarantees.

## Decision 005 — Modal detail view, not page navigation

**Date**: 2026-02-27
**Decision**: Clicking a scholarship card opens a modal overlay, not a new page or route.
**Rationale**: No build step means no client-side router. A modal keeps all state (filters, search query, scroll position) intact when the user closes it — better UX than navigating away. Accessible with focus trap, Escape to close, and focus restoration.
**Alternatives considered**: New page per scholarship (requires URL routing complexity); inline expansion within the card (clutters the grid).
**Trade-offs**: Deep-linking to a specific scholarship is not supported. Acceptable for M1; can be added via URL hash in a future milestone.
