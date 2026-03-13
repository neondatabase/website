import clsx from 'clsx';
import PropTypes from 'prop-types';

import Content from 'components/shared/content';
import DocFooter from 'components/shared/doc-footer';

const contentClassName =
  'col-span-6 col-start-4 w-full max-w-[704px] 2xl:col-span-7 2xl:col-start-3 2xl:max-w-[704px] xl:col-span-12 xl:col-start-1 xl:mx-auto xl:max-w-[704px] lg:ml-0 lg:max-w-none lg:pt-0 md:mx-auto';

const Post = ({ data: { title, subtitle, updatedOn = null }, content, currentSlug }) => (
  <div className={clsx(contentClassName, 'ml-7')}>
    <h1 className="text-5xl leading-dense font-medium tracking-tighter text-wrap sm:text-[28px] lg:text-[36px] xl:text-[40px]">
      {title}
    </h1>
    {subtitle && (
      <p className="mt-[18px] text-xl leading-snug tracking-extra-tight text-gray-new-70 sm:mt-4 sm:text-lg md:text-base">
        {subtitle}
      </p>
    )}
    <div className="mt-[76px] sm:mt-10 sm:pb-8 md:pb-[70px]">
      <Content content={content} isTemplate />
      <DocFooter updatedOn={updatedOn} slug={currentSlug} />
    </div>
  </div>
);

Post.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    subtitle: PropTypes.string,
    updatedOn: PropTypes.string,
  }).isRequired,
  content: PropTypes.string.isRequired,
  currentSlug: PropTypes.string.isRequired,
};

export default Post;
