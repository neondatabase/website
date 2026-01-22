import Image from 'next/image';

import Container from 'components/shared/container/container';
import branching from 'icons/startups/features/branching.svg';
import code from 'icons/startups/features/code.svg';
import database from 'icons/startups/features/database.svg';
import lightning from 'icons/startups/features/lightning.svg';

const FEATURES = [
  {
    icon: lightning,
    title: 'No Server Management',
    description:
      'CPU, memory, connections, and storage scale automatically. No manual resizes, no overprovisioning.',
  },
  {
    icon: database,
    title: 'Scale-to-Zero',
    description:
      'Pay nothing when your DB isn’t in use. Perfect for previews, CI/CD pipelines, and lightweight setups.',
  },
  {
    icon: branching,
    title: 'Branching for Dev/Test',
    description:
      'Pay nothing when your DB isn’t in use. Perfect for previews, CI/CD pipelines, and lightweight setups.',
  },
  {
    icon: code,
    title: '100% Postgres',
    description:
      'Use the drivers, extensions, and tools you already know and trust. No rewrites or migrations required.',
  },
];

const Features = () => (
  <section className="features mb-60 mt-[200px] xl:mb-[200px] xl:mt-[184px] lg:mb-40 lg:mt-36 md:mb-32 md:mt-24">
    <Container className="flex flex-col items-center gap-14 lg:gap-12 md:gap-10" size="1280">
      <h2 className="text-center font-title text-[52px] font-medium leading-none tracking-extra-tight xl:max-w-[540px] xl:text-5xl lg:text-[40px] md:text-[32px]">
        Serverless Postgres, built for&nbsp;developers
      </h2>
      <ul className="grid grid-cols-4 gap-12 xl:grid-cols-2 sm:grid-cols-1">
        {FEATURES.map(({ icon, title, description }, index) => (
          <li className="max-w-[300px] md:max-w-xs" key={index}>
            <Image
              className="mb-2.5"
              src={icon}
              alt={title}
              width={22}
              height={22}
              loading="lazy"
            />
            <h3 className="text-xl font-medium leading-snug tracking-extra-tight">{title}</h3>
            <p className="mt-2 leading-snug tracking-extra-tight text-gray-new-70">{description}</p>
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default Features;
