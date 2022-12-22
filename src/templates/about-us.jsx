/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import CTA from 'components/pages/team/cta';
import Team from 'components/pages/team/team';
import Layout from 'components/shared/layout';
import SEO from 'components/shared/seo';
import SEO_DATA from 'constants/seo-data';
import getReactContentWithLazyBlocks from 'utils/get-react-content-with-lazy-blocks';

const AboutUsPage = ({
  data: {
    wpPage: { content },
  },
}) => {
  const contentWithLazyBlocks = getReactContentWithLazyBlocks(
    content,
    {
      aboutusteam: Team,
      aboutuscta: CTA,
    },
    true
  );
  return <Layout headerTheme="white">{contentWithLazyBlocks}</Layout>;
};

export const query = graphql`
  query ($id: String!) {
    wpPage(id: { eq: $id }) {
      content
      ...wpPageSeo
    }
  }
`;

export default AboutUsPage;

export const Head = ({ location: { pathname } }) => <SEO {...SEO_DATA.team} pathname={pathname} />;
