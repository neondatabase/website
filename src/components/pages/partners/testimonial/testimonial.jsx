import Container from 'components/shared/container/container';

import quoteIcon from './images/quote.svg';

const Testimonial = () => (
  <figure className="testimonial safe-paddings mt-[200px] xl:mt-[120px] md:mt-20">
    <Container className="flex flex-col items-center text-center" size="xs">
      <img
        className="h-20 h-[72px] w-20 xl:w-[72px] lg:h-16 lg:w-16 md:h-12 md:w-12"
        src={quoteIcon}
        width={80}
        height={80}
        alt=""
        loading="lazy"
        aria-hidden
      />
      <blockquote className="mt-5 lg:mt-4">
        <p className="max-w-[842px] text-2xl font-light tracking-tighter xl:max-w-[776px] lg:text-xl">
          By partnering with Neon, Vercel’s frontend platform is now the end-to-end serverless
          solution for building on the Web, from Next.js all the way to SQL.
        </p>
      </blockquote>
      <figcaption className="mt-5 text-lg leading-tight tracking-[-0.02em] text-gray-new-70 lg:mt-4 lg:text-base md:mt-2.5">
        Guillermo Rauch, <cite className="not-italic text-gray-new-50">CEO of Vercel</cite>
      </figcaption>
    </Container>
  </figure>
);

export default Testimonial;
