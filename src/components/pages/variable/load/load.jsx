import Image from 'next/image';
import { PropTypes } from 'prop-types';

import aiIcon from 'icons/variable/ai.svg';
import gamingIcon from 'icons/variable/gaming.svg';
import productivityIcon from 'icons/variable/productivity.svg';
import shopsIcon from 'icons/variable/shops.svg';

import List from '../list';
import Section from '../section';

import loadGraphicAWS from './images/load-graphic-aws.jpg';
import loadGraphicNeon from './images/load-graphic-neon.jpg';

const items = [
  {
    icon: productivityIcon,
    text: 'A productivity application might have increased demand during working hours as teams collaborate and complete tasks.',
  },
  {
    icon: aiIcon,
    text: 'An AI analytics startup could face heavy processing loads during off-peak hours when batch data jobs are run.',
  },
  {
    icon: gamingIcon,
    text: 'A gaming platform might experience surges in user activity during evenings when players are most active.',
  },
  {
    icon: shopsIcon,
    text: 'Online shops might see spikes when certain sales are run… And so on.',
  },
];

const Load = ({ title }) => (
  <Section className="load" title={title}>
    <div className="flex items-center justify-center gap-5 lg:flex-col md:gap-3.5">
      <Image
        className="w-[470px] shrink-0 rounded-lg lg:w-full lg:max-w-xl md:rounded"
        src={loadGraphicAWS}
        width={470}
        height={338}
        alt=""
        sizes="(max-width: 768px) 340px, 100vw"
        aria-hidden
        priority
      />
      <Image
        className="w-[470px] shrink-0 rounded-lg lg:w-full lg:max-w-xl md:rounded"
        src={loadGraphicNeon}
        width={470}
        height={338}
        alt=""
        sizes="(max-width: 768px) 340px, 100vw"
        aria-hidden
        priority
      />
    </div>
    <div className="prose-variable">
      <p>Many applications have variable traffic patterns:</p>
      <List items={items} />
      <p>
        Variable load patterns are common, but traditional managed databases require provisioning a
        fixed amount of CPU and memory. To avoid degraded performance or even outages, it is
        standard practice to provision for peak traffic, which means paying for peak capacity 24/7 —
        even though it&apos;s needed only a fraction of the time.
      </p>
    </div>
  </Section>
);

Load.propTypes = {
  title: PropTypes.shape({}),
};

export default Load;
