import clsx from 'clsx';
import PropTypes from 'prop-types';

import Aside from 'components/pages/doc/aside';
import Breadcrumbs from 'components/pages/doc/breadcrumbs';
import Modal from 'components/pages/doc/modal';
import MODALS from 'components/pages/doc/modal/data';
import Content from 'components/shared/content';
import DocFooter from 'components/shared/doc-footer';

const contentClassName =
  'col-span-6 col-start-4 -mx-10 2xl:col-span-7 2xl:col-start-3 2xl:mx-0 xl:col-span-10 xl:col-start-2 lg:ml-0 lg:pt-0 md:mx-auto';

const Post = ({
  data: { title, subtitle, updatedOn = null },
  content,
  breadcrumbs,
  currentSlug,
  gitHubPath,
  tableOfContents,
}) => {
  const modal = MODALS.find((modal) =>
    breadcrumbs.some((breadcrumb) => modal.pagesToShow.includes(breadcrumb.title))
  );

  return (
    <>
      <div className={contentClassName}>
        {breadcrumbs.length > 0 && (
          <Breadcrumbs breadcrumbs={breadcrumbs} currentSlug={currentSlug} />
        )}
        <h1 className="text-balance text-5xl font-semibold leading-tight tracking-extra-tight md:text-[36px] sm:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-2xl leading-snug text-[#A1A1AA] lg:text-xl md:text-lg">
            {subtitle}
          </p>
        )}
      </div>
      <div className={clsx(contentClassName, 'mt-20 lg:mt-16 md:mt-10 md:pb-[70px] sm:pb-8')}>
        <Content content={content} isTemplate />
        <DocFooter updatedOn={updatedOn} slug={currentSlug} />
      </div>

      <Aside
        className="mt-20"
        tableOfContents={tableOfContents}
        gitHubPath={gitHubPath}
        isTemplate
        enableTableOfContents
      />
      {modal && <Modal {...modal} />}
    </>
  );
};

Post.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    subtitle: PropTypes.string,
    updatedOn: PropTypes.string,
  }).isRequired,
  content: PropTypes.string.isRequired,
  breadcrumbs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  currentSlug: PropTypes.string.isRequired,
  gitHubPath: PropTypes.string.isRequired,
  tableOfContents: PropTypes.arrayOf(PropTypes.shape({})),
};

export default Post;
