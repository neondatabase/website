import clsx from 'clsx';

import Button from 'components/shared/button';
import Container from 'components/shared/container/container';
import GradientBorder from 'components/shared/gradient-border/index';

const CARDS = [
  {
    title: 'Who can apply?',
    description:
      'Venture-backed startups with at least $1M in funding that have launched in the past 12 months.',
    features: [
      'You’ve raised less than $5M in total funding.',
      'You’re building an early-stage product or MVP.',
    ],
    className: 'bg-startups-info-card-1',
  },
  {
    title: 'What do you get?',
    description:
      'Credits, expert support, and visibility to help your startup grow faster with Neon.',
    features: [
      'Up to $100K in Neon credits to grow your usage over time.',
      'Support from Neon engineers during onboarding and beyond.',
      'Early product access and co-marketing opportunities with Neon.',
    ],
    className: 'bg-startups-info-card-2',
  },
  {
    title: 'How to apply?',
    description:
      'Just fill out a short form. We review applications on a rolling basis and typically respond within a few business days.',
    button: {
      text: 'Apply now',
      href: '#contact-form',
    },
    isWide: true,
    className: 'bg-startups-info-card-3',
  },
];

const Info = () => (
  <section className="info mt-[200px] xl:mt-[184px] lg:mt-36 md:mt-24">
    <Container className="flex max-w-[896px] flex-col items-center gap-12 px-8 md:px-5">
      <h2 className="text-center font-title text-5xl font-medium leading-none tracking-extra-tight xl:text-[44px] lg:text-[36px] md:text-[32px]">
        Who’s the Neon
        <br />
        Startup Program for?
      </h2>
      <ul className="grid grid-cols-2 gap-5 lg:gap-6 md:gap-5 sm:grid-cols-1">
        {CARDS.map(({ title, description, features, button, isWide, className }, index) => (
          <li
            className={clsx(
              'relative rounded-xl bg-black-fog px-6 py-7 lg:p-6 md:p-5',
              isWide && 'col-span-full flex items-center justify-between gap-5 sm:flex-col',
              className
            )}
            key={index}
          >
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-2xl font-medium leading-none tracking-tighter">{title}</h3>
                <p className="mt-2.5 max-w-[464px] tracking-extra-tight text-gray-new-50">
                  {description}
                </p>
              </div>
              {features && (
                <>
                  <span className="h-px w-full bg-white mix-blend-overlay" />
                  <ul className="space-y-4">
                    {features.map((feature, index) => (
                      <li className="flex gap-2.5" key={index}>
                        <span className="check-new-icon mt-1 size-4 shrink-0 bg-green-45" />
                        <span className="text-lg font-medium leading-snug tracking-extra-tight">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            {button && (
              <Button className="px-7 py-3 sm:w-full" theme="primary" to={button.href}>
                {button.text}
              </Button>
            )}
            <GradientBorder withBlend />
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default Info;
