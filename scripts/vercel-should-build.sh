#!/usr/bin/env bash
# Vercel Ignored Build Step: exit 0 = skip deploy, exit 1 = build.
# Repo shannon1102/medical-store-web is linked to two Vercel projects; only vppaca should deploy.
set -euo pipefail

LEGACY_MEDICAL_STORE_WEB_PROJECT_ID="prj_aJE7rLtxsSIkvasgLxgZnV5gSDg8"

if [ "${VERCEL_PROJECT_ID:-}" = "$LEGACY_MEDICAL_STORE_WEB_PROJECT_ID" ]; then
  echo "Skipping build for legacy medical-store-web Vercel project (use vppaca)."
  exit 0
fi

exit 1
