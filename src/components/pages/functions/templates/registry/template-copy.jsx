'use client';

import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

import { cn } from 'utils/cn';

const TemplateCopy = ({ value, children = 'Copy', className, label, templateId }) => {
  const [state, setState] = useState('idle');
  const timer = useRef();
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      clearTimeout(timer.current);
    };
  }, []);
  const copy = async () => {
    let nextState = 'copied';
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      nextState = 'error';
    }
    if (!mounted.current) return;
    clearTimeout(timer.current);
    setState(nextState);
    timer.current = setTimeout(() => setState('idle'), 2400);
  };
  return (
    <button
      type="button"
      className={cn(
        'inline-flex min-h-11 cursor-pointer items-center justify-center gap-[.55rem] rounded-none px-3 text-[.8125rem] leading-[1.2] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-1 motion-reduce:transition-none [&_svg]:shrink-0',
        className
      )}
      onClick={copy}
      aria-label={label}
      title={state === 'error' ? 'Copy failed. Try again.' : state === 'copied' ? 'Copied' : label}
      data-copy-state={state}
      data-copy-template={templateId}
    >
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        {state === 'copied' ? (
          <path d="m4 10 4 4 8-8" stroke="currentColor" />
        ) : state === 'error' ? (
          <>
            <circle cx="10" cy="10" r="7" stroke="currentColor" />
            <path d="M10 5v6m0 2v2" stroke="currentColor" />
          </>
        ) : (
          <>
            <rect x="7" y="7" width="10" height="10" stroke="currentColor" />
            <path d="M12 7V3H3v9h4" stroke="currentColor" />
          </>
        )}
      </svg>
      <span aria-live="polite">
        {state === 'copied' ? 'Copied' : state === 'error' ? 'Please retry' : children}
      </span>
    </button>
  );
};
TemplateCopy.propTypes = {
  value: PropTypes.string.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  label: PropTypes.string,
  templateId: PropTypes.string,
};

export default TemplateCopy;
