import dynamic from 'next/dynamic';

const McpSetupConfigurator = dynamic(() => import('./mcp-setup-configurator'), {
  ssr: false,
});

export default McpSetupConfigurator;
