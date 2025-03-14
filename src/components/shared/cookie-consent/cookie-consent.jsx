'use client';

import { useEffect, useState } from 'react';

import Link from 'components/shared/link';
import LINKS from 'constants/links';
import sendGtagEvent from 'utils/send-gtag-event';

import Button from '../button';

const CookieConsent = ({}) => {
  const [visible, setVisible] = useState(false);

  const consentAll = () => {
    if (window.zaraz && window.zaraz.consent) {
      window.zaraz.consent.setAll(true);
      window.zaraz.consent.sendQueuedEvents();
    }
    sendGtagEvent('cookie_consent', { action: 'accept_all' });
    setVisible(false);
  };

  const rejectAll = () => {
    if (window.zaraz && window.zaraz.consent) {
      window.zaraz.consent.setAll(false);
    }
    sendGtagEvent('cookie_consent', { action: 'reject_all' });
    setVisible(false);
  };

  useEffect(() => {
    window.addEventListener(
      'showCookieConsentDialog',
      () => {
        setVisible(true);
      },
      false
    );
  }, []);

  return visible ? (
    <div className="fixed bottom-4 left-4 z-50 flex max-w-[503px] items-center gap-x-10 rounded-lg border border-gray-new-94 bg-white p-4 shadow-[0px_14px_20px_0px_rgba(0,0,0,.1)] dark:border-[#16181D] dark:bg-[#0B0C0F] dark:shadow-[0px_14px_20px_0px_rgba(0,0,0,0.10)] md:bottom-4 md:left-4 md:right-4 sm:flex-col sm:items-start sm:gap-y-4">
      <p className="text-sm font-light leading-snug tracking-extra-tight text-gray-new-40 dark:text-gray-new-80">
        We use cookies to improve our services. Learn more in our{' '}
        <Link
          className="whitespace-nowrap font-normal text-black-new underline decoration-black-new underline-offset-4 transition-colors duration-300 hover:decoration-black-new/40 dark:text-white dark:decoration-white/40 dark:hover:decoration-white/100"
          to={LINKS.cookiePolicy}
        >
          Cookie Policy
        </Link>
        .
      </p>
      <div className="flex gap-x-3.5">
        <Button
          className="border border-gray-new-90 bg-transparent font-medium text-black hover:border-gray-new-70 dark:border-[#2E3038] dark:text-white dark:hover:border-primary-2"
          size="xxs"
          onClick={rejectAll}
        >
          Opt out
        </Button>
        <Button
          className="bg-gray-new-10 font-medium text-white hover:bg-gray-new-20 dark:bg-gray-new-94 dark:text-black dark:hover:bg-gray-6"
          size="xxs"
          onClick={consentAll}
        >
          Accept
        </Button>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default CookieConsent;
