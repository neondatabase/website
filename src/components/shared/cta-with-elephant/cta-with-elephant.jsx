import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import AnimatedButton from 'components/shared/animated-button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';

import GradientLabel from '../gradient-label';

import illustration from './images/cta-elephant.jpg';

const CTAWithElephant = ({
  className = '',
  titleClassName = '',
  buttonClassName = '',
  label = null,
  labelTheme = 'green',
  title,
  description,
  buttonUrl,
  buttonText,
  linkUrl,
  linkText,
  linkTarget = undefined,
}) => (
  <section
    className={clsx('cta-with-elephant overflow-hidden bg-black-pure safe-paddings', className)}
  >
    <Container
      size="medium"
      className="grid grid-cols-12 gap-x-10 md:grid-cols-1 lg:gap-x-4 xl:gap-x-6"
    >
      <div className="relative z-10 col-span-4 col-start-2 flex flex-col items-start pt-16 pb-[164px] md:col-span-full md:items-center md:text-center lg:col-span-6 lg:pb-[54px] xl:col-start-1 xl:pt-20 xl:pb-[78px] 2xl:col-span-5 2xl:col-start-2 2xl:pb-36">
        {label && (
          <GradientLabel className="mb-5" theme={labelTheme}>
            {label}
          </GradientLabel>
        )}
        <Heading
          className={clsx(
            'max-w-[500px] md:mx-auto lg:max-w-[350px] xl:max-w-[400px]',
            titleClassName
          )}
          tag="h2"
          size="2sm"
          asHTML
        >
          {title}
        </Heading>
        <p className="mt-3 max-w-[464px] text-lg leading-snug font-light md:mx-auto md:max-w-md lg:max-w-sm xl:max-w-[400px] xl:text-base">
          {description}
        </p>
        <div className="mt-9 flex items-center gap-x-8 sm:mt-6 sm:flex-col sm:gap-y-5 md:justify-center lg:gap-x-4 xl:mt-7">
          <AnimatedButton
            className={clsx(
              'inline-flex py-5 text-lg tracking-extra-tight hover:bg-[#00FFAA] sm:text-lg lg:text-base xl:py-[17px]',
              buttonClassName
            )}
            theme="primary"
            to={buttonUrl}
            isAnimated
          >
            {buttonText}
          </AnimatedButton>
          {linkUrl && linkText && (
            <Link
              className="tracking-extra-tight underline-offset-[5px]"
              theme="green-underlined"
              to={linkUrl}
              target={linkTarget}
              rel={linkTarget ? 'noopener noreferrer' : undefined}
              size="sm"
            >
              {linkText}
            </Link>
          )}
        </div>
      </div>
      <div className="relative col-span-7 col-start-6 md:z-20 md:col-span-full md:flex md:justify-center 2xl:col-span-6 2xl:col-start-7">
        <Image
          className="absolute bottom-0 left-0 w-[842px] max-w-none md:static md:w-[591px] lg:-left-28 lg:w-[553px] xl:-left-20 xl:w-[652px] 2xl:w-[750px]"
          src={illustration}
          width={842}
          height={482}
          alt=""
        />
      </div>
    </Container>
  </section>
);

CTAWithElephant.propTypes = {
  className: PropTypes.string,
  titleClassName: PropTypes.string,
  buttonClassName: PropTypes.string,
  label: PropTypes.string,
  labelTheme: PropTypes.oneOf(['green', 'gray']),
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  buttonUrl: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  linkUrl: PropTypes.string,
  linkText: PropTypes.string,
  linkTarget: PropTypes.string,
};

export default CTAWithElephant;
