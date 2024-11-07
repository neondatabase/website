import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import Link from 'components/shared/link/link';
import ArrowIcon from 'icons/arrow-sm.inline.svg';
import getLinkProps from 'utils/get-link-props';

import { CardPropTypes } from '../cards';

import сardBg1 from './images/card-bg-1.jpg';
import сardBg4 from './images/card-bg-4.jpg';

const cardBgImages = {
  1: сardBg1,
  4: сardBg4,
};

const FeaturedCard = ({
  index,
  title,
  logo,
  quote,
  author,
  externalUrl = '',
  isInternal,
  post = null,
}) => {
  const linkProps = getLinkProps({ externalUrl, isInternal, post, isFeatured: true });

  return (
    <li
      className={clsx('h-[315px] sm:w-full', {
        'w-[60%]': index % 4 === 0 || index % 4 === 3,
        'flex-[30%] flex-grow': index % 4 === 1 || index % 4 === 2,
      })}
    >
      <Link
        className={clsx(
          'relative z-10 flex h-full w-full flex-col justify-between overflow-hidden',
          'rounded-xl border border-gray-new-15 bg-[#0A0A0A] p-6 pt-5',
          'transition-colors duration-200 hover:border-green-45',
          'xl:rounded-[10px] lg:rounded-lg md:w-full md:max-w-full'
        )}
        {...linkProps}
      >
        <Image
          className="h-8 w-fit lg:h-8"
          src={logo.mediaItemUrl}
          alt={title}
          width={logo.mediaDetails.width}
          height={logo.mediaDetails.height}
          priority
        />
        <figure className="flex w-full flex-col">
          <blockquote>
            <p
              className="text-pretty text-lg font-light leading-snug tracking-extra-tight text-white xl:text-2xl lg:text-lg"
              dangerouslySetInnerHTML={{ __html: `“${quote}”` }}
            />
          </blockquote>
          {author && author.name && (
            <figcaption className="mt-2 text-sm font-light leading-snug tracking-extra-tight text-gray-new-70 lg:text-[13px]">
              {author.name}{' '}
              <cite>{author?.post && <span className="not-italic">— {author?.post}</span>}</cite>
            </figcaption>
          )}
          <div
            className="mt-[18px] inline-flex items-center text-[15px] leading-none tracking-tight text-white transition-colors duration-200 hover:text-green-45 lg:mt-4 lg:text-sm"
            {...linkProps}
          >
            Read story
            <ArrowIcon className="ml-1.5" />
          </div>
        </figure>
        {(index % 4 === 0 || index % 4 === 3) && (
          <Image
            className="pointer-events-none absolute inset-0 -z-10 object-cover"
            src={cardBgImages[(index % 4) + 1]}
            width={576}
            height={315}
            alt=""
            priority
            aria-hidden
          />
        )}
      </Link>
    </li>
  );
};

FeaturedCard.propTypes = CardPropTypes;

const Hero = ({ items }) => {
  const featuredItems = items.filter(
    (item) =>
      item.caseStudyPost.isFeatured === true ||
      // TODO: remove before release
      item.title === 'Vercel'
  );

  return (
    <section className="hero safe-paddings pt-48 xl:pt-[120px] lg:pt-11 md:pt-8">
      <Container className="flex flex-col items-center" size="960">
        <h1 className="text-center font-title text-[68px] font-medium leading-none tracking-extra-tight 2xl:text-6xl xl:text-[56px] lg:text-[44px]">
          Explore success stories
        </h1>
        <p className="mx-auto mt-3.5 max-w-xl text-center text-lg font-light leading-snug tracking-extra-tight md:text-base">
          Discover the diverse and captivating stories of our valued partners, each a testament to
          unique experiences and successes.
        </p>
        {!!featuredItems.length && (
          <ul className="mt-16 flex w-full flex-wrap gap-8 lg:mt-14 md:mt-10 sm:flex-col">
            {featuredItems.map(({ title, caseStudyPost }, index) => (
              <FeaturedCard {...caseStudyPost} title={title} index={index} key={index} />
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
};

Hero.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape(CardPropTypes)).isRequired,
};

export default Hero;
