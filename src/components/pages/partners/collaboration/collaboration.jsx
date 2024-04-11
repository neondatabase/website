import clsx from 'clsx';
import Image from 'next/image';

import Container from 'components/shared/container';
import GradientCard from 'components/shared/gradient-card';
import GradientLabel from 'components/shared/gradient-label';
import Link from 'components/shared/link/link';
import LINKS from 'constants/links';

import koyeb from './images/koyeb.svg';
import replit from './images/replit.svg';
import vercel from './images/vercel.svg';
import Label from './label';

const partners = [
  {
    logo: { icon: vercel, alt: 'Vercel', width: 122, height: 32 },
    label: 'Front-end platforms',
    labelColor: 'yellow',
    description: `Vercel and Neon unlock the first Serverless Postgres database for the Frontend Cloud.`,
    slug: 'neon-postgres-on-vercel',
  },
  {
    logo: { icon: replit, alt: 'Replit', width: 140, height: 32 },
    label: 'Other platforms',
    labelColor: 'pink',
    description: 'Replit added support for Postgres databases by leveraging Neon’s API.',
    slug: 'neon-replit-integration',
  },
  {
    logo: { icon: koyeb, alt: 'Koyeb', width: 123, height: 32 },
    label: 'Backend-as-a-service',
    labelColor: 'blue',
    description: `Gives their users scalable, fully managed serverless Postgres databases via Neon.`,
    slug: '',
  },
];

const Collaboration = () => (
  <section className="collaboration safe-paddings mt-[200px] 2xl:mt-40 xl:mt-36 lg:mt-28 md:mt-20">
    <Container className="grid-gap-x grid grid-cols-12" size="medium">
      <div className="col-span-10 col-start-2 flex flex-col items-center xl:col-span-full xl:col-start-1">
        <GradientLabel>Partners</GradientLabel>
        <h2 className="mt-4 text-center font-title text-[48px] font-medium leading-none tracking-extra-tight lg:text-4xl sm:text-[36px]">
          Featured partners
        </h2>
        <p className="mt-3 text-center text-lg font-light leading-snug sm:text-base">
          Explore our valued collaborations and diverse partnerships.
        </p>

        {/* cards */}
        <ul className="mt-12 grid grid-cols-3 gap-8 lg:grid-cols-2 md:gap-6 sm:grid-cols-1">
          {partners.map(({ logo, label, labelColor, description, slug }, index) => (
            <li key={index}>
              <GradientCard
                className="p-8 pb-7"
                as={slug ? Link : 'div'}
                to={slug ? `${LINKS.blog}/${slug}` : null}
                key={index}
              >
                {/* badge "coming soon" */}
                {!slug && (
                  <div
                    className={clsx(
                      'text-[10px] font-semibold leading-none -tracking-extra-tight text-gray-new-90',
                      'absolute -right-4 -top-4 w-fit rounded-3xl bg-[rgba(228,229,231,0.12)] px-2.5 py-[5px]'
                    )}
                  >
                    COMING SOON
                  </div>
                )}

                <div className="flex flex-col">
                  <Image src={logo.icon} alt={logo.alt} width={logo.width} height={logo.height} />
                  <Label label={label} color={labelColor} />
                  <p className="mt-3 line-clamp-3 font-light leading-snug text-gray-new-60 text-gray-new-90">
                    {description}
                  </p>
                </div>
              </GradientCard>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  </section>
);

export default Collaboration;
