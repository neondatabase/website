import Container from 'components/shared/container/container';

import currencyIcon from './images/currency.svg';
import priorityLowIcon from './images/priority-low.svg';
import screenIcon from './images/screen.svg';
import userIcon from './images/user.svg';

const items = [
  {
    icon: currencyIcon,
    title: 'Bring in new revenue',
    description:
      'Get paid for providing your clients with the best solutions based on their needs.',
  },
  {
    icon: priorityLowIcon,
    title: 'Reduce costs',
    description:
      'Get Serverless Postgres at your demand without the costs of managing it yourself.',
  },
  {
    icon: userIcon,
    title: 'Meet customer demand',
    description: 'Supply your customers with Serverless Postgres in the Cloud.',
  },
  {
    icon: screenIcon,
    title: 'Scale easily',
    description: 'Grow your user base without friction and effortlessly add new solutions.',
  },
];

const Benefits = () => (
  <section className="benefits safe-paddings mt-40 xl:mt-[120px]">
    <Container className="grid-gap-x grid grid-cols-12" size="lg">
      <div className="grid-gap-x col-span-10 col-start-2 grid grid-cols-10 gap-y-2 rounded-[10px] bg-gray-new-8 p-14 xl:col-span-full xl:col-start-1 xl:px-8 xl:py-10">
        <div className="col-span-full">
          <span className="inline-block rounded-[40px] bg-green-45/10 px-3.5 py-2 text-xs font-semibold uppercase leading-none text-green-45">
            Benefits
          </span>
        </div>
        <div className="col-span-4 col-start-1 xl:max-w-[300px]">
          <h2 className="max-w-[322px] text-[56px] font-medium leading-none tracking-tighter xl:max-w-[270px] xl:text-[44px]">
            Why become a partner?
          </h2>
          <p className="mt-5 max-w-[362px] text-lg font-light leading-snug xl:text-base">
            At Neon, we love our partners and believe that partners are vital to our mission to make
            Serverless Postgress in the Cloud easy to integrate, manage, and grow.
          </p>
        </div>
        <ul className="col-start-5 col-end-11 mt-2 grid max-w-[640px] grid-cols-2 gap-x-16 gap-y-12 pl-2.5 xl:-ml-5 xl:mt-0 xl:gap-x-4 xl:gap-y-10 xl:pl-0">
          {items.map(({ icon, title, description }, index) => (
            <li className="flex items-start gap-x-3.5" key={index}>
              <img
                className="mt-0.5 shrink-0"
                src={icon}
                alt=""
                loading="lazy"
                width={24}
                height={24}
                aria-hidden
              />
              <div className="flex flex-col">
                <h3 className="text-[22px] font-medium leading-tight tracking-[-0.02em] xl:text-xl">
                  {title}
                </h3>
                <p className="mt-2 font-light leading-snug text-gray-new-70 xl:mt-[11px]">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  </section>
);

export default Benefits;
