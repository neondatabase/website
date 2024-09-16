'use client';

import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Countdown from 'react-countdown';

import CanvasVideo from 'components/shared/canvas-video';
import { HUBSPOT_DEPLOY_FORM_ID } from 'constants/forms';

import SubscriptionForm from '../subscription-form';

const TimeUnit = ({ value, unit }) => (
  <span className="inline-flex h-8 w-10 items-center justify-center rounded bg-[#0C0D0D]">
    {value.toString().padStart(2, '0')}
    {unit}
  </span>
);

TimeUnit.propTypes = {
  value: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired,
};

const renderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    return <div className="font-medium leading-none text-white">Event has started!</div>;
  }

  return (
    <span className="text-base font-medium leading-none text-white">
      <TimeUnit value={days} unit="d" /> : <TimeUnit value={hours} unit="h" /> :{' '}
      <TimeUnit value={minutes} unit="m" /> : <TimeUnit value={seconds} unit="s" />
    </span>
  );
};

const CountdownTimer = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const targetDate = new Date('2024-10-01T17:00:00Z').getTime();
  const now = new Date().getTime();
  const difference = targetDate - now;

  if (!mounted) {
    return (
      <span className="text-base font-medium leading-none text-white">
        <TimeUnit value={0} unit="d" /> : <TimeUnit value={0} unit="h" /> :{' '}
        <TimeUnit value={0} unit="m" /> : <TimeUnit value={0} unit="s" />
      </span>
    );
  }

  return <Countdown date={Date.now() + difference} renderer={renderer} />;
};

const EmailRegistrationStep = () => (
  <div className="mt-7 flex flex-col items-center overflow-hidden xl:-mt-8 lg:-mt-[109px] xs:-mt-11">
    <div className="relative w-[1049px] max-w-none lg:w-[956px] md:w-[630px] xs:w-[458px]">
      <img
        className="w-full"
        src={`data:image/svg+xml;charset=utf-8,%3Csvg width='1049' height='620' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E`}
        alt=""
        width={1049}
        height={620}
        aria-hidden
      />
      <CanvasVideo
        className="absolute bottom-0 right-0 h-full w-auto max-w-none"
        label="Neon Deploy"
        srcMp4="/videos/pages/deploy/deploy.mp4"
        srcWebm="/videos/pages/deploy/deploy.webm"
        lazyLoading={false}
        inView
      />
    </div>
    <div className="relative z-10 -mt-[204px] flex w-full max-w-[512px] flex-col items-center justify-center pb-12 text-center lg:-mt-[184px] lg:pb-8 md:-mt-36 xs:-mt-[84px]">
      <div className="relative flex flex-col items-center">
        <CountdownTimer />
        <div className="relative mt-3.5 overflow-hidden sm:mt-2.5">
          <time
            className="relative flex flex-col bg-white bg-clip-text text-[32px] leading-[1.2] tracking-tight text-transparent sm:text-[28px]"
            dateTime="2024-10-01T17:00:00Z"
            style={{
              backgroundImage: 'url(/images/deploy/ellipse.svg)',
              backgroundSize: '294px 63px',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              maskImage: 'radial-gradient(ellipse at 50% 50%, #D9D9D9 70%, transparent)',
              maskSize: '100%',
              maskRepeat: 'no-repeat',
              maskPosition: 'center',
            }}
          >
            <span>October 1st, 2024</span> <span>10:00 AM PT</span>
          </time>
        </div>
      </div>
      <p className="mt-3 max-w-[448px] text-lg font-light leading-[1.3] text-gray-new-60 sm:text-base xs:max-w-[320px]">
        Join us for presentations about Postgres, scalability, AI, and using Neon with modern
        developer tools.
      </p>
      <SubscriptionForm
        className="mt-8 lg:mt-6"
        successText="Thanks for registering!"
        submitButtonText="Register"
        size="xs"
        localStorageKey="submittedEmailDeployForm"
        formId={HUBSPOT_DEPLOY_FORM_ID}
      />
    </div>
  </div>
);

export default EmailRegistrationStep;
