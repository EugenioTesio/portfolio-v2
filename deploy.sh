#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="eugenio-tesio-porfolio"

npm run build
firebase deploy --only hosting --project "$PROJECT_ID"
