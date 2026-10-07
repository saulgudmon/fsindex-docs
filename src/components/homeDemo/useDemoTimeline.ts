import {useEffect, useRef, type RefObject} from 'react';

export type DemoPlaybackProps = {
  running: boolean;
  onComplete: () => void;
  onProgress: (progress: number) => void;
};

type Schedule = (callback: () => void, delay: number) => void;

// A pausable clock shared by typing, tool calls, and carousel transitions.
export function useDemoTimeline(
  target: RefObject<HTMLElement | null>,
  running: boolean,
  replay: number,
  setup: (schedule: Schedule, reducedMotion: boolean) => void,
  onFrame?: (elapsed: number) => void,
  onProgress?: (progress: number) => void,
): void {
  const runningRef = useRef(running);
  const setupRef = useRef(setup);
  const frameRef = useRef(onFrame);
  const progressRef = useRef(onProgress);
  runningRef.current = running;
  setupRef.current = setup;
  frameRef.current = onFrame;
  progressRef.current = onProgress;

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let visible = false;
    let started = false;
    let elapsed = 0;
    let previous = 0;
    let duration = 1;
    let events: {at: number; callback: () => void}[] = [];
    const tick = (now: number) => {
      if (runningRef.current && visible && !document.hidden) {
        elapsed += previous ? Math.min(now - previous, 100) : 0;
        while (events.length && events[0].at <= elapsed) events.shift()!.callback();
        frameRef.current?.(elapsed);
        progressRef.current?.(Math.min(elapsed / duration, 1));
      }
      previous = now;
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      cancelAnimationFrame(frame);
      elapsed = 0;
      previous = 0;
      events = [];
      setupRef.current((callback, at) => events.push({at, callback}), motion.matches);
      events.sort((a, b) => a.at - b.at);
      duration = events.at(-1)?.at || 1;
      progressRef.current?.(motion.matches ? 1 : 0);
      if (!motion.matches) frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      if (visible && !started) {
        started = true;
        start();
      }
    }, {threshold: 0.35});
    if (target.current) observer.observe(target.current);
    const onMotionChange = () => { if (started) start(); };
    motion.addEventListener('change', onMotionChange);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      motion.removeEventListener('change', onMotionChange);
    };
  }, [replay, target]);
}
