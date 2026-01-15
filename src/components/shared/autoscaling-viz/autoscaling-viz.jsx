'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const AutoscalingViz = () => {
  const [isCompact, setIsCompact] = useState(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const containerRef = useRef(null);

  // Autoscaling pattern: 12 columns with varying heights (total: 32 squares)
  // One column peaks at 8 squares
  const autoscalingPattern = [1, 2, 4, 1, 2, 1, 8, 2, 3, 1, 2, 1, 1, 2, 1];

  // Provisioned: 15 columns, each with 10 squares (total: 150 squares)
  const provisionedHeight = 10;
  const provisionedColumns = 15;

  // Square size and gap
  const squareSize = 16;
  const gap = 2;

  // Play animation once when scrolled into view
  useEffect(() => {
    if (!containerRef.current || hasPlayedOnce) return undefined;

    const currentElement = containerRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasPlayedOnce) {
            setTimeout(() => {
              setIsCompact(true);
              setHasPlayedOnce(true);
            }, 300);
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the component is visible
      }
    );

    observer.observe(currentElement);

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [hasPlayedOnce]);

  // Generate positions for autoscaling squares
  const generateAutoscalingSquares = () => {
    const squares = [];
    let squareId = 0;

    autoscalingPattern.forEach((height, colIndex) => {
      for (let row = 0; row < height; row++) {
        squares.push({
          id: squareId++,
          initialX: colIndex * (squareSize + gap),
          initialY: (provisionedHeight - 1 - row) * (squareSize + gap),
        });
      }
    });

    return squares;
  };

  // Calculate compact layout positions (8 columns × 4 rows = 32 squares)
  const getCompactPosition = (squareId) => {
    const compactColumns = 8;
    const col = squareId % compactColumns;
    const row = Math.floor(squareId / compactColumns);

    return {
      x: col * (squareSize + gap),
      y: (provisionedHeight - 1 - row) * (squareSize + gap),
    };
  };

  const autoscalingSquares = generateAutoscalingSquares();

  const handleToggle = () => {
    if (hasPlayedOnce) {
      setIsCompact(!isCompact);
    }
  };

  return (
    <div
      ref={containerRef}
      className="not-prose w-full rounded-lg border border-gray-new-10 bg-black-new p-8"
    >
      <div className="mb-6">
        <span className="text-xl font-medium text-white">
          The average production database on Neon used 4.7x less compute than provisioned capacity
          in 2025
        </span>
      </div>

      <div
        className="flex cursor-pointer items-center justify-center gap-8"
        role="button"
        tabIndex={0}
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
      >
        {/* Autoscaling Label (Left) */}
        <div className="flex flex-col items-end text-right">
          <div className="text-sm font-medium uppercase tracking-wide text-[#73bf69]">
            Autoscaling
          </div>
          <div className="text-gray-400 text-xs">{autoscalingSquares.length} CU-hours</div>
        </div>

        {/* Overlapping Grids */}
        <div
          className="relative"
          style={{
            width: provisionedColumns * (squareSize + gap) - gap,
            height: provisionedHeight * (squareSize + gap) - gap,
          }}
        >
          {/* Provisioned (Orange) - Background */}
          {Array.from({ length: provisionedColumns }).map((_, colIndex) =>
            Array.from({ length: provisionedHeight }).map((_, rowIndex) => (
              <div
                key={`${colIndex}-${rowIndex}`}
                className="absolute rounded-sm bg-[#e8912d] opacity-40"
                style={{
                  width: squareSize,
                  height: squareSize,
                  left: colIndex * (squareSize + gap),
                  top: rowIndex * (squareSize + gap),
                }}
              />
            ))
          )}

          {/* Autoscaling (Green) - Foreground */}
          {autoscalingSquares.map((square) => {
            const compactPos = getCompactPosition(square.id);
            return (
              <motion.div
                key={square.id}
                className="absolute rounded-sm bg-[#73bf69]"
                initial={{
                  x: square.initialX,
                  y: square.initialY,
                }}
                animate={{
                  x: isCompact ? compactPos.x : square.initialX,
                  y: isCompact ? compactPos.y : square.initialY,
                }}
                transition={{
                  duration: 0.8,
                  ease: 'easeInOut',
                  delay: isCompact ? square.id * 0.02 : 0,
                }}
                style={{
                  width: squareSize,
                  height: squareSize,
                }}
              />
            );
          })}
        </div>

        {/* Provisioned Label (Right) */}
        <div className="flex flex-col items-start text-left">
          <div className="text-sm font-medium uppercase tracking-wide text-[#e8912d]">
            Provisioned
          </div>
          <div className="text-gray-400 text-xs">
            {provisionedColumns * provisionedHeight} CU-hours
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoscalingViz;
