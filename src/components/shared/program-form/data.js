const AGENT = {
  title: 'Apply for the Agent Plan',
  description: "Building an agent that needs databases? Let us know and we'll follow up promptly.",
  placeholder: 'URL for your Agent Platform',
  buttonText: 'Apply',
  eventName: 'Agent Plan Application Submitted',
};

const STARTUP = {
  title: 'Apply for the Startup Program',
  description: 'Building your startup on Neon? Apply for credits here.',
  placeholder: 'Startup URL',
  buttonText: 'Apply',
  eventName: 'Startup Program Application Submitted',
};

const OPENSOURCE = {
  title: 'Apply for the Open Source Program',
  description:
    'Do you have a non-commercial open source project that uses Neon? Apply for credits here.',
  placeholder: 'Project URL',
  buttonText: 'Apply',
  eventName: 'Open Source Program Application Submitted',
};

const CREATOR = {
  title: 'Apply for the Creator Program',
  description:
    'Creating technical content that teaches developers how to use Neon? Apply for credits here.',
  placeholder: 'Your URL',
  buttonText: 'Apply',
  eventName: 'Creator Program Application Submitted',
};

const DATA = {
  agent: AGENT,
  startup: STARTUP,
  creator: CREATOR,
  openSource: OPENSOURCE,
};

export default DATA;
