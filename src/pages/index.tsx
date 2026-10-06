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
            <Heading as="h1">Ask your filesystem<br /><span>questions.</span></Heading>
            <p className={styles.lead}>
              Everything and FSearch made machine-wide file search instant. fsindex brings that capability to agents.
            </p>
            <div className={styles.actions}>
              <Link className="button button--primary button--lg" to="/docs#install">Get started <span>→</span></Link>
            </div>
            <div className={styles.terminal}>
              <div className={styles.terminalBar}>
                <span>agent scope :: filesystem</span>
                <span>quick_install</span>
              </div>
              <pre><code><span className={styles.prompt}>$</span> curl -fsSL https://raw.githubusercontent.com/saulgudmon/fsindex/refs/heads/main/packaging/install.sh | bash{`\n`}<span className={styles.prompt}>$</span> export PATH="$HOME/.local/bin:$PATH"{`\n`}<span className={styles.prompt}>$</span> systemctl --user enable --now fsindexd{`\n`}<span className={styles.prompt}>$</span> codex mcp add fsindex -- fsindex-mcp</code></pre>
            </div>
            <p className={styles.buildNote}>Requires Bash, curl, tar, minisign, and Python 3 or jq. <Link to="/docs#install">Installation details →</Link></p>
            <div className={styles.projectMeta}>LINUX_ONLY / PER_USER / NAMES+METADATA / MIT</div>
            <p className={styles.buildNote}>// This was vibe coded in 1 day on Oct. 5 2026, so there may be issues!</p>
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
