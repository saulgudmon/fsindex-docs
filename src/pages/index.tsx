import {useCallback, useEffect, useRef, useState, type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';
import DesktopDemo from '../components/homeDemo/DesktopDemo';
import {useDemoTimeline, type DemoPlaybackProps} from '../components/homeDemo/useDemoTimeline';

const demoPrompt = 'play a song by Enigma Dubz';
const collectionPrompt = 'tell me about the Enigma Dubz collection on this system';
const keyboardRows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];

function AgentDemo({running, onComplete, onProgress}: DemoPlaybackProps): ReactNode {
  const demoRef = useRef<HTMLElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const secondMessageRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const [turn, setTurn] = useState(0);
  const [collectionStep, setCollectionStep] = useState(0);
  const [step, setStep] = useState(0);
  const [replay, setReplay] = useState(0);
  const [typedCount, setTypedCount] = useState(0);
  const [activeKey, setActiveKey] = useState('');
  const [sent, setSent] = useState(false);
  const [sendPressed, setSendPressed] = useState(false);

  useDemoTimeline(demoRef, running, replay, (schedule, reducedMotion) => {
      setStep(reducedMotion ? 4 : 0);
      setTurn(reducedMotion ? 1 : 0);
      setCollectionStep(reducedMotion ? 4 : 0);
      if (chatRef.current) chatRef.current.scrollTop = 0;
      setTypedCount(0);
      setActiveKey('');
      setSent(reducedMotion);
      setSendPressed(false);
      if (reducedMotion) return;

      // Each typed character and key highlight share the same timeline.
      const typePrompt = (prompt: string, startTime: number) => {
        let time = startTime;
        Array.from(prompt).forEach((character, index) => {
          if (/[A-Z]/.test(character)) {
            schedule(() => setActiveKey('Shift'), time);
            time += 220;
          }
          schedule(() => {
            setTypedCount(index + 1);
            setActiveKey(character);
          }, time);
          schedule(() => setActiveKey(''), time + 85);
          time += character === ' ' ? 190 : [115, 145, 125][index % 3];
        });
        const sendTime = time + 500;
        schedule(() => setSendPressed(true), sendTime - 140);
        schedule(() => {
          setSent(true);
          setSendPressed(false);
        }, sendTime);
        return sendTime;
      };
      const firstSend = typePrompt(demoPrompt, 900);
      [450, 1200, 2100, 3000].forEach((delay, index) => {
        schedule(() => setStep(index + 1), firstSend + delay);
      });
      const secondStart = firstSend + 3000 + 6000;
      schedule(() => {
        setTurn(1);
        setTypedCount(0);
        setActiveKey('');
        setSent(false);
      }, secondStart);
      const secondSend = typePrompt(collectionPrompt, secondStart + 700);
      [500, 2200, 5200, 8500].forEach((delay, index) => {
        schedule(() => setCollectionStep(index + 1), secondSend + delay);
      });
      schedule(onComplete, secondSend + 8500 + 6000);
  }, undefined, onProgress);

  useEffect(() => {
    const target = collectionStep === 4 ? summaryRef.current : secondMessageRef.current;
    if (turn === 1 && sent && target && chatRef.current) {
      chatRef.current.scrollTo({
        top: target.offsetTop - 12,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      });
    }
  }, [turn, sent, collectionStep]);

  const currentPrompt = turn === 0 ? demoPrompt : collectionPrompt;
  const firstSent = turn > 0 || sent;

  return (
    <figure ref={demoRef} className={styles.demo} aria-label="Illustrated agent chat: play Blue Moon in about three seconds, then summarize an Enigma Dubz collection of 44 unique tracks across three drives in about nine seconds.">
      <div className={styles.mockupLabel}>MCP Tool</div>
      <div className={styles.phone}>
        <div className={styles.phoneStatus} aria-hidden="true"><span>9:41</span><span className={styles.camera} /><span>▥ ▰</span></div>
        <div ref={chatRef} className={clsx(styles.chatBody, !sent && styles.chatWithKeyboard)} aria-hidden="true">
          <div className={clsx(styles.chatIntro, firstSent && styles.introHidden)}>
            <span className={styles.introMark}>✳</span>
            <span>What can I help you with?</span>
          </div>
          <div className={clsx(styles.userMessage, styles.chatStep, firstSent && styles.visible)}>{demoPrompt}</div>
          <div className={clsx(styles.chatStep, step >= 1 && styles.visible)}>
            <div className={styles.messageLabel}>✳ HERMES</div>
            <p className={styles.agentMessage}>Let me find a track in your library.</p>
          </div>
          <div className={clsx(styles.toolCard, styles.chatStep, step >= 1 && styles.visible)}>
            <div className={styles.toolHeading}><span>⌕ fsindex</span><span className={styles.toolBadge}>MCP</span></div>
            <div className={styles.searchQuery}>Searching “Enigma Dubz”</div>
            <div className={styles.toolResult}>{step >= 2 ? <><span className={styles.check}>✓</span> Blue Moon <span className={styles.fileType}>FLAC</span></> : <><span className={styles.searchDot} /> Searching your library…</>}</div>
          </div>
          <div className={clsx(styles.openStep, styles.chatStep, step >= 3 && styles.visible)}><span className={styles.check}>✓</span> {step >= 4 ? 'Opened in your music player' : 'Opening in your music player…'}</div>
          <div className={clsx(styles.chatStep, step >= 4 && styles.visible)}>
            <p className={styles.agentMessage}>Playing Enigma Dubz — “Blue Moon”.</p>
            <div className={styles.nowPlaying}>
              <img className={styles.albumArt} src="https://i.scdn.co/image/ab67616d0000b27308b680ba434cec5b19dcf4bb" alt="Blue Moon album artwork" width={48} height={48} />
              <div className={styles.trackInfo}><span className={styles.playingLabel}>NOW PLAYING</span><strong>Blue Moon</strong><span>Enigma Dubz · FLAC</span></div>
              <div className={styles.equalizer}><i /><i /><i /><i /></div>
            </div>
          </div>
          {turn === 1 && sent && (
            <div ref={secondMessageRef} className={styles.secondExchange}>
              <div className={styles.userMessage}>{collectionPrompt}</div>
              {collectionStep >= 1 && <>
                <div className={styles.messageLabel}>✳ HERMES</div>
                <div className={styles.toolCard}>
                  <div className={styles.toolHeading}><span>⌕ fsindex</span><span className={styles.toolBadge}>MCP</span></div>
                  <div className={styles.searchQuery}>Searching across your drives</div>
                  <div className={styles.toolResult}>
                    {collectionStep >= 2 ? <><span className={styles.check}>✓</span> 245 index hits</> : <><span className={styles.searchDot} /> Finding the collection…</>}
                  </div>
                </div>
                <p className={styles.collectionProgress}>{collectionStep >= 4 ? '✓ Collection mapped · 8.5s' : collectionStep >= 3 ? 'Grouping releases and removing duplicates…' : collectionStep >= 2 ? 'Checking audio files, covers and playlists…' : 'Looking for tracks and releases…'}</p>
              </>}
              {collectionStep >= 4 && <div ref={summaryRef} className={styles.collectionSummary}>
                <p><strong>44 unique audio tracks.</strong><br />Scattered across 3 drives. Found them.</p>
                <p className={styles.summaryMuted}>245 index hits include mirrored copies, cover art and playlists.</p>
                <div className={styles.releaseList}>
                  <div><strong>Awakening (2022)</strong><span>12 FLAC</span></div>
                  <div><strong>Boundless (2021)</strong><span>4 FLAC</span></div>
                  <div><strong>The Cosmos</strong><span>5 FLAC</span></div>
                  <div><strong>Coming Down (2021)</strong><span>3 FLAC</span></div>
                  <div><strong>Blue Moon</strong><span>1 FLAC</span></div>
                  <div><strong>Dubz Vol 1 (2020)</strong><span>2 MP3</span></div>
                </div>
                <p className={styles.summaryMuted}>Plus singles, bootlegs and remixes tucked into the older music dumps.</p>
                <div className={styles.driveList}><span>↳ Music Backup (probably)</span><span>↳ OLD 2TB</span><span>↳ stuff to sort!!</span></div>
                <p className={styles.summaryMuted}>Mostly in “downloads-dump” and “UNSORTED 2017”. One tidy Awakening (Remixed) copy lives in “THE ARCHIVE”.</p>
                <p className={styles.followUp}>Want the full 44-track list?</p>
              </div>}
            </div>
          )}
        </div>
        <div className={styles.composerSpace} />
        <div className={styles.inputDock} aria-hidden="true">
          <div className={clsx(styles.chatComposer, !sent && styles.composerFocused)}>
            <span className={styles.composerText}>{sent ? 'Ask your agent anything…' : <>{currentPrompt.slice(0, typedCount)}<i className={styles.typingCursor} /></>}</span>
            <span className={clsx(styles.sendIcon, !sent && typedCount > 0 && styles.sendReady, sendPressed && styles.sendPressed)}>↑</span>
          </div>
          <div className={clsx(styles.keyboard, sent && styles.keyboardHidden)}>
            <div className={styles.keyboardInner}>
              <div className={styles.keyboardAccessory}><span>✧</span><span>Message Hermes</span><span>⌄</span></div>
              {keyboardRows.map((row, rowIndex) => (
                <div key={row} className={styles.keyRow}>
                  {rowIndex === 2 && <span className={clsx(styles.key, styles.functionKey, activeKey === 'Shift' && styles.keyActive)}>⇧</span>}
                  {Array.from(row).map(letter => (
                    <span key={letter} className={clsx(styles.key, activeKey.toLowerCase() === letter && styles.keyActive)}>
                      {/[A-Z]/.test(activeKey) ? letter.toUpperCase() : letter}
                    </span>
                  ))}
                  {rowIndex === 2 && <span className={clsx(styles.key, styles.functionKey)}>⌫</span>}
                </div>
              ))}
              <div className={styles.keyRow}>
                <span className={clsx(styles.key, styles.bottomKey)}>123</span>
                <span className={clsx(styles.key, styles.bottomKey)}>◎</span>
                <span className={clsx(styles.key, styles.spaceKey, activeKey === ' ' && styles.keyActive)}>space</span>
                <span className={clsx(styles.key, styles.bottomKey)}>↵</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.homeIndicator} aria-hidden="true" />
      </div>
      <figcaption className={styles.demoCaption}>
        <div><span className={styles.speedBadge}>{turn === 0 ? '~3 seconds' : '~9 seconds'}</span><span>{turn === 0 ? 'From send to playback.' : 'From scattered files to a collection.'}</span></div>
        <button className={styles.replayButton} onClick={() => setReplay(value => value + 1)} aria-label="Replay the typing and agent chat demo">↻ Replay</button>
        <small>Illustrated from real Hermes sessions.</small>
      </figcaption>
    </figure>
  );
}

function DemoCarousel(): ReactNode {
  const progressRef = useRef<SVGCircleElement>(null);
  const updateProgress = useCallback((progress: number) => {
    progressRef.current?.setAttribute('stroke-dashoffset', String(1 - progress));
  }, []);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cycle, setCycle] = useState(0);
  const advance = useCallback(() => {
    setSlide(value => (value + 1) % 2);
    setCycle(value => value + 1);
  }, []);
  return <section className={clsx(styles.carousel, paused && styles.carouselPaused)} aria-label="fsindex demos" aria-roledescription="carousel">
    <div className={styles.carouselStage} key={`${slide}-${cycle}`} role="group" aria-roledescription="slide" aria-label={`${slide + 1} of 2: ${slide === 0 ? 'Agent chat' : 'Desktop search'}`}>
      {slide === 0 ? <AgentDemo running={!paused} onComplete={advance} onProgress={updateProgress} /> : <DesktopDemo running={!paused} onComplete={advance} onProgress={updateProgress} />}
    </div>
    <div className={styles.carouselControls}>
      <div className={styles.slideDots} role="group" aria-label="Choose a demo">
        {['MCP Tool', 'Desktop App'].map((label, index) => <button className={styles.slideDot} key={label} aria-label={`Show ${label} demo`} aria-pressed={slide === index} onClick={() => {setSlide(index); setCycle(value => value + 1);}}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle className={styles.dotCenter} cx="12" cy="12" r="3" />
            {slide === index && <><circle className={styles.dotTrack} cx="12" cy="12" r="8" /><circle ref={progressRef} className={styles.dotProgress} cx="12" cy="12" r="8" pathLength="1" strokeDasharray="1" strokeDashoffset="1" /></>}
          </svg>
        </button>)}
      </div>
      <button className={styles.carouselPause} aria-label={paused ? 'Resume demo animations' : 'Pause demo animations'} aria-pressed={paused} onClick={() => setPaused(value => !value)}><span aria-hidden="true">{paused ? '▶' : 'Ⅱ'}</span></button>
    </div>
  </section>;
}

export default function Home(): ReactNode {
  return (
    <Layout title="Filesystem discovery for agents" description="A live Linux filesystem index with an MCP server and composable CLI.">
      <main>
        <header className={styles.hero}>
          <div className={clsx('container', styles.heroInner)}>
            <div className={styles.heroCopy}>
              <div className={styles.kicker}>FSINDEX<span>_</span></div>
              <Heading as="h1">Ask your filesystem<br /><span>questions.</span></Heading>
              <p className={styles.lead}>
                Everything and FSearch made machine-wide file search instant. fsindex brings that capability to agents.
              </p>
              <div className={styles.actions}>
                <Link className="button button--primary button--lg" to="/docs#install">Get started <span>→</span></Link>
              </div>
              <div className={styles.projectMeta}>LINUX_ONLY / PER_USER / NAMES+METADATA / MIT</div>
              <p className={styles.buildNote}>// This was vibe coded in 1 day on Oct. 5 2026, so there may be <Link to="https://github.com/saulgudmon/fsindex/issues">issues</Link>!</p>
              <p className={styles.buildNote}>// If you decide to try it, thank you for being among the first! Any <Link to="https://github.com/saulgudmon/fsindex/discussions">feedback</Link> is appreciated.</p>
            </div>
            <DemoCarousel />
          </div>
        </header>

      </main>
    </Layout>
  );
}
