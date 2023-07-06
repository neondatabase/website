import Container from 'components/shared/container/container';

import currencyIcon from './images/currency.svg';
import priorityLowIcon from './images/priority-low.svg';
import screenIcon from './images/screen.svg';
import userIcon from './images/user.svg';

const items = [
  {
    icon: currencyIcon,
    title: 'Bring in new revenue',
    description: "Earn revenue by tailoring solutions according to your client's requirements.",
  },
  {
    icon: priorityLowIcon,
    title: 'Reduce costs',
    description: 'Access Serverless Postgres on demand without the costs of managing it yourself.',
  },
  {
    icon: userIcon,
    title: 'Meet customer demand',
    description: 'Supply your customers with Serverless Postgres in the Cloud.',
  },
  {
    icon: screenIcon,
    title: 'Scale easily',
    description: 'Grow your user base without friction and easily integrate new solutions.',
  },
];

const Benefits = () => (
  <section className="benefits safe-paddings mt-[136px] xl:mt-[104px] lg:mt-20 md:mt-16">
    <Container className="grid-gap-x grid grid-cols-12" size="mdDoc">
      <div className="grid-gap-x col-span-10 col-start-2 grid grid-cols-10 rounded-2xl bg-gray-new-8 p-12 xl:col-span-full xl:col-start-1 xl:items-center xl:px-8 xl:py-10 lg:px-7 lg:py-9 md:px-5 md:py-8">
        <div className="col-span-4 col-start-1 xl:max-w-[300px] xl:justify-self-start lg:col-span-full lg:max-w-none">
          <span className="inline-block rounded-[40px] bg-green-45/10 px-3.5 py-2 text-xs font-semibold uppercase leading-none tracking-[0.02em] text-green-45">
            Benefits
          </span>
          <h2 className="mt-3 max-w-[322px] text-[52px] font-medium leading-none tracking-[-0.02em] xl:max-w-[270px] xl:text-[44px] lg:max-w-none lg:text-4xl md:text-[32px]">
            Why become a partner?
          </h2>
          <p className="mt-4 max-w-[362px] text-lg font-light leading-snug xl:max-w-[280px] xl:text-base lg:max-w-none md:mt-2.5">
            At Neon, we deeply value our partners, holding firm in our belief that they are vital to
            our mission of making Serverless Postgres easy to integrate, manage, and grow.
          </p>
        </div>
        <ul className="col-start-5 col-end-11 -ml-1.5 mt-2 grid max-w-[640px] grid-cols-2 gap-x-[90px] gap-y-11 xl:-ml-5 xl:mt-0 xl:max-w-none xl:gap-x-10 xl:pl-0 lg:col-span-full lg:ml-0 lg:mt-10 lg:gap-y-10 md:mt-[30px] md:grid-cols-1 md:gap-y-[30px]">
          {items.map(({ icon, title, description }, index) => (
            <li className="flex items-start gap-x-3.5 md:gap-x-3" key={index}>
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
                <h3 className="text-[22px] font-medium leading-tight tracking-[-0.02em] xl:text-xl md:text-lg">
                  {title}
                </h3>
                <p className="md:text-2 mt-2 font-light leading-snug text-gray-new-70 xl:mt-[11px]">
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
