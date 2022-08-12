import { useStaticQuery, graphql } from 'gatsby';
import { getSrc } from 'gatsby-plugin-image';
import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';

const SEO = ({
  pathname,
  title,
  description,
  ogImage,
  metaKeywords,
  metaRobotsNoindex,
  opengraphDescription,
  opengraphTitle,
  opengraphUrl,
  twitterImage: opengraphImage,
  facebook,
}) => {
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

  const isRobotsNoindexPage = metaRobotsNoindex === 'noindex';
  const currentUrl =
    (pathname || opengraphUrl) !== '/' ? `${siteUrl}${pathname || opengraphUrl}` : siteUrl;
  const currentDescription = description || opengraphDescription || siteDescription;

  const opengraphImagePreview =
    opengraphImage && siteUrl + getSrc(opengraphImage.localFile.childImageSharp);
  const ogImagePreview = ogImage && siteUrl + getSrc(ogImage.childImageSharp);
  const currentImagePath = opengraphImagePreview || ogImagePreview || siteUrl + siteImage;

  return (
    <Helmet
      title={title || siteTitle}
      htmlAttributes={{
        lang: siteLanguage,
        prefix: 'og: http://ogp.me/ns#',
      }}
    >
      {/* General */}
      <meta name="description" content={currentDescription} />
      {metaKeywords && <meta name="keywords" content={metaKeywords} />}
      {isRobotsNoindexPage && <meta name="robots" content="noindex" />}
      {/* Open Graph */}
      <meta property="og:title" content={title || opengraphTitle || siteTitle} />
      <meta property="og:description" content={currentDescription} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={currentImagePath} />
      <meta property="og:type" content="website" />
      {facebook && <meta property="fb:app_id" content={facebook.appId} />}
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  pathname: PropTypes.string.isRequired,
  ogImage: PropTypes.shape({
    childImageSharp: PropTypes.shape({}),
  }),
  metaKeywords: PropTypes.string,
  metaRobotsNoindex: PropTypes.string,
  opengraphDescription: PropTypes.string,
  opengraphTitle: PropTypes.string,
  opengraphUrl: PropTypes.string,
  twitterImage: PropTypes.shape({
    localFile: PropTypes.shape({
      childImageSharp: PropTypes.shape({}),
    }),
  }),
  facebook: PropTypes.shape({
    appId: PropTypes.string,
  }),
};

SEO.defaultProps = {
  title: null,
  description: null,
  ogImage: null,
  metaKeywords: null,
  metaRobotsNoindex: null,
  opengraphDescription: null,
  opengraphTitle: null,
  opengraphUrl: null,
  twitterImage: null,
  facebook: null,
};

export default SEO;
