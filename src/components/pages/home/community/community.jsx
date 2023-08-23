import Image from 'next/image';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import discourseIcon from 'icons/discourse.svg';
import githubIcon from 'icons/github.svg';
import blueTwitterIcon from 'icons/twitter-blue.svg';
import twitterIcon from 'icons/twitter.svg';

import erikBernhardsson from './images/erik.jpg';
import guillermoRauch from './images/guillermo-rauch.jpg';
import gunnarMorling from './images/gunnar-morling.jpg';
import johanEliasson from './images/johan-eliasson.jpg';
import marieBraswell from './images/marie-braswell.jpg';
import tobiasPetry from './images/tobias-petry.jpg';

const HEADER = 'Join the community';

const links = [
  {
    icon: twitterIcon,
    to: LINKS.twitter,
    name: 'Twitter',
  },
  {
    icon: discourseIcon,
    to: LINKS.discourse,
    name: 'Discourse',
  },
  {
    icon: githubIcon,
    to: LINKS.github,
    name: 'GitHub',
  },
];

const items = [
  {
    photo: gunnarMorling,
    name: 'Gunnar Morling',
    twitterAccount: 'gunnarmorling',
    twitterUrl:
      'https://twitter.com/gunnarmorling/status/1537323844070932480?s=20&t=K4nY3t3BfN1WrPOcunSKFw',
    text: (
      <>
        Neon is definitely one of the most exciting developments around #Postgres lately. The
        separation of storage and compute is definitely interesting, would love to see some latency
        numbers there. Also how "Pageservers" and "Safekeepers" are kept in sync.
      </>
    ),
  },
  {
    photo: guillermoRauch,
    name: 'Guillermo Rauch',
    twitterAccount: 'rauchg',
    twitterUrl:
      'https://twitter.com/rauchg/status/1537075535230009344?s=20&t=K4nY3t3BfN1WrPOcunSKFw',
    text: (
      <>
        With @Neondatabase , *truly* serverless PostgreSQL is finally here. You can spin up a db and
        connect to it in less than 3 seconds. This changes the game.
      </>
    ),
  },
  {
    photo: marieBraswell,
    name: 'Leigh Marie Braswell',
    twitterAccount: 'LM_Braswell',
    twitterUrl:
      'https://twitter.com/LM_Braswell/status/1537063982766374912?s=20&t=K4nY3t3BfN1WrPOcunSKFw',
    text: (
      <>
        @foundersfund is so excited to partner with @neondatabase who is launching today
        #neonlaunch!! They offer modern, cloud-native architecture for #serverless Postgres,
        separating storage & compute.
      </>
    ),
  },
  {
    photo: erikBernhardsson,
    name: 'Erik Bernhardsson',
    twitterAccount: 'bernhardsson',
    twitterUrl:
      'https://twitter.com/bernhardsson/status/1537126461861240838?s=20&t=K4nY3t3BfN1WrPOcunSKFw',
    text: (
      <>
        100% Postgres compatibility and the ability to scale down to zero and cold start in less
        than 3s... sounds extremely cool
      </>
    ),
  },
  {
    photo: tobiasPetry,
    name: 'Tobias Petry',
    twitterAccount: 'tobias_petry',
    twitterUrl:
      'https://twitter.com/tobias_petry/status/1530442483364159488?s=20&t=K4nY3t3BfN1WrPOcunSKFw',
    text: (
      <>
        An *open-source* serverless PostgreSQL database is currently being built. The first one to
        my knowledge. 🥳 The CEO is one of the founders of @SingleStoreDB , so they really know what
        they do! I have big hopes for this project to succeed.
      </>
    ),
  },
  {
    photo: johanEliasson,
    name: 'Johan Eliasson',
    twitterAccount: 'elitasson',
    twitterUrl:
      'https://twitter.com/elitasson/status/1541011704687087616?s=20&t=mH7iKzLsIzsCYljQ7e7v9Q',
    text: (
      <>
        Ok, I just tried @neondatabase with @nhost and @HasuraHQ. Things just worked out of the box!
        Instant GraphQL API on a truly serverless Postgres database. The future is here!
      </>
    ),
  },
];

const Community = () => (
  <section className="safe-paddings bg-white pt-40 3xl:pt-36 2xl:pt-32 xl:pt-28 lg:pt-20 md:pt-16">
    <Container className="z-20" size="md">
      <Heading
        id="twit-section-title"
        className="text-center lg:mx-auto lg:max-w-[460px]"
        tag="h2"
        size="md"
        theme="black"
      >
        {HEADER}
      </Heading>
      <p className="t-xl mx-auto mt-5 text-center 2xl:mt-4 xl:mt-3.5">
        Learn what the experts love about Neon
      </p>
      <ul className="mt-8 flex justify-center space-x-5">
        {links.map(({ icon, to, name }, index) => (
          <li className="relative" key={index}>
            <span
              className="absolute -bottom-1 -left-1 h-full w-full rounded-full bg-secondary-5"
              aria-hidden
            />
            <Link
              className="relative flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-black bg-white transition-transform duration-200 hover:-translate-x-1 hover:translate-y-1"
              to={to}
              target="_blank"
            >
              <img src={icon} width={24} height={24} alt={name} loading="lazy" />
              <span className="sr-only">{name}</span>
            </Link>
          </li>
        ))}
      </ul>
      <ul className="mx-auto mt-20 grid grid-cols-3 gap-10 overflow-x-auto xl:grid-cols-2 lg:mt-12 lg:gap-8 md:gap-4 sm:-mx-4 sm:flex sm:snap-x sm:snap-mandatory sm:grid-cols-1 sm:px-4">
        {items.map(({ photo, name, twitterAccount, twitterUrl, text }, index) => (
          <li
            className="max-w-[560px] bg-gray-9 p-6 font-sans text-xl xl:p-5 xl:text-base md:p-4 sm:w-[300px] sm:flex-shrink-0 sm:snap-center"
            key={index}
          >
            <div className="flex border-b border-b-gray-6 pb-6 xl:pb-4">
              <div className="w-16 shrink-0">
                <Image className="rounded-full" src={photo} alt={name} width={64} height={64} />
              </div>
              <div className="ml-5 flex w-full flex-col justify-evenly">
                <h3 className="font-semibold leading-none">{name}</h3>
                <div className="flex justify-between">
                  <p className="font-normal leading-none">@{twitterAccount}</p>
                  <Link className="my-auto w-6" to={twitterUrl} target="_blank">
                    <img
                      src={blueTwitterIcon}
                      width={24}
                      height={24}
                      alt="Twitter"
                      loading="lazy"
                    />
                    <span className="sr-only">Twitter</span>
                  </Link>
                </div>
              </div>
            </div>
            <p className="mt-5 leading-snug xl:mt-3">{text}</p>
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default Community;
