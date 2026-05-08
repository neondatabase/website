import PropTypes from 'prop-types';

const BlogPreviewBanner = ({ branch, commitSha = null }) => (
  <div className="mb-8 rounded-lg border border-green-45/30 bg-green-45/10 px-4 py-3 text-sm leading-snug text-gray-new-90 dark:text-white">
    <strong className="font-medium">Previewing blog branch</strong>
    <span className="ml-2 font-mono text-[13px] tracking-extra-tight text-green-45 uppercase">
      {branch}
    </span>
    {commitSha && (
      <span className="ml-3 font-mono text-[13px] tracking-extra-tight text-gray-new-60 uppercase">
        {commitSha.slice(0, 7)}
      </span>
    )}
  </div>
);

BlogPreviewBanner.propTypes = {
  branch: PropTypes.string.isRequired,
  commitSha: PropTypes.string,
};

export default BlogPreviewBanner;
