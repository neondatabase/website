import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import GradientCard from 'components/shared/gradient-card';
import GradientLabel from 'components/shared/gradient-label';

import koyeb from './images/koyeb.svg';
import shuttle from './images/shuttle.svg';
import vercel from './images/vercel.svg';

const partners = [
  {
    logo: { icon: vercel, alt: 'Vercel', width: 122, height: 32 },
    label: 'Front-end platforms',
    isYellowLabel: true,
    description: `Vercel is the Frontend Cloud. Build, scale, and secure a faster, personalized web.`,
  },
  {
    logo: { icon: koyeb, alt: 'Koyeb', width: 123, height: 32 },
    label: 'Backend-as-a-service',
    description: 'Koyeb is a developer-friendly serverless platform to deploy apps globally.',
  },
  {
    logo: { icon: shuttle, alt: 'Shuttle', width: 132, height: 32 },
    label: 'Backend-as-a-service',
    description: 'Shuttle is a build & ship backend platform with no infrastructure files.',
  },
];

const Label = ({ text, isYellow }) => (
  <div
    className={clsx(
      'relative mt-14 w-fit whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] leading-none tracking-[0.02em] lg:mt-6',
      isYellow ? 'text-yellow-70' : 'text-blue-80'
    )}
  >
    <div
      className={clsx(
        'absolute inset-0 rounded-[inherit]',
        isYellow
          ? 'border-image-[linear-gradient(124.33deg,rgba(240,240,117,0.24)_17.11%,rgba(240,240,117,0.12)_74.09%)]'
          : 'border-image-[linear-gradient(124.33deg,rgba(173,224,235,0.24)_17.11%,rgba(173,224,235,0.12)_74.09%)]'
      )}
    />
    {text}
  </div>
);

Label.propTypes = {
  text: PropTypes.string.isRequired,
  isYellow: PropTypes.bool,
};

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
          {partners.map(({ logo, label, isYellowLabel, description }, index) => (
            <li key={index}>
              <GradientCard className="p-8 pb-7">
                <div className="flex flex-col">
                  <Image src={logo.icon} alt={logo.alt} width={logo.width} height={logo.height} />
                  <Label text={label} isYellow={isYellowLabel} />
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
