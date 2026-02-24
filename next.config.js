const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const { CONTENT_ROUTES } = require('./src/constants/content');
const { getAllPosts, getAllChangelogs } = require('./src/utils/api-docs');
const generateChangelogPath = require('./src/utils/generate-changelog-path');
const generateDocPagePath = require('./src/utils/generate-doc-page-path');

const defaultConfig = {
  poweredByHeader: false,
  transpilePackages: ['geist'],
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
        source: '/',
        headers: [
          {
            key: 'Cache-Control',
            value: 'max-age=0, s-maxage=31536000',
          },
        ],
      },
      {
        source: '/home',
        headers: [
          {
            key: 'Cache-Control',
            value: 'max-age=0, s-maxage=31536000',
          },
        ],
      },
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
        source: '/images/technology-logos/:all*',
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
    const docPosts = await getAllPosts();
    const changelogPosts = await getAllChangelogs();
    const docsRedirects = docPosts.filter(Boolean).reduce((acc, post) => {
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
    const changelogRedirects = changelogPosts.filter(Boolean).reduce((acc, post) => {
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
        source: '/docs/use-cases/:path*',
        destination: '/use-cases',
        permanent: true,
      },
      {
        source: '/docs/get-started-with-neon/:path*',
        destination: '/docs/get-started/:path*',
        permanent: true,
      },
      {
        source: '/bm',
        destination: '/?ref=tbm-p',
        permanent: true,
      },
      {
        source: '/burningmonk',
        destination: '/?ref=tbm-p',
        permanent: true,
      },
      {
        source: '/yc-startups',
        destination: '/startups',
        permanent: true,
      },
      {
        source: '/yc-deal-terms',
        destination: '/startups-deal-terms',
        permanent: true,
      },
      {
        source: '/postgresql',
        destination: '/postgresql/tutorial',
        permanent: true,
      },
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
        source: '/team',
        destination: '/about-us',
        permanent: true,
      },
      {
        source: '/jobs',
        destination: 'https://www.databricks.com/company/careers',
        permanent: true,
      },
      {
        source: '/careers',
        destination: 'https://www.databricks.com/company/careers',
        permanent: true,
      },
      {
        source: '/docs/release-notes/:path*',
        destination: '/docs/changelog/:path*',
        permanent: true,
      },
      // Proxy has an error message, that suggests to read `https://neon.com/sni` for more details.
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
        source: '/docs/import/migration-assistant',
        destination: '/docs/import/import-data-assistant',
        permanent: true,
      },
      {
        source: '/migration-assistance',
        destination: '/docs/import/migrate-intro',
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
        source: '/blog/an-apology-and-a-recap-on-may-june-stability',
        destination: '/blog/may-june-recap',
        permanent: false,
      },
      {
        source: '/blog/recap-on-may-june-stability',
        destination: '/blog/may-june-recap',
        permanent: false,
      },
      {
        source: '/blog/migrate-your-data-from-aws-rds-aurora-to-neon',
        destination: '/blog',
        permanent: true,
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
        destination: 'https://trust.neon.com',
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
        source: '/docs/manage/endpoints',
        destination: '/docs/manage/computes',
        permanent: true,
      },
      {
        source: '/sign_in',
        destination: 'https://console.neon.tech/signup',
        permanent: true,
      },
      {
        source: '/deploy',
        destination: '/',
        permanent: true,
      },
      {
        source: '/generate-ticket',
        destination: '/',
        permanent: true,
      },
      {
        source: '/stage',
        destination: '/',
        permanent: true,
      },
      {
        source: '/changelog',
        destination: '/docs/changelog',
        permanent: false,
      },
      {
        source: '/support',
        destination: '/docs/introduction/support',
        permanent: true,
      },
      {
        source: '/early-access-program',
        destination: '/docs/introduction/roadmap#join-the-neon-early-access-program',
        permanent: true,
      },
      {
        source: '/hipaa-compliance-guide',
        destination: '/docs/security/hipaa',
        permanent: true,
      },
      {
        source: '/hipaa-baa',
        destination: 'https://www.databricks.com/legal/neon-baa',
        permanent: true,
      },
      {
        source: '/baa',
        destination: 'https://www.databricks.com/legal/neon-baa',
        permanent: true,
      },
      {
        source: '/baa/signed',
        destination: 'https://ironcladapp.com/public-launch/6884048e9f9f2acee1cf6353',
        permanent: true,
      },
      {
        source: '/launchpad',
        destination: 'https://pg.new',
        permanent: false,
      },
      {
        source: '/instagres',
        destination: 'https://pg.new',
        permanent: false,
      },
      {
        source: '/docs/local/neon-local-vscode',
        destination: '/docs/local/neon-local-connect',
        permanent: true,
      },
      {
        source: '/docs/introduction/monitor-external-tools',
        destination: '/docs/introduction/monitoring',
        permanent: true,
      },
      {
        source: '/flow',
        destination: '/branching',
        permanent: true,
      },
      {
        source: '/flow/:path*',
        destination: '/branching/:path*',
        permanent: true,
      },
      {
        source: '/scalable-architecture',
        destination: '/',
        permanent: true,
      },
      // Legacy Neon Auth (Stack Auth) redirects to new Neon Auth docs
      {
        source: '/docs/neon-auth',
        destination: '/docs/auth/overview',
        permanent: true,
      },
      {
        source: '/docs/neon-auth/components/:path*',
        destination: '/docs/auth/reference/ui-components',
        permanent: true,
      },
      {
        source: '/docs/neon-auth/sdk/:path*',
        destination: '/docs/auth/overview',
        permanent: true,
      },
      {
        source: '/docs/neon-auth/concepts/:path*',
        destination: '/docs/auth/overview',
        permanent: true,
      },
      {
        source: '/docs/neon-auth/customization/:path*',
        destination: '/docs/auth/overview',
        permanent: true,
      },
      {
        source: '/docs/neon-auth/email-configuration',
        destination: '/docs/auth/overview',
        permanent: true,
      },
      {
        source: '/docs/neon-auth/permissions-roles',
        destination: '/docs/auth/overview',
        permanent: true,
      },
      {
        source: '/creators',
        destination: '/docs/community/community-intro',
        permanent: true,
      },
      {
        source: '/blog/join-the-neon-creator-program',
        destination: '/docs/community/community-intro',
        permanent: true,
      },
      {
        source: '/creators',
        destination: '/docs/community/community-intro ',
        permanent: true,
      },
      {
        source: '/blog/autoscaling-report-2025',
        destination: '/autoscaling-report',
        permanent: true,
      },
      {
        source: '/open-source',
        destination: '/programs/open-source',
        permanent: true,
      },
      {
        source: '/agents',
        destination: '/programs/agents',
        permanent: true,
      },
      {
        source: '/cost-fleets',
        destination: '/',
        permanent: true,
      },
      {
        source: '/partners',
        destination: 'https://neon.com/docs/guides/platform-integration-overview',
        permanent: true,
      },
      // Homepage variants redirects
      {
        source: '/all-things-open-2023',
        destination: '/',
        permanent: false,
      },
      {
        source: '/cfe',
        destination: '/',
        permanent: false,
      },
      {
        source: '/devs',
        destination: '/',
        permanent: false,
      },
      {
        source: '/education',
        destination: '/',
        permanent: false,
      },
      {
        source: '/fireship',
        destination: '/',
        permanent: false,
      },
      {
        source: '/github',
        destination: '/',
        permanent: false,
      },
      {
        source: '/last-week-in-aws',
        destination: '/',
        permanent: false,
      },
      {
        source: '/pgt',
        destination: '/',
        permanent: false,
      },
      {
        source: '/radio',
        destination: '/',
        permanent: false,
      },
      {
        source: '/stackoverflow',
        destination: '/',
        permanent: false,
      },
      {
        source: '/youtube',
        destination: '/',
        permanent: false,
      },
      {
        source: '/student',
        destination: 'https://get.neon.com/student-25',
        permanent: false,
      },
      ...docsRedirects,
      ...changelogRedirects,
    ];
  },
  async rewrites() {
    // Generate rewrites for AI agent markdown access
    // Maps /docs/x.md → /md/docs/x.md (internal public/md/ directory)
    const contentRewrites = Object.keys(CONTENT_ROUTES).map((route) => ({
      source: `/${route}/:path*.md`,
      destination: `/md/${route}/:path*.md`,
    }));

    return {
      // afterFiles: runs after checking pages/public files but before dynamic routes
      // This ensures physical .md files are served first, with fallback to public/md/
      afterFiles: [
        // Serve /llms.txt from /docs/llms.txt (canonical location is public/docs/llms.txt)
        { source: '/llms.txt', destination: '/docs/llms.txt' },
        ...contentRewrites,
      ],
      // fallback: existing rewrites for external services
      fallback: [
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
          source: '/developer-days/:path*',
          destination: 'https://neon-dev-days-next.vercel.app/developer-days/:path*',
        },
        {
          source: '/demos/regional-latency',
          destination: 'https://latency-benchmarks-dashboard.vercel.app/demos/regional-latency',
        },
        {
          source: '/demos/regional-latency/:path*',
          destination:
            'https://latency-benchmarks-dashboard.vercel.app/demos/regional-latency/:path*',
        },
        {
          source: '/ai-chat',
          destination: '/docs/introduction#ai-chat',
        },
      ],
    };
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

    config.module.rules.push({
      test: (filePath) => {
        const fileName = filePath.split('/').pop();

        return fileName === 'rive.wasm';
      },
      type: 'asset/resource',
      generator: {
        filename: 'static/[name].[hash][ext]',
      },
    });

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      module: false,
      path: false,
      crypto: false,
      stream: false,
      assert: false,
      http: false,
      https: false,
      os: false,
      url: false,
    };

    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    return config;
  },
  env: {
    INKEEP_INTEGRATION_API_KEY: process.env.INKEEP_INTEGRATION_API_KEY,
    INKEEP_INTEGRATION_ID: process.env.INKEEP_INTEGRATION_ID,
    INKEEP_ORGANIZATION_ID: process.env.INKEEP_ORGANIZATION_ID,
  },
};

module.exports = withBundleAnalyzer(defaultConfig);
