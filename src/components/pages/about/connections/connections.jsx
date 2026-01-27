import PropTypes from 'prop-types';

import SecondarySection from 'components/shared/secondary-section';
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
  <article className="group relative flex h-full flex-col overflow-hidden bg-[#CDDFD7] px-8 py-7 xl:p-6 lg:px-7 lg:py-6 md:px-6 md:py-6">
    <Icon
      className="relative z-10 h-[52px] w-[52px] text-black-pure lg:h-11 lg:w-11"
      aria-hidden="true"
    />

    <div className="relative z-10 mb-6 mt-[87px] flex flex-col gap-3 xl:mt-16 xl:gap-2.5 lg:mt-12 lg:gap-2.5 md:mb-5 md:mt-8">
      <h4 className="text-2xl font-medium leading-tight tracking-extra-tight text-black-pure lg:text-xl">
        {platform}
      </h4>
      <p className="text-lg font-normal leading-snug tracking-[-0.025em] text-gray-new-20 lg:text-base">
        {description}
      </p>
    </div>

    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative z-10 mt-auto flex items-center gap-2 text-base font-medium leading-none tracking-extra-tight text-black-pure transition-colors duration-200 hover:text-gray-new-40 lg:text-sm"
      aria-label={`${linkText} - ${platform}`}
    >
      <span>{linkText}</span>
      <ArrowIcon className="h-3 w-3 text-gray-new-40" aria-hidden="true" />
    </a>

    <div
      className="pointer-events-none absolute right-0 top-0 h-full w-[320px] xl:w-[280px] lg:w-[240px] md:w-[220px]"
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
  <SecondarySection title="Community" className="pb-20">
    <header className="mb-[64px] xl:mb-14 lg:mb-12 md:mb-10 sm:mb-8">
      <SectionLabel>Community</SectionLabel>

      <h3 className="mt-5 max-w-[813px] text-5xl font-normal leading-dense tracking-tighter text-black-pure xl:max-w-[680px] xl:text-[40px] lg:max-w-[560px] lg:text-[36px] md:max-w-full md:text-[28px]">
        Connect with us{' '}
        <span className="text-gray-new-40">wherever you work, build, and share your journey.</span>
      </h3>

      <div className="mt-6 h-px w-full bg-gray-new-50 md:mt-5" aria-hidden="true" />
    </header>

    {/* Cards Grid */}
    <ul className="grid grid-cols-3 gap-[31px] xl:gap-5 lg:grid-cols-2 lg:gap-4 md:grid-cols-1 md:gap-4">
      {CONNECTIONS_DATA.map((card) => (
        <li key={card.platform}>
          <ConnectionCard {...card} />
        </li>
      ))}
    </ul>
  </SecondarySection>
);

export default Connections;
