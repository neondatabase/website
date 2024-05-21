import PropTypes from 'prop-types';

import GradientLabel from 'components/shared/gradient-label';

const Details = ({ label, title, description }) => (
  <div className="w-[505px] max-w-full lg:mt-10">
    {label && <GradientLabel className="inline-block">{label}</GradientLabel>}
    <h2 className="mt-3.5 font-title text-[52px] font-medium leading-none tracking-extra-tight xl:text-[44px] lg:text-4xl md:text-[32px]">
      {title}
    </h2>
    <div
      className="mt-5 text-lg font-light leading-snug xl:text-base"
      dangerouslySetInnerHTML={{ __html: description }}
    />
  </div>
);

Details.propTypes = {
  label: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default Details;
