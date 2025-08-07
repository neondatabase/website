import Image from 'next/image';

import Heading from 'components/shared/heading';
import checkIcon from 'images/pages/about/for-developers/check.svg';
import dollarIcon from 'images/pages/about/for-developers/dollar.svg';
import reliableIcon from 'images/pages/about/for-developers/reliable.svg';
import storageIcon from 'images/pages/about/for-developers/storage.svg';

const ITEMS = [
  {
    icon: storageIcon,
    title: 'Just Be Postgres',
    description:
      'Achieve this by leveraging the pluggable storage layer, preserving the core of&nbsp;Postgres.',
  },
  {
    icon: checkIcon,
    title: 'Easy',
    description:
      'Simplify the life of developers by bringing the serverless consumption model to&nbsp;Postgres.',
  },
  {
    icon: reliableIcon,
    title: 'Reliable',
    description:
      'Use modern replication techniques to provide high availability and high durability&nbsp;guarantees.',
  },
  {
    icon: dollarIcon,
    title: 'Cost Efficient',
    description: 'Aim to deliver the best price-performance Postgres service in the&nbsp;world.',
  },
];

const Developers = () => (
  <section className="developers safe-paddings mt-[216px] xl:mt-[152px] lg:mt-[112px] md:mt-[96px]">
    <div className="relative mx-auto flex max-w-[960px] flex-col items-center xl:max-w-[896px] lg:max-w-[564px] md:px-5">
      <Heading
        className="max-w-[630px] text-center text-[56px] font-medium leading-none tracking-extra-tight lg:text-5xl md:text-[36px]"
        tag="h2"
      >
        Developers are at the center of everything we do
      </Heading>
      <ul className="mt-14 grid grid-cols-4 gap-x-10 gap-y-9 xl:mt-12 lg:mt-11 lg:grid-cols-2 md:mt-9 md:flex md:flex-col md:gap-y-7">
        {ITEMS.map(({ icon, title, description }, index) => (
          <li key={index}>
            <Image className="w-[22px] sm:w-5" src={icon} alt={title} width={22} height={22} />
            <h3 className="mt-4 text-xl font-semibold leading-dense tracking-tighter xl:mt-4 lg:mt-[14px] md:mt-[10px]">
              {title}
            </h3>
            <p
              className="mt-2 font-light tracking-extra-tight text-gray-new-70 lg:mt-[6px]"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default Developers;
