'use client';

import { useEffect, useState } from 'react';

import Link from 'components/shared/link';
import LINKS from 'constants/links';
import sendGtagEvent from 'utils/send-gtag-event';

import Button from '../button';

const CookieConsent = ({}) => {
  const [visualState, setVisualState] = useState('hidden');
  const [purposes, setPurposes] = useState({});
  const [choices, setChoices] = useState({});

  const consentAll = () => {
    if (zaraz && zaraz.consent) {
      zaraz.consent.setAll(true);
      zaraz.consent.sendQueuedEvents();
    }
    sendGtagEvent('cookie_consent', { action: 'accept_all' });
    setVisualState('hidden');
  };

  const rejectAll = () => {
    if (zaraz && zaraz.consent) {
      zaraz.consent.setAll(false);
    }
    sendGtagEvent('cookie_consent', { action: 'reject_all' });
    setVisualState('hidden');
  };

  const updateChoice = (e) => {
    setChoices((prev) => {
      prev[e.target.id] = e.target.checked;
      return prev;
    });
  };

  const confirmChoices = () => {
    Object.keys(choices).forEach((key) => {
      zaraz.consent.set({ [key]: choices[key] });
    });
    setVisualState('hidden');
  };

  const expandBanner = () => {
    setPurposes(zaraz.consent.purposes);
    /* default choices to ticked */
    setChoices(
      Object.keys(zaraz.consent.getAll()).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {})
    );
    setVisualState('expanded');
  };

  useEffect(() => {
    if (document.cookie.indexOf('neon_consent') === -1) {
      setVisualState('visible');
    }
  }, []);

  return visualState === 'visible' ? (
    <div className="fixed bottom-4 left-4 z-50 flex max-w-[590px] items-center gap-4 rounded-[10px] border border-gray-new-30 bg-gray-new-15 px-6 py-4 text-white shadow-md">
      <p className="text-sm">
        We use cookies to improve your website experience. Click Accept to agree to the{' '}
        <Link to={LINKS.cookiePolicy} className="underline">
          Cookie Policy
        </Link>
        .
      </p>
      <Button className="h-9" size="xxs" theme="white-outline" onClick={expandBanner}>
        Customize
      </Button>
      <Button className="h-9" size="xxs" theme="quaternary" onClick={consentAll}>
        Accept
      </Button>
    </div>
  ) : visualState === 'expanded' ? (
    <>
      <div className="fixed bottom-4 left-4 z-50 flex w-full max-w-md flex-col gap-4 rounded-[10px] border border-gray-new-30 bg-gray-new-15 px-6 py-4 text-white shadow-md">
        <span className="text-xl font-bold">Cookie Settings</span>
        <p className="mb-4 text-sm">
          We use cookies to improve your website experience. Click Accept to agree to the{' '}
          <Link to={LINKS.cookiePolicy} className="underline">
            Cookie Policy
          </Link>
          .
        </p>

        {Object.keys(purposes).map((key) => (
          <div className="flex items-start gap-4 pl-2">
            <input
              type="checkbox"
              id={key}
              name={key}
              className="mt-1"
              defaultChecked
              onChange={updateChoice}
            />
            <label htmlFor={key} className="flex flex-col text-sm">
              <span className="font-bold">{purposes[key].name.en}</span>
              <span>{purposes[key].description.en}</span>
            </label>
          </div>
        ))}
        <div className="mt-4 flex justify-end gap-4">
          <Button className="h-9" size="xxs" theme="white-outline" onClick={rejectAll}>
            Reject All
          </Button>
          <Button className="h-9" size="xxs" theme="white-outline" onClick={consentAll}>
            Accept All
          </Button>
          <Button className="h-9" size="xxs" theme="quaternary" onClick={confirmChoices}>
            Confirm Choices
          </Button>
        </div>
      </div>
      <div className="fixed inset-0 z-40" onClick={() => setVisualState('visible')} />
    </>
  ) : (
    <></>
  );
};

export default CookieConsent;

CookieConsent.propTypes = {};
