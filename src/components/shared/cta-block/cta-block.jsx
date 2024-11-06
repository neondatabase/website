import clsx from 'clsx';
import Image from 'next/image';
import { PropTypes } from 'prop-types';

import BgDecor from 'components/pages/use-case/bg-decor';
import Button from 'components/shared/button';

import blueGlowMobile from './images/blue-glow-mobile.png';
import blueGlow from './images/blue-glow.png';
import greenGlowMobile from './images/green-glow-mobile.png';
import greenGlow from './images/green-glow.png';

const CtaBlock = ({ className, title, description, buttonText, buttonUrl }) => (
  <div
    className={clsx(
      'not-prose relative mt-10 w-full overflow-hidden rounded-lg bg-gray-new-8 px-7 py-6 xl:mt-9 lg:mt-8 lg:pr-10 sm:mt-6 sm:p-6',
      className
    )}
  >
    <div className="relative z-10 flex items-center justify-between sm:flex-col sm:gap-[18px]">
      <div className="max-w-sm sm:text-center">
        <h3 className="text-2xl font-medium leading-dense tracking-tighter sm:text-xl">{title}</h3>
        {description && (
          <p className="text-14 mt-2.5 leading-tight tracking-tight text-gray-new-70">
            {description}
          </p>
        )}
      </div>
      <Button
        className="h-10 px-7 text-base !font-semibold tracking-tighter lg:text-sm"
        theme="primary"
        to={buttonUrl}
      >
        {buttonText}
      </Button>
    </div>
    <BgDecor hasBorder hasNoise hasPattern>
      <Image
        className="absolute bottom-0 right-0 h-[65px] w-[560px] sm:hidden"
        src={greenGlow}
        width={560}
        height={65}
        alt=""
      />
      <Image
        className="absolute bottom-0 right-0 hidden h-[111px] w-[176px] sm:block"
        src={greenGlowMobile}
        width={176}
        height={111}
        alt=""
      />
      <Image
        className="absolute left-0 top-0 h-full w-auto sm:hidden"
        src={blueGlow}
        width={315}
        height={106}
        alt=""
      />
      <Image
        className="absolute left-0 top-0 hidden h-[152px] w-[315px] sm:block"
        src={blueGlowMobile}
        width={315}
        height={152}
        alt=""
      />
    </BgDecor>
  </div>
);

CtaBlock.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  buttonText: PropTypes.string.isRequired,
  buttonUrl: PropTypes.string.isRequired,
};

export default CtaBlock;
