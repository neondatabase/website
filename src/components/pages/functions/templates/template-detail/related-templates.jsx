'use client';

import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';

import Button from 'components/shared/button';
import ArrowRightIcon from 'icons/arrow-right.inline.svg';
import { cn } from 'utils/cn';

import TemplateCard, { templateCardType } from '../registry/template-card';

// The track bleeds to the viewport edge but starts and ends on the page frame,
// so its side padding repeats the frame's margins at each breakpoint.
const TRACK_EDGE =
  'px-[max(3rem,calc((100%-72rem)/2))] scroll-px-[max(3rem,calc((100%-72rem)/2))] max-[1201px]:px-8 max-[1201px]:scroll-px-8 max-[601px]:px-5 max-[601px]:scroll-px-5';

const SliderArrow = ({ direction, disabled, onClick }) => (
  <button
    type="button"
    className="flex size-11 items-center justify-center border border-gray-new-40 bg-black-pure text-white transition-colors duration-200 hover:border-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-1 disabled:pointer-events-none disabled:border-gray-new-20 disabled:text-gray-new-30 motion-reduce:transition-none max-[768px]:size-10"
    aria-label={direction === 'prev' ? 'Previous templates' : 'Next templates'}
    disabled={disabled}
    onClick={onClick}
  >
    <ArrowRightIcon
      className={cn('h-3 w-4', direction === 'prev' && '-scale-x-100')}
      aria-hidden="true"
    />
  </button>
);

SliderArrow.propTypes = {
  direction: PropTypes.oneOf(['prev', 'next']).isRequired,
  disabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

const RelatedTemplates = ({ templates, allTemplatesHref, frameClassName }) => {
  const trackRef = useRef(null);
  const [edges, setEdges] = useState({ atStart: true, atEnd: false });

  const updateEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setEdges({
      atStart: track.scrollLeft <= 1,
      atEnd: track.scrollLeft + track.clientWidth >= track.scrollWidth - 1,
    });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    updateEdges();
    track.addEventListener('scroll', updateEdges, { passive: true });
    const observer = new ResizeObserver(updateEdges);
    observer.observe(track);
    return () => {
      track.removeEventListener('scroll', updateEdges);
      observer.disconnect();
    };
  }, [updateEdges]);

  // One card per click: the card width plus the gap between cards.
  const scrollByCard = (direction) => {
    const track = trackRef.current;
    const card = track?.firstElementChild;
    if (!card) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollBy({
      left: direction * (card.getBoundingClientRect().width + gap),
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  };

  const controls = (
    <div className="flex shrink-0 items-center gap-6 max-[768px]:w-full max-[768px]:justify-between">
      <Button
        to={allTemplatesHref}
        theme="white-filled-multi"
        size="xxs"
        className="h-9 shrink-0 px-[18px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-1 motion-reduce:transition-none"
      >
        View all templates
      </Button>
      <div className="flex gap-2">
        <SliderArrow direction="prev" disabled={edges.atStart} onClick={() => scrollByCard(-1)} />
        <SliderArrow direction="next" disabled={edges.atEnd} onClick={() => scrollByCard(1)} />
      </div>
    </div>
  );

  return (
    <section
      className="overflow-hidden bg-black-pure pt-[var(--section-spacing)] pb-[calc(var(--section-spacing)*1.5)]"
      aria-labelledby="related-template-heading"
    >
      <div className={cn(frameClassName, 'flex items-end justify-between gap-8')}>
        <h2
          id="related-template-heading"
          className="min-w-0 flex-1 text-[2.75rem] leading-[1.1] font-normal tracking-tighter max-[601px]:text-[2rem]"
        >
          <span className="block whitespace-nowrap max-[601px]:whitespace-normal">
            Build more with
          </span>
          <span className="block whitespace-nowrap max-[601px]:whitespace-normal">
            ready-made functions
          </span>
        </h2>
        <div className="max-[768px]:hidden">{controls}</div>
      </div>
      <ul
        ref={trackRef}
        className={cn(
          'mt-12 no-scrollbars flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain max-[768px]:mt-8 max-[768px]:gap-3',
          TRACK_EDGE
        )}
        aria-label="More function templates"
      >
        {templates.map((item) => (
          <TemplateCard
            key={item.id}
            template={item}
            variant="catalog"
            className="min-h-[312px] w-[370px] shrink-0 snap-start max-[768px]:min-h-[270px] max-[768px]:w-[320px]"
          />
        ))}
      </ul>
      <div className={cn(frameClassName, 'mt-8 hidden max-[768px]:block')}>{controls}</div>
    </section>
  );
};

RelatedTemplates.propTypes = {
  templates: PropTypes.arrayOf(templateCardType).isRequired,
  allTemplatesHref: PropTypes.string.isRequired,
  frameClassName: PropTypes.string.isRequired,
};

export default RelatedTemplates;
