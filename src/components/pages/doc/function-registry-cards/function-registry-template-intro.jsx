import PropTypes from 'prop-types';

import FunctionRegistryTemplateLogo from './function-registry-template-logo';

const FunctionRegistryTemplateIntro = ({ template }) => (
  <FunctionRegistryTemplateLogo template={template} eager variant="title" />
);

FunctionRegistryTemplateIntro.propTypes = {
  template: PropTypes.shape({
    title: PropTypes.string.isRequired,
    logo: PropTypes.string,
    provider: PropTypes.string,
  }).isRequired,
};

export default FunctionRegistryTemplateIntro;
