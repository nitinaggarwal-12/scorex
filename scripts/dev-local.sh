#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

APP_PORT="${SCOREX_PORT:-5055}"

if [[ ! -f .env && -f .env.template ]]; then
  cp .env.template .env
  echo "Created .env from .env.template"
fi

port_in_use() {
  local port="$1"
  if command -v lsof >/dev/null 2>&1; then
    lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1
  else
    return 1
  fi
}

find_free_port() {
  local p="$1"
  while port_in_use "$p"; do
    p=$((p + 1))
  done
  echo "$p"
}

if [[ "${SCOREX_PORT:-}" == "auto" || "${SCOREX_PORT:-}" == "unique" ]]; then
  APP_PORT=$(find_free_port 5055)
elif port_in_use "$APP_PORT"; then
  echo "Port $APP_PORT is in use:"
  lsof -nP -iTCP:"$APP_PORT" -sTCP:LISTEN || true
  NEXT_PORT=$(find_free_port "$((APP_PORT + 1))")
  echo "Auto-switching to next available unique port: $NEXT_PORT"
  APP_PORT="$NEXT_PORT"
fi

if [[ ! -d ./node_modules ]]; then
  echo "Installing ScoreX server dependencies..."
  npm install
fi

if [[ ! -x ./client/node_modules/.bin/react-scripts ]]; then
  echo "Installing ScoreX client dependencies..."
  (cd client && npm install --include=dev)
fi

export PORT="$APP_PORT"
export REACT_APP_API_URL="/api"
export FRONTEND_URL="http://localhost:$APP_PORT"
export ALLOWED_ORIGINS="http://localhost:$APP_PORT,http://127.0.0.1:$APP_PORT"
export SCOREX_GIT_BRANCH="${SCOREX_GIT_BRANCH:-$(git branch --show-current 2>/dev/null || echo local)}"
export SCOREX_GIT_COMMIT_SHA="${SCOREX_GIT_COMMIT_SHA:-$(git rev-parse HEAD 2>/dev/null || echo local)}"

if [[ "${SKIP_BUILD:-0}" != "1" ]]; then
  printf '\nBuilding ScoreX Phase 1 client...\n'
  (cd client && CI=false npm run build)
fi

printf '\nStarting ScoreX local preview\n'
printf '  Branch: %s\n' "$SCOREX_GIT_BRANCH"
printf '  App:    http://localhost:%s\n' "$APP_PORT"
printf '  Health: http://localhost:%s/api/health\n' "$APP_PORT"
printf '  Build:  http://localhost:%s/build-info\n\n' "$APP_PORT"

# Serve the production React build and API from one Express process.
# This avoids a second React dev-server port and keeps Prompt Canvas free on :3000.
exec env NODE_ENV=development PORT="$APP_PORT" node server/index.js
