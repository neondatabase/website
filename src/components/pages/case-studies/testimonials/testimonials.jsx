import Image from 'next/image';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import triangleIcon from 'icons/triangle.svg';
import backgroundSvg from 'images/pages/case-studies/testimonials/background.svg';

const TestimonialCard = ({ quote, author, logo, title }) => (
  <article className="flex h-[274px] flex-col justify-between lg:h-auto">
    <div className="flex flex-col gap-9 lg:gap-6 md:gap-5">
      <Image
        src={logo.mediaItemUrl}
        alt={title}
        width={logo.mediaDetails.width}
        height={logo.mediaDetails.height}
        className="h-8 w-fit sm:h-6"
      />
      <blockquote
        className="font-mono text-[20px] leading-snug font-normal -tracking-wide text-black xl:text-lg md:text-base [&_mark]:bg-green-44/70"
        dangerouslySetInnerHTML={{ __html: quote }}
      />
    </div>
    <div className="mt-auto flex flex-col gap-1 lg:mt-5">
      <span className="font-mono text-[15px] leading-snug font-medium -tracking-wide text-[#242628]">
        {author.name}
      </span>
      <span className="font-mono text-[15px] leading-snug font-normal -tracking-wide text-[#242628]">
        {author.post}
      </span>
    </div>
  </article>
);

TestimonialCard.propTypes = {
  quote: PropTypes.string.isRequired,
  author: PropTypes.shape({
    name: PropTypes.string.isRequired,
    post: PropTypes.string.isRequired,
  }).isRequired,
  logo: PropTypes.shape({
    mediaItemUrl: PropTypes.string.isRequired,
    mediaDetails: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  title: PropTypes.string.isRequired,
};

const Testimonials = ({ items }) => (
  <section className="relative overflow-hidden bg-[#E4F1EB] py-40 safe-paddings text-black-pure xl:py-20 lg:py-16 md:py-14">
    <Image
      src={backgroundSvg}
      alt=""
      width={1175}
      height={896}
      className="pointer-events-none absolute top-0 right-0 h-full w-auto md:hidden"
      aria-hidden
    />
    <Container size="small" className="relative z-10">
      <div className="flex flex-col border-l border-gray-new-50 pr-8 pl-8 xl:pr-0 xl:pl-6 lg:pl-[18px] sm:border-l-0 sm:pl-0">
        <div className="flex items-end gap-2 sm:gap-1.5">
          <Image
            src={triangleIcon}
            alt=""
            width={12}
            height={14}
            className="sm:h-2.5 sm:w-2.5"
            aria-hidden
          />
          <span className="font-mono text-xs leading-none font-medium text-[#303236] uppercase sm:text-[10px]">
            backed by giants
          </span>
        </div>
        <h2 className="mt-5 max-w-[800px] text-[48px] leading-dense font-normal tracking-tighter text-black xl:max-w-[667px] xl:text-[40px] lt:max-w-[600px] lt:text-[36px] lg:max-w-[533px] lg:text-[32px] md:max-w-[400px] md:text-2xl sm:max-w-none sm:text-[28px]">
          Powering ambitious product teams{' '}
          <span className="text-gray-new-40">of all shapes and sizes with Postgres.</span>
        </h2>
        <div className="mt-40 grid grid-cols-3 gap-16 2xl:gap-12 xl:mt-36 xl:gap-10 lg:mt-16 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-12 md:mt-14 sm:grid-cols-1 sm:gap-y-14">
          {items.map((item) => (
            <TestimonialCard key={item.id} {...item} />
          ))}
        </div>
      </div>
    </Container>
  </section>
);

Testimonials.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      quote: PropTypes.string.isRequired,
      author: PropTypes.shape({
        name: PropTypes.string.isRequired,
        post: PropTypes.string.isRequired,
      }).isRequired,
      logo: PropTypes.shape({
        mediaItemUrl: PropTypes.string.isRequired,
        mediaDetails: PropTypes.shape({
          width: PropTypes.number.isRequired,
          height: PropTypes.number.isRequired,
        }).isRequired,
      }).isRequired,
    })
  ).isRequired,
};

export default Testimonials;
