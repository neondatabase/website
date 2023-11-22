import clsx from 'clsx';
import PropTypes from 'prop-types';

const BuiltInDocsLayout = ({ className = null, withOverflowHidden = false, children }) => (
  // 44px is the height of the topbar
  <div className="relative flex min-h-100vh flex-col">
    {/* <div> */}
    {/*  <Search */}
    {/*    className="mobile-search" */}
    {/*    indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME} */}
    {/*  /> */}
    {/* </div> */}
    <main
      className={clsx(
        withOverflowHidden && 'overflow-hidden',
        'flex flex-1 flex-col dark:bg-black',
        className
      )}
    >
      {children}
    </main>
  </div>
);

BuiltInDocsLayout.propTypes = {
  className: PropTypes.string,
  withOverflowHidden: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default BuiltInDocsLayout;
