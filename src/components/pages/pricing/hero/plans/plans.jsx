import clsx from 'clsx';

import Button from 'components/shared/button';
import Link from 'components/shared/link';

import plans from './data/plans';
import Features from './features';

const Plans = () => (
  <div className="relative mt-16 w-full xl:mt-14 lg:mt-12 md:mx-0 md:mt-11 md:w-full">
    <h2 className="sr-only">Neon pricing plans</h2>
    <ul className="grid-gap relative z-10 grid grid-cols-3 gap-x-[18px] lg:grid-cols-2 md:grid-cols-1">
      {plans.map(
        (
          {
            type,
            title,
            subtitle,
            highlighted = false,
            price,
            priceFrom = false,
            description,
            features,
            otherFeatures,
            button,
          },
          index
        ) => (
          <li
            className={clsx(
              'group relative flex min-h-full flex-col border',
              highlighted ? 'border-[#2f8968]' : 'border-gray-new-30'
            )}
            key={index}
          >
            <div className="p-5">
              <h3
                className={clsx(
                  'font-mono text-sm font-medium uppercase leading-none',
                  highlighted ? 'text-green-52' : 'text-gray-new-60'
                )}
              >
                {type}
              </h3>
              <div className="mt-[46px] flex flex-col gap-0.5">
                <h4 className="whitespace-nowrap text-2xl font-normal leading-snug tracking-extra-tight">
                  {title}
                </h4>
                {subtitle ? (
                  <p className="text-lg leading-snug tracking-extra-tight text-gray-new-50">
                    {subtitle}
                  </p>
                ) : (
                  <p className="text-lg leading-snug tracking-extra-tight text-gray-new-50">
                    ${price}/month{` ${priceFrom ? 'minimum' : ''}`}
                  </p>
                )}
              </div>

              <Button
                className="mt-5 w-full"
                theme={highlighted ? 'white-filled' : 'outlined'}
                to={button.url}
                size="new"
                tagName={button.event}
              >
                Get started
              </Button>
              <p className="mt-5 text-base leading-snug tracking-extra-tight text-gray-new-70">
                {Array.isArray(description)
                  ? description.map((part, i) =>
                      typeof part === 'string' ? (
                        part
                      ) : (
                        <Link key={i} to={part.href} onClick={part.onClick}>
                          {part.text}
                        </Link>
                      )
                    )
                  : description}
              </p>
            </div>
            <Features features={features} type={type} highlighted={highlighted} />
            {otherFeatures && (
              <Features
                title={otherFeatures.title}
                features={otherFeatures.features}
                type={type}
                highlighted={highlighted}
              />
            )}
          </li>
        )
      )}
    </ul>
  </div>
);

export default Plans;
