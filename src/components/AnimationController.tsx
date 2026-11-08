
"use client";

import { useEffect, type ReactNode } from "react";

/* Animation Timing */

const PAUSE = 5000;
const INTRO_DELAY = 2000;
const PING_DURATION = 1800;

/* Animation Sequence */

const sequence = [
  { name: "link1", duration: 2500 },
  { name: "link2", duration: 2500 },
  { name: "flags", duration: 2400 },
  { name: "ping", duration: PING_DURATION },
] as const;

export default function AnimationController({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    const root = document.documentElement;
    const motion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    let index = 0;
    let timer: ReturnType<typeof setTimeout>;
    let introTimer: ReturnType<typeof setTimeout>;
    let introEndTimer: ReturnType<typeof setTimeout>;
    let introPlayed = false;

    const stop = () => {
      clearTimeout(timer);
      clearTimeout(introTimer);
      clearTimeout(introEndTimer);

      root.dataset.animationStage = "pause";
      delete root.dataset.introPing;
    };

    const run = () => {
      const current = sequence[index];

      root.dataset.animationStage = current.name;

      timer = setTimeout(() => {
        root.dataset.animationStage = "pause";

        timer = setTimeout(() => {
          index = (index + 1) % sequence.length;
          run();
        }, PAUSE);
      }, current.duration);
    };

    const sync = () => {
      stop();
      index = 0;

      if (motion.matches || document.hidden) return;

      run();

      if (!introPlayed) {
        introTimer = setTimeout(() => {
          introPlayed = true;
          root.dataset.introPing = "true";

          introEndTimer = setTimeout(() => {
            delete root.dataset.introPing;
          }, PING_DURATION);
        }, INTRO_DELAY);
      }
    };

    sync();

    motion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);

    return () => {
      stop();
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      delete root.dataset.animationStage;
    };
  }, []);

  return children;
}
