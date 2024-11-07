import Image from 'next/image';
import { PropTypes } from 'prop-types';

import Container from 'components/shared/container';
import GradientCard from 'components/shared/gradient-card';
import ArrowIcon from 'icons/arrow-sm.inline.svg';
import getLinkProps from 'utils/get-link-props';

const Card = ({ title, logo, description, externalUrl = '', isInternal, post = null, index }) => {
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

export const CardPropTypes = {
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

Card.propTypes = CardPropTypes;

const Cards = ({ items }) => (
  <section className="main safe-paddings mt-56 xl:mt-[120px] lg:mt-11 md:mt-8">
    <Container className="flex flex-col items-center" size="960">
      <h2 className="max-w-2xl text-center font-title text-[48px] font-medium leading-none tracking-extra-tight lg:text-4xl sm:text-[36px]">
        Powering ambitious product teams of all shapes and sizes
      </h2>
      <ul className="mt-14 h-12 w-full rounded-full border border-gray-new-15 bg-black-new" />
      <ul className="mt-12 grid grid-cols-3 gap-5 gap-x-[34px] lg:grid-cols-2 sm:grid-cols-1">
        {items.map(({ title, caseStudyPost }, index) => (
          <Card {...caseStudyPost} title={title} key={index} index={index} />
        ))}
      </ul>
    </Container>
  </section>
);

Cards.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape(CardPropTypes)).isRequired,
};

export default Cards;
