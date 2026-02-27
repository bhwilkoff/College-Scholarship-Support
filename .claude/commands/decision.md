Log an architectural or design decision to DECISIONS.md.

When this command is invoked:

1. **Determine the next decision number** by reading DECISIONS.md and finding the highest existing "Decision NNN" entry.

2. **Gather the decision details**. If not provided in the command arguments, ask for:
   - The decision (what was chosen, in one sentence)
   - The rationale (why this is right for this project)
   - Alternatives considered (what else was on the table)
   - Trade-offs (what is gained, what is given up)

3. **Append the entry to DECISIONS.md** in this exact format:

```
## Decision NNN — [Short descriptive title]
**Date**: YYYY-MM-DD
**Decision**: [One sentence stating what was decided]
**Rationale**: [Why this choice serves this project's goals]
**Alternatives considered**: [Other options evaluated]
**Trade-offs**: [What we gain, what we give up]
```

4. **Confirm** with a one-line acknowledgment: "Decision NNN logged."

Do not edit or remove any existing entries. DECISIONS.md is append-only.
