import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Container from 'components/shared/container/container';
import quoteIcon from 'icons/quote.svg';

const CompanyLogo = ({ className, src, width, isPriority }) => (
  <Image
    className={clsx('h-9 lg:h-7 lg:w-auto md:h-6', className)}
    src={src}
    width={width}
    height={36}
    alt=""
    priority={isPriority}
  />
);

CompanyLogo.propTypes = {
  className: PropTypes.string,
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  isPriority: PropTypes.bool,
};

const TestimonialNew = ({
  className = '',
  figureClassName = '',
  quoteClassName = '',
  quote,
  author,
  company,
  isPriority,
}) => (
  <div className={clsx('testimonial-new safe-paddings', className)}>
    <Container className="relative flex flex-col items-center px-16 md:px-5" size="960">
      {company && author ? (
        <CompanyLogo
          className="mb-7 lg:mb-6 md:mb-5"
          src={company.src}
          width={company.width}
          priority={isPriority}
        />
      ) : (
        <div className="h-[68px] w-full lg:h-[60px] md:h-[52px]">
          <Image
            className="absolute left-1/2 top-0 -z-10 -ml-2.5 -mt-7 -translate-x-1/2 lg:h-20 lg:w-auto md:h-[72px]"
            src={quoteIcon}
            width={104}
            height={89}
            alt=""
            priority={isPriority}
          />
        </div>
      )}
      <figure className={clsx('max-w-[840px] lg:max-w-[620px]', figureClassName)}>
        <blockquote className="text-center">
          <p
            className={clsx(
              'bg-[radial-gradient(66.11%_247.88%_at_50%_50%,#FFF_31.15%,rgba(255,255,255,0.1)_100%)] bg-clip-text text-[28px] leading-snug tracking-tighter text-transparent lg:text-2xl md:text-xl',
              quoteClassName
            )}
          >
            {quote}
          </p>
        </blockquote>
        <figcaption className="mt-5 flex h-[30px] items-center justify-center lg:mt-[18px] md:h-auto md:flex-col md:gap-2.5">
          {author ? (
            <>
              {author.avatar && (
                <Image
                  className="mr-2.5 rounded-full md:mx-auto"
                  src={author.avatar}
                  width={30}
                  height={30}
                  quality={100}
                  alt={`${author.name} photo`}
                  priority={isPriority}
                />
              )}
              <span className="text-lg font-light leading-tight tracking-extra-tight text-gray-new-70 lg:text-base md:mx-auto md:flex md:flex-col md:items-center md:gap-1 md:text-center md:text-sm">
                <span>{author.name}</span>
                <cite className="ml-1.5 not-italic text-gray-new-50 before:mr-1.5 before:inline-flex before:h-px before:w-4 before:bg-gray-new-50 before:align-middle md:ml-0 md:before:hidden">
                  {author.position}
                </cite>
              </span>
            </>
          ) : (
            company && <CompanyLogo src={company.src} width={company.width} priority={isPriority} />
          )}
        </figcaption>
      </figure>
    </Container>
  </div>
);

TestimonialNew.propTypes = {
  className: PropTypes.string,
  figureClassName: PropTypes.string,
  quoteClassName: PropTypes.string,
  quote: PropTypes.string.isRequired,
  author: PropTypes.shape({
    name: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    avatar: PropTypes.object,
  }),
  company: PropTypes.shape({
    src: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
  }),
  isPriority: PropTypes.bool,
};

export default TestimonialNew;
