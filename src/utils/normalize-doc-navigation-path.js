const AI_GATEWAY_MODEL_DETAIL_PATH = /^((?:\/docs\/)?ai-gateway\/models)\/[^/]+\/?$/;
const FUNCTION_REGISTRY_TEMPLATE_PATH =
  /^((?:\/docs\/)?compute\/functions\/registry\/templates)\/[^/]+\/?$/;
const LEGACY_FUNCTION_REGISTRY_TEMPLATE_PATH =
  /^((?:\/docs\/)?compute\/functions\/registry-templates)\/[^/]+\/?$/;

const normalizeDocNavigationPath = (path) =>
  path
    .replace(AI_GATEWAY_MODEL_DETAIL_PATH, '$1')
    .replace(FUNCTION_REGISTRY_TEMPLATE_PATH, '$1')
    .replace(LEGACY_FUNCTION_REGISTRY_TEMPLATE_PATH, '$1');

export default normalizeDocNavigationPath;
