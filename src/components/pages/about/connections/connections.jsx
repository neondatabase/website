import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import SectionLabel from 'components/shared/section-label';
import LINKS from 'constants/links';
import DotsPattern from 'images/dots-pattern.inline.svg';

import ArrowIcon from './images/arrow-right.inline.svg';
import DiscordIcon from './images/discord-icon.inline.svg';
import LinkedInIcon from './images/linkedin-icon.inline.svg';
import XTwitterIcon from './images/x-twitter-icon.inline.svg';

const CONNECTIONS_DATA = [
  {
    platform: 'X (Twitter)',
    description: 'Stay up to date with the latest news, updates, and insights from our team.',
    linkText: 'Engage with us',
    href: LINKS.twitter,
    icon: XTwitterIcon,
  },
  {
    platform: 'LinkedIn',
    description: 'Connect, collaborate, and discover opportunities to build and grow.',
    linkText: 'Follow and learn',
    href: LINKS.linkedin,
    icon: LinkedInIcon,
  },
  {
    platform: 'Discord',
    description: "Join real-time discussions, ask questions, and share what you're building.",
    linkText: 'Talk to us',
    href: LINKS.discord,
    icon: DiscordIcon,
  },
];

const ConnectionCard = ({ platform, description, linkText, href, icon: Icon }) => (
  <article className="group relative flex h-full flex-col overflow-hidden bg-[#CDDFD7] p-8 xl:p-6 md:p-5">
    {/* Icon */}
    <Icon
      className="relative z-10 h-[52px] w-[52px] text-black-pure xl:h-12 xl:w-12 lg:h-11 lg:w-11"
      aria-hidden="true"
    />

    {/* Content */}
    <div className="relative z-10 mt-[87px] flex flex-col gap-3 xl:mt-16 xl:gap-2.5 lg:mt-12 lg:gap-2 md:mt-10">
      <h4 className="text-2xl font-medium leading-snug tracking-extra-tight text-black-pure xl:text-[22px] lg:text-xl md:text-lg">
        {platform}
      </h4>
      <p className="text-lg font-normal leading-normal tracking-[-0.05em] text-gray-new-20 xl:text-base lg:text-[15px] md:text-sm">
        {description}
      </p>
    </div>

    {/* Link */}
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative z-10 mt-auto flex items-center gap-2 pt-4 text-base font-medium leading-none tracking-extra-tight text-black-pure transition-colors duration-200 hover:text-gray-new-40"
      aria-label={`${linkText} - ${platform}`}
    >
      <span>{linkText}</span>
      <ArrowIcon className="h-3 w-3 text-gray-new-40" aria-hidden="true" />
    </a>

    {/* Pattern overlay */}
    <div
      className="pointer-events-none absolute right-0 top-0 h-full w-[320px] xl:w-[280px] lg:w-[260px] md:w-[240px]"
      aria-hidden="true"
      style={{
        maskImage: 'linear-gradient(224deg, #000 0%, rgba(0, 0, 0, 0) 41.2%)',
        WebkitMaskImage: 'linear-gradient(224deg, #000 0%, rgba(0, 0, 0, 0) 41.2%)',
      }}
    >
      <DotsPattern className="h-full w-full" fill="#A7C6B8" />
    </div>
  </article>
);

ConnectionCard.propTypes = {
  platform: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  linkText: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
};

const Connections = () => (
  <section className="connections safe-paddings overflow-hidden bg-[#E4F1EB]">
    <h2 className="sr-only">Community</h2>
    <Container
      size={1280}
      className="pb-[200px] pt-40 xl:pb-40 xl:pt-32 lg:pb-32 lg:pt-24 md:pb-24 md:pt-20 sm:pb-20 sm:pt-16"
    >
      {/* Header */}
      <header className="mb-[64px] xl:mb-14 lg:mb-12 md:mb-10">
        {/* Label */}
        <SectionLabel>Community</SectionLabel>

        {/* Title */}
        <h3 className="mt-[34px] max-w-[813px] text-5xl font-normal leading-dense tracking-tighter xl:mt-7 xl:max-w-[680px] xl:text-[40px] lg:mt-6 lg:max-w-[560px] lg:text-4xl md:mt-5 md:max-w-full md:text-[32px] sm:text-[28px]">
          <span className="text-black-pure">Connect with us</span>{' '}
          <span className="text-gray-new-40">
            wherever you work, build, and share your journey.
          </span>
        </h3>

        {/* Divider */}
        <div
          className="mt-[34px] h-px w-full bg-gray-new-50 xl:mt-7 lg:mt-6 md:mt-5"
          aria-hidden="true"
        />
      </header>

      {/* Cards Grid */}
      <ul className="grid grid-cols-3 gap-[31px] xl:gap-6 lg:grid-cols-2 lg:gap-5 md:grid-cols-1 md:gap-4">
        {CONNECTIONS_DATA.map((card) => (
          <li key={card.platform}>
            <ConnectionCard {...card} />
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default Connections;
