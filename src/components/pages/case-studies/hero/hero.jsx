'use client';

import Image from 'next/image';
import PropTypes from 'prop-types';
import { useState } from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Link from 'components/shared/link/link';
import LINKS from 'constants/links';
import ArrowIcon from 'icons/arrow-sm.inline.svg';
import ChevronIcon from 'icons/chevron-down.inline.svg';

const POSTS_PER_VIEW = 6;

const Hero = ({ items }) => {
  const [posts, setPosts] = useState(items.slice(0, POSTS_PER_VIEW));
  return (
    <section className="hero safe-paddings pt-36 xl:pt-[120px] lg:pt-11 md:pt-8">
      <Container className="flex flex-col items-center" size="medium">
        <h1 className="text-center text-[72px] font-medium leading-none tracking-extra-tight 2xl:text-6xl xl:text-[56px] lg:text-[44px]">
          Explore <span className="text-green-45">success stories</span>
        </h1>
        <p className="mx-auto mt-5 max-w-[664px] text-center text-xl font-light leading-snug lg:text-lg md:text-base">
          Discover the diverse and captivating stories of our valued partners, each a testament to
          unique experiences and successes.
        </p>
        <div className="grid-gap-x grid grid-cols-12">
          <ul className="col-span-10 col-start-2 mt-20 grid grid-cols-3 gap-x-8 gap-y-7 xl:col-span-full xl:col-start-1 xl:mt-16 lg:mt-12 lg:grid-cols-2 md:mt-10 md:gap-6 sm:grid-cols-1">
            {posts.map(({ title, caseStudyPost: { description, logo, post } }, index) => (
              <li className="overflow-hidden rounded-xl" key={index}>
                <Link
                  className="group relative flex h-full flex-col rounded-xl border-2 border-white border-opacity-[0.02]"
                  to={`${LINKS.blog}/${post.slug}`}
                >
                  <span className="absolute left-[-103px] top-[-103px] h-[206px] w-[206px] rounded-full bg-white blur-[130px]" />
                  <span className="absolute bottom-[-75px] right-[-79px] h-[158px] w-[158px] rounded-full bg-white blur-[200px]" />
                  <div className="relative z-10 flex h-full flex-col justify-start rounded-xl bg-[radial-gradient(162.08%_141.42%_at_0%_0%,rgba(48,50,54,0.50)0%,rgba(48,50,54,0.00)48.97%),linear-gradient(165deg,#1A1C1E_6.13%,#111213_75.96%)] px-8 pb-10 pt-9 md:p-7 md:pb-8">
                    <Image
                      className="xl:h-12 xl:w-fit"
                      src={logo.mediaItemUrl}
                      alt={title}
                      width={logo.mediaDetails.width}
                      height={logo.mediaDetails.height}
                    />
                    <p className="mb-4 mt-12 font-light leading-snug text-gray-new-60 xl:mt-10 lg:mt-8 md:mt-6">
                      <span className="font-normal text-white">{title}</span>. {description}
                    </p>
                    <div className="mt-auto inline-flex items-baseline text-[15px] leading-none tracking-extra-tight text-green-45 transition-colors duration-200 group-hover:text-[#00FFAA]">
                      Read case study
                      <ArrowIcon className="ml-1" />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {posts?.length < items.length && (
          <Button
            className="mt-10 h-[38px] rounded-full px-5 text-[15px] font-medium transition-colors duration-200"
            theme="gray-10"
            onClick={() => setPosts(items.slice(0, posts.length + POSTS_PER_VIEW))}
          >
            Show more
            <ChevronIcon className="ml-2.5 inline-block h-auto w-3" />
          </Button>
        )}
      </Container>
    </section>
  );
};

Hero.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      caseStudyPost: PropTypes.shape({
        description: PropTypes.string.isRequired,
        logo: PropTypes.shape({
          mediaItemUrl: PropTypes.string.isRequired,
          mediaDetails: PropTypes.shape({
            width: PropTypes.number.isRequired,
            height: PropTypes.number.isRequired,
          }).isRequired,
        }).isRequired,
        post: PropTypes.shape({
          slug: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
    })
  ).isRequired,
};

export default Hero;
