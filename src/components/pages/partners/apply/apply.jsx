'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import GradientLabel from 'components/shared/gradient-label';

import PartnerForm from './partner-form';

const Testimonial = ({ className = null, ariaHidden = false }) => (
  <figure className={clsx('mt-16 max-w-[464px]', className)} aria-hidden={ariaHidden}>
    <blockquote>
      <p className="border-l border-green-45 pl-[18px] text-2xl font-normal leading-snug tracking-tighter xl:text-xl">
        The combination of flexible resource limits and nearly instant database provisioning made
        Neon a no-brainer.
      </p>
    </blockquote>
    <figcaption className="mt-4 text-base leading-tight tracking-extra-tight lg:mt-5 md:mt-4">
      Lincoln Bergeson –{' '}
      <cite className="inline font-light not-italic text-gray-new-70">
        Infrastructure engineer at Replit
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
    className="apply-form safe-paddings mt-[192px] xl:mt-40 lg:mt-32 md:mt-[90px]"
  >
    <Container className="grid-gap-x grid grid-cols-12" size="medium">
      <div className="grid-gap-x col-span-10 col-start-2 grid grid-cols-10 xl:col-span-full xl:col-start-1 xl:grid-cols-12">
        <div className="col-span-5 lg:col-span-full lg:text-center">
          <GradientLabel className="inline-block">Apply now</GradientLabel>
          <h2 className="mt-3 font-title text-[52px] font-medium leading-none tracking-extra-tight xl:text-[44px] lg:text-4xl md:text-[32px]">
            Become a Partner
          </h2>
          <p className="md:flat-breaks sm:flat-none mt-3 text-lg font-light leading-snug xl:text-base">
            Start the process here and our partnerships team will reach out to you.
          </p>
          <Testimonial className="lg:hidden" />
        </div>
        <div className="col-span-5 xl:col-span-7 lg:col-span-full lg:mt-10 md:mt-6">
          <PartnerForm />
        </div>
        <Testimonial className="col-span-full hidden lg:mt-10 lg:block md:mt-8" ariaHidden />
      </div>
    </Container>
  </section>
);

export default Apply;
