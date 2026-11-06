import CopyPrompt from './copy-prompt';

const AgentPrompt = (props) => <CopyPrompt {...props} variant="agent" />;

AgentPrompt.propTypes = CopyPrompt.propTypes;

export default AgentPrompt;
