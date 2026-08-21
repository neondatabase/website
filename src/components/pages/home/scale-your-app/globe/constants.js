// Adapted from the Pixel Point globe renderer, Copyright (c) 2026 Pixel Point, MIT License.

export const SCENE_WIDTH = 1920;
export const SCENE_HEIGHT = 1080;
export const SCREEN_RADIUS_RATIO = 0.3535;

export const SETTINGS = {
  background: '#000000',
  bandColumnSpacing: 4.5,
  bandDistance: 3,
  bandDotSize: 2,
  bands: [
    { id: 1, position: 47.5, width: 18 },
    { id: 2, position: 25.5, width: 22 },
    { id: 3, position: 4.5, width: 15 },
    { id: 4, position: -16.5, width: 22 },
  ],
  crtIntensity: 75,
  latitudeCount: 9,
  lineColor: '#FFFFFF',
  lineWidth: 2.1,
  logoHoldSeconds: 4,
  logos: [
    { bandId: 1, logoId: 'dxc', position: 60 },
    { bandId: 2, logoId: 'meta', position: 66 },
    { bandId: 3, logoId: 'prada', position: 72 },
    { bandId: 4, logoId: 'zillow', position: 72 },
  ],
  logoSpeed: 1.25,
  meridianCount: 18,
  orientation: {
    position: [0.2, 1.5, 5],
  },
  outline: true,
  sphereColor: '#000000',
};

export const CRT_STATIC_PHASE_MS = 1280;
