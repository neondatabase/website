import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import Breadcrumbs from 'components/pages/doc/breadcrumbs';
import FaqCard from 'components/pages/faqs/faq-card';
import FaqSearch from 'components/pages/faqs/faq-search';
import Socials from 'components/shared/socials';
import SEO_DATA from 'constants/seo-data';
import { getAllFaqs } from 'utils/api-faqs';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata({
  ...SEO_DATA.faqs,
});

const FaqsPage = async () => {
  const posts = await getAllFaqs();

  if (!posts) return notFound();

  const validPosts = Array.isArray(posts) ? posts.filter(Boolean) : [];

  return (
    <div className="relative min-w-0 pb-32 lg:pb-24 md:pb-20">
      <Breadcrumbs
        breadcrumbs={[
          {
            title: 'Community',
            slug: 'community/community-intro',
          },
          {
            title: 'FAQs',
          },
        ]}
      />
      <div className="relative mb-12 flex w-full items-end justify-between gap-5 lg:mb-2 md:mb-8 sm:flex-col sm:items-start sm:gap-5">
        <div>
          <h1 className="max-w-[540px] text-[56px] leading-dense tracking-tighter lt:text-[48px] lg:text-[40px] md:text-[32px] sm:text-[28px]">
            FAQs
          </h1>
        </div>
        <div className="mb-2.5 flex items-center gap-x-4 lg:mb-[60px] lg:gap-x-6 md:mb-0 sm:mb-0 [&_svg]:lg:size-4 [&_ul]:lg:gap-6">
          <Socials withTitle={false} />
        </div>
      </div>
      <Suspense fallback={null}>
        <FaqSearch
          searchInputClassName="right-0 top-3 lg:top-3 md:static! md:right-auto! md:top-auto! md:mt-4"
          posts={validPosts}
        >
          <div className="faqs">
            {validPosts.map((post) => (
              <FaqCard key={post.slug} {...post} />
            ))}
          </div>
        </FaqSearch>
      </Suspense>
    </div>
  );
};

export default FaqsPage;
