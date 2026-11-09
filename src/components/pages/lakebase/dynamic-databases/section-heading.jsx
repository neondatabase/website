import PropTypes from 'prop-types';

const SectionHeading = ({ id, primary, secondary }) => (
  <h3
    className="max-w-[1088px] indent-[96px] text-[40px] leading-[1.125] font-normal tracking-[-0.04em] text-pretty text-white xl:text-[36px] lg:indent-16 lg:text-[32px] md:indent-0 md:text-[28px] sm:text-[26px]"
    id={id}
  >
    {primary} <span className="text-gray-new-50">{secondary}</span>
  </h3>
);

SectionHeading.propTypes = {
  id: PropTypes.string.isRequired,
  primary: PropTypes.string.isRequired,
  secondary: PropTypes.string.isRequired,
};

export default SectionHeading;
