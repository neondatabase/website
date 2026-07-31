import Content from 'components/shared/content';

import { renderGlobalOptions, schema } from './renderers';

// Generated global-options table. Documented once (on the CLI overview);
// command pages link here instead of repeating it.
const CliGlobalOptions = () => (
  <div className="cli-options-table">
    <Content content={renderGlobalOptions(schema)} />
  </div>
);

export default CliGlobalOptions;
