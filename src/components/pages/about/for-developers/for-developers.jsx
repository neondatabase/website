import Image from 'next/image';

import Container from 'components/shared/container';
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

const ForDevelopers = () => (
  <section className="for-developers safe-paddings mt-[200px] xl:mt-[136px] lg:mt-[104px] md:mt-[72px]">
    <Container className="xl:max-w-[896px] lg:!pl-16 lg:!pr-[140px] md:!px-5" size="960">
      <Heading
        className="max-w-[800px] text-[68px] font-medium leading-[0.9] tracking-extra-tight xl:max-w-[663px] xl:text-[56px] lg:max-w-[564px] lg:text-5xl md:max-w-[420px] md:text-[36px] sm:max-w-[288px]"
        tag="h2"
        theme="black"
      >
        Developers are at the center of everything we do.
      </Heading>
      <ul className="mt-16 grid grid-cols-4 gap-x-10 gap-y-9 xl:mt-14 lg:mt-11 lg:grid-cols-2 sm:mt-9 sm:grid-cols-1 sm:gap-y-7">
        {ITEMS.map(({ icon, title, description }, index) => (
          <li key={index}>
            <Image className="w-[22px] sm:w-5" src={icon} alt="" width={22} height={22} />
            <h3 className="mt-4 text-xl font-semibold leading-dense tracking-tighter lg:mt-3.5 lg:text-lg sm:mt-2.5">
              {title}
            </h3>
            <p
              className="mt-2 font-light tracking-extra-tight text-gray-new-70 lg:mt-1.5 lg:max-w-[260px] sm:w-3/4 sm:min-w-[260px] sm:max-w-none"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default ForDevelopers;
