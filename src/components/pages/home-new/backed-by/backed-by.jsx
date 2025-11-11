import clsx from 'clsx';
import Image from 'next/image';

import Container from 'components/shared/container';
import databaseIcon from 'icons/home-new/database.svg';
import databricksIcon from 'icons/home-new/databricks.svg';

import HeadingLabel from '../heading-label';

const ITEMS = [
  {
    icon: databaseIcon,
    title: '40,000+',
    description: 'Databases provisioned daily - built for scale and reliability.',
  },
  {
    icon: databricksIcon,
    title: 'Databricks',
    description: 'Neon has been part of Databricks Company since May 2025.',
  },
];

const BackedBy = () => (
  <section className="backed-by safe-paddings relative overflow-hidden bg-[#E4F1EB] pb-[168px] pt-40">
    <Container className="z-10 flex gap-16 px-0 xl:px-8" size="1344">
      <div className="flex-1 border-l border-gray-new-50 px-8">
        <HeadingLabel className="mb-5 md:mb-4" theme="black">
          Backed by giants
        </HeadingLabel>
        <h2
          className={clsx(
            'text-[44px] leading-dense tracking-tighter text-gray-new-40',
            'xl:text-[36px] lg:text-2xl md:text-xl',
            '[&>strong]:font-normal [&>strong]:text-black'
          )}
        >
          <strong>Backed by Giants. Trusted Postgres. Battle-tested scale.</strong> Neon was founded
          by Postgres committers, bringing decades of expertise.
        </h2>
        <ul className="mt-[216px] flex gap-x-[52px] xl:mt-[136px] md:mt-9">
          {ITEMS.map(({ icon, title, description }) => (
            <li className="w-64" key={title}>
              <Image className="mb-5" src={icon} alt={title} width={32} height={32} />
              <h3 className="text-4xl leading-dense tracking-tighter text-black">{title}</h3>
              <p className="mt-1.5 text-balance tracking-extra-tight text-gray-new-40">
                {description}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex w-[480px] flex-col justify-between border-l border-gray-new-50 px-8">
        <HeadingLabel className="md:mb-4" theme="black">
          Trusted by the best
        </HeadingLabel>
        <blockquote className="mt-auto font-mono text-xl leading-snug tracking-extra-tight text-black">
          Neon's serverless philosophy is{' '}
          <span className="-mx-1 bg-[#39A57D]/60 px-1">aligned with our vision:</span> no
          infrastructure to manage, no servers to provision, no database cluster to maintain.
          <cite className="mt-5 block text-base not-italic leading-normal text-gray-new-15">
            Edouard Bonlieu – Co-founder at Koyeb
          </cite>
        </blockquote>
      </div>
    </Container>
    <span
      className={clsx(
        'pointer-events-none absolute right-0 top-0 aspect-[1.4] w-[1360px] -translate-y-1/2 translate-x-1/3 -rotate-45 rounded-[100%] lg:hidden',
        'bg-[url("/images/pages/home-new/noise-light.png")] bg-[length:400px] [mask-image:radial-gradient(50%_50%_at_50%_50%,white_20%,transparent)]'
      )}
      aria-hidden
    />
  </section>
);

export default BackedBy;
