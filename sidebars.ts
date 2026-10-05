import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    'introduction',
    'install',
    {
      type: 'category',
      label: 'MCP for agents',
      collapsed: false,
      items: ['mcp/setup', 'mcp/tools', 'mcp/agent-guidance'],
    },
    {
      type: 'category',
      label: 'Command line',
      collapsed: false,
      items: ['cli/overview', 'cli/search-count', 'cli/administration'],
    },
    'configuration',
    'concepts/freshness-and-volumes',
  ],
};

export default sidebars;
