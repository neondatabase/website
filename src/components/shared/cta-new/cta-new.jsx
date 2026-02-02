import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import LINKS from 'constants/links';

import ctaBackground from './images/cta-bg.jpg';
import Label from './label';

const CTANew = ({
  className,
  copyWrapperClassName = null,
  title = "The world's most advanced <br /> Postgres platform.",
  description = null,
  label = 'Get started',
  buttonText = 'Get started',
  buttonUrl = LINKS.signup,
}) => (
  <section
    className={clsx(
      'cta safe-paddings relative mt-[183px] bg-[#151617] xl:mt-[168px] lg:mt-[145px] md:mt-[90px]',
      className
    )}
  >
    <div className="absolute inset-0 z-10">
      <Container className="top-1/2 -translate-y-1/2" size="1920">
        <Label className="sm:mb-4">{label}</Label>
        <div
          className={clsx(
            'mt-6 max-w-[800px] text-[48px] leading-dense tracking-tighter xl:max-w-[760px] xl:text-[44px] lg:text-[40px] md:mt-4 md:text-[28px] sm:max-w-none',
            copyWrapperClassName
          )}
        >
          <h2 className="text-white sm:inline" dangerouslySetInnerHTML={{ __html: title }} />
          {description && <p className="text-gray-new-50 sm:inline">{description}</p>}
        </div>
        <Button className="mt-10 lg:mt-8" theme="white-filled" size="new" to={buttonUrl}>
          {buttonText}
        </Button>
      </Container>
    </div>

    <div className="pointer-events-none relative overflow-hidden">
      <Image
        className="min-h-[550px] w-full object-cover lg:min-h-[486px] md:min-h-[446px]"
        src={ctaBackground}
        width={1920}
        height={610}
        sizes="100vw"
        alt=""
      />
    </div>
  </section>
);

CTANew.propTypes = {
  className: PropTypes.string,
  copyWrapperClassName: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  label: PropTypes.string,
  buttonText: PropTypes.string,
  buttonUrl: PropTypes.string,
};

export default CTANew;
