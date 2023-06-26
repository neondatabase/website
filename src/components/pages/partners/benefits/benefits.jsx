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
  <section className="benefits safe-paddings mt-40">
    <Container className="grid-gap-x grid grid-cols-12" size="lg">
      <div className="grid-gap-x col-span-10 col-start-2 grid grid-cols-10 rounded-[10px] bg-gray-new-8 px-14 pb-14 pt-[50px]">
        <div className="col-span-4 col-start-1">
          <span className="inline-block rounded-[40px] bg-green-45/10 px-3.5 py-2 text-xs font-semibold uppercase leading-none text-green-45">
            Benefits
          </span>
          <h2 className="mt-2 max-w-[322px] text-[56px] font-medium leading-none tracking-tighter">
            Why become a partner?
          </h2>
          <p className="mt-5 max-w-[362px] text-lg font-light leading-snug">
            At Neon, we love our partners and believe that partners are vital to our mission to make
            Serverless Postgress in the Cloud easy to integrate, manage, and grow.
          </p>
        </div>
        <ul className="col-start-5 col-end-11 grid max-w-[640px] grid-cols-2 gap-x-14 gap-y-12 pl-5">
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
                <h3 className="text-[22px] font-medium leading-tight tracking-[-0.02em]">
                  {title}
                </h3>
                <p className="mt-2 font-light leading-snug text-gray-new-70">{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  </section>
);

export default Benefits;
