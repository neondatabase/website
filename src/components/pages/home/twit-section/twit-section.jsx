import { Link } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import Arrow from './images/arrow.inline.svg';
import TwitterIcon from './images/twitter.inline.svg';

const HEADER = 'What our users are saying. ';

const items = [
  {
    photo: (
      <StaticImage
        className="rounded-full"
        src="./images/gunnar-morling.jpg"
        alt="Gunnar Morling"
      />
    ),
    name: 'Gunnar Morling',
    twitterAccount: 'gunnarmorling',
    twitterUrl:
      'https://twitter.com/gunnarmorling/status/1537323844070932480?s=20&t=K4nY3t3BfN1WrPOcunSKFw',
    text: (
      <p>
        {' '}
        Neon is definitely one of the most exciting developments around{' '}
        <Link
          className="border-b-2 border-b-primary-2 font-semibold"
          to="https://twitter.com/hashtag/Postgres?src=hashtag_click"
        >
          #Postgres
        </Link>{' '}
        lately. The separation of storage and compute is definitely interesting, would love to see
        some latency numbers there. Also how "Pageservers" and "Safekeepers" are kept in sync.
      </p>
    ),
  },
  {
    photo: (
      <StaticImage
        className="rounded-full"
        src="./images/guillermo-rauch.jpg"
        alt="Guillermo Rauch"
      />
    ),
    name: 'Guillermo Rauch',
    twitterAccount: 'rauchg',
    twitterUrl:
      'https://twitter.com/rauchg/status/1537075535230009344?s=20&t=K4nY3t3BfN1WrPOcunSKFw',
    text: (
      <p>
        With{' '}
        <Link
          className="border-b-2 border-b-primary-2 font-semibold"
          to="https://twitter.com/neondatabase"
        >
          @Neondatabase
        </Link>
        , *truly* serverless PostgreSQL is finally here.You can spin up a db and connect to it in
        less than 3 seconds.This changes the game.
      </p>
    ),
  },
  {
    photo: (
      <StaticImage
        className="rounded-full"
        src="./images/marie-braswell.jpg"
        alt="'Leigh Marie' Braswell"
      />
    ),
    name: "'Leigh Marie' Braswell",
    twitterAccount: 'LM_Braswell',
    twitterUrl:
      'https://twitter.com/LM_Braswell/status/1537063982766374912?s=20&t=K4nY3t3BfN1WrPOcunSKFw',
    text: (
      <p>
        {' '}
        <Link
          className="border-b-2 border-b-primary-2 font-semibold"
          to="https://twitter.com/foundersfund"
        >
          @foundersfund
        </Link>{' '}
        is so excited to partner with{' '}
        <Link
          className="border-b-2 border-b-primary-2 font-semibold"
          to="https://twitter.com/neondatabase"
        >
          @neondatabase
        </Link>{' '}
        who is launching today{' '}
        <Link
          className="border-b-2 border-b-primary-2 font-semibold"
          to="https://twitter.com/hashtag/neonlaunch?src=hashtag_click"
        >
          #neonlaunch!!
        </Link>{' '}
        They offer modern, cloud-native architecture for{' '}
        <Link
          className="border-b-2 border-b-primary-2 font-semibold"
          to="https://twitter.com/hashtag/serverless?src=hashtag_click"
        >
          #serverless
        </Link>{' '}
        Postgres, separating storage & compute.
      </p>
    ),
  },
  {
    photo: <StaticImage className="rounded-full" src="./images/iavins.jpg" alt="v" />,
    name: 'v',
    twitterAccount: 'iavins',
    twitterUrl:
      'https://twitter.com/iavins/status/1530515401578119168?s=20&t=K4nY3t3BfN1WrPOcunSKFw',
    text: (
      <p>
        Neon DB{' '}
        <Link
          className="border-b-2 border-b-primary-2 font-semibold"
          to="https://twitter.com/neondatabase"
        >
          @Neondatabase
        </Link>{' '}
        is really exciting! Serverless Postgres with separated storage and compute for autoscaling
        (this is huge!), branching, Point in Time Reset, and time travel queries They have built an
        open source storage engine to make storage, backups, and archiving easier
      </p>
    ),
  },
  {
    photo: (
      <StaticImage
        className="rounded-full"
        src="./images/tobias-petry.jpg"
        alt="Tobias_Petry.sql"
      />
    ),
    name: 'Tobias_Petry.sql',
    twitterAccount: 'tobias_petry',
    twitterUrl:
      'https://twitter.com/tobias_petry/status/1530442483364159488?s=20&t=K4nY3t3BfN1WrPOcunSKFw',
    text: (
      <p>
        An *open-source* serverless PostgreSQL database is currently being built. The first one to
        my knowledge. 🥳 The CEO is one of the founders of{' '}
        <Link
          className="border-b-2 border-b-primary-2 font-semibold"
          to="https://twitter.com/SingleStoreDB"
        >
          @SingleStoreDB
        </Link>
        , so they really know what they do! I have big hopes for this project to succeed.
      </p>
    ),
  },
  {
    photo: (
      <StaticImage
        className="rounded-full"
        src="./images/johan-eliasson.jpg"
        alt="Johan Eliasson"
      />
    ),
    name: 'Johan Eliasson',
    twitterAccount: 'elitasson',
    twitterUrl:
      'https://twitter.com/elitasson/status/1541011704687087616?s=20&t=mH7iKzLsIzsCYljQ7e7v9Q',
    text: (
      <p>
        Ok, I just tried{' '}
        <Link
          className="border-b-2 border-b-primary-2 font-semibold"
          to="https://twitter.com/neondatabase"
        >
          @neondatabase
        </Link>{' '}
        with{' '}
        <Link
          className="border-b-2 border-b-primary-2 font-semibold"
          to="https://twitter.com/nhost"
        >
          @nhost
        </Link>{' '}
        and{' '}
        <Link
          className="border-b-2 border-b-primary-2 font-semibold"
          to="https://twitter.com/HasuraHQ"
        >
          @HasuraHQ
        </Link>{' '}
        . Things just worked out of the box! Instant GraphQL API on a truly serverless Postgres
        database. The future is here!
      </p>
    ),
  },
];

const TwitSection = () => (
  <section
    id="Twitter wall"
    className="safe-paddings bg-white pt-40 3xl:pt-36 2xl:pt-32 xl:pt-28 lg:pt-20 md:pt-16"
  >
    <h2 className="text-center text-6xl font-bold lg:mx-auto lg:max-w-[460px]">
      {HEADER}
      <Link className="text-secondary-7" to="https://twitter.com/neondatabase/">
        Follow Us <Arrow className="inline" />
      </Link>
    </h2>
    <ul className="mx-auto mt-20 grid max-w-[1760px] grid-cols-3 gap-y-10 gap-x-10">
      {items.map(({ photo, name, twitterAccount, twitterUrl, text }, index) => (
        <li className="w-[560px] shrink-0 border-2 border-gray-4 p-6" key={index}>
          <div className="flex border-b border-b-gray-4 pb-6">
            <div className="w-16">{photo}</div>
            <div className="ml-5 w-full">
              <h4 className="font-sans text-xl font-semibold">{name}</h4>
              <div className="flex justify-between">
                <p className="font-sans text-xl font-normal">@{twitterAccount}</p>
                <Link className="my-auto" to={twitterUrl} target="_blank">
                  <TwitterIcon />
                </Link>
              </div>
            </div>
          </div>
          <p className="mt-5 font-sans text-xl leading-snug">{text}</p>
        </li>
      ))}
    </ul>
  </section>
);

export default TwitSection;
