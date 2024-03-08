import Image from 'next/image';

import Container from 'components/shared/container';
import GradientCard from 'components/shared/gradient-card';
import GradientLabel from 'components/shared/gradient-label';
import Label from 'components/shared/label';

import koyeb from './images/koyeb.svg';
import replit from './images/replit.svg';
import vercel from './images/vercel.svg';

const partners = [
  {
    logo: { icon: vercel, alt: 'Vercel', width: 122, height: 32 },
    label: 'Front-end platforms',
    labelColor: 'yellow',
    description: `Vercel is the Frontend Cloud. Build, scale, and secure a faster, personalized web.`,
  },
  {
    logo: { icon: koyeb, alt: 'Koyeb', width: 123, height: 32 },
    label: 'Backend-as-a-service',
    labelColor: 'blue',
    description: 'Koyeb is a developer-friendly serverless platform to deploy apps globally.',
  },
  {
    logo: { icon: replit, alt: 'Replit', width: 140, height: 32 },
    label: 'Other platforms',
    labelColor: 'pink',
    description: 'Replit added support for Postgres databases by leveraging Neon’s API.',
  },
];

const Collaboration = () => (
  <section className="collaboration mb-[100px] mt-[192px]">
    <Container className="grid-gap-x grid grid-cols-12" size="medium">
      <div className="col-span-10 col-start-2 flex flex-col items-center xl:col-span-full xl:col-start-1">
        <GradientLabel>Partners</GradientLabel>
        <h2 className="mt-4 text-center text-[48px] font-medium leading-none tracking-extra-tight lg:text-4xl sm:text-[36px]">
          Featured partners
        </h2>
        <p className="mt-3 text-center text-lg font-light leading-snug sm:text-base">
          Explore our valued collaborations and diverse partnerships.
        </p>

        {/* cards */}
        <ul className="mt-12 grid grid-cols-3 gap-8 lg:grid-cols-2 md:gap-6 sm:grid-cols-1">
          {partners.map(({ logo, label, labelColor, description }, index) => (
            <li key={index}>
              <GradientCard className="p-8 pb-7">
                <div className="flex flex-col">
                  <Image src={logo.icon} alt={logo.alt} width={logo.width} height={logo.height} />
                  <Label label={label} color={labelColor} />
                  <p className="mt-3 line-clamp-3 font-light leading-snug text-gray-new-60">
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
