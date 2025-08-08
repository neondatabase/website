import Image from 'next/image';
import PropTypes from 'prop-types';

import Heading from 'components/shared/heading';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import discordLogo from 'icons/discord-colored.svg';
import linkedinLogo from 'icons/linkedin-colored.svg';
import xLogo from 'icons/x-colored.svg';

const SOCIALS = [
  {
    icon: xLogo,
    title: 'x.com',
    description: 'Follow for updates and insights.',
    link: {
      text: 'Engage with us',
      href: LINKS.twitter,
    },
  },
  {
    icon: linkedinLogo,
    title: 'LinkedIn',
    description: 'Network and discover opportunities.',
    link: {
      text: 'Follow and learn',
      href: LINKS.linkedin,
    },
  },
  {
    icon: discordLogo,
    title: 'Discord',
    description: 'Engage in real-time conversations.',
    link: {
      text: 'Talk to us',
      href: LINKS.discord,
    },
  },
];

const Card = ({ icon, title, description, link }) => (
  <article className="group relative flex w-[216px] flex-col items-center justify-center rounded-lg border border-gray-new-15 bg-[#0A0A0A] p-6 lg:w-[200px] md:w-[320px]">
    <a
      className="absolute left-0 top-0 h-full w-full"
      href={link.href}
      aria-label={link.text}
      target="_blank"
      rel="noreferrer noopener"
    />
    <Image src={icon} alt={title} width={32} height={32} quality={100} className="mb-[14px]" />
    <h3 className="mb-2 text-xl leading-snug tracking-tight text-white">{title}</h3>
    <p className="mb-[18px] text-center text-sm font-normal leading-snug tracking-tight text-gray-new-60">
      {description}
    </p>
    <Link
      theme="white"
      to={link.href}
      target="_blank"
      className="text-[13px] font-medium leading-none tracking-extra-tight transition-[color] duration-300 group-hover:text-primary-2"
      aria-label={link.text}
      withArrow
    >
      {link.text}
    </Link>
  </article>
);

Card.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  link: PropTypes.object.isRequired,
};

const Connections = () => (
  <section className="connections safe-paddings mt-[216px] xl:mt-[152px] lg:mt-[112px] md:mt-[96px]">
    <div className="relative mx-auto flex max-w-[1088px] flex-col items-center xl:max-w-[704px] md:px-5">
      <Heading
        className="max-w-[625px] text-center text-5xl font-medium leading-none tracking-extra-tight xl:text-4xl xl:tracking-tight lg:text-[32px]"
        tag="h2"
      >
        Connect with us wherever you
        <br />
        work, build, and share
      </Heading>
      <ul className="mt-12 flex gap-7 text-2xl text-gray-new-50 xl:mt-11 lg:mt-10 md:mt-8 md:flex-col">
        {SOCIALS.map((item, index) => (
          <li key={index}>
            <Card {...item} />
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default Connections;
