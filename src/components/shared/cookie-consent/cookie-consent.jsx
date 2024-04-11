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
    <div className="fixed bottom-[50px] left-12 z-50 flex max-w-[503px] items-end gap-x-10 rounded-lg border border-[#16181D] bg-[#0B0C0F] p-4 shadow-[0px_14px_20px_0px_rgba(0,0,0,0.10)] md:bottom-4 md:left-4 md:right-4 sm:flex-col sm:items-start sm:gap-y-4">
      <p className="text-sm font-light leading-snug tracking-extra-tight text-gray-new-80">
        We use cookies to improve our services. Learn more in our{' '}
        <Link
          className="whitespace-nowrap font-normal underline-offset-[3px]"
          theme="white-underlined"
          to={LINKS.cookiePolicy}
        >
          Cookie Policy
        </Link>
        .
      </p>
      <div className="flex gap-x-3.5">
        <Button className="font-medium" size="xxs" theme="black-outline" onClick={rejectAll}>
          Opt out
        </Button>
        <Button className="font-medium" size="xxs" theme="gray-94-filled" onClick={consentAll}>
          Accept
        </Button>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default CookieConsent;
