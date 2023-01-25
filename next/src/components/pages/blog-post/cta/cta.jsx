import PropTypes from 'prop-types';

import Button from 'components/shared/button';

import background from './images/background.svg';

const CTA = ({ title, buttonText, buttonUrl }) => (
  <div className="relative my-5">
    <div className="flex items-center justify-between space-x-20 py-4 px-8 sm:flex-col sm:space-x-0">
      <h2 className="my-0 max-w-lg text-[22px] font-semibold text-white md:my-0 sm:text-center sm:text-lg sm:leading-tight">
        {title}
      </h2>
      <Button className="!text-sm sm:mt-3 xs:w-full" theme="primary" size="xs" to={buttonUrl}>
        {buttonText}
      </Button>
    </div>
    <img
      className="absolute inset-0 -z-10 m-0 h-full w-full bg-black object-cover md:m-0"
      src={background}
      alt=""
      aria-hidden
    />
  </div>
);

CTA.propTypes = {
  title: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  buttonUrl: PropTypes.string.isRequired,
};

export default CTA;
