import PropTypes from 'prop-types';

import Container from 'components/shared/container/container';
import SelfFundedIcon from 'icons/startups/self-funded.inline.svg';
import VentureBackedIcon from 'icons/startups/venture-backed.inline.svg';
import { cn } from 'utils/cn';

const CARDS = [
  {
    icon: SelfFundedIcon,
    title: 'Self-Funded',
    description:
      'Building on your own? No investors, no problem. If you’re a founder shipping fast, you qualify.',
    apply: [
      'Early-stage, self-funded startup.',
      'Building an MVP or early product.',
      'Less than $5M raised in total funding.',
    ],
    perks: [
      'Up to $100K in Neon credits.',
      'Onboarding support from Neon engineers.',
      'Early access to new Neon features.',
    ],
  },
  {
    icon: VentureBackedIcon,
    title: 'Venture-Backed',
    description:
      'Backed by a VC or accelerator? If you’re part of a recognized accelerator or have investor backing, start here.',
    apply: [
      'Part of a recognized accelerator or incubator (e.g. YC, a16z).',
      'Building an early-stage product or MVP.',
      'Less than $5M raised in total funding.',
    ],
    perks: [
      'Up to $100K in Neon credits.',
      'Onboarding support from Neon engineers.',
      'Early access to new Neon features.',
      'Co-marketing opportunities and visibility with Neon.',
    ],
  },
];

const BulletList = ({ label, items }) => (
  <div className="flex flex-col gap-6">
    <span className="font-mono text-[15px] leading-none font-medium tracking-wide text-gray-new-70 uppercase">
      {label}
    </span>
    <ul className="flex flex-col gap-4.5">
      {items.map((item, index) => (
        <li className="flex items-start gap-3" key={index}>
          <span className="mt-[8px] ml-[2px] size-2 shrink-0 bg-green-52" aria-hidden />
          <span className="text-lg leading-snug tracking-extra-tight">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

BulletList.propTypes = {
  label: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const Info = () => (
  <section className="info mt-53 xl:mt-[184px] lg:mt-36 md:mt-24">
    <Container className="flex flex-col gap-12 lg:gap-10 md:gap-8" size="1280">
      <h2 className="text-5xl leading-dense text-white xl:text-[44px] lg:text-[40px] md:text-[32px]">
        Who’s the Neon
        <br />
        Startups Program for?
      </h2>
      <div className="grid grid-cols-2 grid-rows-[auto_1fr] border border-gray-new-20 sm:flex sm:flex-col">
        {CARDS.map(({ icon: Icon, title, description, apply, perks }, index) => (
          <div
            className={cn(
              'row-span-2 grid grid-rows-subgrid sm:flex sm:flex-col',
              index > 0 && 'border-l border-gray-new-20 sm:border-t sm:border-l-0'
            )}
            key={index}
          >
            <div className="flex flex-col gap-7 bg-gray-new-8 px-9 pt-8 pb-9 lg:px-7 lg:pt-7 lg:pb-8 md:px-6 md:pt-6 md:pb-7">
              <Icon className="size-14 shrink-0 text-white" aria-hidden />
              <div className="flex flex-col gap-4">
                <h3 className="text-[32px] leading-tight tracking-tighter xl:text-[28px] md:text-2xl">
                  {title}
                </h3>
                <p className="text-lg leading-snug tracking-extra-tight text-gray-new-70">
                  {description}
                </p>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-y-13 border-t border-gray-new-20 px-9 pt-9 pb-10 lg:gap-10 lg:px-7 lg:pt-7 lg:pb-8 md:px-6 md:pt-6 md:pb-7">
              <BulletList label="Who can apply?" items={apply} />
              <BulletList label="What you get:" items={perks} />
            </div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

export default Info;
