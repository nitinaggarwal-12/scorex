#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

APP_PORT="${SCOREX_PORT:-5001}"

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

if port_in_use "$APP_PORT"; then
  echo "Port $APP_PORT is already in use:"
  lsof -nP -iTCP:"$APP_PORT" -sTCP:LISTEN || true
  echo
  echo "If this is an older ScoreX process, stop it and run npm run dev again."
  echo "Or use another port: SCOREX_PORT=5002 npm run dev"
  exit 1
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
export FRONTEND_URL="http://localhost:$APP_PORT"
export ALLOWED_ORIGINS="http://localhost:$APP_PORT,http://127.0.0.1:$APP_PORT"
export SCOREX_GIT_BRANCH="${SCOREX_GIT_BRANCH:-$(git branch --show-current 2>/dev/null || echo local)}"
export SCOREX_GIT_COMMIT_SHA="${SCOREX_GIT_COMMIT_SHA:-$(git rev-parse HEAD 2>/dev/null || echo local)}"

printf '\nBuilding ScoreX Phase 1 client...\n'
(cd client && CI=false npm run build)

printf '\nStarting ScoreX local preview\n'
printf '  Branch: %s\n' "$SCOREX_GIT_BRANCH"
printf '  App:    http://localhost:%s\n' "$APP_PORT"
printf '  Health: http://localhost:%s/api/health\n' "$APP_PORT"
printf '  Build:  http://localhost:%s/build-info\n\n' "$APP_PORT"

# Serve the production React build and API from one Express process.
# This avoids a second React dev-server port and keeps Prompt Canvas free on :3000.
exec env NODE_ENV=development PORT="$APP_PORT" node server/index.js
