import clsx from 'clsx';
import Image from 'next/image';

import Button from 'components/shared/button';
import Container from 'components/shared/container/container';
import GradientBorder from 'components/shared/gradient-border';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import checkIcon from 'icons/serverless-apps/check.svg';

const features = [
  'CPU, memory, and storage scale automatically with your workload.',
  'Usage-based pricing eliminates overprovisioning.',
  'Supports up to 10,000 connections via its built-in connection pooler.',
  'It’s 100% Postgres, without the server management.',
];

const Hero = () => (
  <section className="hero safe-paddings pt-[90px] lg:pt-12 md:pt-9">
    <Container className="flex flex-col items-center" size="960">
      <h1 className="mx-auto text-center font-title text-[68px] font-medium leading-none tracking-extra-tight xl:text-[56px] xl:leading-[0.9] lg:text-5xl md:px-5 md:text-4xl">
        Postgres for serverless apps
      </h1>
      <p className="mt-4 text-center text-lg font-light leading-snug tracking-tighter text-gray-new-80 xl:font-normal xl:tracking-extra-tight lg:mt-[14px] lg:text-base md:mt-3">
        With thousands of connections, real-time autoscaling, and usage-based pricing
      </p>
      <div
        className={clsx(
          'relative mt-16 w-full overflow-hidden rounded-lg bg-[#0D0E10] pb-7 pl-8 pr-10 pt-6',
          'xl:mt-14 lg:mt-12 lg:px-7 lg:py-6 md:mt-10 md:p-6'
        )}
      >
        <div className="relative z-10 flex w-full gap-5 lg:gap-0 md:flex-col md:gap-8">
          <div className="flex-1">
            <h2 className="text-balance text-2xl font-medium leading-snug tracking-tighter">
              Why use Neon for serverless architectures:
            </h2>
            <ul className="lg:gap-x-4s mt-[18px] grid grid-cols-2 gap-x-10 gap-y-[18px] lg:gap-x-4 sm:grid-cols-1">
              {features.map((feature, index) => (
                <li className="flex items-start gap-1.5" key={index}>
                  <Image
                    className="mt-1 shrink-0"
                    src={checkIcon}
                    width={16}
                    height={16}
                    alt=""
                    priority
                  />
                  <p className="tracking-extra-tight text-gray-new-90 lg:text-[15px] md:text-base">
                    {feature}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative w-[270px] pl-11 lg:w-[254px] lg:pl-7 md:w-full md:border-t md:border-dashed md:border-white/10 md:pl-0 md:pt-8">
            <h3 className="text-balance text-xl font-medium leading-snug tracking-tighter md:text-2xl">
              Sign up to get the Free Plan, plus $100 in credits
            </h3>
            <p className="mt-2 text-pretty font-light leading-snug tracking-extra-tight text-gray-new-70 xl:font-normal">
              ...or{' '}
              <Link
                className="border-b border-gray-new-70/40 font-normal transition-colors duration-200 hover:border-white"
                to={LINKS.contactSales}
              >
                talk to our team
              </Link>{' '}
              if you have any questions.
            </p>
            <Button
              className="mt-5 h-11 w-full font-semibold tracking-tighter"
              theme="primary"
              to={LINKS.signup}
            >
              Sign up
            </Button>
          </div>
        </div>
        <span className="pointer-events-none absolute -top-3 right-0 h-[273px] w-[230px] -translate-y-full translate-x-1/2 rounded-[100%] bg-[#CF9FFF] opacity-50 mix-blend-plus-lighter blur-2xl" />
        <span className="pointer-events-none absolute -right-5 -top-6 h-[224px] w-[403px] -translate-y-full rounded-[100%] bg-[#00E5BF] opacity-80 mix-blend-plus-lighter blur-2xl" />
        <span className="pointer-events-none absolute -right-[110px] top-32 h-[451px] w-[348px] -translate-y-full rotate-[109deg] rounded-[100%] bg-gradient-to-b from-[#00E5BF] to-transparent opacity-30 blur-3xl" />
        <span className="pointer-events-none absolute bottom-6 right-[310px] top-5 border-l border-dashed border-white mix-blend-overlay lg:inset-y-6 lg:right-[282px] md:hidden" />
        <GradientBorder className="border-image-serverless-apps-hero-border" />
      </div>
    </Container>
  </section>
);

export default Hero;
