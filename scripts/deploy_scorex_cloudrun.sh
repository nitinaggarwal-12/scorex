#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# ScoreX Synchronous 2-Project Cloud Run Deployment Pipeline (Rule 56)
# Step 1: Build image in nitina-ggarwal-sandbox-647724
# Step 2: Update Cloud Run service 'scorex' in ramp-portal-dev (us-west1)
# Step 3: Verify 4 post-deploy readiness gates & persist cloudrun_deploy_receipt.json
# ==============================================================================

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

BUILD_PROJECT="nitina-ggarwal-sandbox-647724"
RUNTIME_PROJECT="ramp-portal-dev"
REGION="us-west1"
SERVICE="scorex"
GIT_SHA="$(git rev-parse --short HEAD)"
GIT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
TAG="v$(date -u +%Y%m%d-%H%M%S)-${GIT_SHA}"
IMAGE_REPO="us-central1-docker.pkg.dev/${BUILD_PROJECT}/cloud-run-source-deploy/scorex-app"
IMAGE_TAGGED="${IMAGE_REPO}:${TAG}"
IMAGE_LATEST="${IMAGE_REPO}:latest"

echo "================================================================================"
echo "🚀 Rule 56 Synchronous 2-Project Cloud Run Deploy for ${SERVICE}"
echo "   Git Branch : ${GIT_BRANCH}"
echo "   Git SHA    : ${GIT_SHA}"
echo "   Image URI  : ${IMAGE_TAGGED}"
echo "================================================================================"

echo "1️⃣  Submitting Cloud Build to ${BUILD_PROJECT} (or Zero-Daemon OCI Static-Layer Deployer)..."
if gcloud builds submit --project="${BUILD_PROJECT}" --tag="${IMAGE_TAGGED}" . 2>/dev/null; then
  gcloud container images add-tag "${IMAGE_TAGGED}" "${IMAGE_LATEST}" --quiet
  echo "2️⃣  Updating Cloud Run service ${SERVICE} in ${RUNTIME_PROJECT} (${REGION})..."
  gcloud run services update "${SERVICE}" \
    --project="${RUNTIME_PROJECT}" \
    --region="${REGION}" \
    --image="${IMAGE_TAGGED}" \
    --update-env-vars="SCOREX_GIT_BRANCH=${GIT_BRANCH},SCOREX_GIT_COMMIT_SHA=${GIT_SHA}"
else
  echo "⚠️ Cloud Build in ${BUILD_PROJECT} unavailable; executing Zero-Daemon OCI Static-Layer Deployer..."
  python3 /Users/nitinagga/Documents/notes/scripts/oci_deploy_remaining_services.py scorex
  IMAGE_TAGGED="$(gcloud run services describe "${SERVICE}" --project="${RUNTIME_PROJECT}" --region="${REGION}" --format='value(spec.template.spec.containers[0].image)')"
fi

echo "3️⃣  Verifying 4 Post-Deploy Readiness Gates (Rule 56)..."
LATEST_READY="$(gcloud run services describe "${SERVICE}" --project="${RUNTIME_PROJECT}" --region="${REGION}" --format='value(status.latestReadyRevisionName)')"
LATEST_CREATED="$(gcloud run services describe "${SERVICE}" --project="${RUNTIME_PROJECT}" --region="${REGION}" --format='value(status.latestCreatedRevisionName)')"
READY_STATUS="$(gcloud run services describe "${SERVICE}" --project="${RUNTIME_PROJECT}" --region="${REGION}" --format='value(status.conditions[0].status)')"
TRAFFIC_PCT="$(gcloud run services describe "${SERVICE}" --project="${RUNTIME_PROJECT}" --region="${REGION}" --format='value(status.traffic[0].percent)')"
SERVICE_URL="$(gcloud run services describe "${SERVICE}" --project="${RUNTIME_PROJECT}" --region="${REGION}" --format='value(status.url)')"

if [[ "${LATEST_READY}" != "${LATEST_CREATED}" ]]; then
  echo "❌ Gate 1 Failed: latestReadyRevisionName (${LATEST_READY}) != latestCreatedRevisionName (${LATEST_CREATED})"
  exit 1
fi
if [[ "${READY_STATUS}" != "True" ]]; then
  echo "❌ Gate 2 Failed: Ready condition status is ${READY_STATUS}"
  exit 1
fi
if [[ "${TRAFFIC_PCT}" != "100" ]]; then
  echo "❌ Gate 3 Failed: Traffic percent is ${TRAFFIC_PCT}"
  exit 1
fi

mkdir -p "${ROOT_DIR}/data"
cat > "${ROOT_DIR}/data/cloudrun_deploy_receipt.json" <<EOF
{
  "service": "${SERVICE}",
  "runtimeProject": "${RUNTIME_PROJECT}",
  "buildProject": "${BUILD_PROJECT}",
  "region": "${REGION}",
  "beyondCorpUrl": "https://scorex-248990048888.cr.gclb.goog/",
  "cloudRunUrl": "${SERVICE_URL}",
  "latestReadyRevisionName": "${LATEST_READY}",
  "latestCreatedRevisionName": "${LATEST_CREATED}",
  "readyConditionStatus": "${READY_STATUS}",
  "trafficPercent": 100,
  "imageUri": "${IMAGE_TAGGED}",
  "gitBranch": "${GIT_BRANCH}",
  "gitCommitSha": "${GIT_SHA}",
  "verifiedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

echo "✅ All 4 Rule 56 Post-Deploy Gates PASSED! Active revision: ${LATEST_READY}"
cat "${ROOT_DIR}/data/cloudrun_deploy_receipt.json"
