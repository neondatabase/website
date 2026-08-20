'use client';

import { Alignment, Fit } from '@rive-app/react-canvas';
import { useCallback, useEffect, useRef } from 'react';

import useRiveAnimation from 'hooks/use-rive-animation';
import { cn } from 'utils/cn';

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

  const pinActiveTarget = useCallback(
    function pinTarget() {
      const target = activeTargetRef.current;
      const properties = getProperties();
      if (target === null) return;

      if (properties) {
        Object.entries(properties.active).forEach(([key, property]) => {
          const isActive = key === target;
          if (property.value !== isActive) property.value = isActive;
        });
      }
      hoverFrameRef.current = requestAnimationFrame(pinTarget);
    },
    [getProperties]
  );

  const setActiveTarget = useCallback(
    (target) => {
      if (activeTargetRef.current === target) return;

      if (hoverFrameRef.current !== null) {
        cancelAnimationFrame(hoverFrameRef.current);
        hoverFrameRef.current = null;
      }

      activeTargetRef.current = target;
      if (target === null) {
        const properties = getProperties();
        if (!properties) return;
        Object.values(properties.active).forEach((property) => {
          if (property.value) property.value = false;
        });
        return;
      }

      pinActiveTarget();
    },
    [getProperties, pinActiveTarget]
  );

  const updatePointer = useCallback(() => {
    pointerFrameRef.current = null;
    const pointer = pendingPointerRef.current;
    if (!pointer) return;

    const { clientX, clientY, rect } = pointer;
    const scale = Math.min(rect.width / ARTBOARD_WIDTH, rect.height / ARTBOARD_HEIGHT);
    const offsetX = (rect.width - ARTBOARD_WIDTH * scale) / 2;
    const offsetY = (rect.height - ARTBOARD_HEIGHT * scale) / 2;
    const x = (clientX - rect.left - offsetX) / scale;
    const y = (clientY - rect.top - offsetY) / scale;

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
    if (!isVisible) setActiveTarget(null);
  }, [isVisible, setActiveTarget]);

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
        'relative aspect-[2770/1530] w-full overflow-hidden bg-[#D8E9E1] transition-opacity',
        'after:pointer-events-none after:absolute after:right-0 after:bottom-0 after:left-0 after:z-10 after:h-px after:bg-gray-new-10',
        isReady ? 'opacity-100' : 'opacity-0'
      )}
    >
      <span className="absolute top-0 left-1/2 -z-10 h-full w-px" ref={wrapperRef} aria-hidden />
      <div
        className="size-full [&_canvas]:h-full! [&_canvas]:w-full!"
        ref={animationRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerCancel={handlePointerLeave}
        aria-hidden
      >
        {isIntersecting ? <RiveComponent /> : null}
      </div>
    </div>
  );
};

export default Animation;
