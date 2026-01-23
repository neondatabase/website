import Script from 'next/script';
import PropTypes from 'prop-types';

const JsonLd = ({ data, id }) => (
  <Script
    id={id || 'json-ld'}
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(data, null, 2),
    }}
  />
);

JsonLd.propTypes = {
  data: PropTypes.object.isRequired,
  id: PropTypes.string,
};

export default JsonLd;
