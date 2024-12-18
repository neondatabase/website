import Image from 'next/image';
import { PropTypes } from 'prop-types';

import Section from '../section';

import loadGraphicAWS from './images/load-graphic-aws.jpg';
import loadGraphicNeon from './images/load-graphic-neon.jpg';

const Load = ({ title }) => (
  <Section className="load" title={title}>
    <div className="prose-variable">
      <p>
      Variable load patterns are common, but traditional managed databases require provisioning a fixed amount of CPU and memory.
        
      To avoid performance issues during traffic spikes, you’re likely provisioning a larger machine than you need most of the time. Scaling up must be done manually. Scaling down may require downtime.

      </p>
    </div>    <div className="flex items-center justify-center gap-5 lg:flex-col md:gap-3.5">
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
  </Section>
);

Load.propTypes = {
  title: PropTypes.shape({}),
};

export default Load;
