import PropTypes from 'prop-types';

const GradientLabel = ({ children }) => (
  <span className="relative before:absolute before:inset-0 before:z-10 before:rounded-[40px] before:bg-black-new after:absolute after:-inset-px after:rounded-[40px] after:bg-[linear-gradient(180deg,rgba(0,229,153,0.2)20%,rgba(0,229,153,0.6)100%)]">
    <span className="relative z-20 block rounded-[40px] bg-[linear-gradient(180deg,rgba(0,229,153,0.00)0%,rgba(0,229,153,0.10)100%)] px-[13px] py-1.5 text-sm font-medium leading-none -tracking-extra-tight text-green-45">
      {children}
    </span>
  </span>
);

GradientLabel.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GradientLabel;
