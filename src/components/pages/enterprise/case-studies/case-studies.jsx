import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';
import React from 'react';

import Container from 'components/shared/container/container';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import ArrowRightIcon from 'icons/arrow-right.inline.svg';

import lines from './images/lines.svg';

const CaseStudies = ({ items }) => (
  <section className="impact safe-paddings relative overflow-hidden">
    <Container className="flex items-end justify-between gap-x-4" size="960">
      <div>
        <h2 className="font-title text-[52px] font-medium tracking-tighter">Neon’s impact</h2>
        <p className="-mt-1 text-lg leading-snug tracking-tight text-gray-new-80">
          Discover how our solutions have made a real-world impact.
        </p>
      </div>
      <Link
        className="mb-2 text-lg font-medium leading-none tracking-tight"
        theme="white"
        size="xs"
        to={LINKS.caseStudies}
        withArrow
      >
        Explore all case studies
      </Link>
    </Container>
    <Container className="relative mt-11" size="1216">
      <ul className="grid w-[1216px] grid-cols-3 px-6">
        {items.map(({ title, description, logo, link }, index) => (
          <li key={index}>
            <Link className="group relative block h-[230px] w-full rounded-xl p-10" to={link}>
              <div className="relative z-10 flex h-full flex-col justify-between">
                <p className="relative text-[28px] font-medium leading-tight tracking-tight text-white">
                  {title}{' '}
                  <span
                    className="font-normal text-gray-new-60"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                </p>
                <div className="relative flex items-center gap-x-2.5">
                  <Image
                    className="relative h-6 w-fit"
                    src={logo.src}
                    alt={logo.alt}
                    width={logo.width}
                    height={logo.height}
                    priority
                  />
                  <ArrowRightIcon
                    className={clsx(
                      'pointer-events-none -mb-px shrink-0',
                      'opacity-0 transition-opacity duration-300 group-hover:opacity-100'
                    )}
                    aria-hidden
                  />
                </div>
              </div>
              <div
                className={clsx(
                  'pointer-events-none absolute inset-px bg-[radial-gradient(86.07%_100.77%_at_0_100%,rgba(1,119,119,0.30)_0%,rgba(0,0,0,0.30)_100%)]',
                  'opacity-0 transition-opacity duration-300 group-hover:opacity-100'
                )}
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>
      <Image
        className="pointer-events-none absolute left-0 top-2 -z-10 w-[1216px] max-w-none"
        src={lines}
        width={1216}
        height={444}
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
