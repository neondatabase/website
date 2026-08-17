const AI_GATEWAY_MODEL_DETAIL_PATH = /^((?:\/docs\/)?ai-gateway\/models)\/[^/]+\/?$/;

const normalizeDocNavigationPath = (path) => path.replace(AI_GATEWAY_MODEL_DETAIL_PATH, '$1');

export default normalizeDocNavigationPath;
