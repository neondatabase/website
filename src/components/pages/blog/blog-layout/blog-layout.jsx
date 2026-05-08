import PropTypes from 'prop-types';

import Sidebar from 'components/pages/blog/sidebar';
import Container from 'components/shared/container';

const BlogLayout = ({ categories, routeConfig, children }) => (
  <div className="pt-20 safe-paddings pb-24 lg:pt-12 lg:pb-20 sm:pt-10 sm:pb-16">
    <Container className="flex flex-col" size="1600">
      <div className="flex gap-16 xl:gap-3.5 xl:pl-0 lg:flex-col lg:gap-0 md:relative">
        <Sidebar categories={categories} routeConfig={routeConfig} />
        <div className="relative w-full max-w-[1184px] lg:max-w-full">{children}</div>
      </div>
    </Container>
  </div>
);

BlogLayout.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      slug: PropTypes.string,
    })
  ).isRequired,
  routeConfig: PropTypes.shape({
    basePath: PropTypes.string.isRequired,
    categoryBasePath: PropTypes.string.isRequired,
    isPreview: PropTypes.bool,
    previewParams: PropTypes.object,
  }).isRequired,
  children: PropTypes.node.isRequired,
};

export default BlogLayout;
