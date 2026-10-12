'use client';

import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { useId, useState } from 'react';

import Link from 'components/shared/link';
import ArrowRightIcon from 'icons/lakebase-arrow-right.inline.svg';
import AutoscalingIcon from 'icons/lakebase-autoscaling.inline.svg';
import ServerlessAppsIcon from 'icons/lakebase-serverless-apps.inline.svg';
import testimonialPattern from 'images/pages/lakebase/from-first-line/testimonial-pattern.png';
import { cn } from 'utils/cn';

const ICONS = {
  autoscaling: AutoscalingIcon,
  serverless: ServerlessAppsIcon,
};

const DirectionButton = ({ controls, direction, disabled, onClick }) => {
  const isPrevious = direction === 'previous';

  return (
    <button
      className={cn(
        'flex size-11 items-center justify-center border border-black-pure bg-transparent text-black-pure',
        'transition-[background-color,border-color,color,opacity] duration-200 enabled:hover:bg-white',
        'disabled:cursor-not-allowed'
      )}
      type="button"
      aria-controls={controls}
      aria-label={`${isPrevious ? 'Previous' : 'Next'} slide`}
      disabled={disabled}
      onClick={onClick}
    >
      <ArrowRightIcon className={cn('w-6', isPrevious && 'rotate-180')} aria-hidden="true" />
    </button>
  );
};

DirectionButton.propTypes = {
  controls: PropTypes.string.isRequired,
  direction: PropTypes.oneOf(['previous', 'next']).isRequired,
  disabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

const Tag = ({ icon, label }) => {
  const Icon = ICONS[icon];

  return (
    <li className="flex items-center gap-2 bg-[rgba(205,223,215,0.75)] px-3.5 py-3 font-mono text-[15px] leading-none font-medium text-gray-new-20 uppercase sm:px-3 sm:py-2.5 sm:text-xs">
      {Icon && <Icon className="size-4 shrink-0 text-green-44" aria-hidden="true" />}
      {label}
    </li>
  );
};

Tag.propTypes = {
  icon: PropTypes.oneOf(Object.keys(ICONS)).isRequired,
  label: PropTypes.string.isRequired,
};

const Quote = ({ author, caseStudyLabel, caseStudyUrl, company, highlight, logo, quote }) => {
  const highlightIndex = quote.indexOf(highlight);
  const hasHighlight = highlightIndex !== -1;
  const beforeHighlight = hasHighlight ? quote.slice(0, highlightIndex) : quote;
  const afterHighlight = hasHighlight ? quote.slice(highlightIndex + highlight.length) : '';

  return (
    <article className="relative flex min-h-[326px] flex-col overflow-hidden bg-[#CDDFD7] p-8 sm:min-h-[310px] sm:p-6">
      <Image
        className="pointer-events-none absolute top-0.75 -right-0.5 h-[327px] w-[320px] max-w-none [mask-image:linear-gradient(224.38deg,#000_0%,transparent_41.205%)] mix-blend-overlay"
        src={testimonialPattern}
        width={320}
        height={327}
        sizes="320px"
        alt=""
      />

      <Image
        className={cn('relative z-10 max-w-[160px] object-contain object-left', logo.className)}
        src={logo.src}
        width={logo.width}
        height={logo.height}
        alt={logo.alt}
      />

      <figure className="relative z-10 mt-auto max-w-[495px]">
        <blockquote className="font-mono text-lg leading-[1.375] tracking-extra-tight text-gray-new-20 sm:text-base">
          “{beforeHighlight}
          {hasHighlight && (
            <mark className="bg-[rgba(57,165,125,0.6)] px-px text-black-pure">{highlight}</mark>
          )}
          {afterHighlight}”
        </blockquote>
        <figcaption className="mt-3.5 font-mono text-[15px] leading-[1.375] tracking-extra-tight text-gray-new-40 sm:text-sm">
          <span className="font-medium text-gray-new-20">{author}</span> – {company}
        </figcaption>
      </figure>

      {caseStudyUrl ? (
        <Link
          className="relative z-10 mt-5 w-fit border-b border-dashed border-gray-new-40 pb-0.5 text-[15px] leading-none tracking-extra-tight text-black-pure"
          to={caseStudyUrl}
        >
          {caseStudyLabel}
        </Link>
      ) : (
        <span className="relative z-10 mt-5 w-fit border-b border-dashed border-gray-new-40 pb-0.5 text-[15px] leading-none tracking-extra-tight text-black-pure">
          {caseStudyLabel}
        </span>
      )}
    </article>
  );
};

Quote.propTypes = {
  author: PropTypes.string.isRequired,
  caseStudyLabel: PropTypes.string.isRequired,
  caseStudyUrl: PropTypes.string,
  company: PropTypes.string.isRequired,
  highlight: PropTypes.string.isRequired,
  logo: PropTypes.shape({
    alt: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    src: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
  }).isRequired,
  quote: PropTypes.string.isRequired,
};

const Carousel = ({ slides }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselId = useId();
  const prefersReducedMotion = useReducedMotion();
  const activeSlide = slides[activeIndex];
  const hasMultipleSlides = slides.length > 1;

  const showPrevious = () => setActiveIndex((index) => (index - 1 + slides.length) % slides.length);
  const showNext = () => setActiveIndex((index) => (index + 1) % slides.length);

  return (
    <div
      className="mt-16 border-t border-gray-new-50 pt-[27px] md:mt-12 md:border-t-0 md:pt-0"
      role="region"
      aria-roledescription="carousel"
      aria-label="Lakebase customer journeys"
    >
      <div className="absolute top-[187px] right-8 flex items-center gap-5 xl:top-[163px] lg:relative lg:top-auto lg:right-auto lg:z-10 lg:justify-end md:mt-6 md:w-full md:before:h-px md:before:flex-1 md:before:bg-gray-new-50 md:before:content-['']">
        <DirectionButton
          controls={carouselId}
          direction="previous"
          disabled={!hasMultipleSlides}
          onClick={showPrevious}
        />
        <DirectionButton
          controls={carouselId}
          direction="next"
          disabled={!hasMultipleSlides}
          onClick={showNext}
        />
      </div>

      <div id={carouselId} aria-live="polite" aria-atomic="true">
        <LazyMotion features={domAnimation}>
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              className="grid grid-cols-[minmax(0,36rem)_minmax(0,36rem)] gap-x-[12rem] xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:gap-x-20 lg:-mt-11 lg:grid-cols-1 lg:gap-y-12 md:mt-7 md:gap-y-10"
              key={activeIndex}
              role="group"
              aria-roledescription="slide"
              aria-label={`${activeIndex + 1} of ${slides.length}`}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
            >
              <div className="flex min-h-[326px] flex-col justify-between lg:min-h-0 lg:gap-y-20 md:gap-y-10">
                <ul className="flex flex-wrap items-start gap-3.5">
                  {activeSlide.tags.map((tag) => (
                    <Tag key={tag.label} {...tag} />
                  ))}
                </ul>

                <div className="max-w-[463px]">
                  <h3 className="text-[28px] leading-tight tracking-extra-tight text-black-pure md:text-2xl sm:text-[22px]">
                    {activeSlide.title}
                  </h3>
                  <p className="mt-3 text-lg leading-normal tracking-extra-tight text-gray-new-40 md:text-base">
                    {activeSlide.description}
                  </p>
                </div>
              </div>

              <Quote {...activeSlide.testimonial} />
            </m.div>
          </AnimatePresence>
        </LazyMotion>
      </div>
    </div>
  );
};

Carousel.propTypes = {
  slides: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      tags: PropTypes.arrayOf(
        PropTypes.shape({
          icon: PropTypes.oneOf(Object.keys(ICONS)).isRequired,
          label: PropTypes.string.isRequired,
        })
      ).isRequired,
      testimonial: PropTypes.shape({
        author: PropTypes.string.isRequired,
        caseStudyLabel: PropTypes.string.isRequired,
        caseStudyUrl: PropTypes.string,
        company: PropTypes.string.isRequired,
        highlight: PropTypes.string.isRequired,
        logo: PropTypes.shape({
          alt: PropTypes.string.isRequired,
          className: PropTypes.string.isRequired,
          height: PropTypes.number.isRequired,
          src: PropTypes.string.isRequired,
          width: PropTypes.number.isRequired,
        }).isRequired,
        quote: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
};

export default Carousel;
