import { RuntimeLoader } from '@rive-app/react-canvas';

const RIVE_RUNTIME_VERSION = '2.40.0';

export const RIVE_WASM_URL = `/animations/rive/rive.wasm?v=${RIVE_RUNTIME_VERSION}`;
export const RIVE_FALLBACK_WASM_URL = `/animations/rive/rive_fallback.wasm?v=${RIVE_RUNTIME_VERSION}`;

export const configureRiveRuntime = () => {
  RuntimeLoader.setWasmUrl(RIVE_WASM_URL);
  RuntimeLoader.setWasmFallbackUrl(RIVE_FALLBACK_WASM_URL);
};
