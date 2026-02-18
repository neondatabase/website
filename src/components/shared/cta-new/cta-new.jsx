import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import SectionLabel from 'components/shared/section-label';
import LINKS from 'constants/links';

import ctaBackground from './images/cta-bg.jpg';

const CtaNew = ({
  className,
  title = "The world's most advanced <br /> Postgres platform.",
  description = 'Trusted by developers, ready for agents. Build and scale applications faster with Neon.',
  label = 'Get started',
  buttonText = 'Get started',
  buttonUrl = LINKS.signup,
}) => (
  <section className={clsx('cta safe-paddings relative bg-[#151617]', className)}>
    <div className="absolute inset-0 z-10">
      <Container className="top-1/2 -translate-y-1/2" size="1920">
        <SectionLabel className="text-gray-new-80 sm:mb-4">{label}</SectionLabel>
        <div className="mt-6 max-w-[800px] text-[48px] leading-dense tracking-tighter xl:max-w-[760px] xl:text-[44px] lg:text-[40px] md:mt-4 md:text-[28px] sm:max-w-none">
          <h2 className="text-white sm:inline" dangerouslySetInnerHTML={{ __html: title }} />
          <p className="text-gray-new-50 sm:inline">{description}</p>
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

CtaNew.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  label: PropTypes.string,
  buttonText: PropTypes.string,
  buttonUrl: PropTypes.string,
};

export default CtaNew;
