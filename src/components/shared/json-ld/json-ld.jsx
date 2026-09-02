import PropTypes from 'prop-types';

// Server-rendered JSON-LD. A plain <script> (not next/script) so the structured
// data is present in the initial HTML for crawlers that do not execute JS.
// Matches the inline pattern used by the docs/guides/blog pages.
const JsonLd = ({ data, id }) => (
  <script
    id={id || 'json-ld'}
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);

JsonLd.propTypes = {
  data: PropTypes.object.isRequired,
  id: PropTypes.string,
};

export default JsonLd;
