/* eslint-disable no-console */
import { decodeFont } from '@rive-app/react-canvas';

const fontCache = new Map();
const pendingFonts = new Map();

const getFontUrl = (fontName) => {
  if (fontName === 'Geist Mono') {
    return '/fonts/geist-mono/GeistMono-Regular.ttf';
  }
  return 'https://cdn.rive.app/runtime/flutter/inter.ttf';
};

const loadAndDecodeFont = async (fontUrl) => {
  if (fontCache.has(fontUrl)) {
    return fontCache.get(fontUrl);
  }

  if (pendingFonts.has(fontUrl)) {
    return pendingFonts.get(fontUrl);
  }

  const fontPromise = (async () => {
    try {
      const response = await fetch(fontUrl);
      const arrayBuffer = await response.arrayBuffer();
      const font = await decodeFont(new Uint8Array(arrayBuffer));

      fontCache.set(fontUrl, font);

      return font;
    } catch (error) {
      console.error(`Failed to load font from ${fontUrl}:`, error);
      throw error;
    } finally {
      pendingFonts.delete(fontUrl);
    }
  })();

  pendingFonts.set(fontUrl, fontPromise);
  return fontPromise;
};

const cachedFontLoader = (asset, bytes) => {
  if (asset?.cdnUuid?.length > 0 || bytes?.length > 0) {
    return false;
  }

  if (asset?.isFont) {
    const assetName = asset.name || '';
    const fontUrl = getFontUrl(assetName);

    loadAndDecodeFont(fontUrl)
      .then((font) => {
        asset.setFont(font);
      })
      .catch((error) => {
        console.error(`Error setting font for asset "${assetName}":`, error);
      });

    return true;
  }

  return false;
};

export const getCachedFontLoader = () => cachedFontLoader;

export const preloadRiveFonts = async () => {
  const fontUrls = [
    '/fonts/geist-mono/GeistMono-Regular.ttf',
    'https://cdn.rive.app/runtime/flutter/inter.ttf',
  ];

  await Promise.all(fontUrls.map((url) => loadAndDecodeFont(url)));
};

export const clearFontCache = () => {
  fontCache.forEach((font) => {
    try {
      font.unref();
    } catch (error) {
      // Ignore errors
    }
  });

  fontCache.clear();
  pendingFonts.clear();
};
