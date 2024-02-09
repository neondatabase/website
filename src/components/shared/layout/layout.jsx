import clsx from 'clsx';
import PropTypes from 'prop-types';

import Footer from 'components/shared/footer';
import Header from 'components/shared/header';

const API_URL = 'https://api.github.com/repos/neondatabase/neon';

const fetchGithubStarCount = async () => {
  try {
    const response = await fetch(API_URL, {
      next: {
        revalidate: 60 * 60 * 24,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const json = await response.json();
    return json.stargazers_count;
  } catch (error) {
    console.error('Error fetching GitHub star count:', error);
    return null;
  }
};

const Layout = async ({
  className = null,
  headerClassName = null,
  headerTheme,
  footerTheme = 'white',
  withOverflowHidden = false,
  children,
  isHeaderSticky = false,
  headerWithBottomBorder = false,
  footerWithTopBorder = false,
  isDocPage = false,
  isBlogPage = false,
}) => {
  const githubStarCount = await fetchGithubStarCount();

  return (
    // 44px is the height of the topbar
    <div className="relative flex min-h-[calc(100vh-44px)] flex-col">
      <Header
        className={headerClassName}
        withBottomBorder={headerWithBottomBorder}
        theme={headerTheme}
        isSticky={isHeaderSticky}
        isDocPage={isDocPage}
        isBlogPage={isBlogPage}
        githubStarCount={githubStarCount}
      />
      <main
        className={clsx(
          withOverflowHidden && 'overflow-hidden',
          'flex flex-1 flex-col dark:bg-black',
          className
        )}
      >
        {children}
      </main>
      <Footer isDocPage={isDocPage} theme={footerTheme} withTopBorder={footerWithTopBorder} />
    </div>
  );
};

Layout.propTypes = {
  className: PropTypes.string,
  headerClassName: PropTypes.string,
  headerTheme: PropTypes.oneOf(['white', 'black', 'black-new', 'gray-8']).isRequired,
  footerTheme: PropTypes.oneOf(['white', 'black', 'black-new', 'gray-8']),
  withOverflowHidden: PropTypes.bool,
  children: PropTypes.node.isRequired,
  isHeaderSticky: PropTypes.bool,
  headerWithBottomBorder: PropTypes.bool,
  footerWithTopBorder: PropTypes.bool,
  isDocPage: PropTypes.bool,
  isBlogPage: PropTypes.bool,
};

export default Layout;
