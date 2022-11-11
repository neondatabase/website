import { HUBSPOT_FORM_PORTAL_ID } from 'constants/forms';

const emailRegexp =
  // eslint-disable-next-line no-control-regex, no-useless-escape
  /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;

function doNowOrAfterSomeTime(callback, loadingAnimationStartedTime) {
  const LOADING_ANIMATION_FULL_DURATION = 2200; // 2000 (loading animation duration) + 200 (loading animation delay) = 2200

  if (Date.now() - loadingAnimationStartedTime > LOADING_ANIMATION_FULL_DURATION) {
    callback();
  } else {
    setTimeout(
      callback,
      LOADING_ANIMATION_FULL_DURATION - (Date.now() - loadingAnimationStartedTime)
    );
  }
}

const sendHubspotFormData = async ({ formId, context, values }) => {
  const response = await fetch(
    `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_FORM_PORTAL_ID}/${formId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        context,
        fields: values,
      }),
    }
  );

  return response;
};

// eslint-disable-next-line import/prefer-default-export
export { emailRegexp, doNowOrAfterSomeTime, sendHubspotFormData };
