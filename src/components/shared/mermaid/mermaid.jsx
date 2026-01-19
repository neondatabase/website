'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

let mermaidAPI;

const getNeonTheme = (isDark) => ({
  theme: 'base',
  themeVariables: {
    primaryColor: '#00E599',
    primaryBorderColor: '#00cc88',
    primaryTextColor: isDark ? '#ffffff' : '#0c0d0d',
    secondaryColor: isDark ? '#303236' : '#EFEFF0',
    secondaryBorderColor: isDark ? '#494B50' : '#C9CBCF',
    secondaryTextColor: isDark ? '#E4E5E7' : '#131415',
    // Tertiary colors
    tertiaryColor: isDark ? '#18191B' : '#FAFAFA',
    tertiaryBorderColor: isDark ? '#494B50' : '#C9CBCF',
    tertiaryTextColor: isDark ? '#E4E5E7' : '#131415',
    // Note colors
    noteBkgColor: isDark ? '#303236' : '#EFEFF0',
    noteBorderColor: isDark ? '#494B50' : '#C9CBCF',
    noteTextColor: isDark ? '#E4E5E7' : '#131415',
    // Text and lines
    textColor: isDark ? '#E4E5E7' : '#131415',
    lineColor: isDark ? '#494B50' : '#C9CBCF',
    // Background
    background: isDark ? '#18191B' : '#ffffff',
    mainBkg: isDark ? '#18191B' : '#ffffff',
    // Fonts
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: '14px',
    // Git graph
    git0: '#00E599',
    git1: '#ff4c79',
    git2: '#f0f075',
    git3: '#ffa64c',
    git4: '#aa99ff',
    git5: '#259df4',
    git6: '#ADE0EB',
    git7: '#fbd0d7',
    gitBranchLabel0: isDark ? '#131415' : '#ffffff',
    gitBranchLabel1: '#ffffff',
    gitBranchLabel2: '#131415',
    gitBranchLabel3: '#131415',
    gitBranchLabel4: '#ffffff',
    gitBranchLabel5: '#ffffff',
    gitBranchLabel6: '#131415',
    gitBranchLabel7: '#131415',
    // Flowchart
    nodeBorder: '#00cc88',
    clusterBkg: isDark ? '#242628' : '#F2F2F3',
    clusterBorder: isDark ? '#494B50' : '#C9CBCF',
    // Sequence diagram
    actorBkg: isDark ? '#303236' : '#EFEFF0',
    actorBorder: '#00cc88',
    actorTextColor: isDark ? '#E4E5E7' : '#131415',
    actorLineColor: isDark ? '#494B50' : '#C9CBCF',
    signalColor: isDark ? '#E4E5E7' : '#131415',
    signalTextColor: isDark ? '#E4E5E7' : '#131415',
    labelBoxBkgColor: isDark ? '#303236' : '#EFEFF0',
    labelBoxBorderColor: isDark ? '#494B50' : '#C9CBCF',
    labelTextColor: isDark ? '#E4E5E7' : '#131415',
    loopTextColor: isDark ? '#E4E5E7' : '#131415',
    activationBorderColor: '#00cc88',
    activationBkgColor: isDark ? '#242628' : '#F2F2F3',
    sequenceNumberColor: '#ffffff',
    // State diagram
    labelColor: isDark ? '#E4E5E7' : '#131415',
    // ER diagram
    attributeBackgroundColorOdd: isDark ? '#242628' : '#F2F2F3',
    attributeBackgroundColorEven: isDark ? '#303236' : '#EFEFF0',
  },
});

const Mermaid = ({ chart, className }) => {
  const containerRef = useRef(null);
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(null);
  const [themeKey, setThemeKey] = useState(0);

  useEffect(() => {
    const renderChart = async () => {
      try {
        const isDark = document.documentElement.classList.contains('dark');

        if (!mermaidAPI) {
          const mermaid = (await import('mermaid')).default;
          mermaid.initialize({
            startOnLoad: false,
            ...getNeonTheme(isDark),
          });
          mermaidAPI = mermaid;
        }

        const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;
        const { svg: renderedSvg } = await mermaidAPI.render(id, chart);
        setSvg(renderedSvg);
        setError(null);
      } catch (err) {
        // eslint-disable-next-line
        console.error('Mermaid rendering error:', err);
        setError(err.message);
      }
    };

    renderChart();
  }, [chart, themeKey]);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          mermaidAPI = null;
          setThemeKey((prev) => prev + 1);
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
      <div
        className={clsx(
          'my-8 rounded-lg border p-6',
          'border-secondary-1/50 bg-secondary-4/20 dark:bg-secondary-1/10'
        )}
      >
        <p className="text-sm font-semibold text-secondary-1">Mermaid Diagram Error</p>
        <pre className="mt-2 overflow-auto text-xs text-secondary-1/80">{error}</pre>
      </div>
    );
  }

  if (!svg) {
    return null;
  }

  return (
    <div
      className={clsx('mermaid-container', className)}
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
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
