import Image from 'next/image';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import GradientCard from 'components/shared/gradient-card';
import Link from 'components/shared/link/link';
import LINKS from 'constants/links';
import ArrowIcon from 'icons/arrow-sm.inline.svg';

function getLinkProps({ externalUrl, isInternal, post, isFeatured }) {
  const linkUrl = isInternal && post?.slug ? `${LINKS.blog}/${post.slug}` : externalUrl;

  if (!linkUrl) return {};

  return {
    to: linkUrl,
    as: !isFeatured ? Link : undefined,
    target: isInternal ? undefined : '_blank',
    rel: isInternal ? undefined : 'noopener noreferrer',
  };
}

const FeaturedCard = ({
  title,
  image,
  quote,
  author,
  externalUrl = '',
  isInternal,
  post = null,
}) => {
  const linkProps = getLinkProps({ externalUrl, isInternal, post, isFeatured: true });

  return (
    <div className="flex items-center gap-10 lg:gap-5 md:flex-col md:gap-6 sm:gap-3.5">
      <Link
        className="w-1/2 max-w-[496px] shrink-0 overflow-hidden rounded-xl border border-transparent transition-colors duration-200 hover:border-green-45 xl:rounded-[10px] lg:rounded-lg md:w-full md:max-w-full"
        {...linkProps}
      >
        <Image
          className="h-auto w-full"
          src={image.mediaItemUrl}
          alt={title}
          width={image.mediaDetails.width / 2}
          height={image.mediaDetails.height / 2}
          quality={95}
          priority
        />
      </Link>
      <figure className="w-1/2 max-w-[598px] md:w-full md:max-w-full">
        <blockquote>
          <p
            className="text-[26px] font-light leading-snug tracking-tighter text-white xl:text-2xl lg:text-lg"
            dangerouslySetInnerHTML={{ __html: quote }}
          />
        </blockquote>
        {author && author.name && (
          <figcaption className="mt-3 font-light leading-tight -tracking-extra-tight lg:text-[13px]">
            {author.name}{' '}
            <cite>
              {author?.post && <span className="text-gray-new-70">– {author?.post}</span>}
            </cite>
          </figcaption>
        )}
        {!!linkProps && (
          <Link
            className="mt-9 inline-flex items-baseline text-[15px] leading-none tracking-[-0.05em] text-green-45 transition-colors duration-200 hover:text-[#00FFAA] lg:mt-7 lg:text-sm"
            {...linkProps}
          >
            Read case study
            <ArrowIcon className="ml-1" />
          </Link>
        )}
      </figure>
    </div>
  );
};

FeaturedCard.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.shape({
    mediaItemUrl: PropTypes.string.isRequired,
    mediaDetails: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    }).isRequired,
  }),
  quote: PropTypes.string,
  author: PropTypes.shape({
    name: PropTypes.string,
    post: PropTypes.string,
  }),
  isInternal: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf([null])]),
  externalUrl: PropTypes.string,
  post: PropTypes.shape({
    slug: PropTypes.string.isRequired,
  }),
  index: PropTypes.number,
};

const CardItem = ({
  title,
  logo,
  description,
  externalUrl = '',
  isInternal,
  post = null,
  index,
}) => {
  const linkProps = getLinkProps({ externalUrl, isInternal, post });

  return (
    <li>
      <GradientCard className="p-8 lg:rounded-lg lg:p-6 sm:p-5" {...linkProps}>
        <div className="flex h-full flex-col">
          <Image
            className="h-10 w-fit lg:h-8"
            src={logo.mediaItemUrl}
            alt={title}
            width={logo.mediaDetails.width}
            height={logo.mediaDetails.height}
            priority={index < 6}
          />
          <p className="mb-4 mt-[60px] line-clamp-3 font-light leading-snug text-gray-new-60 xl:mt-10 lg:mt-10 md:mt-6">
            <span className="font-normal text-white">{title}</span>. {description}
          </p>
          {!!linkProps && (
            <div className="mt-auto inline-flex items-baseline text-[15px] leading-none tracking-extra-tight text-green-45 transition-colors duration-200 group-hover:text-[#00FFAA] lg:text-sm">
              Read case study
              <ArrowIcon className="ml-1" />
            </div>
          )}
        </div>
      </GradientCard>
    </li>
  );
};

CardItem.propTypes = {
  title: PropTypes.string.isRequired,
  logo: PropTypes.shape({
    mediaItemUrl: PropTypes.string.isRequired,
    mediaDetails: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    }).isRequired,
  }),
  description: PropTypes.string,
  isInternal: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf([null])]),
  externalUrl: PropTypes.string,
  post: PropTypes.shape({
    slug: PropTypes.string.isRequired,
  }),
  index: PropTypes.number,
};

const Hero = ({ items }) => {
  const featuredItem = items.find((item) => item.caseStudyPost.isFeatured === true);
  const otherItems = items.filter((item) => item !== featuredItem);

  return (
    <section className="hero safe-paddings pt-36 xl:pt-[120px] lg:pt-11 md:pt-8">
      <Container className="flex flex-col items-center" size="1220">
        <h1 className="text-center font-title text-[72px] font-medium leading-none tracking-extra-tight 2xl:text-6xl xl:text-[56px] lg:text-[44px]">
          Explore <span className="text-green-45">success stories</span>
        </h1>
        <p className="mx-auto mt-5 max-w-[635px] text-center text-xl font-light leading-snug tracking-extra-tight lg:text-lg md:text-base">
          Learn how others are using Neon
        </p>
        <div className="mt-20 w-full lg:mt-14 md:mt-10">
          {!!featuredItem && (
            <>
              <div className="mb-16 lg:mb-14">
                <FeaturedCard {...featuredItem.caseStudyPost} title={featuredItem.title} />
              </div>
              <h2 className="mb-7 text-2xl leading-none tracking-tight lg:text-xl md:text-lg">
                More customer stories
              </h2>
            </>
          )}
          <ul className="col-span-10 col-start-2 grid grid-cols-3 gap-x-[34px] gap-y-9 xl:col-span-full xl:col-start-1 xl:gap-x-8 lg:grid-cols-2 md:gap-8 sm:grid-cols-1 sm:gap-y-5">
            {otherItems.map(({ title, caseStudyPost }, index) => (
              <CardItem {...caseStudyPost} title={title} key={index} index={index} />
            ))}
          </ul>
        </div>
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
        isInternal: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf([null])]),
        externalUrl: PropTypes.string,
        post: PropTypes.shape({
          slug: PropTypes.string.isRequired,
        }),
      }).isRequired,
    })
  ).isRequired,
};

export default Hero;
