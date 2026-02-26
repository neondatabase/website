import Image from 'next/image';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import Link from 'components/shared/link';
import HasuraLogo from 'components/shared/logos/images/hasura.inline.svg';
import VercelLogo from 'components/shared/logos/images/vercel.inline.svg';
import LINKS from 'constants/links';
import ArrowRightIcon from 'icons/arrow-right.inline.svg';
import triangleIcon from 'icons/triangle.svg';
import patternSvg1 from 'images/pages/case-studies/hero/pattern-1.svg';
import patternSvg2 from 'images/pages/case-studies/hero/pattern-2.svg';

const CARDS = [
  {
    logo: VercelLogo,
    category: 'AI & Agents',
    title:
      '99.99% uptime without over-provisioning. <span>How Vercel uses autoscaling to keep Postgres stable.</span>',
    linkText: 'Read case study',
    linkUrl: `${LINKS.blog}/neon-postgres-on-vercel`,
    background: {
      src: patternSvg1,
      width: 303,
      height: 166,
    },
  },
  {
    logo: HasuraLogo,
    category: 'fast-moving teams',
    title:
      'Database operations, made repeatable. <span>How Hasura standardizes provisioning across environments with Neon.</span>',
    linkText: 'Read case study',
    linkUrl: `${LINKS.blog}/neon-hasura-integration`,
    background: {
      src: patternSvg2,
      width: 285,
      height: 164,
    },
  },
];

const FeaturedCard = ({ logo: Logo, category, title, linkText, linkUrl, background }) => (
  <Link className="group" to={linkUrl}>
    <article className="relative flex h-[408px] w-full min-w-0 flex-col overflow-hidden border border-gray-new-30">
      <Image
        className="absolute right-0 top-0"
        src={background.src}
        width={background.width}
        height={background.height}
        alt=""
        priority
      />
      <div className="relative z-10 flex flex-1 flex-col justify-between p-8">
        <Logo className="h-8 w-auto max-w-[119px] fill-white object-contain object-left text-white" />
        <div className="mt-auto flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[13px] font-medium uppercase leading-none text-green-52">
              {category}
            </span>

            <h2
              className="text-[28px] font-normal leading-tight tracking-tighter text-white [&_span]:text-gray-new-60"
              dangerouslySetInnerHTML={{ __html: title }}
            />
          </div>

          <span className="inline-flex w-fit items-center gap-2 text-base font-medium leading-none tracking-tighter text-white">
            {linkText}
            <ArrowRightIcon className="size-4 shrink-0 text-gray-new-70 transition-transform duration-200 group-hover:translate-x-[3px]" />
          </span>
        </div>
      </div>
    </article>
  </Link>
);

FeaturedCard.propTypes = {
  logo: PropTypes.elementType.isRequired,
  category: PropTypes.string,
  title: PropTypes.string.isRequired,
  linkText: PropTypes.string.isRequired,
  linkUrl: PropTypes.string.isRequired,
  background: PropTypes.shape({
    src: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }).isRequired,
};

const Hero = () => (
  <section className="safe-paddings relative py-40 xl:py-36 lg:py-20 md:py-12">
    <Container size="branching" className="flex flex-col gap-16 lg:gap-14 md:gap-10">
      <div className="flex max-w-[896px] flex-col gap-5">
        <div className="flex items-end gap-2 md:gap-1.5">
          <Image
            src={triangleIcon}
            alt=""
            width={12}
            height={14}
            aria-hidden="true"
            className="md:h-2.5 md:w-2.5"
          />
          <span className="font-mono text-xs font-medium uppercase leading-none text-gray-new-80 md:text-[0.625rem]">
            Case studies
          </span>
        </div>
        <h1 className="text-[3.5rem] font-normal leading-[1.125] tracking-[-0.04em] text-white xl:text-[3.25rem] lg:text-[2.75rem] md:text-[2rem]">
          Real-world stories from teams running serverless Postgres at scale.
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-8 lg:gap-6 md:grid-cols-1 md:gap-6">
        {CARDS.map(({ logo, category, title, linkText, linkUrl, background }, index) => (
          <FeaturedCard
            key={index}
            logo={logo}
            category={category}
            title={title}
            linkText={linkText}
            linkUrl={linkUrl}
            background={background}
          />
        ))}
      </div>
    </Container>
  </section>
);

export default Hero;
