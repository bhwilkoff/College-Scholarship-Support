# SCRATCHPAD

## Current State

> **Keep this block short and current.** Update it at the end of every session.
> This is the first thing Claude reads — make it worth reading.

**Status**: M1 complete — fully working scholarship search app live on GitHub Pages.
**Active milestone**: M2 — AI Prompt Template Generator
**Last session**: [2026-02-27]

**Next actions**:
- [ ] M2: Add scholarship detail view with AI prompt template generator
  - Select a scholarship → generate a structured AI prompt tailored to that scholarship's specific questions/essay requirements
  - Prompt should be a "guardrail" framework — forces reflection, not shortcuts
  - Include editable fields (applicant's name, school, major, extracurriculars) that customize the prompt
- [ ] M3: Social-card visual redesign — make each scholarship feel like a "post" to interact with

**Open questions**:
- Should the AI prompt be copyable to clipboard, or should it link directly to a chat interface (Claude, ChatGPT, etc.)?
- For M3, do we keep the dark theme or offer light/dark toggle?

---

## Milestones

> Each milestone should represent a user-visible capability, not a technical task.
> Write the acceptance criteria as things a real user could verify, not things only a developer would notice.

### M0 — Project Initialization ✅

- [x] Clone template repository
- [x] Fill in CLAUDE.md project identity section
- [x] Define milestones M1–M3 below
- [x] Push initial commit to GitHub
- [x] Enable GitHub Pages in repository settings
- [x] Confirm live URL is accessible

### M1 — Exhaustive Scholarship Research ✅

The user can see hundreds (100) of scholarships available that are filterable by a dozen or so different factors including amount of scholarship, deadline, qualifications, restrictions, location, and likelihood of receiving the scholarship, among others.

**Learning-orientation check**:
- [x] Deepens understanding — likelihood indicators and rich metadata teach users how competitive each scholarship is
- [x] Invites participation — filtering requires users to make choices about their own situation and goals
- [x] Supports human agency — users can filter and sort to find scholarships that fit *their* unique profile

**Acceptance criteria**:
- [x] Searchability of large scholarship database (100 scholarships, full-text search)
- [x] Sorting and Filtering capabilities (sort by amount/deadline/likelihood/name; filter by type, year, state, GPA, essay, renewable, likelihood, amount range)
- [x] Large selection of metadata for each scholarship (amount, deadline, type, year eligible, GPA req, essay req, renewable, state, likelihood, tags, organization, URL)

### M2 — AI Prompt Template Generator

The user can select any scholarship and generate an AI prompt suitable for use in a modern AI agent/chat interface that will help with the development of answers to the specific scholarship form/questions. This feature should be very specific in that it creates guardrails for the applicant to use with AI so that all responses require significant thought and co-creation before submitting materials for any given scholarship.

**Learning-orientation check**:
- [ ] Deepens understanding
- [ ] Invites participation
- [ ] Supports human agency

**Acceptance criteria**:
- [ ] Ability to adjust prompts based upon user preferences
- [ ] Understanding of what each application requires (questions, essays, information, etc.)
- [ ] Intuitive guardrails so that the applicant learns something about themselves as they are constructing responses to the scholarship applications

### M3 — Robust Interface and Branding

The user is able to intuitively use the search and support service within a modern look and feel that could easily be seen by someone who uses TikTok, Snapchat, Instagram, Youtube, or other modern websites as something worth their time. The goal is not to simply have a table of information in the way that other college websites might display opportunities, but rather for each opportunity to look and feel like an "object" that is to be interacted with in the same way that a user might interact with a "post or video" on Instagram or a User within a social network.

**Learning-orientation check**:
- [ ] Deepens understanding
- [ ] Invites participation
- [ ] Supports human agency

**Acceptance criteria**:
- [ ] Look and feel is consistent with modern social networks and websites
- [ ] Each scholarship is an object with robust metadata and can be interacted with as such
- [ ] All "fields" about the scholarship are well maintained and look inviting to a young audience.

<!-- Add milestones as the project grows. Keep acceptance criteria user-observable. -->

---

## Session Log

> Append a brief entry after each session. Never edit past entries.
> Format: what state you found, what state you did, what state you left it in.

### Session 1 — 2026-02-27

**Found**: Empty repo with placeholder HTML/CSS/JS. No content, no data.

**Did**:
- Built full app HTML structure (`index.html`) with accessible, mobile-first layout: sticky header, filter sidebar, results grid, modal detail view
- Built complete dark-mode CSS (`css/styles.css`) with modern design system using CSS custom properties — card hover effects, badge colors per type, toggle switches, GPA slider, view grid/list
- Built full application logic (`js/app.js`) with search (full-text across name, org, tags, description), 8 filter dimensions (type, year, likelihood, renewable, essay, amount range, GPA), 5 sort modes, grid/list view toggle, accessible modal with focus trap
- Built scholarship database (`js/data.js`) with 100 real scholarships across 10 categories: flagship national, STEM, identity-based, field-of-study, arts, community service, need-based, regional/state, essay competitions, athletic
- Updated `DECISIONS.md` and `SCRATCHPAD.md`
- Committed and pushed to `claude/start-work-CAiMc`

**Left**: M1 complete. App is live. 100 scholarships searchable and filterable. Ready for M2 (AI Prompt Template Generator).
