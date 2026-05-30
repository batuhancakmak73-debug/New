#!/bin/bash
set -euo pipefail

# Only run in Claude Code remote (web) sessions
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

SKILLS_DIR="$HOME/.local/share/mattpocock-skills"
SKILLS_LINK_TARGET="$HOME/.claude/skills"

# Clone or update mattpocock/skills
if [ -d "$SKILLS_DIR/.git" ]; then
  git -C "$SKILLS_DIR" pull --ff-only --quiet
else
  git clone --depth=1 --quiet https://github.com/mattpocock/skills.git "$SKILLS_DIR"
fi

# Link skills into ~/.claude/skills/
mkdir -p "$SKILLS_LINK_TARGET"

find "$SKILLS_DIR/skills" -name SKILL.md -not -path '*/deprecated/*' -print0 |
while IFS= read -r -d '' skill_md; do
  src="$(dirname "$skill_md")"
  name="$(basename "$src")"
  target="$SKILLS_LINK_TARGET/$name"

  if [ -e "$target" ] && [ ! -L "$target" ]; then
    rm -rf "$target"
  fi

  ln -sfn "$src" "$target"
done

echo "mattpocock/skills linked successfully."
