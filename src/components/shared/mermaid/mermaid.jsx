'use client';

import PropTypes from 'prop-types';
import { useEffect, useId, useRef, useState } from 'react';

import { cn } from 'utils/cn';

// Pele renders Mermaid syntax to SVG. Colors and fonts come from the --pele-* CSS variables
// on .mermaid-container (see doc-content.css), so theme changes need no re-render.
// mount() re-lays out the diagram when the container width or web fonts change.
const Mermaid = ({ chart, className }) => {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);
  // useId() returns values like ":r1:", which break SVG url(#id) references.
  const idPrefix = `pele-${useId().replace(/:/g, '')}-`;

  useEffect(() => {
    let mounted;
    let cancelled = false;

    const renderChart = async () => {
      try {
        const { mountAsync } = await import('pele/lazy');
        if (cancelled || !containerRef.current) return;

        // zoom: false — pele's zoom buttons are wider than the container padding and cover
        // the top-right corner of wide diagrams.
        mounted = await mountAsync(containerRef.current, chart, {
          idPrefix,
          fontSize: 14,
          zoom: false,
        });
        if (cancelled) mounted.destroy();
        setError(null);
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        setError(err.message);
      }
    };

    renderChart();

    return () => {
      cancelled = true;
      mounted?.destroy();
    };
  }, [chart, idPrefix]);

  return (
    <>
      <div
        className={cn('mermaid-container not-prose', error && 'hidden', className)}
        ref={containerRef}
      />
      {error && (
        <div
          className={cn(
            'my-8 rounded-lg border p-6',
            'border-secondary-1/50 bg-secondary-4/20 dark:bg-secondary-1/10'
          )}
        >
          <p className="text-sm font-semibold text-secondary-1">Mermaid Diagram Error</p>
          <pre className="mt-2 overflow-auto text-xs text-secondary-1/80">{error}</pre>
        </div>
      )}
    </>
  );
};

Mermaid.propTypes = {
  chart: PropTypes.string.isRequired,
  className: PropTypes.string,
};

Mermaid.defaultProps = {
  className: '',
};

export default Mermaid;
