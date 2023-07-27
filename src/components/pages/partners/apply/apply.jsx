import clsx from 'clsx';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import Link from 'components/shared/link/link';
import LINKS from 'constants/links';

import Form from './form';

const Testimonial = ({ className = null, ariaHidden = false }) => (
  <figure className={clsx('mt-16 max-w-[464px]', className)} aria-hidden={ariaHidden}>
    <blockquote>
      <p className="border-l border-green-45 pl-[18px] text-2xl font-normal leading-snug tracking-tighter xl:text-xl">
        The combination of flexible resource limits and nearly instant database provisioning made
        Neon a no-brainer.
      </p>
    </blockquote>
    <figcaption className="mt-4 text-base leading-tight tracking-[-0.02em] lg:mt-5 md:mt-4">
      Lincoln Bergeson –{' '}
      <cite className="inline font-light not-italic text-gray-new-70">
        Infrastructure Engineer at Replit
      </cite>
    </figcaption>
  </figure>
);

Testimonial.propTypes = {
  className: PropTypes.string,
  ariaHidden: PropTypes.bool,
};

const Apply = () => (
  <section
    id="partners-apply"
    className="apply-form safe-paddings pb-40 pt-[240px] xl:pb-[120px] xl:pt-40 lg:pb-24 lg:pt-32 md:pb-20 md:pt-[90px]"
  >
    <Container className="grid-gap-x grid grid-cols-12" size="medium">
      <div className="grid-gap-x col-span-10 col-start-2 grid grid-cols-10 xl:col-span-full xl:col-start-1 xl:grid-cols-12">
        <div className="col-span-5 lg:col-span-full lg:text-center">
          <span className="inline-block rounded-[40px] bg-green-45/10 px-3.5 py-2 text-xs font-semibold uppercase leading-none tracking-[0.02em] text-green-45">
            Apply now
          </span>
          <h2 className="mt-3 text-[52px] font-medium leading-none tracking-[-0.02em] xl:text-[44px] lg:text-4xl md:text-[32px]">
            Become a Partner
          </h2>
          <p className="md:flat-breaks sm:flat-none mt-3 text-lg font-light leading-snug xl:text-base">
            Not sure about the right partnership option?
            <br />
            <Link
              className="inline-block leading-tight text-green-45 underline decoration-green-45/40 decoration-1 underline-offset-[6px] transition-colors hover:decoration-transparent"
              to={LINKS.contactSales}
            >
              Contact us
            </Link>{' '}
            if you have questions.
          </p>

          <Testimonial className="lg:hidden" />
        </div>
        <Form className="col-span-5 xl:col-span-7 lg:col-span-full lg:mt-10 md:mt-6" />
        <Testimonial className="col-span-full hidden lg:mt-10 lg:block md:mt-8" ariaHidden />
      </div>
    </Container>
  </section>
);

export default Apply;
