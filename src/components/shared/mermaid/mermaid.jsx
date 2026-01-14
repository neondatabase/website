'use client';

import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

let mermaidAPI;

const Mermaid = ({ chart, className = '' }) => {
  const containerRef = useRef(null);
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const renderChart = async () => {
      try {
        if (!mermaidAPI) {
          const mermaid = (await import('mermaid')).default;

          // Initialize mermaid with absolute defaults
          mermaid.initialize({
            startOnLoad: false,
          });

          mermaidAPI = mermaid;
        }

        // Generate unique ID for this chart
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

        // Render the chart
        const { svg: renderedSvg } = await mermaidAPI.render(id, chart);
        setSvg(renderedSvg);
        setError(null);
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        setError(err.message);
      }
    };

    renderChart();
  }, [chart]);

  // Re-render when theme changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          // Reset mermaidAPI to force re-initialization with new theme
          mermaidAPI = null;
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  if (error) {
    return (
      <div className="border-red-500 bg-red-50 dark:bg-red-900/20 my-8 rounded-lg border p-6">
        <p className="text-red-600 dark:text-red-400 text-sm font-semibold">
          Mermaid Diagram Error
        </p>
        <pre className="text-red-500 dark:text-red-300 mt-2 text-xs">{error}</pre>
      </div>
    );
  }

  if (!svg) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`mermaid-container my-8 overflow-x-auto rounded-lg border border-gray-new-94 bg-white p-6 dark:border-gray-new-20 dark:bg-gray-new-10 ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

Mermaid.propTypes = {
  chart: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default Mermaid;
