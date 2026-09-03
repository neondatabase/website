'use client';

import { Alignment, Fit } from '@rive-app/react-canvas';
import { useCallback, useEffect, useRef } from 'react';

import { cn } from 'utils/cn';

import useRiveAnimation from '../use-section-rive-animation';

const ARTBOARD_WIDTH = 2770;
const ARTBOARD_HEIGHT = 1530;
const POINTER_ORIGIN_X = 1112;
const POINTER_ORIGIN_Y = 656;

const HOVER_REGIONS = [
  { key: 'scales', minX: 471, maxX: 857, minY: 855, maxY: 960 },
  { key: 'scales', minX: 649, maxX: 677, minY: 961, maxY: 974 },
  { key: 'compute', minX: 1204, maxX: 1644, minY: 576, maxY: 1189 },
  { key: 'branching', minX: 1661, maxX: 1820, minY: 576, maxY: 1189 },
  { key: 'built', minX: 1844, maxX: 2282, minY: 576, maxY: 1188 },
];

const ACTIVE_PROPERTY_PATHS = {
  scales: 'propertyOfScales/activeScales',
  compute: 'propertyOfCompute/activeCompute',
  branching: 'propertyOfInstBranching/activeBranch',
  built: 'propertyOfBuilt/activeBuilt',
};

const getHoverTarget = (x, y) =>
  HOVER_REGIONS.find(
    ({ minX, maxX, minY, maxY }) => x >= minX && x <= maxX && y >= minY && y <= maxY
  )?.key ?? null;

const Animation = () => {
  const riveRef = useRef(null);
  const propertiesRef = useRef(null);
  const activeTargetRef = useRef(null);
  const pointerFrameRef = useRef(null);
  const hoverFrameRef = useRef(null);
  const pendingPointerRef = useRef(null);

  const { isReady, wrapperRef, animationRef, isIntersecting, isVisible, rive, RiveComponent } =
    useRiveAnimation({
      src: '/animations/pages/home/lakebase-postgres.riv',
      artboard: 'main',
      stateMachines: 'SM',
      fit: Fit.Contain,
      alignment: Alignment.Center,
      threshold: 0.01,
      // The file's built-in hover listener loops in Canvas, so pointer state is mirrored below.
      shouldDisableRiveListeners: true,
    });
  riveRef.current = rive;

  const getProperties = useCallback(() => {
    const currentRive = riveRef.current;
    if (!currentRive) return null;
    if (propertiesRef.current?.rive === currentRive) return propertiesRef.current;

    const instance = currentRive.viewModelInstance;
    if (!instance) return null;

    propertiesRef.current = {
      rive: currentRive,
      mouseX: instance.number('mouseX'),
      mouseY: instance.number('mouseY'),
      active: Object.fromEntries(
        Object.entries(ACTIVE_PROPERTY_PATHS).map(([key, path]) => [key, instance.boolean(path)])
      ),
    };

    return propertiesRef.current;
  }, []);

  const syncActiveTarget = useCallback(() => {
    const properties = getProperties();
    if (!properties) return;

    Object.entries(properties.active).forEach(([key, property]) => {
      const isActive = key === activeTargetRef.current;
      if (property.value !== isActive) property.value = isActive;
    });
  }, [getProperties]);

  const pinActiveTarget = useCallback(
    function pinTarget() {
      // The file also reactivates a default tooltip in its idle state. Keep the
      // neutral state pinned so no card opens before the user hovers the diagram.
      syncActiveTarget();
      hoverFrameRef.current = requestAnimationFrame(pinTarget);
    },
    [syncActiveTarget]
  );

  const setActiveTarget = useCallback(
    (target) => {
      activeTargetRef.current = target;
      syncActiveTarget();
    },
    [syncActiveTarget]
  );

  const updatePointer = useCallback(() => {
    pointerFrameRef.current = null;
    const pointer = pendingPointerRef.current;
    if (!pointer) return;

    const { clientX, clientY, rect } = pointer;
    const x = ((clientX - rect.left) / rect.width) * ARTBOARD_WIDTH;
    const y = ((clientY - rect.top) / rect.height) * ARTBOARD_HEIGHT;

    const properties = getProperties();
    if (properties) {
      properties.mouseX.value = x - POINTER_ORIGIN_X;
      properties.mouseY.value = y - POINTER_ORIGIN_Y;
    }
    setActiveTarget(getHoverTarget(x, y));
  }, [getProperties, setActiveTarget]);

  const handlePointerMove = useCallback(
    (event) => {
      if (event.pointerType === 'touch') return;

      pendingPointerRef.current = {
        clientX: event.clientX,
        clientY: event.clientY,
        rect: event.currentTarget.getBoundingClientRect(),
      };

      if (pointerFrameRef.current === null) {
        pointerFrameRef.current = requestAnimationFrame(updatePointer);
      }
    },
    [updatePointer]
  );

  const handlePointerLeave = useCallback(() => {
    pendingPointerRef.current = null;
    if (pointerFrameRef.current !== null) {
      cancelAnimationFrame(pointerFrameRef.current);
      pointerFrameRef.current = null;
    }
    setActiveTarget(null);
  }, [setActiveTarget]);

  useEffect(() => {
    if (!isReady || !isVisible) {
      setActiveTarget(null);
      return undefined;
    }

    pinActiveTarget();

    return () => {
      if (hoverFrameRef.current !== null) {
        cancelAnimationFrame(hoverFrameRef.current);
        hoverFrameRef.current = null;
      }
    };
  }, [isReady, isVisible, pinActiveTarget, setActiveTarget]);

  useEffect(
    () => () => {
      if (pointerFrameRef.current !== null) cancelAnimationFrame(pointerFrameRef.current);
      if (hoverFrameRef.current !== null) cancelAnimationFrame(hoverFrameRef.current);
    },
    []
  );

  return (
    <div
      className={cn(
        'relative aspect-[2770/1530] w-full transition-opacity',
        isReady ? 'opacity-100' : 'opacity-0'
      )}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerLeave}
      ref={wrapperRef}
    >
      <div
        className="pointer-events-none absolute inset-0 [&_canvas]:h-full! [&_canvas]:w-full!"
        ref={animationRef}
        aria-hidden
      >
        {isIntersecting ? <RiveComponent /> : null}
      </div>
    </div>
  );
};

export default Animation;
