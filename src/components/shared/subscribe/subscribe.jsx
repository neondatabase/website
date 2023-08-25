import Image from 'next/image';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';
import SubscriptionForm from 'components/shared/subscription-form';
import { HUBSPOT_NEWSLETTERS_FORM_ID } from 'constants/forms';
import LINKS from 'constants/links';
import linkedinIcon from 'icons/linkedin.svg';
import twitterIcon from 'icons/twitter.svg';

// import DiscordIcon from './images/subscribe-discord.inline.svg';
import githubIcon from './images/subscribe-github.svg';
import illustration from './images/subscribe-illustration.jpg';

const links = [
  {
    icon: twitterIcon,
    to: LINKS.twitter,
    name: 'Twitter',
  },
  {
    icon: linkedinIcon,
    to: LINKS.linkedin,
    name: 'LinkedIn',
  },
  // {
  //   icon: DiscordIcon,
  //   to: LINKS.discord,
  //   name: 'Discord',
  // },
  {
    icon: githubIcon,
    to: LINKS.github,
    name: 'GitHub',
  },
];

const Subscribe = () => (
  <section
    id="subscribe"
    className="safe-paddings my-48 3xl:my-44 2xl:my-40 xl:my-32 lg:my-24 md:my-20"
  >
    <Container className="flex items-center justify-between lg:block" size="md">
      <Image
        className="max-w-[800px] 3xl:max-w-[660px] 2xl:max-w-[550px] xl:max-w-[430px] lg:!hidden"
        src={illustration}
        alt=""
        loading="lazy"
        aria-hidden
      />

      <div className="max-w-[710px] 3xl:max-w-[590px] 2xl:max-w-[488px] xl:max-w-[456px] lg:max-w-none">
        <Heading className="lg:text-center" tag="h2" size="xl" theme="black">
          Subscribe to our&nbsp;Newsletter
        </Heading>

        <SubscriptionForm
          className="mt-10 2xl:mt-8 xl:mt-7"
          formId={HUBSPOT_NEWSLETTERS_FORM_ID}
          localStorageKey="submittedEmailNewsletterForm"
        />

        <div className="mt-[94px] flex items-center space-x-[38px] 2xl:mt-[74px] 2xl:space-x-8 xl:mt-16 xl:space-x-7 lg:mt-12 lg:flex-col lg:space-x-0">
          <span className="t-3xl font-bold !leading-none">Join us:</span>
          <ul className="flex space-x-[26px] 2xl:space-x-5 xl:space-x-[18px] lg:mt-3.5">
            {links.map(({ icon, to, name }, index) => (
              <li className="relative" key={index}>
                <span
                  className="absolute -bottom-1.5 -left-1.5 h-full w-full rounded-full bg-secondary-5 xl:-bottom-1 xl:-left-1"
                  aria-hidden
                />
                <Link
                  className="relative flex h-[72px] w-[72px] items-center justify-center rounded-full border-4 border-black bg-white transition-transform duration-200 hover:-translate-x-1.5 hover:translate-y-1.5 2xl:h-16 2xl:w-16 xl:h-14 xl:w-14 xl:hover:-translate-x-1 xl:hover:translate-y-1"
                  to={to}
                  target="_blank"
                >
                  <img src={icon} width={32} height={32} alt="" loading="lazy" />
                  <span className="sr-only">{name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Container>
  </section>
);

export default Subscribe;
