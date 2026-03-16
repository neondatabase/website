import Image from 'next/image';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';
import SubscriptionForm from 'components/shared/subscription-form';
import { HUBSPOT_NEWSLETTERS_FORM_ID } from 'constants/forms';
import LINKS from 'constants/links';
import linkedinIcon from 'icons/linkedin.svg';
import xIcon from 'icons/x.svg';

import discordIcon from './images/subscribe-discord.svg';
import gitHubIcon from './images/subscribe-github.svg';
import illustration from './images/subscribe-illustration.jpg';

const links = [
  {
    icon: xIcon,
    to: LINKS.twitter,
    name: 'X',
  },
  {
    icon: linkedinIcon,
    to: LINKS.linkedin,
    name: 'LinkedIn',
  },
  {
    icon: discordIcon,
    to: LINKS.discord,
    name: 'Discord',
  },
  {
    icon: gitHubIcon,
    to: LINKS.github,
    name: 'GitHub',
  },
];

const Subscribe = () => (
  <section className="my-44 safe-paddings md:my-20 lg:my-24 xl:my-32 2xl:my-40" id="subscribe">
    <Container className="grid grid-cols-12 items-center grid-gap-x lg:block" size="medium">
      <Image
        className="col-span-5 lg:hidden!"
        src={illustration}
        alt=""
        loading="lazy"
        aria-hidden
      />

      <div className="col-span-6 col-start-7 ml-1.5 lg:ml-0">
        <Heading className="lg:text-center" tag="h2" size="md" theme="black">
          Subscribe to our&nbsp;Newsletter
        </Heading>

        <SubscriptionForm
          className="mt-12 xl:mt-7 2xl:mt-8"
          formId={HUBSPOT_NEWSLETTERS_FORM_ID}
          localStorageKey="submittedEmailNewsletterForm"
        />

        <div className="mt-[94px] flex items-center space-x-[38px] lg:mt-12 lg:flex-col lg:space-x-0 xl:mt-16 xl:space-x-7 2xl:mt-[74px] 2xl:space-x-8">
          <span className="t-3xl leading-none! font-bold">Join us:</span>
          <ul className="flex space-x-[26px] lg:mt-3.5 xl:space-x-[18px] 2xl:space-x-5">
            {links.map(({ icon, to, name }, index) => (
              <li className="relative" key={index}>
                <span
                  className="absolute -bottom-1.5 -left-1.5 h-full w-full rounded-full bg-secondary-5 xl:-bottom-1 xl:-left-1"
                  aria-hidden
                />
                <Link
                  className="relative flex h-[72px] w-[72px] items-center justify-center rounded-full border-4 border-black bg-white transition-transform duration-200 hover:-translate-x-1.5 hover:translate-y-1.5 xl:h-14 xl:w-14 xl:hover:-translate-x-1 xl:hover:translate-y-1 2xl:h-16 2xl:w-16"
                  to={to}
                  target="_blank"
                  rel="noopener noreferrer"
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
