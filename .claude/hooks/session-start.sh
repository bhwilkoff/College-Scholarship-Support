#!/bin/bash
# session-start.sh
#
# Silently orients Claude at the start of every session.
# Output is injected into Claude's context before the first user message.
# Kept deliberately short to minimize token cost.

CLAUDE_MD="CLAUDE.md"
SCRATCHPAD="SCRATCHPAD.md"

# Verify project files exist — if not, this is probably a fresh clone
if [ ! -f "$CLAUDE_MD" ]; then
  echo "TEMPLATE NOTICE: CLAUDE.md not found. Fill in the project identity section before starting work."
  exit 0
fi

echo "=== PROJECT CONTEXT ==="
echo ""
cat "$CLAUDE_MD"
echo ""

# Inject only the Current State block from SCRATCHPAD — not the full file.
# This keeps session-start tokens low while still orienting Claude.
if [ -f "$SCRATCHPAD" ]; then
  echo "=== CURRENT STATE (from SCRATCHPAD.md) ==="
  echo ""
  # Extract lines between "## Current State" and the first "---" separator
  awk '/^## Current State/{found=1; next} found && /^---/{exit} found{print}' "$SCRATCHPAD"
  echo ""
fi

echo "=== END OF SESSION CONTEXT ==="
