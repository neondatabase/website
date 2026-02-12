'use client';

import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

const AutoscalingViz = ({
  multiplier = 2.4,
  provisionedTotal = 96,
  autoscalingTotal = 40,
  label = 'production database',
}) => {
  const [isCompact, setIsCompact] = useState(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const containerRef = useRef(null);

  // Calculate provisioned grid dimensions based on total
  const provisionedHeight = 8;
  const provisionedColumns = Math.ceil(provisionedTotal / provisionedHeight);

  // Generate autoscaling pattern to match autoscalingTotal
  // Peak should be ~80% of provisionedHeight (representing P99.5, with provisioned at P99.5 + 20%)
  const generateAutoscalingPattern = () => {
    const numColumns = provisionedColumns;
    const peakHeight = Math.round(provisionedHeight * 0.8); // 80% of max height
    const pattern = new Array(numColumns).fill(0);
    let remaining = autoscalingTotal;

    // Set peak in the middle
    const peakIndex = Math.floor(numColumns / 2);
    pattern[peakIndex] = Math.min(peakHeight, remaining);
    remaining -= pattern[peakIndex];

    // Create bell curve from peak
    for (let distance = 1; distance < numColumns / 2 && remaining > 0; distance += 1) {
      // Height decreases exponentially from peak
      const factor = Math.exp(-distance / (numColumns / 6)); // Gradual falloff
      const height = Math.min(
        Math.max(1, Math.round(peakHeight * factor)),
        Math.floor(remaining / 2)
      );

      // Add to both sides of peak
      if (peakIndex - distance >= 0 && remaining >= height) {
        pattern[peakIndex - distance] = height;
        remaining -= height;
      }
      if (peakIndex + distance < numColumns && remaining >= height) {
        pattern[peakIndex + distance] = height;
        remaining -= height;
      }
    }

    // Distribute any remaining squares near the peak
    let i = peakIndex;
    let direction = 1;
    while (remaining > 0) {
      i += direction;
      if (i >= numColumns || i < 0) {
        direction *= -1;
        i = peakIndex + direction;
      }
      if (pattern[i] < provisionedHeight) {
        pattern[i] += 1;
        remaining -= 1;
      }
    }

    return pattern;
  };

  const autoscalingPattern = generateAutoscalingPattern();

  // Square size and gap - scale down for larger grids
  const baseSquareSize = 16;
  const scaleFactor = provisionedColumns > 12 ? 12 / provisionedColumns : 1;
  const squareSize = Math.max(8, Math.floor(baseSquareSize * scaleFactor));
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
      for (let row = 0; row < height; row += 1) {
        squares.push({
          id: squareId,
          initialX: colIndex * (squareSize + gap),
          initialY: (provisionedHeight - 1 - row) * (squareSize + gap),
        });
        squareId += 1;
      }
    });

    return squares;
  };

  // Calculate compact layout positions based on autoscalingTotal
  const getCompactPosition = (squareId) => {
    const compactColumns = Math.ceil(autoscalingTotal / provisionedHeight);
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
      className="not-prose w-full border border-gray-new-30 bg-gray-new-8 p-8"
    >
      <div className="mb-6">
        <span className="text-pretty indent-24 text-3xl font-normal leading-dense tracking-tighter text-gray-new-50 [&>strong]:font-normal [&>strong]:text-white">
          The average {label} on Neon uses <strong>{multiplier}x less compute</strong> than
          provisioned equivalent.
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
        {/* Provisioned Column (Left) */}
        <div className="flex flex-col items-center gap-3">
          <div className="font-mono text-sm font-medium uppercase tracking-wide text-[#e8912d]">
            Provisioned
          </div>
          <div
            className="relative border border-gray-new-30 bg-gray-new-8"
            style={{
              width: provisionedColumns * (squareSize + gap) - gap,
              height: provisionedHeight * (squareSize + gap) - gap,
            }}
          >
            {/* Provisioned Grid (Orange) */}
            {Array.from({ length: provisionedColumns }).map((_, colIndex) =>
              Array.from({ length: provisionedHeight }).map((_, rowIndex) => (
                <div
                  key={`provisioned-${colIndex}-${rowIndex}`}
                  className="absolute bg-[#e8912d]"
                  style={{
                    width: squareSize,
                    height: squareSize,
                    left: colIndex * (squareSize + gap),
                    top: rowIndex * (squareSize + gap),
                  }}
                />
              ))
            )}
          </div>
          <div className="text-gray-400 font-mono text-xs">{provisionedTotal} CU-hours</div>
        </div>

        {/* Arrow */}
        <div className="flex items-center">
          <svg
            width="40"
            height="24"
            viewBox="0 0 40 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="opacity-30"
          >
            <path
              d="M0 12H38M38 12L28 2M38 12L28 22"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400"
            />
          </svg>
        </div>

        {/* Autoscaling Column (Right) */}
        <div className="flex flex-col items-center gap-3">
          <div className="font-mono text-sm font-medium uppercase tracking-wide text-[#73bf69]">
            Autoscaling
          </div>
          <div
            className="relative"
            style={{
              width: provisionedColumns * (squareSize + gap) - gap,
              height: provisionedHeight * (squareSize + gap) - gap,
            }}
          >
            {/* Ghost Grid Background (Gray) - Shows full provisioned size */}
            {Array.from({ length: provisionedColumns }).map((_, colIndex) =>
              Array.from({ length: provisionedHeight }).map((_, rowIndex) => (
                <div
                  key={`ghost-${colIndex}-${rowIndex}`}
                  className="absolute"
                  style={{
                    width: squareSize,
                    height: squareSize,
                    left: colIndex * (squareSize + gap),
                    top: rowIndex * (squareSize + gap),
                    backgroundColor: 'rgba(128, 128, 128, 0.3)',
                  }}
                />
              ))
            )}

            {/* Autoscaling Grid (Green) - Animated */}
            {autoscalingSquares.map((square) => {
              const compactPos = getCompactPosition(square.id);
              return (
                <motion.div
                  key={square.id}
                  className="absolute bg-[#73bf69]"
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

            {/* Multiplier Text Overlay */}
            <motion.div
              className="absolute flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: isCompact ? 1 : 0 }}
              transition={{
                duration: 0.6,
                delay: isCompact ? 1 : 0,
                ease: 'easeInOut',
              }}
              style={{
                left: 5 * (squareSize + gap),
                top: 0,
                width: 7 * (squareSize + gap) - gap,
                height: provisionedHeight * (squareSize + gap) - gap,
              }}
            >
              <div className="text-center font-mono">
                <div className="text-3xl font-bold text-white">{multiplier}x</div>
                <div className="text-gray-300 text-xl font-medium">Less</div>
              </div>
            </motion.div>
          </div>
          <div className="text-gray-400 font-mono text-xs">{autoscalingTotal} CU-hours</div>
        </div>
      </div>
    </div>
  );
};

AutoscalingViz.propTypes = {
  multiplier: PropTypes.number,
  provisionedTotal: PropTypes.number,
  autoscalingTotal: PropTypes.number,
  label: PropTypes.string,
};

export default AutoscalingViz;
