'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import useHubspotForm from 'hooks/use-hubspot-form';

import 'styles/hubspot-form.css';

const hubspotFormID = '1bf5e212-bb19-4358-9666-891021ce386c';

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

const Apply = () => {
  useHubspotForm('hubspot-form');

  return (
    <section
      id="request-trial"
      className="apply-form safe-paddings pb-40 pt-[240px] xl:pb-[120px] xl:pt-40 lg:pb-24 lg:pt-32 md:pb-20 md:pt-[90px]"
    >
      <Container className="grid-gap-x grid grid-cols-12" size="medium">
        <div className="grid-gap-x col-span-10 col-start-2 grid grid-cols-10 xl:col-span-full xl:col-start-1 xl:grid-cols-12">
          <div className="col-span-5 lg:col-span-full lg:text-center">
            <span className="inline-block rounded-[40px] bg-green-45/10 px-3.5 py-2 text-xs font-semibold uppercase leading-none tracking-[0.02em] text-green-45">
              Apply now
            </span>
            <h2 className="mt-3 text-5xl font-medium leading-none tracking-[-0.02em] xl:text-[44px] lg:text-4xl md:text-[32px]">
              Request an Enterprise Trial
            </h2>
            <p className="md:flat-breaks sm:flat-none mt-3 text-lg font-light leading-snug xl:text-base">
              Apply here for a time-limited full access trial of Neon for your business, including
              custom resource limits and technical support.
            </p>
            <Testimonial className="lg:hidden" />
          </div>
          <div className="hubspot-form-wrapper col-span-5 xl:col-span-7 lg:col-span-full lg:mt-10 md:mt-6">
            <div
              className="hubspot-form not-prose with-link-primary"
              data-form-id={hubspotFormID}
            />
          </div>
          <Testimonial className="col-span-full hidden lg:mt-10 lg:block md:mt-8" ariaHidden />
        </div>
      </Container>
    </section>
  );
};

export default Apply;
