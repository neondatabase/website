import Image from 'next/image';

import Container from 'components/shared/container';
import Link from 'components/shared/link/link';

import bunnyshell from './images/bunnyshell.svg';
import hasura from './images/hasura.svg';
import proposales from './images/proposales.svg';
import replit from './images/replit.svg';
import vercel from './images/vercel.svg';
import wundergraph from './images/wundergraph.svg';

const items = [
  {
    logo: vercel,
    width: 240,
    height: 52,
    title: 'Vercel',
    description:
      'Vercel and Neon unlock the first Serverless Postgres database for the Frontend Cloud.',
    url: '/',
  },
  {
    logo: hasura,
    width: 178,
    title: 'Hasura',
    description: 'Learn how to connect a Hasura Cloud project to a new or existing Neon database.',
    url: '/',
  },
  {
    logo: wundergraph,
    width: 234,
    title: 'WunderGraph',
    description:
      'Learn how to connect your Neon project to WunderGraph using our newly released integration.',
    url: '/',
  },
  {
    logo: bunnyshell,
    width: 240,
    title: 'Bunnyshell',
    description:
      'Learn how Bunnyshell, an Environments-as-a-Service platform, added support for Neon Postgres',
    url: '/',
  },
  {
    logo: replit,
    width: 228,
    title: 'Replit',
    description: "Learn how Replit added support for Postgres databases by leveraging Neon's API.",
    url: '/',
  },
  {
    logo: proposales,
    width: 234,
    title: 'Proposales',
    description: 'How Proposales integrated Neon in their Postgres development workflow.',
    url: '/',
  },
];

const Hero = () => (
  <section className="hero safe-paddings pt-36">
    <Container className="flex flex-col items-center" size="medium">
      <h1 className="text-center text-[72px] font-medium leading-none tracking-extra-tight 2xl:text-6xl xl:text-[56px] lg:text-[44px]">
        Explore <span className="text-green-45">success stories</span>
      </h1>
      <p className="mx-auto mt-5 max-w-[664px] text-center text-xl font-light leading-snug">
        Discover the diverse and captivating stories of our valued partners, each a testament to
        unique experiences and successes.
      </p>
      <ul className="mt-20 grid grid-cols-3 gap-8">
        {items.map((item, index) => (
          <li className="overflow-hidden rounded-xl" key={index}>
            <article className="relative flex h-full flex-col rounded-xl border-2 border-white border-opacity-[0.02]">
              <span className="absolute left-[-103px] top-[-103px] h-[206px] w-[206px] rounded-full bg-white blur-[130px]" />
              <span className="absolute bottom-[-75px] right-[-79px] h-[158px] w-[158px] rounded-full bg-white blur-[200px]" />
              <div className="relative z-10 flex h-full flex-col rounded-xl bg-[radial-gradient(162.08%_141.42%_at_0%_0%,rgba(48,50,54,0.50)0%,rgba(48,50,54,0.00)48.97%),linear-gradient(165deg,#1A1C1E_6.13%,#111213_75.96%)] px-8 pb-10 pt-9">
                <Image src={item.logo} alt={item.title} width={item.width} height={52} />
                <p className="mb-4 mt-12 text-xl font-light leading-snug text-gray-new-60">
                  <span className="text-white">{item.title}</span>. {item.description}
                </p>
                <Link
                  className="mt-auto inline-flex items-center text-[15px] leading-none tracking-extra-tight"
                  to={item.url}
                  theme="green"
                  withArrow
                >
                  Read case study
                </Link>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default Hero;
