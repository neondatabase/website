'use client';

import {
  Alignment,
  Fit,
  Layout,
  RuntimeLoader as RendererRuntimeLoader,
  useRive,
} from '@rive-app/react-webgl2';
import { useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const RIVE_SRC = '/animations/pages/lakebase/hero.riv?20260902';
const RIVE_LAYOUT = new Layout({ fit: Fit.Contain, alignment: Alignment.Center });
const RIVE_RENDERER_WASM_URL = RendererRuntimeLoader.getWasmUrl().replace(
  'https://unpkg.com/',
  'https://cdn.jsdelivr.net/npm/'
);

RendererRuntimeLoader.setWasmUrl(RIVE_RENDERER_WASM_URL);

const RiveCanvas = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [containerRef, isVisible] = useInView({ threshold: 0.2 });
  const { rive, RiveComponent } = useRive(
    {
      src: RIVE_SRC,
      artboard: 'neon-lakebase',
      stateMachines: 'State Machine 1',
      layout: RIVE_LAYOUT,
      autoplay: true,
      onLoad: () => setIsLoaded(true),
      onLoadError: () => setIsLoaded(false),
    },
    { useOffscreenRenderer: true }
  );

  useEffect(() => {
    if (!rive || !isLoaded) return;

    if (isVisible) {
      rive.play();
    } else {
      rive.pause();
    }
  }, [isLoaded, isVisible, rive]);

  return (
    <div
      className="absolute top-[-95.6175%] left-[-21.4286%] aspect-[1920/1146] w-[142.8572%]"
      ref={containerRef}
      aria-hidden
    >
      <RiveComponent
        className={`size-full transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
};

const AnimatedDiagram = () => {
  const prefersReducedMotion = useReducedMotion();
  const [supportsRenderer, setSupportsRenderer] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setSupportsRenderer(false);
      return;
    }

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2');

    setSupportsRenderer(Boolean(context));
    context?.getExtension('WEBGL_lose_context')?.loseContext();
  }, [prefersReducedMotion]);

  return !prefersReducedMotion && supportsRenderer ? <RiveCanvas /> : null;
};

export default AnimatedDiagram;
