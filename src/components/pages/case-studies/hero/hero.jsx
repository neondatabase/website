import Image from 'next/image';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import GradientCard from 'components/shared/gradient-card';
import Link from 'components/shared/link/link';
import LINKS from 'constants/links';
import ArrowIcon from 'icons/arrow-sm.inline.svg';

const CardItem = ({
  title,
  isFeatured,
  logo,
  image,
  description,
  quote,
  author,
  externalUrl = '',
  isInternal,
  post = null,
  index,
}) => {
  const linkUrl = isInternal && post?.slug ? `${LINKS.blog}/${post.slug}` : externalUrl;
  const linkProps = linkUrl
    ? {
        to: linkUrl,
        as: !isFeatured ? Link : undefined,
        target: isInternal ? undefined : '_blank',
        rel: isInternal ? undefined : 'noopener noreferrer',
      }
    : {};

  if (isFeatured)
    return (
      <Link className="group flex items-center gap-10 lg:gap-8 md:flex-col md:gap-4" {...linkProps}>
        <div className="w-2/5 max-w-[496px] overflow-hidden rounded-lg md:w-full md:max-w-full">
          <Image
            className="h-auto w-full transition-transform duration-300 group-hover:scale-105"
            src={image.mediaItemUrl}
            alt={title}
            width={image.mediaDetails.width}
            height={image.mediaDetails.height}
            priority
          />
        </div>
        <div className="w-3/5 max-w-[598px] md:w-full md:max-w-full">
          <p
            className="text-[26px] font-light leading-snug tracking-tighter text-white xl:text-2xl lg:text-lg"
            dangerouslySetInnerHTML={{ __html: quote }}
          />
          {author && author.name && (
            <p className="mt-3 font-light leading-tight -tracking-extra-tight lg:mt-2 lg:text-xs">
              {author.name}{' '}
              {author?.post && <span className="text-gray-new-70">– {author?.post}</span>}
            </p>
          )}
          {!!linkProps && (
            <div className="mt-9 inline-flex items-baseline text-[15px] leading-none tracking-extra-tight text-green-45 transition-colors duration-200 group-hover:text-[#00FFAA] lg:mt-5">
              Read case study
              <ArrowIcon className="ml-1" />
            </div>
          )}
        </div>
      </Link>
    );

  return (
    <li>
      <GradientCard className="p-8 md:p-7 md:pb-8" {...linkProps}>
        <div className="flex h-full flex-col">
          <Image
            className="h-10 w-fit"
            src={logo.mediaItemUrl}
            alt={title}
            width={logo.mediaDetails.width}
            height={logo.mediaDetails.height}
            priority={index < 6}
          />
          <p className="mb-4 mt-[60px] line-clamp-3 font-light leading-snug text-gray-new-60 xl:mt-10 lg:mt-8 md:mt-6">
            <span className="font-normal text-white">{title}</span>. {description}
          </p>
          {!!linkProps && (
            <div className="mt-auto inline-flex items-baseline text-[15px] leading-none tracking-extra-tight text-green-45 transition-colors duration-200 group-hover:text-[#00FFAA]">
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
  isFeatured: PropTypes.bool.isRequired,
  logo: PropTypes.shape({
    mediaItemUrl: PropTypes.string.isRequired,
    mediaDetails: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    }).isRequired,
  }),
  image: PropTypes.shape({
    mediaItemUrl: PropTypes.string.isRequired,
    mediaDetails: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    }).isRequired,
  }),
  description: PropTypes.string,
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

const Hero = ({ items }) => {
  const featuredItem = items.find((item) => item.caseStudyPost.isFeatured === true);
  const otherItems = featuredItem ? items.filter((item) => item !== featuredItem) : items;

  return (
    <section className="hero safe-paddings pt-36 xl:pt-[120px] lg:pt-11 md:pt-8">
      <Container className="flex flex-col items-center" size="1220">
        <h1 className="text-center font-title text-[72px] font-medium leading-none tracking-extra-tight 2xl:text-6xl xl:text-[56px] lg:text-[44px]">
          Explore <span className="text-green-45">success stories</span>
        </h1>
        <p className="mx-auto mt-5 max-w-[635px] text-center text-xl font-light leading-snug lg:text-lg md:text-base">
          Discover the diverse and captivating stories of our valued partners, each a testament to
          unique experiences and successes.
        </p>
        <div className="mt-20 w-full lg:mt-16 md:mt-12">
          {!!featuredItem && (
            <>
              <div className="mb-16 lg:mb-12 md:mb-10">
                <CardItem {...featuredItem.caseStudyPost} />
              </div>
              <h2 className="mb-7 text-2xl leading-none tracking-tight lg:mb-6 lg:text-xl md:mb-5  md:text-lg">
                More customer stories
              </h2>
            </>
          )}
          <ul className="дg:grid-cols-2 col-span-10 col-start-2 grid grid-cols-3 gap-x-8 gap-y-9 xl:col-span-full xl:col-start-1  md:gap-6 sm:grid-cols-1">
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
