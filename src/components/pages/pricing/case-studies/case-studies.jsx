import clsx from 'clsx';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import GradientLabel from 'components/shared/gradient-label';
import Link from 'components/shared/link';
import LINKS from 'constants/links';

import branchIcon from './images/branch.svg';
import opusflowIcon from './images/opusflow.svg';
import proposalesIcon from './images/proposales.svg';
import vercelIcon from './images/vercel.svg';

const items = [
  {
    title: 'launch',
    description: 'Uses Neon to streamline dev, test and prod of their YC-backed SaaS startup.',
    icon: {
      src: proposalesIcon,
      alt: 'Proposales',
      width: 117,
      height: 27,
    },
  },
  {
    title: 'Scale',
    description:
      'Built Insurtech on Neon to focus on shipping product, not babysitting infrastructure',
    icon: {
      src: branchIcon,
      alt: 'Branch',
      width: 75,
      height: 27,
    },
  },
  {
    title: 'enterprise',
    description:
      'Vercel and Neon unlock the first Serverless Postgres database for the Frontend Cloud.',
    icon: {
      src: vercelIcon,
      alt: 'Vercel',
      width: 88,
      height: 27,
    },
  },
  {
    title: 'enterprise',
    description:
      '75% cost reduction by moving a fleet of databases powering multi-tenant SaaS to Neon.',
    icon: {
      src: opusflowIcon,
      alt: 'OpusFlow',
      width: 117,
      height: 23,
    },
  },
];

const CaseStudies = ({ className = null }) => (
  <section className={clsx('case-studies safe-paddings', className)}>
    <Container className="grid-gap-x grid grid-cols-12" size="medium">
      <div className="col-span-10 col-start-2 grid grid-cols-10 gap-x-10 rounded-2xl bg-gray-new-8 px-14 py-12 xl:col-span-full xl:col-start-1 xl:grid-cols-12 xl:items-center xl:gap-x-6 xl:p-8 lg:gap-x-4 lg:pb-10 lg:pt-9 md:py-8">
        <div className="col-span-4 col-start-1 flex flex-col items-start xl:max-w-[300px] xl:self-start xl:justify-self-start lg:col-span-full lg:max-w-none">
          <GradientLabel>Customers</GradientLabel>
          <h2 className="mt-3 max-w-[322px] text-[40px] font-medium leading-none tracking-[-0.02em] xl:max-w-[270px] xl:text-[44px] lg:max-w-none lg:text-4xl md:text-[32px]">
            Database velocity from MVP to IPO
          </h2>
          <p className="mt-4 max-w-[362px] text-lg font-light leading-snug xl:max-w-[280px] xl:text-base lg:max-w-[648px] md:mt-2.5 sm:max-w-none sm:pr-1.5">
            Businesses of all sizes leverage features like branching and autoscaling to increase dev
            velocity and gain a competitive advantage.{' '}
          </p>
          <Link
            className="mt-4 inline-block decoration-1 underline-offset-4 hover:!decoration-green-45/0 sm:mt-3"
            to={LINKS.caseStudies}
            theme="green-underlined"
          >
            Explore case studies
          </Link>
        </div>
        <ul className="col-start-5 col-end-11 grid max-w-[664px] grid-cols-2 gap-x-[104px] gap-y-9 pl-10 2xl:gap-x-10 xl:col-start-6 xl:col-end-13 xl:max-w-none xl:gap-x-4 xl:pl-0 lg:col-span-full lg:mt-10 lg:gap-10 md:mt-8 md:grid-cols-1 md:gap-y-7">
          {items.map(({ icon, title, description }, index) => (
            <li className="max-w-[255px] xl:max-w-none" key={index}>
              <div className="flex items-center gap-x-4">
                <img
                  className="mt-0.5 shrink-0"
                  src={icon.src}
                  width={icon.width}
                  height={icon.height}
                  alt={icon.alt}
                  loading="lazy"
                  aria-hidden
                />
                <h3 className="text-sm font-medium uppercase leading-none tracking-[0.02em] text-yellow-70">
                  {title}
                </h3>
              </div>
              <p className="mt-2 font-light leading-snug text-gray-new-70">{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  </section>
);

CaseStudies.propTypes = {
  className: PropTypes.string,
};

export default CaseStudies;
