const fs = require('fs');
const path = require('path');

const { BLOG_BASE_PATH, BLOG_POSTS_PER_PAGE } = require('./src/constants/blog');
const POST_AUTHORS = require('./src/constants/post-authors');
const { generateSidebar } = require('./src/utils/docs');
const getBlogPostPath = require('./src/utils/get-blog-post-path');

// We have this variable in order to decide whether to render draft posts or not
// We are rendering ALL posts, including draft ones in development mode
// And we are skipping draft posts in production mode
// We have an array structure here in order to use it in the filter using the "in" operator
const DRAFT_FILTER = process.env.NODE_ENV === 'production' ? [false] : [true, false];

// eslint-disable-next-line no-unused-vars
async function createBlogPages({ graphql, actions }) {
  const { createPage } = actions;

  const result = await graphql(
    `
      query ($draftFilter: [Boolean]!) {
        allMdx(
          filter: {
            fileAbsolutePath: { regex: "/posts/" }
            fields: { draft: { in: $draftFilter } }
          }
        ) {
          totalCount
        }
      }
    `,
    { draftFilter: DRAFT_FILTER }
  );

  if (result.errors) throw new Error(result.errors);

  const pageCount = Math.ceil(result.data.allMdx.totalCount / BLOG_POSTS_PER_PAGE);

  Array.from({ length: pageCount }).forEach((_, i) => {
    const pagePath = i === 0 ? BLOG_BASE_PATH : `${BLOG_BASE_PATH}/${i + 1}`;

    createPage({
      path: pagePath,
      component: path.resolve('./src/templates/blog.jsx'),
      context: {
        currentPageIndex: i,
        pageCount,
        limit: BLOG_POSTS_PER_PAGE,
        skip: i * BLOG_POSTS_PER_PAGE,
        draftFilter: DRAFT_FILTER,
        canonicalUrl: `${process.env.GATSBY_DEFAULT_SITE_URL}${pagePath}`,
      },
    });
  });
}

// eslint-disable-next-line no-unused-vars
async function createBlogPosts({ graphql, actions }) {
  const result = await graphql(`
    {
      allMdx(filter: { fileAbsolutePath: { regex: "/posts/" } }) {
        nodes {
          id
          slug
          fields {
            draft
          }
          frontmatter {
            title
            description
            author
          }
        }
      }
    }
  `);

  if (result.errors) throw new Error(result.errors);

  result.data.allMdx.nodes.forEach(({ id, slug, fields, frontmatter }) => {
    // Do not create a post in production if it's draft
    if (process.env.NODE_ENV === 'production' && fields.draft) return;

    // Required fields validation
    if (!frontmatter.title) {
      throw new Error(`Post with ID "${id}" does not have field "title"!`);
    }
    if (!frontmatter.description) {
      throw new Error(`Post "${frontmatter.title}" does not have field "description"!`);
    }
    if (!frontmatter.author) {
      throw new Error(`Post "${frontmatter.title}" does not have field "author"!`);
    }
    if (!Object.keys(POST_AUTHORS).includes(frontmatter.author)) {
      throw new Error(
        `Post "${frontmatter.title}" has unknown author "${frontmatter.author}"!\nPlease check an array of authors in "/src/constants/post-authors.js"`
      );
    }

    actions.createPage({
      path: getBlogPostPath(slug),
      component: path.resolve('./src/templates/blog-post.jsx'),
      context: { id },
    });
  });
}

// eslint-disable-next-line no-unused-vars
async function createStaticPages({ graphql, actions }) {
  const result = await graphql(`
    query staticPageQuery {
      allMdx(filter: { fileAbsolutePath: { regex: "/src/static-pages/" } }) {
        nodes {
          id
          slug
        }
      }
    }
  `);

  if (result.errors) throw new Error(result.errors);

  result.data.allMdx.nodes.forEach(({ id, slug }) => {
    actions.createPage({
      path: `/${slug}`,
      component: path.resolve('./src/templates/static.jsx'),
      context: { id },
    });
  });
}

async function createDocPages({ graphql, actions, reporter }) {
  const { createPage } = actions;

  const result = await graphql(`
    {
      allMdx(sort: { fields: fileAbsolutePath, order: ASC }) {
        edges {
          node {
            fileAbsolutePath
            frontmatter {
              title
              id
              sidebarLabel
            }
          }
        }
      }
    }
  `);

  if (result.errors) {
    throw new Error(result.errors);
  }

  const pages = result.data.allMdx.edges;

  const pagesById = {};
  pages.forEach(
    ({
      node: {
        frontmatter: { title, sidebarLabel, id },
      },
    }) => {
      pagesById[id] = {
        title,
        sidebarLabel,
        slug: id,
      };
    }
  );

  const docSidebar = generateSidebar(pagesById);

  pages.forEach(
    ({
      node: {
        frontmatter: { id },
      },
    }) => {
      const templatePath = path.resolve(`./src/templates/doc-page.jsx`);

      const context = { id, docSidebar };

      if (fs.existsSync(templatePath)) {
        createPage({
          path: `/docs/${id}`,
          component: templatePath,
          context,
        });
      } else {
        reporter.error(`Template "doc-page" was not found`);
      }
    }
  );
}

exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions;

  if (node.frontmatter) {
    createNodeField({
      node,
      name: 'draft',
      value: node.frontmatter.draft || false,
    });
  }
};

// eslint-disable-next-line no-unused-vars
exports.createPages = async (options) => {
  // await createBlogPages(options);
  // await createBlogPosts(options);
  // await createStaticPages(options);
  await createDocPages(options);
};
