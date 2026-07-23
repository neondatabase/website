import Image from 'next/image';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import ArrowRightIcon from 'icons/arrow-right.inline.svg';
import triangleIcon from 'icons/triangle.svg';
import patternSvg1 from 'images/pages/case-studies/hero/pattern-1.svg';
import patternSvg2 from 'images/pages/case-studies/hero/pattern-2.svg';
import { cn } from 'utils/cn';

const CARDS = [
  {
    logo: {
      src: '/images/case-studies/replit.svg',
      width: 120,
      height: 32,
    },
    category: 'AI & Agents',
    title:
      '<span>“The combination of </span>flexible resource limits and nearly instant provisioning<span> made Neon a no-brainer.”</span>',
    author: 'Lincoln Bergeson, Engineer',
    linkText: 'Read case study',
    linkUrl: `${LINKS.blog}/neon-replit-integration`,
    background: {
      src: patternSvg1,
      width: 303,
      height: 166,
    },
  },
  {
    logo: {
      src: '/images/case-studies/vapi.svg',
      width: 99,
      height: 32,
    },
    category: 'AI & Agents',
    title: '<span>“Neon’s serverless model is a </span>perfect fit for us.”',
    titleTheme: 'large',
    author: 'Tejas Siripurapu, Founding Engineer',
    linkText: 'Read case study',
    linkUrl: `${LINKS.blog}/vapi-voice-agents-neon`,
    background: {
      src: patternSvg2,
      width: 285,
      height: 164,
    },
  },
];

const FeaturedCard = ({
  logo,
  category,
  title,
  titleTheme,
  author,
  linkText,
  linkUrl,
  background,
}) => (
  <Link className="group leading-none" to={linkUrl}>
    <article className="relative flex h-[408px] w-full flex-col overflow-hidden border border-gray-new-30 sm:h-[340px] xs:h-[320px]">
      <Image
        className="absolute top-0 right-0 lt:h-auto lt:max-w-[55%] lg:max-w-[50%] sm:max-w-[40%]"
        src={background.src}
        width={background.width}
        height={background.height}
        alt=""
        priority
      />
      <div className="relative z-10 flex flex-1 flex-col justify-between p-8 2xl:pr-16 sm:p-6 xs:p-5">
        <Image
          className="h-8 w-auto max-w-[120px] object-contain object-left sm:h-6 sm:max-w-[90px]"
          src={logo.src}
          alt=""
          width={logo.width}
          height={logo.height}
          style={{ width: 'auto' }}
          priority
        />
        <div className="mt-auto flex flex-col gap-8 lg:gap-6">
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[13px] leading-none font-medium text-green-52 uppercase sm:text-[10px]">
              {category}
            </span>

            <h2
              className={cn(
                'font-normal tracking-tighter text-white lg:text-2xl/tight md:text-[28px] sm:text-2xl/tight xs:text-[20px] [&_span]:text-gray-new-60',
                titleTheme === 'large' ? 'text-[36px] leading-tight' : 'text-[28px] leading-tight'
              )}
              dangerouslySetInnerHTML={{ __html: title }}
            />
          </div>

          <div className="flex items-center justify-between gap-6 lg:flex-col lg:items-start lg:gap-4">
            <span className="text-base leading-none font-normal -tracking-wide text-gray-new-90 lg:text-[.9375rem]">
              {author}
            </span>
            <span className="inline-flex shrink-0 items-center gap-2 text-base leading-none font-medium tracking-tighter text-white sm:text-[15px]">
              {linkText}
              <ArrowRightIcon className="size-4 shrink-0 text-gray-new-70 transition-[translate,color] duration-200 group-hover:translate-x-[3px] group-hover:text-white" />
            </span>
          </div>
        </div>
      </div>
    </article>
  </Link>
);

FeaturedCard.propTypes = {
  logo: PropTypes.shape({
    src: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }).isRequired,
  category: PropTypes.string,
  title: PropTypes.string.isRequired,
  titleTheme: PropTypes.oneOf(['large']),
  author: PropTypes.string.isRequired,
  linkText: PropTypes.string.isRequired,
  linkUrl: PropTypes.string.isRequired,
  background: PropTypes.shape({
    src: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }).isRequired,
};

const Hero = () => (
  <section className="relative py-40 safe-paddings xl:py-36 lg:py-20 md:py-14 sm:py-10">
    <Container size="branching" className="flex flex-col gap-16 lg:gap-14 md:gap-10">
      <div className="flex max-w-[960px] flex-col gap-5 lt:max-w-[864px] lg:max-w-[640px] md:max-w-none">
        <div className="flex items-end gap-2 sm:gap-1.5">
          <Image
            src={triangleIcon}
            alt=""
            width={12}
            height={14}
            aria-hidden="true"
            className="sm:h-2.5 sm:w-2.5"
          />
          <span className="font-mono text-xs leading-none font-medium text-gray-new-80 uppercase sm:text-[10px]">
            Case studies
          </span>
        </div>
        <h1 className="text-[3.5rem] leading-[1.125] font-normal tracking-tighter text-white lt:text-[54px] lg:text-[40px] md:text-[32px]">
          Real-world stories from teams shipping world-class products on Neon.
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-8 lg:gap-6 md:grid-cols-1 md:gap-6">
        {CARDS.map(
          ({ logo, category, title, titleTheme, author, linkText, linkUrl, background }, index) => (
            <FeaturedCard
              key={index}
              logo={logo}
              category={category}
              title={title}
              titleTheme={titleTheme}
              author={author}
              linkText={linkText}
              linkUrl={linkUrl}
              background={background}
            />
          )
        )}
      </div>
    </Container>
  </section>
);

export default Hero;
