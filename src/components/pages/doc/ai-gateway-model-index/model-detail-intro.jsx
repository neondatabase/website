import PropTypes from 'prop-types';

import AnchorHeading from 'components/shared/anchor-heading';

import ModelDetailClient from './model-detail-client';

const CommandHeading = AnchorHeading('h2');

const ModelDetailIntro = ({ row, snippets, initialMode }) => (
  <div className="prose-doc post-content prose mt-8 max-w-none dark:prose-invert xs:prose-code:break-words">
    <div id="about" className="anchor-heading scroll-mt-32" aria-hidden />
    <p>
      {row.name} is available through the Neon AI Gateway. {row.providerName} provides the model,
      which accepts {row.inputsLabel} inputs and supports a {row.contextLabel} context window.
    </p>

    <CommandHeading>Command</CommandHeading>
    <ModelDetailClient row={row} snippets={snippets} initialMode={initialMode} />
  </div>
);

ModelDetailIntro.propTypes = {
  row: PropTypes.object.isRequired,
  snippets: PropTypes.shape({
    modelIdPlaceholder: PropTypes.string.isRequired,
    tabs: PropTypes.object.isRequired,
    envExample: PropTypes.string.isRequired,
  }).isRequired,
  initialMode: PropTypes.oneOf(['text', 'image']).isRequired,
};

export default ModelDetailIntro;
