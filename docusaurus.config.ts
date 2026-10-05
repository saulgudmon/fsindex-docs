import type {Config} from '@docusaurus/types';
import type {Options, ThemeConfig} from '@docusaurus/preset-classic';
import {themes as prismThemes} from 'prism-react-renderer';

const config: Config = {
  title: 'fsindex',
  tagline: 'Fast filesystem discovery for agents and humans',
  favicon: 'img/favicon.svg',
  url: 'https://fsindex.dev',
  baseUrl: '/',
  organizationName: 'fsindex',
  projectName: 'fsindex',
  onBrokenLinks: 'throw',
  trailingSlash: false,
  markdown: {
    mermaid: true,
    hooks: {onBrokenMarkdownLinks: 'warn'},
  },
  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
          editUrl: undefined,
        },
        blog: false,
        theme: {customCss: './src/css/custom.css'},
        sitemap: {changefreq: 'weekly', priority: 0.5},
      } satisfies Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.svg',
    metadata: [
      {name: 'keywords', content: 'filesystem index, MCP, AI agents, CLI, Linux'},
    ],
    navbar: {
      title: 'fsindex',
      logo: {alt: 'fsindex logo', src: 'img/favicon.svg'},
      items: [
        {to: '/docs', label: 'Docs', position: 'right', className: 'navbar-docs-link'},
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Made by <a href="https://brodieway.land">Brodie Wayland</a> · <a href="https://github.com/saulgudmon/fsindex-docs">Docs GitHub</a> · <a href="https://github.com/saulgudmon/fsindex">fsindex GitHub</a>`,
    },
    colorMode: {defaultMode: 'dark', disableSwitch: true},
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'toml'],
    },
  } satisfies ThemeConfig,
};

export default config;
