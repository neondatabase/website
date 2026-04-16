const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const { CONTENT_ROUTES } = require('./src/constants/content');
const { getAllPosts, getAllChangelogs } = require('./src/utils/api-docs');
const generateChangelogPath = require('./src/utils/generate-changelog-path');
const generateDocPagePath = require('./src/utils/generate-doc-page-path');

const defaultConfig = {
  poweredByHeader: false,
  transpilePackages: ['geist', 'react-icons'],
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 85, 90, 95, 99, 100],
    localPatterns: [
      {
        pathname: '/docs/og',
      },
      {
        pathname: '/**',
        search: '',
      },
    ],
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
      {
        source: '/(docs|postgresql|guides|branching|programs|use-cases)/:path*.md',
        headers: [
          {
            key: 'Content-Disposition',
            value: 'inline',
          },
          {
            key: 'Content-Type',
            value: 'text/markdown; charset=utf-8',
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
      // PostgreSQL URL deduplication redirects (old postgresql-xxx → xxx)
      {
        source: '/postgresql/postgresql-18/:path*',
        destination: '/postgresql/18/:path*',
        permanent: true,
      },
      {
        source: '/postgresql/postgresql-18',
        destination: '/postgresql/18',
        permanent: true,
      },
      {
        source: '/postgresql/postgresql-18-new-features',
        destination: '/postgresql/18-new-features',
        permanent: true,
      },
      {
        source: '/postgresql/postgresql-administration/:path*',
        destination: '/postgresql/administration/:path*',
        permanent: true,
      },
      {
        source: '/postgresql/postgresql-administration',
        destination: '/postgresql/administration',
        permanent: true,
      },
      {
        source: '/postgresql/postgresql-advanced',
        destination: '/postgresql/advanced',
        permanent: true,
      },
      {
        source: '/postgresql/postgresql-aggregate-functions/:path*',
        destination: '/postgresql/aggregate-functions/:path*',
        permanent: true,
      },
      {
        source: '/postgresql/postgresql-aggregate-functions',
        destination: '/postgresql/aggregate-functions',
        permanent: true,
      },
      {
        source: '/postgresql/postgresql-api',
        destination: '/postgresql/api',
        permanent: true,
      },
      {
        source: '/postgresql/postgresql-cheat-sheet',
        destination: '/postgresql/cheat-sheet',
        permanent: true,
      },
      {
        source: '/postgresql/postgresql-csharp/:path*',
        destination: '/postgresql/csharp/:path*',
        permanent: true,
      },
      {
        source: '/postgresql/postgresql-csharp',
        destination: '/postgresql/csharp',
        permanent: true,
      },
      {
        source: '/postgresql/postgresql-date-functions/:path*',
        destination: '/postgresql/date-functions/:path*',
        permanent: true,
      },
      {
        source: '/postgresql/postgresql-date-functions',
        destination: '/postgresql/date-functions',
        permanent: true,
      },
      {
        source: '/postgresql/postgresql-functions',
        destination: '/postgresql/functions',
        permanent: true,
      },
      {
        source: '/postgresql/postgresql-getting-started/:path*',
        destination: '/postgresql/getting-started/:path*',
        permanent: true,
      },
      {
        source: '/postgresql/postgresql-getting-started',
        destination: '/postgresql/getting-started',
        permanent: true,
      },
      {
        source: '/postgresql/postgresql-indexes/:path*',
        destination: '/postgresql/indexes/:path*',
        permanent: true,
      },
      {
        source: '/postgresql/postgresql-indexes',
        destination: '/postgresql/indexes',
        permanent: true,
      },
      {
        source: '/postgresql/postgresql-jdbc/:path*',
        destination: '/postgresql/jdbc/:path*',
        permanent: true,
      },
      {
        source: '/postgresql/postgresql-jdbc',
        destination: '/postgresql/jdbc',
        permanent: true,
      },
      {
        source: '/postgresql/postgresql-json-functions/:path*',
        destination: '/postgresql/json-functions/:path*',
        permanent: true,
      },
      {
        source: '/postgresql/postgresql-json-functions',
        destination: '/postgresql/json-functions',
        permanent: true,
      },
      {
        source: '/postgresql/postgresql-math-functions/:path*',
        destination: '/postgresql/math-functions/:path*',
        permanent: true,
      },
      {
        source: '/postgresql/postgresql-math-functions',
        destination: '/postgresql/math-functions',
        permanent: true,
      },
      {
        source: '/postgresql/postgresql-php/:path*',
        destination: '/postgresql/php/:path*',
        permanent: true,
      },
      {
        source: '/postgresql/postgresql-php',
        destination: '/postgresql/php',
        permanent: true,
      },
      {
        source: '/postgresql/postgresql-plpgsql/:path*',
        destination: '/postgresql/plpgsql/:path*',
        permanent: true,
      },
      {
        source: '/postgresql/postgresql-plpgsql',
        destination: '/postgresql/plpgsql',
        permanent: true,
      },
      {
        source: '/postgresql/postgresql-python/:path*',
        destination: '/postgresql/python/:path*',
        permanent: true,
      },
      {
        source: '/postgresql/postgresql-python',
        destination: '/postgresql/python',
        permanent: true,
      },
      {
        source: '/postgresql/postgresql-string-functions/:path*',
        destination: '/postgresql/string-functions/:path*',
        permanent: true,
      },
      {
        source: '/postgresql/postgresql-string-functions',
        destination: '/postgresql/string-functions',
        permanent: true,
      },
      {
        source: '/postgresql/postgresql-triggers/:path*',
        destination: '/postgresql/triggers/:path*',
        permanent: true,
      },
      {
        source: '/postgresql/postgresql-triggers',
        destination: '/postgresql/triggers',
        permanent: true,
      },
      {
        source: '/postgresql/postgresql-tutorial/:path*',
        destination: '/postgresql/tutorial/:path*',
        permanent: true,
      },
      {
        source: '/postgresql/postgresql-tutorial',
        destination: '/postgresql/tutorial',
        permanent: true,
      },
      {
        source: '/postgresql/postgresql-views/:path*',
        destination: '/postgresql/views/:path*',
        permanent: true,
      },
      {
        source: '/postgresql/postgresql-views',
        destination: '/postgresql/views',
        permanent: true,
      },
      {
        source: '/postgresql/postgresql-window-function/:path*',
        destination: '/postgresql/window-function/:path*',
        permanent: true,
      },
      {
        source: '/postgresql/postgresql-window-function',
        destination: '/postgresql/window-function',
        permanent: true,
      },
      // PostgreSQL tutorial file URL deduplication redirects
      {
        source: '/postgresql/tutorial/postgresql-add-column',
        destination: '/postgresql/tutorial/add-column',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-alias',
        destination: '/postgresql/tutorial/alias',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-all',
        destination: '/postgresql/tutorial/all',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-alter-table',
        destination: '/postgresql/tutorial/alter-table',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-and',
        destination: '/postgresql/tutorial/and',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-any',
        destination: '/postgresql/tutorial/any',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-array',
        destination: '/postgresql/tutorial/array',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-between',
        destination: '/postgresql/tutorial/between',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-boolean',
        destination: '/postgresql/tutorial/boolean',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-bytea-data-type',
        destination: '/postgresql/tutorial/bytea-data-type',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-case',
        destination: '/postgresql/tutorial/case',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-cast',
        destination: '/postgresql/tutorial/cast',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-change-column-type',
        destination: '/postgresql/tutorial/change-column-type',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-char-varchar-text',
        destination: '/postgresql/tutorial/char-varchar-text',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-check-constraint',
        destination: '/postgresql/tutorial/check-constraint',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-coalesce',
        destination: '/postgresql/tutorial/coalesce',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-column-alias',
        destination: '/postgresql/tutorial/column-alias',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-composite-types',
        destination: '/postgresql/tutorial/composite-types',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-copy-table',
        destination: '/postgresql/tutorial/copy-table',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-correlated-subquery',
        destination: '/postgresql/tutorial/correlated-subquery',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-create-table-as',
        destination: '/postgresql/tutorial/create-table-as',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-create-table',
        destination: '/postgresql/tutorial/create-table',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-cross-join',
        destination: '/postgresql/tutorial/cross-join',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-cte',
        destination: '/postgresql/tutorial/cte',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-cube',
        destination: '/postgresql/tutorial/cube',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-data-types',
        destination: '/postgresql/tutorial/data-types',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-date',
        destination: '/postgresql/tutorial/date',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-default-value',
        destination: '/postgresql/tutorial/default-value',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-delete-cascade',
        destination: '/postgresql/tutorial/delete-cascade',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-delete-join',
        destination: '/postgresql/tutorial/delete-join',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-delete',
        destination: '/postgresql/tutorial/delete',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-distinct-on',
        destination: '/postgresql/tutorial/distinct-on',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-double-precision-type',
        destination: '/postgresql/tutorial/double-precision-type',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-drop-column',
        destination: '/postgresql/tutorial/drop-column',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-drop-table',
        destination: '/postgresql/tutorial/drop-table',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-enum',
        destination: '/postgresql/tutorial/enum',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-except',
        destination: '/postgresql/tutorial/except',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-exists',
        destination: '/postgresql/tutorial/exists',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-explain',
        destination: '/postgresql/tutorial/explain',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-fetch',
        destination: '/postgresql/tutorial/fetch',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-foreign-key',
        destination: '/postgresql/tutorial/foreign-key',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-full-outer-join',
        destination: '/postgresql/tutorial/full-outer-join',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-generate_series',
        destination: '/postgresql/tutorial/generate_series',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-generated-columns',
        destination: '/postgresql/tutorial/generated-columns',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-group-by',
        destination: '/postgresql/tutorial/group-by',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-grouping-sets',
        destination: '/postgresql/tutorial/grouping-sets',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-having',
        destination: '/postgresql/tutorial/having',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-hstore',
        destination: '/postgresql/tutorial/hstore',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-identity-column',
        destination: '/postgresql/tutorial/identity-column',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-in',
        destination: '/postgresql/tutorial/in',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-inner-join',
        destination: '/postgresql/tutorial/inner-join',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-insert-multiple-rows',
        destination: '/postgresql/tutorial/insert-multiple-rows',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-insert',
        destination: '/postgresql/tutorial/insert',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-integer',
        destination: '/postgresql/tutorial/integer',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-intersect',
        destination: '/postgresql/tutorial/intersect',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-interval',
        destination: '/postgresql/tutorial/interval',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-is-null',
        destination: '/postgresql/tutorial/is-null',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-isnull',
        destination: '/postgresql/tutorial/isnull',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-joins',
        destination: '/postgresql/tutorial/joins',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-json',
        destination: '/postgresql/tutorial/json',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-left-join',
        destination: '/postgresql/tutorial/left-join',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-like',
        destination: '/postgresql/tutorial/like',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-limit',
        destination: '/postgresql/tutorial/limit',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-merge',
        destination: '/postgresql/tutorial/merge',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-natural-join',
        destination: '/postgresql/tutorial/natural-join',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-not-null-constraint',
        destination: '/postgresql/tutorial/not-null-constraint',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-nullif',
        destination: '/postgresql/tutorial/nullif',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-numeric',
        destination: '/postgresql/tutorial/numeric',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-or',
        destination: '/postgresql/tutorial/or',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-order-by',
        destination: '/postgresql/tutorial/order-by',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-primary-key',
        destination: '/postgresql/tutorial/primary-key',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-random-range',
        destination: '/postgresql/tutorial/random-range',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-real-data-type',
        destination: '/postgresql/tutorial/real-data-type',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-recursive-query',
        destination: '/postgresql/tutorial/recursive-query',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-rename-column',
        destination: '/postgresql/tutorial/rename-column',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-rename-table',
        destination: '/postgresql/tutorial/rename-table',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-right-join',
        destination: '/postgresql/tutorial/right-join',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-rollup',
        destination: '/postgresql/tutorial/rollup',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-select-distinct',
        destination: '/postgresql/tutorial/select-distinct',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-select-into',
        destination: '/postgresql/tutorial/select-into',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-select',
        destination: '/postgresql/tutorial/select',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-self-join',
        destination: '/postgresql/tutorial/self-join',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-sequences',
        destination: '/postgresql/tutorial/sequences',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-serial',
        destination: '/postgresql/tutorial/serial',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-server-and-database-objects',
        destination: '/postgresql/tutorial/server-and-database-objects',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-subquery',
        destination: '/postgresql/tutorial/subquery',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-temporary-table',
        destination: '/postgresql/tutorial/temporary-table',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-time',
        destination: '/postgresql/tutorial/time',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-timestamp',
        destination: '/postgresql/tutorial/timestamp',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-transaction',
        destination: '/postgresql/tutorial/transaction',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-truncate-table',
        destination: '/postgresql/tutorial/truncate-table',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-union',
        destination: '/postgresql/tutorial/union',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-unique-constraint',
        destination: '/postgresql/tutorial/unique-constraint',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-update-join',
        destination: '/postgresql/tutorial/update-join',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-update',
        destination: '/postgresql/tutorial/update',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-upsert',
        destination: '/postgresql/tutorial/upsert',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-user-defined-data-types',
        destination: '/postgresql/tutorial/user-defined-data-types',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-uuid',
        destination: '/postgresql/tutorial/uuid',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-vs-mysql',
        destination: '/postgresql/tutorial/vs-mysql',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-where',
        destination: '/postgresql/tutorial/where',
        permanent: true,
      },
      {
        source: '/postgresql/tutorial/postgresql-xml-data-type',
        destination: '/postgresql/tutorial/xml-data-type',
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
        source: '/privacy-policy',
        destination: 'https://www.databricks.com/legal/privacynotice',
        permanent: true,
      },
      {
        source: '/privacy-guide',
        destination: 'https://www.databricks.com/legal/privacynotice',
        permanent: true,
      },
      {
        source: '/terms-of-service',
        destination: '/platform-terms',
        permanent: true,
      },
      {
        source: '/dpa',
        destination: '/platform-terms#3.4',
        permanent: true,
      },
      {
        source: '/sensitive-data-terms',
        destination: 'https://www.databricks.com/legal/terms-of-use',
        permanent: true,
      },
      {
        source: '/programs/creators',
        destination: '/programs/open-source',
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
        destination: 'https://neon.new',
        permanent: false,
      },
      {
        source: '/instagres',
        destination: 'https://neon.new',
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
      // Deprecated Neon Azure Native ISV docs (EOL); redirect to docs home
      {
        source: '/docs/manage/azure',
        destination: '/docs/introduction',
        permanent: true,
      },
      {
        source: '/docs/import/migrate-from-azure-native',
        destination: '/docs/introduction',
        permanent: true,
      },
      {
        source: '/docs/azure/azure-deploy',
        destination: '/docs/introduction',
        permanent: true,
      },
      {
        source: '/docs/azure/azure-manage',
        destination: '/docs/introduction',
        permanent: true,
      },
      {
        source: '/docs/azure/azure-develop',
        destination: '/docs/introduction',
        permanent: true,
      },
      {
        source: '/docs/introduction/billing-azure-marketplace',
        destination: '/docs/introduction',
        permanent: true,
      },
      {
        source: '/docs/get-started/azure-get-started',
        destination: '/docs/introduction',
        permanent: true,
      },
      // Same deprecated Azure Native ISV slugs as raw `.md` URLs (rewrites otherwise miss file)
      {
        source: '/docs/manage/azure.md',
        destination: '/docs/introduction',
        permanent: true,
      },
      {
        source: '/docs/import/migrate-from-azure-native.md',
        destination: '/docs/introduction',
        permanent: true,
      },
      {
        source: '/docs/azure/azure-deploy.md',
        destination: '/docs/introduction',
        permanent: true,
      },
      {
        source: '/docs/azure/azure-manage.md',
        destination: '/docs/introduction',
        permanent: true,
      },
      {
        source: '/docs/azure/azure-develop.md',
        destination: '/docs/introduction',
        permanent: true,
      },
      {
        source: '/docs/introduction/billing-azure-marketplace.md',
        destination: '/docs/introduction',
        permanent: true,
      },
      {
        source: '/docs/get-started/azure-get-started.md',
        destination: '/docs/introduction',
        permanent: true,
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

    // /:path*.md above requires at least one segment after the route name,
    // so /branching.md (no separator) doesn't match. Add explicit index rewrites.
    const indexRewrites = Object.keys(CONTENT_ROUTES)
      .filter((route) => !route.includes('/'))
      .map((route) => ({
        source: `/${route}.md`,
        destination: `/md/${route}.md`,
      }));

    return {
      // beforeFiles: serve static files from public/docs/ before the
      // docs/[...slug] catch-all intercepts them
      beforeFiles: [
        { source: '/docs/:path*/llms.txt', destination: '/docs/:path*/llms.txt' },
        { source: '/docs/llms-full.txt', destination: '/docs/llms-full.txt' },
      ],
      // afterFiles: runs after checking pages/public files but before dynamic routes
      // This ensures physical .md files are served first, with fallback to public/md/
      afterFiles: [
        // Serve /llms.txt and /llms-full.txt from /docs/ (canonical location is public/docs/)
        { source: '/llms.txt', destination: '/docs/llms.txt' },
        { source: '/llms-full.txt', destination: '/docs/llms-full.txt' },
        { source: '/docs/changelog/:path*.md', destination: '/md/changelog/:path*.md' },
        ...indexRewrites,
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
  turbopack: {
    root: __dirname,
    rules: {
      '*.inline.svg': {
        loaders: [
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
        as: '*.js',
      },
    },
    resolveAlias: {
      fs: { browser: './empty.js' },
      module: { browser: './empty.js' },
      path: { browser: './empty.js' },
      crypto: { browser: './empty.js' },
      stream: { browser: './empty.js' },
      assert: { browser: './empty.js' },
      http: { browser: './empty.js' },
      https: { browser: './empty.js' },
      os: { browser: './empty.js' },
      url: { browser: './empty.js' },
    },
  },
  env: {
    INKEEP_INTEGRATION_API_KEY: process.env.INKEEP_INTEGRATION_API_KEY,
    INKEEP_INTEGRATION_ID: process.env.INKEEP_INTEGRATION_ID,
    INKEEP_ORGANIZATION_ID: process.env.INKEEP_ORGANIZATION_ID,
  },
};

module.exports = withBundleAnalyzer(defaultConfig);
