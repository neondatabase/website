import clsx from 'clsx';
import PropTypes from 'prop-types';

const UseCaseList = ({ theme, children }) => (
  <div
    className={clsx(
      '[&_ul]:!pl-[34px]',
      '[&_li]:before:!-left-7 [&_li]:before:!top-[3px] [&_li]:before:!size-4',
      '[&_li]:before:!bg-transparent',
      theme === 'pros'
        ? '[&_li]:before:bg-[url("/images/pages/use-cases/pros.svg")]'
        : '[&_li]:before:bg-[url("/images/pages/use-cases/cons.svg")]'
    )}
  >
    {children}
  </div>
);

UseCaseList.propTypes = {
  theme: PropTypes.oneOf(['pros', 'cons']).isRequired,
  children: PropTypes.node.isRequired,
};

export default UseCaseList;
