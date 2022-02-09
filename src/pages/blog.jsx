import React from 'react';

import PostsList from 'components/pages/blog/posts-list';
import Layout from 'components/shared/layout';

const HomePage = () => (
  <Layout headerTheme="white">
    <PostsList />
  </Layout>
);

export default HomePage;
