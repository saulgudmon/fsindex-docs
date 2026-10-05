import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

export default function Home(): ReactNode {
  return (
    <Layout title="Filesystem discovery for agents" description="A live Linux filesystem index with an MCP server and composable CLI.">
      <main>
        <header className={styles.hero}>
          <div className={clsx('container', styles.heroInner)}>
            <div className={styles.kicker}>FSINDEX<span>_</span></div>
            <Heading as="h1">Ask your filesystem<br /><span>better questions.</span></Heading>
            <p className={styles.lead}>
              Everything and FSearch made machine-wide file search instant. fsindex brings that capability to agents.
            </p>
            <div className={styles.actions}>
              <Link className="button button--primary button--lg" to="/docs">Get started <span>→</span></Link>
            </div>
            <div className={styles.terminal}>
              <div className={styles.terminalBar}>
                <span>agent scope :: filesystem</span>
                <span>quick_install</span>
              </div>
              <pre><code><span className={styles.prompt}>$</span> <span className={styles.placeholder}>[quick install command — coming soon]</span>{`\n`}<span className={styles.prompt}>$</span> fsindexd{`\n`}<span className={styles.prompt}>$</span> codex mcp add fsindex -- fsindex-mcp</code></pre>
            </div>
            <div className={styles.projectMeta}>LINUX_ONLY / PER_USER / NAMES+METADATA / MIT</div>
          </div>
        </header>

        <section className={styles.boundary}>
          <div className="container">
            <div className={styles.boundaryInner}>
              <span className={styles.boundaryMark}>[01]</span>
              <div><Heading as="h2">Names and metadata. Never file contents.</Heading><p>Find what exists, where it is, how large it is, and when it changed.</p></div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
