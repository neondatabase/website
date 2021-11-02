/* eslint-disable react/prop-types */
import { useStaticQuery, graphql } from 'gatsby';
import React from 'react';
import { Helmet } from 'react-helmet';

const SEO = () => {
  const {
    site: {
      siteMetadata: { siteTitle, siteDescription, siteUrl, siteImage, siteLanguage },
    },
  } = useStaticQuery(graphql`
    query SEO {
      site {
        siteMetadata {
          siteTitle
          siteDescription
          siteUrl
          siteImage
          siteLanguage
        }
      }
    }
  `);

  return (
    <Helmet
      title={siteTitle}
      htmlAttributes={{
        lang: siteLanguage,
        prefix: 'og: http://ogp.me/ns#',
      }}
    >
      {/* General */}
      <meta name="description" content={siteDescription} />
      {/* Open Graph */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:image" content={siteImage} />
      <meta property="og:type" content="website" />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
};

export default SEO;
