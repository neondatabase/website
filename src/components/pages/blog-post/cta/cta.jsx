import PropTypes from 'prop-types';

import Button from 'components/shared/button';

const CTA = ({ title, description, buttonText, buttonUrl }) => (
  <div className="not-prose relative my-10 after:absolute after:-inset-px after:rounded-md after:bg-[radial-gradient(circle,rgba(173,224,235,0.6)_0%,rgba(12,13,13,0.5)_120%)] after:p-px md:my-8">
    <div className="relative z-10 flex items-center justify-between overflow-hidden rounded-md bg-black-new py-6 pl-7 pr-8 sm:flex-col sm:px-6">
      <img
        className="absolute right-0 -z-10 h-full w-auto object-cover"
        src="/images/background-cta.svg"
        alt=""
        width={457}
        height={92}
        aria-hidden
      />
      <div className="sm:text-center">
        <h2 className="max-w-sm text-2xl font-medium leading-none tracking-tighter text-white md:my-0 sm:leading-tight">
          {title}
        </h2>
        <p className="mt-2.5 text-sm leading-tight tracking-[-0.02em] text-gray-new-70">
          {description}
        </p>
      </div>
      <Button
        className="!text-base !font-semibold sm:mt-5 xs:w-full"
        theme="blue"
        size="xs"
        data-label="cta"
        to={buttonUrl}
      >
        {buttonText}
      </Button>
    </div>
  </div>
);

CTA.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  buttonUrl: PropTypes.string.isRequired,
};

export default CTA;
