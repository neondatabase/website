import PropTypes from 'prop-types';

import GradientLabel from 'components/shared/gradient-label';

const Details = ({ label, title, description }) => (
  <div className="w-1/2 max-w-[505px] lg:mt-10 lg:w-full">
    {label && <GradientLabel className="inline-block">{label}</GradientLabel>}
    {title && (
      <h2 className="mt-3.5 font-title text-[52px] font-medium leading-none tracking-extra-tight xl:text-[44px] lg:text-4xl md:text-[32px]">
        {title}
      </h2>
    )}
    {description && (
      <div
        className="mt-5 text-lg font-light leading-snug xl:text-base"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    )}
  </div>
);

Details.propTypes = {
  label: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
};

export default Details;
