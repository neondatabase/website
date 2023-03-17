import PropTypes from 'prop-types';

import Button from 'components/shared/button';
import LINKS from 'constants/links';
import DiscourseWhiteIcon from 'icons/discourse-logo-white.inline.svg';
import DiscourseIcon from 'icons/discourse-logo.inline.svg';

const CommunityBanner = ({ children = null }) => (
  <section className="my-10 flex items-center rounded-[10px] border border-gray-7 bg-community-light p-6 dark:border-gray-2 dark:bg-community-dark">
    <div>
      <h4 className="my-2 text-xl font-semibold leading-tight text-black dark:text-white">
        {children}
      </h4>
      <Button
        className="mt-3 px-5 py-2.5 !text-sm !font-bold !text-black hover:bg-[#00e5bf]"
        to={LINKS.discourse}
        size="xs"
        theme="primary"
      >
        Join Community
      </Button>
    </div>
    <DiscourseIcon className="mr-4 ml-auto dark:hidden sm:hidden" aria-hidden />
    <DiscourseWhiteIcon className="mr-4 ml-auto hidden dark:block dark:sm:hidden" aria-hidden />
  </section>
);

CommunityBanner.propTypes = {
  children: PropTypes.node,
};

export default CommunityBanner;
