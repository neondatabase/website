import PropTypes from 'prop-types';

import Aside from 'components/pages/doc/aside';
import Breadcrumbs from 'components/pages/doc/breadcrumbs';
import DropdownMenu from 'components/pages/doc/dropdown-menu';
import Modal from 'components/pages/doc/modal';
import MODALS from 'components/pages/doc/modal/data';
import selectModal from 'components/pages/doc/modal/select-modal';
import Content from 'components/shared/content';
import DocFooter from 'components/shared/doc-footer';
import NavigationLinks from 'components/shared/navigation-links';
import { GUIDES_BASE_PATH } from 'constants/guides';

// Same pieces as the docs Post, laid out like a blog article: the reading column is centered
// on the page and the table of contents / author rail sits to its right, level with the body.
const GuidePost = ({
  data: { title, subtitle, enableTableOfContents = false },
  content,
  breadcrumbs,
  navigationLinks: { previousLink, nextLink },
  currentSlug,
  gitHubPath,
  tableOfContents,
  author,
}) => {
  const modal = selectModal(MODALS, `${GUIDES_BASE_PATH}${currentSlug}`);

  return (
    <>
      <div className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_minmax(0,52rem)_minmax(296px,1fr)] content-start pb-32 xl:grid-cols-[minmax(0,1fr)_minmax(0,52rem)_minmax(0,1fr)] lg:block lg:pb-24 md:pb-20">
        <article className="contents">
          <header className="col-start-2 min-w-0">
            {breadcrumbs?.length > 0 && <Breadcrumbs className="mb-7!" breadcrumbs={breadcrumbs} />}
            <div className="flex items-start justify-between gap-6 sm:flex-col sm:items-stretch sm:gap-4">
              <div className="max-w-xl 2xl:max-w-[520px]">
                <h1 className="text-[36px] leading-tight font-medium tracking-tighter text-balance md:text-[28px]">
                  {title}
                </h1>
                {subtitle && (
                  <p className="mt-[1.125rem] text-xl leading-tight tracking-extra-tight text-gray-new-40 dark:text-gray-new-70 md:mt-1.5 md:text-lg">
                    {subtitle}
                  </p>
                )}
              </div>
              <DropdownMenu gitHubPath={gitHubPath} />
            </div>
          </header>
          <div className="col-start-2 min-w-0">
            <Content className="mt-10 lg:mt-7 md:mt-5" content={content} />
            <DocFooter slug={currentSlug} gitHubPath={gitHubPath} />
            <NavigationLinks
              className="mt-6"
              previousLink={previousLink}
              nextLink={nextLink}
              basePath={GUIDES_BASE_PATH}
            />
          </div>
        </article>
        <Aside
          className="col-start-3 row-start-2 mt-10 ml-16! w-auto 2xl:ml-10!"
          enableTableOfContents={enableTableOfContents}
          tableOfContents={tableOfContents}
          gitHubPath={gitHubPath}
          author={author}
        />
      </div>
      {modal && <Modal {...modal} />}
    </>
  );
};

GuidePost.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    enableTableOfContents: PropTypes.bool,
  }).isRequired,
  content: PropTypes.string.isRequired,
  breadcrumbs: PropTypes.arrayOf(PropTypes.shape({})),
  navigationLinks: PropTypes.exact({
    previousLink: PropTypes.shape({}),
    nextLink: PropTypes.shape({}),
  }).isRequired,
  currentSlug: PropTypes.string.isRequired,
  gitHubPath: PropTypes.string.isRequired,
  tableOfContents: PropTypes.arrayOf(PropTypes.shape({})),
  author: PropTypes.shape({
    slug: PropTypes.string,
    name: PropTypes.string.isRequired,
    position: PropTypes.string,
    bio: PropTypes.string,
    link: PropTypes.shape({
      url: PropTypes.string,
      title: PropTypes.string,
    }),
    photo: PropTypes.string,
  }),
};

export default GuidePost;
