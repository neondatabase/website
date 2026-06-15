import PropTypes from 'prop-types';
import { Suspense } from 'react';

import Breadcrumbs from 'components/pages/doc/breadcrumbs';
import FaqCard from 'components/pages/faqs/faq-card';
import FaqSearch from 'components/pages/faqs/faq-search';

const FAQS_HUB_BASE_PATH = '/docs/faqs';

const FaqsIndex = ({ posts }) => (
  <>
    <div className="relative min-w-0 grow pb-32 lg:pb-24 md:pb-20">
      <Breadcrumbs className="mb-7!" breadcrumbs={[{ title: 'FAQs' }]} />
      <div className="relative mb-10 flex w-full items-end justify-between gap-5 md:mb-8 sm:flex-col sm:items-start sm:gap-5">
        <div className="max-w-2xl">
          <h1 className="text-[56px] leading-dense tracking-tighter lt:text-[48px] lg:text-[40px] md:text-[32px] sm:text-[28px]">
            FAQs
          </h1>
          <p className="mt-4 text-lg leading-snug tracking-extra-tight text-gray-new-40 dark:text-gray-new-70 sm:mt-2">
            Quick answers to common questions, each linking to the full documentation.
          </p>
        </div>
      </div>
      <Suspense fallback={null}>
        <FaqSearch
          posts={posts}
          basePath={FAQS_HUB_BASE_PATH}
          searchInputClassName="right-0 top-3 lg:top-3 md:static! md:right-auto! md:top-auto! md:mt-4"
        >
          <div className="faqs">
            {posts.map((post) => (
              <FaqCard key={post.slug} {...post} basePath={FAQS_HUB_BASE_PATH} />
            ))}
          </div>
        </FaqSearch>
      </Suspense>
    </div>
    {/* Spacer matching the docs "On this page" rail width so the hub body aligns with FAQ pages. */}
    <div className="w-[312px] shrink-0 xl:hidden" aria-hidden />
  </>
);

FaqsIndex.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      subtitle: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default FaqsIndex;
