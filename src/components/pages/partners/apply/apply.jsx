import clsx from 'clsx';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import Link from 'components/shared/link/link';
import LINKS from 'constants/links';

import Form from './form';

const Testimonial = ({ className = null, ariaHidden = false }) => (
  <figure className={clsx('mt-40 max-w-[464px] xl:mt-[120px]', className)} aria-hidden={ariaHidden}>
    <blockquote>
      <p className="border-l border-gray-new-60 pl-3.5 text-2xl font-light tracking-tighter xl:text-xl">
        “The combination of flexible resource limits and nearly instant database provisioning made
        Neon a no-brainer.”
      </p>
    </blockquote>
    <figcaption className="mt-6 flex flex-col text-lg leading-tight tracking-[-0.02em] xl:text-base lg:mt-5">
      Lincoln Bergeson{' '}
      <cite className="mt-1.5 not-italic text-gray-new-60">Infrastructure Engineer at Replit</cite>
    </figcaption>
  </figure>
);

Testimonial.propTypes = {
  className: PropTypes.string,
  ariaHidden: PropTypes.bool,
};

const Apply = () => (
  <section className="apply-form safe-paddings mb-40 mt-[200px] xl:mb-[120px] xl:mt-36 lg:mb-24 lg:mt-28">
    <Container className="grid-gap-x grid grid-cols-12" size="lg">
      <div className="grid-gap-x col-span-10 col-start-2 grid grid-cols-10 xl:col-span-full xl:col-start-1 xl:grid-cols-12">
        <div className="col-span-5 lg:col-span-full lg:text-center">
          <span className="inline-block rounded-[40px] bg-green-45/10 px-3.5 py-2 text-xs font-semibold uppercase leading-none text-green-45 lg:px-2.5 lg:text-[10px]">
            Apply now
          </span>
          <h2 className="mt-2 text-[56px] font-medium leading-none tracking-tighter xl:text-[44px] lg:text-4xl">
            Become a Partner
          </h2>
          <p className="lg:flat-breaks mt-4 text-lg font-light leading-snug xl:text-base">
            Not sure about the right partnership option?
            <br />
            <Link theme="green" to={LINKS.contactSales}>
              Contact us
            </Link>{' '}
            if you have questions.
          </p>

          <Testimonial className="lg:hidden" />
        </div>
        <Form className="col-span-5 xl:col-span-7 lg:col-span-full lg:mt-8" />
        <Testimonial className="col-span-full hidden lg:mt-7 lg:block" ariaHidden />
      </div>
    </Container>
  </section>
);

export default Apply;
