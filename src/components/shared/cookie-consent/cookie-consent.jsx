'use client';

import { useEffect, useState } from 'react';

import Link from 'components/shared/link';
import LINKS from 'constants/links';
import sendGtagEvent from 'utils/send-gtag-event';

import Button from '../button';

const CookieConsent = ({}) => {
  const [visible, setVisible] = useState(false);

  const consentAll = () => {
    if (zaraz && zaraz.consent) {
      zaraz.consent.setAll(true);
      zaraz.consent.sendQueuedEvents();
    }
    sendGtagEvent('cookie_consent', { action: 'accept_all' });
    setVisible(false);
  };

  const rejectAll = () => {
    if (zaraz && zaraz.consent) {
      zaraz.consent.setAll(false);
    }
    sendGtagEvent('cookie_consent', { action: 'reject_all' });
    setVisible(false);
  };

  useEffect(() => {
    if (document.cookie.indexOf('neon_consent') === -1) {
      setVisible(true);
    }
  }, []);

  return visible ? (
    <div className="fixed bottom-4 left-4 z-50 flex max-w-[510px] items-end  gap-4 rounded-[10px] border border-gray-new-30 bg-gray-new-15 px-6 py-4 text-white shadow-md">
      <p className="text-sm">
        We use first-party cookies to improve our services. Learn more at{' '}
        <Link to={LINKS.cookiePolicy} className="underline">
          Cookie Policy
        </Link>
        .
      </p>
      <Button className="h-9" size="xxs" theme="gray-dark-outline" onClick={rejectAll}>
        Opt Out
      </Button>
      <Button className="h-9" size="xxs" theme="quaternary" onClick={consentAll}>
        Accept
      </Button>
    </div>
  ) : (
    <></>
  );
};

export default CookieConsent;

CookieConsent.propTypes = {};
