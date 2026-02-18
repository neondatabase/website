import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Button from 'components/shared/button';
import ButtonAiHelper from 'components/shared/button-ai-helper';
import Container from 'components/shared/container';
import SectionLabel from 'components/shared/section-label';
import LINKS from 'constants/links';

import ctaBackground from './images/cta-bg.jpg';

const CONTACT_SALES_AI_SETTINGS = {
  botName: 'Neon Sales AI',
  placeholder: 'How do I get started?',
  introMessage:
    "<p>Hi!<br>I'm an AI assistant here to help you learn about Neon and answer any questions you have.</p><p>Feel free to ask about pricing, features, enterprise solutions, or anything else!</p>",
  quickQuestions: [
    'How to get a Demo request?',
    'What are the Enterprise Pricing?',
    'HIPAA Compliance',
    'Security Overview',
  ],
};

const CTANew = ({
  className,
  copyWrapperClassName = null,
  title = "The world's most advanced <br /> Postgres platform.",
  description = null,
  label = 'Get started',
  buttonText = 'Get started',
  buttonUrl = LINKS.signup,
  buttonType = null,
}) => (
  <section
    className={clsx(
      'cta safe-paddings relative mt-[183px] bg-[#151617] xl:mt-[168px] lg:mt-[145px] md:mt-[90px]',
      className
    )}
  >
    <div className="absolute inset-0 z-10">
      <Container className="top-1/2 -translate-y-1/2" size="1920">
        <SectionLabel className="text-gray-new-80 sm:mb-4">{label}</SectionLabel>
        <div className="mt-6 max-w-[800px] text-[48px] leading-dense tracking-tighter xl:max-w-[760px] xl:text-[44px] lg:text-[40px] md:mt-4 md:text-[28px] sm:max-w-none">
          <h2 className="text-white sm:inline" dangerouslySetInnerHTML={{ __html: title }} />
          {description && <p className="text-gray-new-50 sm:inline">{description}</p>}
        </div>
        {buttonType === 'aiHelper' ? (
          <ButtonAiHelper className="mt-10 lg:mt-8" {...CONTACT_SALES_AI_SETTINGS}>
            {buttonText}
          </ButtonAiHelper>
        ) : (
          <Button className="mt-10 lg:mt-8" theme="white-filled" size="new" to={buttonUrl}>
            {buttonText}
          </Button>
        )}
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
  buttonType: PropTypes.oneOf(['aiHelper', null]),
};

export default CTANew;
