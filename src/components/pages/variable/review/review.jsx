import { PropTypes } from 'prop-types';

const Review = ({ text, author, company }) => (
  <div className="mt-14 w-full rounded-lg border border-white/10 bg-[#0D0E10] pb-8 pl-14 pr-11 pt-14">
    <p className="text-xl">{text}</p>
    <div className="mt-5 flex items-center justify-between">
      <div className="text-lg">
        <span className="text-gray-new-60">{author}</span>{' '}
        <span className="text-gray-new-40">- {company}</span>
      </div>
      <div className="text-sm font-medium">Case study</div>
    </div>
  </div>
);

Review.propTypes = {
  text: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
};

export default Review;
