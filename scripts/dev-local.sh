#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

UI_PORT="${SCOREX_UI_PORT:-3001}"
API_PORT="${SCOREX_API_PORT:-5001}"

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

if port_in_use "$UI_PORT"; then
  echo "ScoreX UI port $UI_PORT is already in use."
  lsof -nP -iTCP:"$UI_PORT" -sTCP:LISTEN || true
  echo "Set another port with SCOREX_UI_PORT=<port> npm run dev"
  exit 1
fi

if port_in_use "$API_PORT"; then
  echo "ScoreX API port $API_PORT is already in use."
  lsof -nP -iTCP:"$API_PORT" -sTCP:LISTEN || true
  echo "Set another port with SCOREX_API_PORT=<port> npm run dev"
  exit 1
fi

export PORT="$API_PORT"
export FRONTEND_URL="http://localhost:$UI_PORT"
export ALLOWED_ORIGINS="http://localhost:$UI_PORT,http://127.0.0.1:$UI_PORT"
export SCOREX_GIT_BRANCH="${SCOREX_GIT_BRANCH:-$(git branch --show-current 2>/dev/null || echo local)}"
export SCOREX_GIT_COMMIT_SHA="${SCOREX_GIT_COMMIT_SHA:-$(git rev-parse HEAD 2>/dev/null || echo local)}"

if [[ ! -x ./node_modules/.bin/concurrently ]]; then
  echo "Root dependencies are not installed. Run: npm install"
  exit 1
fi

if [[ ! -x ./client/node_modules/.bin/react-scripts ]]; then
  echo "Client dependencies are not installed. Run: cd client && npm install --include=dev"
  exit 1
fi

echo "Starting ScoreX"
echo "  Branch: $SCOREX_GIT_BRANCH"
echo "  UI:     http://localhost:$UI_PORT"
echo "  API:    http://localhost:$API_PORT"
echo "  Health: http://localhost:$API_PORT/api/health"

echo

exec ./node_modules/.bin/concurrently \
  --kill-others \
  --names API,UI \
  "PORT=$API_PORT npm run server" \
  "cd client && PORT=$UI_PORT HOST=0.0.0.0 BROWSER=none npm start"
