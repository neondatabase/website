import sendGtagEvent from 'utils/send-gtag-event';

// Device-level variant assignments, keyed by experiment ID: { [experimentId]: variantId }.
const STORAGE_KEY = 'experimentAssignments';

function readAssignments() {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

// Returns this device's variant for an experiment. The first call picks one at random and stores
// it, so the device stays in that variant on every later visit. A stored variant that's no longer
// in `variantIds` is replaced with a new random pick. Call from the client only (after mount).
export function getExperimentVariant(experimentId, variantIds) {
  const assignments = readAssignments();
  const assigned = assignments[experimentId];
  if (variantIds.includes(assigned)) return assigned;

  const variantId = variantIds[Math.floor(Math.random() * variantIds.length)];
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...assignments, [experimentId]: variantId })
    );
  } catch {
    // Storage unavailable (private mode, quota): the variant holds for this page view only.
  }
  return variantId;
}

export function trackExperimentViewed(experimentId, variantId) {
  return sendGtagEvent('Experiment Viewed', { experiment_id: experimentId, variant_id: variantId });
}

export function trackExperimentSuccess(experimentId, variantId, properties = {}) {
  return sendGtagEvent('Experiment Success', {
    experiment_id: experimentId,
    variant_id: variantId,
    ...properties,
  });
}
