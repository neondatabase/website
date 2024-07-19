import Image from 'next/image';
import { PropTypes } from 'prop-types';

import Button from 'components/shared/button';

import BgDecor from '../bg-decor';

import blueGlow from './images/blue-glow.png';
import greenGlow from './images/green-glow.png';

const Cta = ({ text, button }) => (
  <div className="relative mt-3 w-full overflow-hidden rounded-lg bg-gray-new-8 px-7 py-6 sm:mt-2">
    <div className="relative z-10 flex items-center justify-between sm:flex-col sm:gap-[18px]">
      <h3 className="mb-1 max-w-sm text-2xl font-medium leading-dense tracking-tighter text-white sm:text-center sm:text-xl">
        {text}
      </h3>
      <Button
        className="h-10 px-7 text-base !font-semibold tracking-tighter"
        theme="primary"
        to={button.url}
      >
        {button.title}
      </Button>
    </div>
    <BgDecor hasBorder hasNoise hasPattern>
      <Image
        className="absolute left-0 top-0 h-[106px] w-[315px]"
        src={blueGlow}
        width={315}
        height={106}
        alt=""
      />
      <Image
        className="absolute bottom-0 right-0 h-[65px] w-[560px]"
        src={greenGlow}
        width={560}
        height={65}
        alt=""
      />
    </BgDecor>
  </div>
);

Cta.propTypes = {
  text: PropTypes.string.isRequired,
  button: PropTypes.shape({
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default Cta;
