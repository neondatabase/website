import Image from 'next/image';

import Container from 'components/shared/container/container';
import aiIcon from 'icons/variable/ai.svg';
import gamingIcon from 'icons/variable/gaming.svg';
import productivityIcon from 'icons/variable/productivity.svg';
import shopsIcon from 'icons/variable/shops.svg';


import List from '../list';

import loadGraphicAWS from './images/load-graphic-aws.jpg';
import loadGraphicNeon from './images/load-graphic-neon.jpg';

const items = [
  {
    icon: productivityIcon,
    text: '<strong>A productivity application</strong> might have increased demand during working hours as teams collaborate and complete tasks.',
  },
  {
    icon: aiIcon,
    text: '<strong>An AI analytics startup</strong> could face heavy processing loads during off-peak hours when batch data jobs are run.',
  },
  {
    icon: gamingIcon,
    text: '<strong>A gaming platform</strong> might experience surges in user activity during evenings when players are most active.',
  },
  {
    icon: shopsIcon,
    text: '<strong>Online shops</strong> might see spikes when certain sales are run… And so on.',
  },
];

const Load = () => (
  <section className="hero safe-paddings relative overflow-hidden pt-[72px] xl:pt-16 lg:pt-14 md:pt-11">
    <Container size="xxs">
      <h2 className="mb-7 text-[36px] font-medium leading-tight tracking-tighter xl:mb-6 xl:text-[32px] lg:mb-5 lg:text-[28px] md:mb-4 md:text-2xl">
        Variable resources for variable load
      </h2>
      <div className="space-y-7 text-lg tracking-extra-tight text-gray-new-70 xl:space-y-6 lg:space-y-5 sm:space-y-4 sm:text-base [&_span]:text-green-45 [&_strong]:font-medium [&_strong]:text-white">
        <p>
          No real-world database has constant demand. To some extent, all modern applications
          experience variable traffic patterns; for some applications, demand is clearly variable.
          For example:
        </p>
        <List items={items} />
        <p>
          Variable load patterns are common, but <strong>traditional managed databases</strong>{' '}
          require provisioning a fixed amount of CPU and memory. To avoid degraded performance or
          even outages, it is standard practice to provision for peak traffic, which means{' '}
          <strong>
            paying for peak capacity 24/7 — even though it&apos;s needed only a fraction of the
            time.
          </strong>
        </p>
        <p>
          <strong>Neon&apos;s serverless architecture</strong> eliminates the need for provisioning
          a fixed amount of CPU and memory. Instead of overpaying for peak capacity that is rarely
          needed, Neon dynamically adjusts compute resources to match actual workload demands.{' '}
          <strong>This means you only pay for what you use.</strong>
        </p>
      </div>
    </Container>
    <Container size="960" className="mt-10 xl:mt-9 lg:mt-8 sm:mt-6">
      <div className="flex items-center gap-5 lg:flex-col md:gap-3.5">
        <Image
          className="w-full max-w-xl rounded-lg md:rounded"
          src={loadGraphicAWS}
          width={470}
          height={338}
          alt=""
          sizes="(max-width: 768px) 340px, 100vw"
          aria-hidden
          priority
        />
        <Image
          className="w-full max-w-xl rounded-lg md:rounded"
          src={loadGraphicNeon}
          width={470}
          height={338}
          alt=""
          sizes="(max-width: 768px) 340px, 100vw"
          aria-hidden
          priority
        />
      </div>
    </Container>
  </section>
);

export default Load;
