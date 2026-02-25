import Image from 'next/image';
import { PropTypes } from 'prop-types';

const Testimonial = ({ text, author, authorPosition, authorPhoto }) => (
  <figure className="not-prose relative my-7 w-full border-l-2 border-green-44 pl-6 [&_a]:text-white [&_a]:underline [&_a]:decoration-white/40 [&_a]:decoration-dashed [&_a]:underline-offset-4 [&_a]:transition-colors hover:[&_a]:decoration-white">
    <blockquote className="font-mono text-xl font-normal leading-snug tracking-tighter text-white">
      <span
        className="box-decoration-clone p-0.5 [&>strong]:bg-green-52/60 [&>strong]:font-normal"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </blockquote>
    <figcaption className="mt-5 flex items-center gap-x-2.5">
      {authorPhoto && (
        <Image
          className="pointer-events-none size-8 rounded-full"
          src={authorPhoto.src}
          width={32}
          height={32}
          alt=""
        />
      )}
      <div className="text-base">
        <span className="font-medium text-white" dangerouslySetInnerHTML={{ __html: author }} />
        {authorPosition && (
          <span className="text-gray-new-70">
            <span className="mx-1.5">—</span>
            <cite className="not-italic" dangerouslySetInnerHTML={{ __html: authorPosition }} />
          </span>
        )}
      </div>
    </figcaption>
  </figure>
);

Testimonial.propTypes = {
  text: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  authorPosition: PropTypes.string,
  authorPhoto: PropTypes.shape({
    src: PropTypes.string,
  }),
};

export default Testimonial;
