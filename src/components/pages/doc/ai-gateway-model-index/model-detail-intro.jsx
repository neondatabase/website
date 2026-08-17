import PropTypes from 'prop-types';

import AnchorHeading from 'components/shared/anchor-heading';

import ModelDetailClient from './model-detail-client';

const CommandHeading = AnchorHeading('h2');

const ModelDetailIntro = ({ row, languagesByMode, initialMode }) => (
  <div className="prose-doc post-content prose mt-8 max-w-none dark:prose-invert xs:prose-code:break-words">
    <div id="about" className="anchor-heading scroll-mt-32" aria-hidden />
    {row.hasMeasuredCapabilities ? (
      <p>
        Neon AI Gateway provides {row.name} by {row.providerName}. The model supports{' '}
        {row.inputsLabel} inputs and a {row.contextLabel} context window.
      </p>
    ) : (
      <p>
        {row.name} is listed in the Neon AI Gateway model catalog. Verified availability and code
        examples are not currently available for this model.
      </p>
    )}

    <CommandHeading>Command</CommandHeading>
    <ModelDetailClient languagesByMode={languagesByMode} initialMode={initialMode} />
  </div>
);

ModelDetailIntro.propTypes = {
  row: PropTypes.object.isRequired,
  languagesByMode: PropTypes.shape({
    text: PropTypes.arrayOf(PropTypes.object).isRequired,
    image: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  initialMode: PropTypes.oneOf(['text', 'image']).isRequired,
};

export default ModelDetailIntro;
