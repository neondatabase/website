import clsx from 'clsx';
import Image from 'next/image';

import Container from 'components/shared/container';
import GradientBorder from 'components/shared/gradient-border/index';
import Link from 'components/shared/link';
import { LogosWall } from 'components/shared/logos';
import LINKS from 'constants/links';

import api from './images/api.jpg';
import autoscaling from './images/autoscaling.jpg';
import autosuspend from './images/autosuspend.jpg';
import instantDb from './images/instant-db.jpg';

const logos = ['create', 'replit', 'comigo', 'rubric', 'wordware', 'basehub'];

const ITEMS = [
  {
    title: 'Instant database provisioning.',
    description:
      'Neon enables the creation of new databases in under a second, allowing your users to start building right away.',
    image: instantDb,
  },
  {
    title: 'Cost efficiency.',
    description: 'Scale-to-zero minimizes costs for inactive databases, saving money.',
    image: autosuspend,
  },
  {
    title: 'Powerful API.',
    description: 'Neon&apos;sAPI endpoints suit both large database fleets and AI Agents.',
    image: api,
  },
  {
    title: 'Serverless scalability.',
    description:
      'Neon&apos;s architecture automatically adjusts resources based on demand, reducing manual load for developers and agents.',
    image: autoscaling,
  },
];

const Bento = () => (
  <section className="bento safe-paddings relative overflow-hidden pt-[200px]">
    <Container className="max-w-[832px]">
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <h2 className="font-title text-5xl font-medium leading-none tracking-extra-tight xl:text-[44px] lg:text-4xl md:text-[32px]">
          Build better AI Agents
        </h2>
        <p className="mt-3 text-lg leading-snug tracking-extra-tight text-gray-new-70">
          AI agents now create more Neon databases daily than humans —{' '}
          <span className="text-white">over&nbsp;12k every day</span>. Neon is built for this scale.
        </p>
        <Link
          className="mt-6 text-lg leading-none tracking-[-0.03em]"
          to={LINKS.bookMeeting}
          theme="white"
          withArrow
        >
          Schedule a call
        </Link>
      </div>
      <ul className="mt-14 flex flex-wrap gap-5">
        {ITEMS.map(({ title, description, image }, index) => (
          <li className={clsx('relative h-[384px]')} key={title}>
            <div className="absolute inset-x-0 bottom-0 z-10 p-6 pr-8 text-lg leading-snug tracking-extra-tight">
              <h3 className="inline font-medium text-white">{title}</h3>{' '}
              <p
                className="inline font-light text-gray-new-60"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>
            <div className="relative shrink-0 overflow-hidden rounded-[14px]">
              <Image
                className="relative"
                src={image}
                alt=""
                width={[0, 3].includes(index) ? 488 : 324}
                height={384}
                quality={100}
              />
              <GradientBorder withBlend />
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-24 flex items-center gap-10 md:flex-col md:gap-8">
        <p className="max-w-[184px] font-medium leading-snug tracking-extra-tight text-gray-new-70 md:text-sm">
          Trusted in production by&nbsp;thousands of teams.
        </p>
        <LogosWall logos={logos} size="sm" />
      </div>
    </Container>
  </section>
);

export default Bento;
