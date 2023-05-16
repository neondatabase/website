/* eslint-disable no-unused-vars */

'use client';

import { useState } from 'react';
import useCookie from 'react-use/lib/useCookie';
import useLocation from 'react-use/lib/useLocation';

import Button from 'components/shared/button/button';
import LinesIllustration from 'components/shared/lines-illustration';
import { HUBSPOT_NEWSLETTERS_FORM_ID } from 'constants/forms';
import useLocalStorage from 'hooks/use-local-storage';
import { doNowOrAfterSomeTime, emailRegexp, sendHubspotFormData } from 'utils/forms';

const SubscribeForm = () => {
  const [email, setEmail] = useState('');
  // TODO: add form states to the component

  const [formState, setFormState] = useState('default');
  const [submittedEmail, setSubmittedEmail] = useLocalStorage('submittedEmailNewsletterForm', []);
  const [errorMessage, setErrorMessage] = useState('');
  const [hubspotutk] = useCookie('hubspotutk');
  const { href } = useLocation();
  const handleInputChange = (event) => setEmail(event.currentTarget.value.trim());

  const context = {
    hutk: hubspotutk,
    pageUri: href,
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email) {
      setErrorMessage('Please enter your email');
    } else if (!emailRegexp.test(email)) {
      setErrorMessage('Please enter a valid email');
    } else if (submittedEmail.includes(email)) {
      setErrorMessage('You have already submitted this email');
    } else {
      setSubmittedEmail([...submittedEmail, email]);
      setErrorMessage('');
      setFormState('loading');

      const loadingAnimationStartedTime = Date.now();

      sendHubspotFormData({
        formId: HUBSPOT_NEWSLETTERS_FORM_ID,
        context,
        values: [
          {
            name: 'email',
            value: email,
          },
        ],
      })
        .then((response) => {
          if (response.ok) {
            doNowOrAfterSomeTime(() => {
              setFormState('success');
              setEmail('Thank you for subscribing!');

              setTimeout(() => {
                setFormState('default');
                setEmail('');
              }, 2000);
            }, loadingAnimationStartedTime);
          } else {
            doNowOrAfterSomeTime(() => {
              setFormState('error');
              setErrorMessage('Something went wrong. Please reload the page and try again');
            }, loadingAnimationStartedTime);
          }
        })
        .catch(() => {
          doNowOrAfterSomeTime(() => {
            setFormState('error');
            setErrorMessage('Something went wrong. Please reload the page and try again');
          }, loadingAnimationStartedTime);
        });
    }
  };
  return (
    <section className="subscribe-form safe-paddings overflow-hidden pt-[118px] pb-[125px] xl:pt-[104px] xl:pb-[123px] lg:pt-20 lg:pb-28">
      <div className="mx-auto flex max-w-[1166px] items-center justify-between 2xl:px-10 lg:flex-col lg:px-8 md:px-4">
        <div className="relative z-20 lg:text-center">
          <h2 className="text-4xl leading-none tracking-tighter xl:text-[36px] sm:text-[32px]">
            Subscribe to <mark className="bg-transparent text-green">Neon’s News</mark>
          </h2>
          <p className="mt-3.5 text-lg leading-tight tracking-[-0.02em] text-gray-new-80 lg:mt-2.5">
            Get insider access to Neon's latest news and events
          </p>
        </div>
        <form
          className="relative w-full max-w-[518px] xl:max-w-[456px] lg:mt-5"
          onSubmit={handleSubmit}
        >
          <div className="relative z-20">
            <input
              className="h-14 w-full appearance-none rounded-[50px] border border-green bg-black-new pl-7 pr-36 placeholder:text-white/60 focus:outline-none"
              type="email"
              name="email"
              placeholder="Your email address..."
              onChange={handleInputChange}
            />
            <Button
              className="absolute inset-y-2 right-2 h-10"
              size="xs"
              theme="primary"
              type="submit"
            >
              Subscribe
            </Button>
          </div>
          <LinesIllustration className="z-10 w-full" spread={4} color="#00E599" size="sm" />
        </form>
      </div>
    </section>
  );
};

SubscribeForm.propTypes = {};

export default SubscribeForm;
