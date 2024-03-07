import clsx from 'clsx';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import GradientCard from 'components/shared/gradient-card';
import GradientLabel from 'components/shared/gradient-label';

import Koyeb from './images/koyeb.inline.svg';
import Shuttle from './images/shuttle.inline.svg';
import Vercel from './images/vercel.inline.svg';

const partners = [
  {
    logo: Vercel,
    label: 'Front-end platforms',
    isYellowLabel: true,
    description: `Vercel is the Frontend Cloud. Build, scale, and secure a faster, personalized web.`,
  },
  {
    logo: Koyeb,
    label: 'Backend-as-a-service',
    description: 'Koyeb is a developer-friendly serverless platform to deploy apps globally.',
  },
  {
    logo: Shuttle,
    label: 'Backend-as-a-service',
    description: 'Shuttle is a build & ship backend platform with no infrastructure files.',
  },
];

const Label = ({ text, isYellow }) => (
  <div
    className={clsx(
      'relative mt-14 w-fit rounded-full px-3 py-1.5 text-[13px] leading-none tracking-[0.02em]',
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
  <section className="collab mt-[192px]">
    <Container size="medium">
      <div className="flex flex-col items-center">
        <GradientLabel>Partners</GradientLabel>
        <h2
          className="mt-4 text-center text-[48px] font-medium leading-none tracking-extra-tight"
          // lg:text-4xl sm:text-[36px]
        >
          Featured partners
        </h2>
        <p className="mt-3 text-center text-lg font-light leading-snug sm:text-base">
          Explore our valued collaborations and diverse partnerships.
        </p>

        {/* cards */}
        <ul className="mt-12 flex max-w-[1220px] gap-x-8 md:gap-x-6">
          {partners.map(({ logo: Logo, label, isYellowLabel, description }, index) => (
            <li className="nw-full" key={index}>
              <GradientCard className="p-8 pb-7">
                <div className="flex h-full flex-col">
                  <Logo />
                  <Label text={label} isYellow={isYellowLabel} />
                  <p className="mt-3 line-clamp-3 font-light leading-snug text-gray-new-60">
                    {/* xl:mt-10 lg:mt-8 md:mt-6 */}
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
