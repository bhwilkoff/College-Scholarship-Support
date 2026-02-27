# College and Univeristy Scholarship Support — Project Context

## Project Identity

**Name**: Scholarship Search and Support
**Purpose**: This is the single resource any college-age student will need in order to find and apply to the most relevant scholarships for achieving their academic goals.
**Audience**: This tool is for High School Juniors and Seniors and anyone else who is applying to Colleges and Universities and for whom money is a significant issue with attending the school(s) of their dreams. They likely will have specific schools in mind and a budget that is needed in order to afford them. They are trying to gather enough scholarship dollars together in order to graduate without debt.
**Human context**: This app will change how people think about paying for college/university. It will allow them to think bigger and strive for more in their educational journey because they will no longer see financial burden as a significant barrier.

**GitHub repo**: bhwilkoff/College-Scholarship-Support
**Live URL**: https://bhwilkoff.github.io/College-Scholarship-Support

## Tech Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript — no framework, no build step
- **Hosting**: GitHub Pages (static only — no server-side code, no databases)
- **Data / Auth**: [e.g., localStorage only | external API — name it | none]
- **Cost**: $0

## Key Files and Directories

```
index.html          Main application entry point
css/styles.css      All styles (mobile-first, custom properties)
js/app.js           Application logic
SCRATCHPAD.md       Session state, milestone log, open questions
DECISIONS.md        Architecture decision record (append-only)
CLAUDE.md           This file — project context and standing instructions
```

## Conventions

- Milestones are numbered M1, M2, M3... in SCRATCHPAD.md
- Every significant technical or design choice is logged in DECISIONS.md
- At the **end of every session**, update the "Current State" block in SCRATCHPAD.md
- Append a brief session log entry at the bottom of SCRATCHPAD.md
- Use `/milestone` to complete a milestone (triggers values checklist)
- Use `/decision` to log an architectural decision in the correct format
- Use `/status` for a quick orientation at any point in a session

---

## Standing Instructions for Claude

### Learning Orientation — Non-Negotiable

Before implementing any feature, evaluate it against these criteria. If a feature fails, surface the conflict and propose an alternative that passes before proceeding.

1. **Does it deepen understanding?**
   The user should leave knowing or seeing something they didn't before. Passive delivery of information is not enough — the feature should invite engagement with ideas.

2. **Does it invite participation, not consumption?**
   Does it ask something of the user — a judgment, a reflection, a contribution? Or does it simply serve content to be scrolled past?

3. **Does it support human agency?**
   Does it give people more control over their own thinking, decisions, or work? Does it make them more capable, not more dependent?

4. **Clarity over cleverness**
   Choose the simpler implementation. Every abstraction, pattern, or indirection is a cost that must be justified. When two approaches work, use the one a careful reader can understand in 30 seconds.

5. **Accessible by default**
   WCAG AA from the first line of code. Keyboard navigable. Meaningful alt text. Sufficient color contrast. Screen-reader compatible structure. Accessibility is not a feature added at the end — it's a constraint honored from the start.

6. **Responsive from the start**
   Mobile-first. Design and test at 375px before 1440px. Every layout decision assumes a small screen until proven otherwise.

### Autonomous Work Guidelines

- At session start, this file and the Current State section of SCRATCHPAD.md are already loaded. Orient silently and begin.
- When uncertain between two approaches: document the trade-off in DECISIONS.md and choose the simpler one.
- Do not add features, abstractions, helpers, or polish beyond what is explicitly requested.
- Do not refactor surrounding code when fixing a bug. Fix the bug, stop.
- Commit messages should be descriptive enough to serve as a project history without reading the diff.
- If a requested feature conflicts with the learning-orientation values above, do not implement it silently. Surface the conflict, explain why, and offer an alternative.

### Memory and Continuity

- SCRATCHPAD.md "Current State" block = source of truth for where work stands right now
- DECISIONS.md is append-only — never edit or remove past decisions
- Git history is long-term memory — commit meaningful, readable snapshots
- If context is ambiguous, read SCRATCHPAD.md and DECISIONS.md before asking
