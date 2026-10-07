import {useRef, useState, type ReactNode} from 'react';
import clsx from 'clsx';
import useBaseUrl from '@docusaurus/useBaseUrl';
import entries from './collection.json';
import {useDemoTimeline, type DemoPlaybackProps} from './useDemoTimeline';
import styles from '../../pages/index.module.css';

const queryText = 'Enigma Dubz';
// Counts follow the reference screenshots; an empty query shows the full index.
const matchCounts = [1597682, 1145555, 199362, 3916, 390, 342, 342, 342, 245, 245, 245, 245];
const resultsHeight = 366;
const rowHeight = 30;
const initialRows = [
  {name: 'dashboard_clients.heartbeat', path: '/home/user/.local/state/agent/dashboard_clients.heartbeat'},
  {name: 'MEGAsync.log', path: '/home/user/.local/share/Mega/MEGAsync/logs/MEGAsync.log'},
  {name: 'data.sqlite', path: '/home/user/.config/browser/Default/data.sqlite'},
  {name: 'usage', path: '/home/user/.config/browser/Default/storage/usage'},
  {name: 'Reporting and NEL-journal', path: '/home/user/.config/browser/Default/Reporting and NEL-journal'},
  {name: 'Reporting and NEL', path: '/home/user/.config/browser/Default/Reporting and NEL'},
  {name: 'cookies.sqlite-wal', path: '/home/user/.config/browser/Default/cookies.sqlite-wal'},
  {name: 'workspace.sqlite-shm', path: '/home/user/.local/state/agent/workspace.sqlite-shm'},
  {name: 'workspace.sqlite-wal', path: '/home/user/.local/state/agent/workspace.sqlite-wal'},
  {name: 'agent.log', path: '/home/user/.local/state/agent/agent.log'},
  {name: 'gateway_state.json', path: '/home/user/.local/state/agent/gateway_state.json'},
  {name: 'Network Persistent State', path: '/home/user/.config/browser/Default/Network Persistent State'},
  {name: 'logs_2.sqlite-shm', path: '/home/user/.local/state/editor/logs_2.sqlite-shm'},
  {name: 'tauri_localhost_0.localstorage-wal', path: '/home/user/.local/share/fsindex/tauri_localhost_0.localstorage-wal'},
  {name: 'Preferences', path: '/home/user/.config/browser/Default/Preferences'},
  {name: 'kalendarrc', path: '/home/user/.config/kalendarrc'},
  {name: 'context_open.marker', path: '/home/user/.config/browser/Default/context_open.marker'},
  {name: 'broadcast-listeners.json', path: '/home/user/.config/browser/Default/broadcast-listeners.json'},
  {name: 'extension-store-menus', path: '/home/user/.config/browser/Default/extension-store-menus'},
].map(row => ({...row, kind: 'file', size: '—'}));

const narrowingRows = [
  {name: 'benign-versus-invasive-tumor-boundary-v1.html', path: '/home/user/Projects/research/benign-versus-invasive-tumor-boundary-v1.html'},
  {name: 'material-theme-palenight-63d2473c.js', path: '/home/user/.config/editor/themes/material-theme-palenight-63d2473c.js'},
  {name: 'material-theme-palenight-c80b71f0.js', path: '/home/user/.local/share/editor/themes/material-theme-palenight-c80b71f0.js'},
  {name: 'JobDriver_LovinOneNightStand.cs', path: '/home/user/Games/Mods/Source/JobDriver_LovinOneNightStand.cs'},
  {name: 'LordJob_Joinable_MovieNight.cs', path: '/home/user/Games/Mods/Source/LordJob_Joinable_MovieNight.cs'},
  {name: 'com.github.subhadeepjasu.enigma.svg', path: '/home/user/.local/share/icons/apps/com.github.subhadeepjasu.enigma.svg'},
].flatMap(row => [
  row,
  {...row, path: row.path.replace('/home/user/', '/home/user/Backups/old-laptop/')},
  {...row, path: row.path.replace('/home/user/', '/home/user/Backups/desktop-2024/')},
]).map(row => ({...row, kind: 'file', size: '—'}));

function Match({text, query}: {text: string; query: string}): ReactNode {
  if (!query) return text;
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index < 0) return text;
  return <>{text.slice(0, index)}<mark>{text.slice(index, index + query.length)}</mark><Match text={text.slice(index + query.length)} query={query} /></>;
}

export default function DesktopDemo({running, onComplete, onProgress}: DemoPlaybackProps): ReactNode {
  const appIcon = useBaseUrl('/img/favicon.svg');
  const demoRef = useRef<HTMLElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [replay, setReplay] = useState(0);
  const interrupted = useRef(false);
  useDemoTimeline(demoRef, running, replay, (schedule, reducedMotion) => {
    interrupted.current = false;
    setQuery(reducedMotion ? queryText : '');
    if (resultsRef.current) resultsRef.current.scrollTop = 0;
    if (reducedMotion) return;
    Array.from(queryText).forEach((_, index) => {
      schedule(() => setQuery(queryText.slice(0, index + 1)), 2200 + index * 180);
    });
    schedule(onComplete, 18000);
  }, elapsed => {
    const results = resultsRef.current;
    if (!results || interrupted.current || elapsed < 5200) return;
    const flingStart = 13000;
    const slowDistance = (flingStart - 5200) * 0.055;
    if (elapsed < flingStart) {
      results.scrollTop = (elapsed - 5200) * 0.055;
      return;
    }
    // A free-spinning wheel: a quick burst that coasts to a stop over three seconds.
    const progress = Math.min((elapsed - flingStart) / 3000, 1);
    const coast = 1 - (1 - progress) ** 3;
    const distance = Math.max(0, Math.min(5800, results.scrollHeight - results.clientHeight - slowDistance));
    results.scrollTop = slowDistance + distance * coast;
  }, onProgress);
  const complete = query === queryText;
  const candidates = query.length >= 5 ? [...narrowingRows, ...entries] : [...initialRows, ...narrowingRows];
  const rows = !query ? initialRows : complete ? entries : candidates.filter(row => (row.name + row.path).toLowerCase().includes(query.toLowerCase()));
  const matchCount = complete ? entries.length : matchCounts[query.length];
  const count = matchCount.toLocaleString('en-US');
  // Estimate the full result-set thumb, independent of the small preview sample.
  const previewThumbHeight = Math.max(8, Math.min(resultsHeight, resultsHeight ** 2 / (matchCount * rowHeight)));

  return <figure ref={demoRef} className={styles.desktopDemo} aria-label="Illustrated fsindex desktop search with 245 sample results and highlighted query matches">
    <div className={styles.mockupLabel}>Desktop App</div>
    <div className={styles.desktopWindow}>
      <div className={styles.desktopTitle}><span className={styles.desktopBrand}><img src={appIcon} alt="" width={18} height={18} /><b>fsindex</b></span><span aria-hidden="true">−　□　×</span></div>
      <div className={styles.desktopToolbar}>
        <span aria-hidden="true">☰</span>
        <div className={styles.desktopSearch} aria-label={`Search: ${query || 'waiting to type'}`}><span aria-hidden="true">⌕</span><span>{query}<i className={clsx(styles.typingCursor, complete && styles.cursorFinished)} /></span><span aria-hidden="true">×</span></div>
        <span className={styles.desktopFilter}>All <span aria-hidden="true">⌄</span></span>
      </div>
      <div className={styles.resultHead}><span>Name</span><span>Path</span></div>
      <div className={styles.resultsViewport}>
      <div ref={resultsRef} className={clsx(styles.desktopResults, !complete && styles.resultsPreview)} tabIndex={complete ? 0 : -1} role="region" aria-label={complete ? 'Search results; scroll to browse all 245 entries' : `Search preview: ${count} matches`} onWheel={() => {if (complete) interrupted.current = true;}} onTouchStart={() => {if (complete) interrupted.current = true;}} onPointerDown={() => {if (complete) interrupted.current = true;}} onKeyDown={() => {if (complete) interrupted.current = true;}}>
        {rows.map((row, index) => <div className={styles.resultRow} key={`${row.path}-${index}`}>
          <span className={styles.resultName} title={row.name}><span className={styles.resultIcon} aria-hidden="true">{row.kind === 'directory' ? '▰' : /\.(flac|mp3|wav|aiff)$/i.test(row.name) ? '♪' : '▤'}</span><span><Match text={row.name} query={query} /></span></span>
          <span className={styles.resultPath} title={row.path}><Match text={row.path} query={query} /></span>
        </div>)}
      </div>
      {!complete && <div className={styles.previewScrollTrack} aria-hidden="true"><span style={{height: previewThumbHeight}} /></div>}
      </div>
      <div className={styles.desktopStatus}><span className={styles.searchOptions} aria-label="Mock search options: case sensitive off, regular expressions off, search paths on"><span>Aa</span><span>.*</span><span className={styles.mockToggleActive}>Path</span></span><span>{count} items</span><span>3 volumes</span><span className={styles.indexedCount}>1,597,682 indexed</span><span className={styles.indexStatus}>● Index current</span></div>
    </div>
    <figcaption className={styles.desktopCaption}><div><strong>Your files. As you type.</strong><span>One search, across all your drives.</span></div><button className={styles.replayButton} onClick={() => setReplay(value => value + 1)}>↻ Replay</button><small>Illustrated desktop demo</small></figcaption>
  </figure>;
}
