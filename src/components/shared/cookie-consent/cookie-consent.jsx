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
    if (
      document.cookie.indexOf('neon_consent') === -1 &&
      document.cookie.indexOf('ajs_user_id') === -1
    ) {
      setVisible(true);
    }
  }, []);

  return visible ? (
    <div className="fixed bottom-4 left-4 z-50 flex max-w-[560px] items-end gap-x-10 rounded-[10px] border border-gray-2 bg-gray-1 px-6 py-5 text-white md:right-4 sm:flex-col sm:items-start sm:gap-y-4">
      <p>
        We use first-party cookies to improve our services. Learn more in our{' '}
        <Link
          className="whitespace-nowrap underline-offset-[3px]"
          theme="green-underlined"
          to={LINKS.cookiePolicy}
        >
          Cookie Policy
        </Link>
        .
      </p>
      <div className="flex gap-x-3">
        <Button className="h-9" size="xxs" theme="gray-2-outline" onClick={rejectAll}>
          Opt Out
        </Button>
        <Button className="h-9" size="xxs" theme="white-filled" onClick={consentAll}>
          Accept
        </Button>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default CookieConsent;
