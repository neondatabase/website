import clsx from 'clsx';
import { StaticImage } from 'gatsby-plugin-image';
import React, { useState } from 'react';

import Button from 'components/shared/button';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import logoBlack from 'images/logo-black.svg';
import logoWhite from 'images/logo-white.svg';

import CheckIcon from './images/check.inline.svg';

const emailRegexp =
  // eslint-disable-next-line no-control-regex, no-useless-escape
  /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;

const Hero = () => {
  const [email, setEmail] = useState('');
  const [formState, setFormState] = useState('default');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (event) => setEmail(event.currentTarget.value.trim());

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email) {
      setErrorMessage('Please enter your email');
    } else if (!emailRegexp.test(email)) {
      setErrorMessage('Please enter a valid email');
    } else {
      setErrorMessage('');
      setFormState('readonly');

      fetch('https://submit-form.com/nHIBlORO', {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ email }),
      })
        .then((response) => {
          if (response.ok) {
            setEmail('Thanks for joining the waitlist!');
          } else {
            setFormState('default');
            setErrorMessage('Something went wrong. Please reload the page and try again');
          }
        })
        .catch(() => {
          setFormState('error');
          setErrorMessage('Something went wrong. Please reload the page and try again');
        });
    }
  };

  return (
    <section className="safe-paddings flex h-screen min-h-[760px] lg:h-auto lg:min-h-screen lg:flex-col">
      <div className="relative max-w-[520px] bg-black p-8 text-white lg:order-last lg:max-w-none lg:py-7 md:px-4">
        <Link className="inline-block align-top lg:hidden" to="/">
          <img src={logoWhite} alt="Neon" />
        </Link>
        <h2 className="mt-12 text-[28px] font-bold lg:mt-0 lg:max-w-[450px] md:text-[26px]">
          Get serverless, fault-tolerant, branchable Postgresql for free
        </h2>
        <p className="mt-5 border-t border-t-[#2E3338] pt-5 font-semibold">Free Tier includes:</p>
        <ul className="mt-5 space-y-4">
          {['compute up to 1 vCPU / 256 MB', 'up to 10 GB storage', '3 clusters per user'].map(
            (item, index) => (
              <li className="flex items-center space-x-2 font-bold" key={index}>
                <CheckIcon />
                <span>{item}</span>
              </li>
            )
          )}
        </ul>
        <StaticImage
          className="!absolute bottom-0 right-0 lg:hidden"
          src="./images/illustration.png"
          alt=""
          aria-hidden
        />
      </div>
      <div className="flex grow items-center justify-center">
        <div className="max-w-[470px] lg:pb-10 lg:pt-3.5 md:w-full md:max-w-none md:px-4">
          <Link className="lg:alight-top hidden lg:inline-block" to="/">
            <img src={logoBlack} alt="Neon" />
          </Link>
          <h1 className="text-[28px] font-bold lg:mt-10 md:text-[26px]">Get early access</h1>
          <p className="mt-2.5">Neon is in beta, please submit your email to join the waitlist</p>
          <form className="mt-7 lg:mt-5" noValidate onSubmit={handleSubmit}>
            <div className="relative">
              <input
                className={clsx(
                  'remove-autocomplete-styles h-11 w-full rounded border border-[#c7ccd1] px-3.5',
                  errorMessage && 'border-[#FF4C79]'
                )}
                name="email"
                type="email"
                value={email}
                placeholder="Email address..."
                autoComplete="email"
                style={{ boxShadow: '0px 1px 2px rgba(23, 26, 28, 0.06)' }}
                readOnly={formState === 'readonly'}
                onChange={handleInputChange}
              />
              {errorMessage && (
                <span className="absolute left-0 -bottom-1 w-full translate-y-full text-[12px] font-semibold text-[#FF4C79]">
                  {errorMessage}
                </span>
              )}
            </div>
            <div className="mt-7 flex items-center justify-between lg:mt-6 lg:flex-col lg:items-center lg:justify-center lg:space-y-6">
              <Button size="xs" theme="primary">
                Join the waitlist
              </Button>
              <p className="text-[14px]">
                Already have an account?{' '}
                <Link className="font-semibold text-[#0D80F2] hover:underline" to={LINKS.dashboard}>
                  Log In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Hero;
