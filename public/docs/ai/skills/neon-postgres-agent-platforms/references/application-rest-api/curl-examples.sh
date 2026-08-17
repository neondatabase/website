#!/usr/bin/env bash
# Reference-only curls for sample product REST routes (see CURL_REFERENCE.md: not Neon Management API).
# Safe defaults: localhost, no destructive verbs. Expect 401 without STACK_SESSION_COOKIE.

APP_BASE_URL="${APP_BASE_URL:-http://localhost:3000}"
APP_PROJECT_ID="${APP_PROJECT_ID:-YOUR_PROJECT_ID}"
APP_VERSION_ID="${APP_VERSION_ID:-YOUR_VERSION_ID}"

COOKIE_HEADER=()
if [[ -n "${STACK_SESSION_COOKIE:-}" ]]; then
  COOKIE_HEADER=(-H "Cookie: ${STACK_SESSION_COOKIE}")
fi

echo "# GET /api/v1/models (requires auth)"
curl -sS "${COOKIE_HEADER[@]}" "${APP_BASE_URL}/api/v1/models" | head -c 800
echo -e "\n"

echo "# POST /api/v1/projects, body: {\"name\": \"dev-placeholder\"}"
curl -sS -X POST "${COOKIE_HEADER[@]}" \
  -H "Content-Type: application/json" \
  -d '{"name":"dev-placeholder"}' \
  "${APP_BASE_URL}/api/v1/projects" | head -c 800
echo -e "\n"

echo "# GET /api/v1/projects/{projectId}/versions"
curl -sS "${COOKIE_HEADER[@]}" \
  "${APP_BASE_URL}/api/v1/projects/${APP_PROJECT_ID}/versions" | head -c 1200
echo -e "\n"

echo "# POST /api/v1/projects/{projectId}/checkpoint, optional assistantMessageId"
curl -sS -X POST "${COOKIE_HEADER[@]}" \
  -H "Content-Type: application/json" \
  -d '{}' \
  "${APP_BASE_URL}/api/v1/projects/${APP_PROJECT_ID}/checkpoint" | head -c 800
echo -e "\n"

echo "# POST /api/v1/projects/{projectId}/versions, body: {\"versionId\": \"...\"}"
curl -sS -X POST "${COOKIE_HEADER[@]}" \
  -H "Content-Type: application/json" \
  -d "{\"versionId\":\"${APP_VERSION_ID}\"}" \
  "${APP_BASE_URL}/api/v1/projects/${APP_PROJECT_ID}/versions" | head -c 1200
echo -e "\n"
