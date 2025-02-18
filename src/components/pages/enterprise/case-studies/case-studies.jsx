import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';
import React from 'react';

import Container from 'components/shared/container/container';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import ArrowRightIcon from 'icons/arrow-right.inline.svg';

import linesMd from './images/lines-md.svg';
import lines from './images/lines.svg';

const bgTransformStyles = {
  0: { transform: 'matrix(-1,0,0,1,0,0)' },
  4: { transform: 'matrix(1,0,0,-1,0,0)' },
  5: { transform: 'matrix(1,0,0,-1,0,0)' },
};

const CaseStudies = ({ items }) => (
  <section className="impact safe-paddings relative mx-auto overflow-hidden xl:max-w-[1024px] lg:max-w-[768px] md:w-[360px]">
    <Container
      className="flex items-end justify-between gap-x-4 md:justify-center md:text-center"
      size="960"
    >
      <div>
        <h2 className="font-title text-[52px] font-medium tracking-tighter xl:text-5xl lg:text-4xl md:text-[32px]">
          Neon’s impact
        </h2>
        <p className="-mt-1 text-lg leading-snug tracking-tight text-gray-new-80 lg:text-base md:mt-0">
          Discover how our solutions have made a real-world impact.
        </p>
      </div>
      <Link
        className="mb-1 text-lg font-medium leading-none tracking-tight xl:mb-0.5 xl:text-base md:hidden"
        theme="white"
        size="xs"
        to={LINKS.caseStudies}
        withArrow
      >
        Explore all case studies
      </Link>
    </Container>
    <Container className="relative mt-11 xl:mt-12 xl:!px-0 md:mt-10 md:!px-0" size="1216">
      <ul className="grid w-full grid-cols-3 px-6 xl:px-0 md:grid-cols-2">
        {items.map(({ title, description, logo, link }, index) => (
          <li key={index}>
            <Link
              className="group relative block h-[230px] w-full rounded-xl p-10 xl:h-[196px] xl:p-8 lg:h-[169px] lg:pb-6 md:h-auto md:px-5 md:pb-[22px] md:pt-4"
              to={link}
            >
              <div className="relative z-10 flex h-full flex-col justify-between">
                <p className="relative text-[28px] font-medium leading-tight tracking-tight text-white xl:text-2xl lg:text-xl md:text-base">
                  {title}{' '}
                  <span
                    className="font-normal text-gray-new-60"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                </p>
                <div className="relative flex items-center gap-x-2.5 md:mt-4">
                  <Image
                    className="relative h-6 w-fit lg:h-5 md:h-[18px]"
                    src={logo.src}
                    alt={logo.alt}
                    width={logo.width}
                    height={logo.height}
                    priority
                  />
                  <ArrowRightIcon
                    className={clsx(
                      'pointer-events-none -mb-px shrink-0 md:w-2.5',
                      'opacity-0 transition-opacity duration-300 group-hover:opacity-100'
                    )}
                    aria-hidden
                  />
                </div>
              </div>
              <span
                className={clsx(
                  'pointer-events-none absolute inset-px',
                  'opacity-100 transition-opacity duration-300 group-hover:opacity-100',
                  {
                    'bg-[radial-gradient(71.93%_100%_at_0%_100%,rgba(1,119,119,0.3)_0%,rgba(0,0,0,0.3)_100%)]':
                      index === 0 || index === 3 || index === 5,
                    'bg-[linear-gradient(0deg,rgba(1,119,119,0.30)_0%,rgba(0,0,0,0.30)_74.1%)]':
                      index === 1,
                    'bg-[radial-gradient(86.07%_100.77%_at_0_100%,rgba(1,119,119,0.30)_0%,rgba(0,0,0,0.30)_100%)]':
                      index === 2,
                    'rotate-180': index === 3,
                    'bg-[linear-gradient(360deg,rgba(1,119,119,0.3)_0%,rgba(0,0,0,0.3)_74.1%)]':
                      index === 4,
                  }
                )}
                style={bgTransformStyles[index]}
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>
      <Link
        className="mt-10 hidden w-full text-center !text-[16px] font-medium leading-none tracking-tight md:flex md:justify-center"
        theme="white"
        size="xs"
        to={LINKS.caseStudies}
        withArrow
      >
        Explore all case studies
      </Link>
      <Image
        className="pointer-events-none absolute left-0 top-2 -z-10 w-[1216px] max-w-none xl:-left-[22px] xl:top-0 xl:w-[1070px] lg:-left-4 lg:top-[23px] lg:w-[800px] md:hidden"
        src={lines}
        width={1216}
        height={444}
        alt=""
      />
      <Image
        className="pointer-events-none absolute -top-5 left-0 -z-10 hidden w-[360px] max-w-none md:block"
        src={linesMd}
        width={360}
        height={433}
        alt=""
      />
    </Container>
  </section>
);

CaseStudies.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      logo: PropTypes.shape({
        src: PropTypes.string.isRequired,
        alt: PropTypes.string.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
      }).isRequired,
      link: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default CaseStudies;
