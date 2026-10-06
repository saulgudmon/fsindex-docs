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
      copyright: `Made by <a href="https://brodieway.land">Brodie Wayland</a> · <a class="footer-github-link" href="https://github.com/saulgudmon/fsindex" aria-label="fsindex on GitHub" title="fsindex on GitHub"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.56v-2.23c-3.23.7-3.91-1.37-3.91-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.72 1.27 3.38.97.1-.75.4-1.27.74-1.56-2.58-.29-5.29-1.29-5.29-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.47.11-3.05 0 0 .97-.31 3.16 1.18a10.93 10.93 0 0 1 5.75 0c2.19-1.49 3.15-1.18 3.15-1.18.63 1.58.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.4-2.72 5.38-5.3 5.67.42.36.79 1.07.79 2.17v3.22c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z"/></svg></a>`,
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
