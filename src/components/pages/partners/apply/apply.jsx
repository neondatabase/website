'use client';

import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { InlineWidget } from 'react-calendly';

import Container from 'components/shared/container';
import GradientLabel from 'components/shared/gradient-label';
import useHubspotForm from 'hooks/use-hubspot-form';

import 'styles/hubspot-form.css';
import 'styles/calendly-widget.css';
import CloseIcon from './images/close.inline.svg';

const calendlyURL = 'https://calendly.com/d/ckxx-b4h-69y/neon-solutions-engineering';
const hubspotFormID = '26f1ff16-e3ab-4adf-b09f-910f130637b0';

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

const Apply = () => {
  const [userData, setUserData] = useState({
    email: '',
    name: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useHubspotForm('hubspot-form', {
    onFormSubmitted: (form, data) => {
      const { submissionValues } = data;
      const name = `${submissionValues.firstname || ''} ${submissionValues.lastname || ''}`.trim();

      setIsModalOpen(true);
      setUserData({
        email: submissionValues.email || '',
        name,
      });
    },
  });

  const handleOpenChange = () => {
    setIsModalOpen(false);
  };

  return (
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
              Start the process here. You'll be able to schedule a meeting with our partnerships
              team as a next step.
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
      <Dialog.Root open={isModalOpen} onOpenChange={handleOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[150] bg-[rgba(12,13,13,0.2)] data-[state=closed]:animate-fade-out-overlay data-[state=open]:animate-fade-in-overlay dark:bg-black/80" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[150] mx-auto max-h-[85vh] w-full max-w-[756px] -translate-x-1/2 -translate-y-1/2 lg:h-full lg:max-h-full lg:max-w-full">
            <div className="relative flex h-full max-h-[85vh] flex-col rounded-[10px] border border-gray-new-20 bg-gray-new-8 pt-4 text-white shadow-[4px_4px_10px_rgba(0,0,0,0.5)] data-[state=closed]:animate-dialog-hide data-[state=open]:animate-dialog-show lg:h-full lg:max-h-screen lg:rounded-none">
              <div className="mt-6 flex h-full max-h-[calc(100vh_-_62px)] flex-col overflow-y-auto pb-12 md:mt-12">
                <div className="calendly-spinner">
                  <div className="calendly-bounce1" />
                  <div className="calendly-bounce2" />
                  <div className="calendly-bounce3" />
                </div>
                <InlineWidget
                  url={calendlyURL}
                  pageSettings={{
                    backgroundColor: '131415',
                    primaryColor: '00e599',
                    textColor: 'ffffff',
                    hideGdprBanner: true,
                  }}
                  prefill={userData}
                />
              </div>
              <Dialog.Close asChild>
                <button
                  className="absolute right-5 top-4 flex h-6 w-6 items-center justify-center"
                  aria-label="Close"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                >
                  <CloseIcon className="h-4 w-4 text-gray-new-60 dark:text-gray-new-50" />
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
};

export default Apply;
