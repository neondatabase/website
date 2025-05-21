/* eslint-disable consistent-return */
import { useEffect } from 'react';

import { injectScript } from 'utils/inject-script';

const FORM_JS_SRC = 'https://js.hsforms.net/forms/v2.js';
const PORTAL_ID = '26233105';

export const initForm = async (element: HTMLElement, onFormHandles: any) => {
  await injectScript(FORM_JS_SRC);
  const formId = element.getAttribute('data-form-id');

  window?.hbspt?.forms?.create({
    region: 'eu1',
    portalId: PORTAL_ID,
    formId,
    target: `div[data-form-id='${formId}']`,
    ...onFormHandles,
  });
};

export default function useHubspotForm(blockSelector: string, onFormHandles: any = null) {
  useEffect(() => {
    const elements = document.getElementsByClassName(blockSelector);
    Array.from(elements).forEach((element) => {
      initForm(element as HTMLElement, onFormHandles);
    });
  }, [blockSelector, onFormHandles]);
}
