"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** How long each frame is held on screen. */
const ROTATE_MS = 6000;
/** How early the next frame is mounted so it can download before it is shown. */
const LEAD_MS = 2500;

/**
 * Owns which hero frames exist in the DOM and which one is visible.
 *
 * Two rules drive the whole thing:
 *
 * 1. A mounted <Image> is a real <img> that downloads immediately. Every frame
 *    is `absolute inset-0`, so it is inside the viewport and `loading="lazy"`
 *    will NOT defer it. The mount set is therefore the only thing keeping the
 *    other frames off the critical path — first paint ships frame 0 alone.
 * 2. A frame is only faded in once its bitmap is ready. Next's `onLoad` already
 *    awaits `img.decode()` before it fires (see handleLoading in
 *    next/dist/client/image-component.js), so `markReady` means "decoded", and
 *    a cross-fade can never reveal a half-loaded frame or stall on a decode.
 */
export function useHeroRotation(count: number) {
  const [index, setIndex] = useState(0);
  const [live, setLive] = useState<number[]>([0]);

  const ready = useRef<Set<number>>(new Set());
  /** A frame we wanted to show that had not decoded yet. Flushed by markReady. */
  const waiting = useRef<number | null>(null);
  const indexRef = useRef(0);
  const restart = useRef<(() => void) | null>(null);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const arm = useCallback(
    (i: number) => setLive((m) => (m.includes(i) ? m : [...m, i])),
    []
  );

  // Mount, let it paint at opacity 0, then fade. Without the two frames there
  // is no start value to transition from and the frame snaps in.
  const fadeTo = useCallback((i: number) => {
    requestAnimationFrame(() => requestAnimationFrame(() => setIndex(i)));
  }, []);

  const show = useCallback(
    (i: number) => {
      if (ready.current.has(i)) fadeTo(i);
      else waiting.current = i;
    },
    [fadeTo]
  );

  const markReady = useCallback(
    (i: number) => {
      ready.current.add(i);
      if (waiting.current === i) {
        waiting.current = null;
        fadeTo(i);
      }
    },
    [fadeTo]
  );

  useEffect(() => {
    if (count < 2) return;
    // A reduced-motion visitor never gets the cross-fade, so nothing past
    // frame 0 is ever mounted or downloaded.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let armId = 0;
    let showId = 0;

    const cycle = () => {
      const next = (indexRef.current + 1) % count;
      armId = window.setTimeout(() => arm(next), ROTATE_MS - LEAD_MS);
      showId = window.setTimeout(() => {
        // Don't burn a frame on a tab nobody is looking at: hold and re-check.
        if (document.visibilityState === "visible") show(next);
        cycle();
      }, ROTATE_MS);
    };

    cycle();
    restart.current = () => {
      window.clearTimeout(armId);
      window.clearTimeout(showId);
      cycle();
    };

    return () => {
      window.clearTimeout(armId);
      window.clearTimeout(showId);
      restart.current = null;
    };
  }, [count, arm, show]);

  // Clicking a dot has to reset the cadence. Without this the pending timer
  // still fires on its old schedule and yanks the visitor off their choice.
  const jumpTo = useCallback(
    (i: number) => {
      arm(i);
      waiting.current = null;
      show(i);
      restart.current?.();
    },
    [arm, show]
  );

  return { index, live, jumpTo, markReady };
}
