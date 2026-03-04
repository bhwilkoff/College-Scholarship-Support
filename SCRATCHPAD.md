# SCRATCHPAD

## Current State

> **Keep this block short and current.** Update it at the end of every session.
> This is the first thing Claude reads — make it worth reading.

**Status**: M2 complete — AI Prompt Template Generator live. Database expanded to 236 scholarships.
**Active milestone**: M3 — Robust Interface and Branding
**Last session**: [2026-03-04]

**Database expansion progress** (sequential category research — Category 1 of 7 complete):
- [x] Category 1: Merit / Essay / Service — 86 new entries added (IDs 151–236)
- [ ] Category 2: STEM
- [ ] Category 3: Identity / Diversity
- [ ] Category 4: Need-Based
- [ ] Category 5: Regional / State-Specific
- [ ] Category 6: Arts
- [ ] Category 7: Athletic

**Research methodology (use for subsequent categories)**:
1. Grep existing names to avoid duplicates before searching
2. Use one Agent to research ALL scholarships in the category at once (ask for 100+)
3. Agent returns summary only — then resume agent to get data in **3 batches of ~33** (not all at once)
4. Manually filter duplicates against existing DB before writing
5. Write to data.js in 3 sequential Edit calls (each ~30 entries) to stay under token limits
6. Validate with `node -e` script that modifies `const` → `global` before eval
7. Set `CLAUDE_CODE_MAX_OUTPUT_TOKENS=100000` in `~/.zshenv` (already done)

**Next actions**:
- [ ] M3: Social-card visual redesign — make each scholarship feel like a "post" to interact with
  - Cards should feel like objects to interact with, not table rows
  - Consider TikTok/Instagram card aesthetic — large visuals, interactive feel
  - Decide: keep dark theme only, or offer light/dark toggle?
- [ ] Continue database expansion with Category 2: STEM

**Open questions**:
- For M3, do we keep the dark theme or offer light/dark toggle?
- Should cards have micro-interactions (swipe, like/save, etc.) or stay click-to-open?

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

### M2 — AI Prompt Template Generator ✅

The user can select any scholarship and generate an AI prompt suitable for use in a modern AI agent/chat interface that will help with the development of answers to the specific scholarship form/questions. This feature should be very specific in that it creates guardrails for the applicant to use with AI so that all responses require significant thought and co-creation before submitting materials for any given scholarship.

**Learning-orientation check**:
- [x] Deepens understanding — reflection questions surface what the selection committee is actually looking for; students leave with clearer self-knowledge
- [x] Invites participation — the form requires the student to articulate their own story before any AI is involved; Phase 1 demands answers before any help
- [x] Supports human agency — AI is explicitly instructed not to write for the student; every sentence stays in their voice

**Acceptance criteria**:
- [x] Ability to adjust prompts based upon user preferences (name, school, major, activities fields)
- [x] Understanding of what each application requires (type-tailored reflection questions matched to what each scholarship values)
- [x] Intuitive guardrails so that the applicant learns something about themselves (two-phase structure: reflect first, shape second)

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

### Session 2 — 2026-02-28

**Found**: M1 complete. Modal showing scholarship details. M2 not yet started.

**Did**:
- Built AI Prompt Template Generator (M2) — "Prepare with AI" section in every scholarship modal
- Applicant fills in name, school, major, and key activities/achievements
- Generates a two-phase guardrail prompt: Phase 1 asks 3 reflection questions one at a time (type-tailored per scholarship); Phase 2 only helps shape the student's own answers
- 10 type-specific question sets (merit, need-based, identity, STEM, field-of-study, community-service, arts, essay, regional, athletic) + default fallback
- Copy-to-clipboard with accessible confirmation feedback
- New CSS for all prompt UI elements, consistent with existing dark design system
- Updated SCRATCHPAD.md with M2 complete status

**Left**: M2 complete. Ready for M3 (Robust Interface and Branding — social-card visual redesign).

### Session 3 — 2026-03-04

**Found**: M2 complete. 150 scholarships in database. Previous attempts at parallel multi-agent research failed due to token limits.

**Did**:
- Set `CLAUDE_CODE_MAX_OUTPUT_TOKENS=100000` in `~/.zshenv` to fix output truncation
- Researched Category 1 (Merit/Essay/Service) sequentially using a single Agent with 3 resume calls for batched output
- Added 86 net-new scholarships (IDs 151–236) across three subcategories:
  - Merit/Academic Excellence: 27 entries (Cameron Impact, Posse, NHS, Daniels, CBYX, USSYP, etc.)
  - Essay/Writing Competitions: 31 entries (National History Day, DAR Good Citizens, USIP Peace Essay, YoungArts Writing, etc.)
  - Community Service/Civic Engagement: 28 entries (Huntington Public Service, Diller Tikkun Olam, Bonner Scholarship, etc.)
- Documented research methodology in SCRATCHPAD for reuse across remaining 6 categories
- Validated file with Node.js; database now at 236 total scholarships

**Left**: 236 scholarships live. Database expansion 1/7 categories complete. M3 interface work not yet started.
