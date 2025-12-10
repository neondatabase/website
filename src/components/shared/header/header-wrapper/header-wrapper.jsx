import clsx from 'clsx';
import PropTypes from 'prop-types';

const HeaderWrapper = ({
  className = null,
  children,
  isSticky = false,
  isStickyOverlay = false,
}) => (
  <>
    <header
      className={clsx(
        'header left-0 right-0 top-0 z-50 flex h-16 w-full items-center bg-white dark:bg-black-pure lg:relative lg:h-14',
        'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-gray-new-90 after:dark:bg-gray-new-20',
        isSticky ? 'sticky' : 'absolute',
        isStickyOverlay && '-mb-16',
        className
      )}
    >
      {children}
    </header>
    {/* semi-transparent overlay */}
    <div
      className={clsx(
        'navigation-overlay',
        'pointer-events-none fixed inset-0 z-40 bg-gray-new-8/80 opacity-0 transition-opacity delay-150 duration-200'
      )}
    />
  </>
);

HeaderWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  isSticky: PropTypes.bool,
  isStickyOverlay: PropTypes.bool,
};

export default HeaderWrapper;
