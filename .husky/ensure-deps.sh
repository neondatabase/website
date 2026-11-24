# Sourced by the hooks in this folder, which git runs directly (core.hooksPath is .husky).

# Load the personal startup files husky's runner loaded, for example to put node on PATH in a
# GUI git client.
for f in "${XDG_CONFIG_HOME:-$HOME/.config}/husky/init.sh" "$HOME/.huskyrc"; do
  if [ -f "$f" ]; then
    . "$f"
  fi
done

# Fail the hook when any command fails, as husky's runner did.
set -e

# HUSKY=0 skips the hooks, as it did with husky.
if [ "${HUSKY-}" = "0" ]; then
  exit 0
fi

# Fallback paths for GUI git clients
export PATH="$PATH:/opt/homebrew/bin:/usr/local/bin:$HOME/.npm-global/bin"

# The hooks run tools from this checkout's node_modules. A new git worktree has none, so stop
# with a clear message instead of failing on a missing command.
if [ ! -d node_modules ]; then
  echo "git hook: no node_modules in $(pwd)." >&2
  echo "Install this checkout's dependencies first: npm ci --prefer-offline" >&2
  exit 1
fi
