import PropTypes from 'prop-types';

const SliderItem = ({ text, authorName, authorTitle }) => (
  <figure className="flex min-h-[222px] flex-col items-center justify-center lg:min-h-[184px] md:min-h-[164px] sm:min-h-[190px] xs:min-h-[246px]">
    <blockquote className="mt-6 lg:mt-4">
      <p
        className="with-link-primary max-w-[796px] text-[28px] font-light leading-snug tracking-tighter lg:max-w-[584px] lg:text-2xl md:text-[23px] md:leading-tight"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </blockquote>
    <figcaption className="mt-5 text-lg leading-tight tracking-[-0.02em] text-white xl:text-base lg:mt-4 md:mt-3">
      {authorName} <cite className="font-light not-italic text-gray-new-70">– {authorTitle}</cite>
    </figcaption>
  </figure>
);

SliderItem.propTypes = {
  text: PropTypes.string.isRequired,
  authorName: PropTypes.string.isRequired,
  authorTitle: PropTypes.string.isRequired,
};

export default SliderItem;
