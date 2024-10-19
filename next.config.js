const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const { POSTGRES_DOCS_BASE_PATH } = require('./src/constants/docs');
const { getAllPosts, getAllChangelogPosts } = require('./src/utils/api-docs');
const generateChangelogPath = require('./src/utils/generate-changelog-path');
const generateDocPagePath = require('./src/utils/generate-doc-page-path');
const { getAllPostgresTutorials } = require('./src/utils/postgresql-pages');

const defaultConfig = {
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/fonts/:slug*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:all*(svg|jpg|png)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, must-revalidate',
          },
        ],
      },
      {
        source: '/animations/:all*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/videos/:all*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/docs/:all*(svg|jpg|png)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/blog/parsing-json-from-postgres-in-js',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
  },
  async redirects() {
    const postgresPosts = await getAllPostgresTutorials();
    const docPosts = await getAllPosts();
    const changelogPosts = await getAllChangelogPosts();
    const postgresRedirects = postgresPosts.reduce((acc, post) => {
      const { slug, redirectFrom: postRedirects } = post;
      if (!postRedirects || !postRedirects.length) {
        return acc;
      }

      const postRedirectsArray = postRedirects.map((redirect) => ({
        source: redirect,
        destination: `${POSTGRES_DOCS_BASE_PATH}${slug}`,
        permanent: true,
      }));

      return [...acc, ...postRedirectsArray];
    }, []);
    const docsRedirects = docPosts.reduce((acc, post) => {
      const { slug, redirectFrom: postRedirects } = post;
      if (!postRedirects || !postRedirects.length) {
        return acc;
      }

      const postRedirectsArray = postRedirects.map((redirect) => ({
        source: redirect,
        destination: generateDocPagePath(slug),
        permanent: true,
      }));

      return [...acc, ...postRedirectsArray];
    }, []);
    const changelogRedirects = changelogPosts.reduce((acc, post) => {
      const { slug, redirectFrom: postRedirects } = post;
      if (!postRedirects || !postRedirects.length) {
        return acc;
      }

      const postRedirectsArray = postRedirects.map((redirect) => ({
        source: redirect,
        destination: generateChangelogPath(slug),
        permanent: true,
      }));

      return [...acc, ...postRedirectsArray];
    }, []);

    return [
      {
        source: '/blog/the-non-obviousness-of-postgres-roles',
        destination: '/blog/postgres-roles',
        permanent: true,
      },
      {
        source: '/2024-plan-updates',
        destination: '/pricing',
        permanent: true,
      },
      {
        source: '/blog/category/case-study',
        destination: '/case-studies',
        permanent: true,
      },
      {
        source: '/team',
        destination: '/about-us',
        permanent: true,
      },
      {
        source: '/jobs',
        destination: '/careers',
        permanent: true,
      },
      {
        source: '/docs/release-notes/:path*',
        destination: '/docs/changelog/:path*',
        permanent: true,
      },
      // Proxy has an error message, that suggests to read `https://neon.tech/sni` for more details.
      {
        source: '/sni',
        destination: '/docs/connect/connection-errors',
        permanent: true,
      },
      {
        source: '/docs',
        destination: '/docs/introduction',
        permanent: true,
      },
      {
        source: '/docs/postgres',
        destination: '/docs/postgres/index',
        permanent: true,
      },
      {
        source: '/early-access',
        destination: '/',
        permanent: true,
      },
      {
        source: '/driver',
        destination: '/docs/serverless/serverless-driver',
        permanent: false,
      },
      {
        source: '/blog/postgres-autoscaling',
        destination: '/blog/scaling-serverless-postgres',
        permanent: false,
      },
      {
        source: '/api-reference',
        destination: 'https://api-docs.neon.tech',
        permanent: true,
      },
      {
        source: '/api-reference/v2',
        destination: 'https://api-docs.neon.tech/v2',
        permanent: true,
      },
      {
        source: '/ycmatcher',
        destination: 'https://yc-idea-matcher.vercel.app',
        permanent: true,
      },
      {
        source: '/trust',
        destination: 'https://trust.neon.tech',
        permanent: true,
      },
      {
        source: '/discord',
        destination: 'https://discord.gg/92vNTzKDGp',
        permanent: false,
      },
      {
        source: '/developer-days',
        destination: 'https://devdays.neon.tech',
        permanent: true,
      },
      {
        source: '/ping-thing',
        destination: '/demos/ping-thing',
        permanent: true,
      },
      // redirect all path that contains /docs/postgres/**/*.html to /docs/postgres/**
      {
        source: '/docs/postgres/:path*.html',
        destination: '/docs/postgres/:path*',
        permanent: true,
      },
      {
        source: '/sign_in',
        destination: 'https://console.neon.tech/signup',
        permanent: true,
      },
      {
        source: '/ai',
        destination: '/docs/ai/ai-intro',
        permanent: true,
      },
      ...postgresRedirects,
      ...docsRedirects,
      ...changelogRedirects,
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api_spec/release/v2.json',
        destination: 'https://dfv3qgd2ykmrx.cloudfront.net/api_spec/release/v2.json',
      },
      {
        source: '/demos/ping-thing',
        destination: 'https://ping-thing.vercel.app/demos/ping-thing',
      },
      {
        source: '/demos/ping-thing/:path*',
        destination: 'https://ping-thing.vercel.app/demos/ping-thing/:path*',
      },
      {
        source: '/demos/playground',
        destination: 'https://postgres-ai-playground.vercel.app/demos/playground',
      },
      {
        source: '/demos/playground/:path*',
        destination: 'https://postgres-ai-playground.vercel.app/demos/playground/:path*',
      },
      {
        source: '/demos/instant-postgres',
        destination: 'https://instant-postgres.mahmoudw.com/demos/instant-postgres',
      },
      {
        source: '/demos/instant-postgres/:path*',
        destination: 'https://instant-postgres.mahmoudw.com/demos/instant-postgres/:path*',
      },
      {
        source: '/developer-days/:path*',
        destination: 'https://neon-dev-days-next.vercel.app/developer-days/:path*',
      },
      {
        source: '/demos/regional-latency',
        destination: 'https://latencies-ui.vercel.app/demos/regional-latency',
      },
      {
        source: '/demos/regional-latency/:asset*',
        destination: 'https://latencies-ui.vercel.app/demos/regional-latency/:asset*',
      },
      {
        source: '/dev-for-rds',
        destination: 'https://dev-for-rds.vercel.app/dev-for-rds',
      },
      {
        source: '/dev-for-rds/:path*',
        destination: 'https://dev-for-rds.vercel.app/dev-for-rds/:path*',
      },
    ];
  },
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.('.svg'));

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports not ending in ".inline.svg"
      {
        test: /(?<!inline)\.svg$/,
        use: [
          {
            loader: require.resolve('url-loader'),
            options: {
              limit: 512,
              publicPath: '/_next/static/svgs',
              outputPath: 'static/svgs',
              fallback: require.resolve('file-loader'),
            },
          },
          {
            loader: require.resolve('svgo-loader'),
          },
        ],
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.inline.svg$/i,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              svgo: true,
              svgoConfig: {
                plugins: [
                  {
                    name: 'preset-default',
                    params: {
                      overrides: {
                        removeViewBox: false,
                      },
                    },
                  },
                  'prefixIds',
                ],
              },
            },
          },
        ],
      }
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
  env: {
    INKEEP_INTEGRATION_API_KEY: process.env.INKEEP_INTEGRATION_API_KEY,
    INKEEP_INTEGRATION_ID: process.env.INKEEP_INTEGRATION_ID,
    INKEEP_ORGANIZATION_ID: process.env.INKEEP_ORGANIZATION_ID,
  },
};

module.exports = withBundleAnalyzer(defaultConfig);
