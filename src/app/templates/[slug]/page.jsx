import Image from 'next/image';
import { notFound } from 'next/navigation';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import Layout from 'components/shared/layout';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import BackIcon from 'images/pages/templates/back.inline.svg';
import GitHubIcon from 'images/pages/templates/github.inline.svg';
import NetlifyIcon from 'images/pages/templates/netlify.inline.svg';
import RenderIcon from 'images/pages/templates/render.inline.svg';
import VercelIcon from 'images/pages/templates/vercel.inline.svg';
import templates from 'utils/data/templates';
import getMetadata from 'utils/get-metadata';

export async function generateMetadata({ params }) {
  const { slug } = params;
  const template = templates.find((template) => template.slug === slug);
  if (!template) return notFound();
  const { name, description } = template;
  return getMetadata({
    title: `${name} - Neon Templates`,
    description,
  });
}
export async function generateStaticParams() {
  return templates.map((template) => ({
    slug: template.slug,
  }));
}

const TemplatePage = ({ params }) => {
  const { slug } = params;
  const template = templates.find((template) => template.slug === slug);
  if (!template) return notFound();

  const { name, description, framework, type, css, cms, publisher, githubUrl } = template;
  const items = [
    {
      label: 'Framework',
      value: framework,
    },
    {
      label: 'Use Case',
      value: type,
    },
    {
      label: 'CSS',
      value: css,
    },
    {
      label: 'CMS',
      value: cms,
    },
    {
      label: 'Publisher',
      value: publisher,
    },
  ];
  return (
    <Layout headerWithBorder burgerWithoutBorder isHeaderSticky hasThemesSupport>
      <Container
        className="relative mb-[104px] mt-12 w-full xl:mb-24 xl:mt-10 lg:mb-20 lg:mt-8 sm:mb-[72px] sm:mt-6"
        size="1344"
      >
        <Link
          className="absolute left-8 top-0 flex items-center gap-x-1.5 font-medium leading-normal tracking-extra-tight text-gray-new-50 transition-colors duration-200 hover:text-green-45 dark:text-gray-new-60 dark:hover:text-green-45 lg:static lg:mx-auto lg:max-w-[512px]"
          to={LINKS.templates}
        >
          <BackIcon />
          Back To Templates
        </Link>

        <div className="mx-auto max-w-[512px] lg:mt-5">
          <h1 className="font-title text-[44px] font-medium leading-none tracking-extra-tight xl:text-4xl lg:text-[32px] sm:text-[28px]">
            {name}
          </h1>
          <p className="mt-3 text-lg font-light leading-snug tracking-extra-tight text-gray-new-20 dark:text-gray-new-80 sm:mt-2 sm:text-base">
            {description}
          </p>
          <ul className="mt-10 xl:mt-8 lg:mt-7 sm:mt-6">
            {items.map(
              (item) =>
                item.value.length > 0 && (
                  <li
                    className="flex justify-between border-t border-gray-new-80/80 py-3.5 last:border-b dark:border-gray-new-15/80 sm:py-3"
                    key={item.label}
                  >
                    <span className="font-medium leading-tight tracking-extra-tight text-gray-new-20 dark:text-gray-new-90">
                      {item.label}
                    </span>
                    <span className="leading-tight tracking-extra-tight text-gray-new-30 dark:text-gray-new-70">
                      {typeof item.value === 'string' ? item.value : item.value.join(', ')}
                    </span>
                  </li>
                )
            )}
          </ul>
          <div className="mt-10 flex justify-between xl:mt-8 lg:mt-7 sm:mt-6">
            <div className="flex flex-col gap-y-2.5">
              <Link
                className="flex items-center gap-x-1.5 leading-none tracking-extra-tight sm:text-sm"
                theme="black"
                to={template.githubUrl}
              >
                <GitHubIcon /> View Repo
              </Link>
              <Link
                className="flex items-center gap-x-1.5 leading-none tracking-extra-tight sm:text-sm"
                theme="black"
                to={`https://app.netlify.com/start/deploy?repository=${githubUrl}#DATABASE_URL`}
              >
                <NetlifyIcon /> Deploy to Netlify
              </Link>
            </div>
            <div className="flex flex-col gap-y-2.5">
              <Link
                className="flex items-center gap-x-1.5 leading-none tracking-extra-tight sm:text-sm"
                theme="black"
                to={`https://vercel.com/new/clone?repository-url=${githubUrl}&env=DATABASE_URL`}
              >
                <VercelIcon /> Deploy to Vercel
              </Link>
              <Link
                className="flex items-center gap-x-1.5 leading-none tracking-extra-tight sm:text-sm"
                theme="black"
                to={`https://render.com/deploy?repo=${githubUrl}#DATABASE_URL`}
              >
                <RenderIcon /> Deploy to Render
              </Link>
            </div>
          </div>
          <Image
            className="mt-12 lg:mt-10"
            src={`https://neon.tech/docs/og?title=${btoa(name)}&breadcrumb=${btoa('Templates')}`}
            alt={`Thumbnail - ${name}`}
            width={512}
            height={288}
          />
        </div>
      </Container>
    </Layout>
  );
};

TemplatePage.propTypes = {
  params: PropTypes.shape({
    slug: PropTypes.string.isRequired,
  }).isRequired,
};

export default TemplatePage;
