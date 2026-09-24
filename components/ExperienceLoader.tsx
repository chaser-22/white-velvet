"use client";

import { useEffect, useState } from "react";

type LoaderState = "visible" | "leaving" | "gone";

export default function ExperienceLoader() {
  const [state, setState] = useState<LoaderState>("visible");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const sessionKey = "wv:intro-seen-v2";
    if (window.sessionStorage.getItem(sessionKey) === "1") {
      setState("gone");
      return;
    }

    const startedAt = performance.now();
    let sceneReady = Boolean((window as Window & { __wvSceneReady?: boolean }).__wvSceneReady);
    let fontsReady = !document.fonts;
    let minimumElapsed = false;
    let leaveTimer = 0;
    let goneTimer = 0;

    const progressTimer = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      const next = Math.min(99, Math.floor((elapsed / 5000) * 100));
      setProgress(next);
    }, 50);

    const beginExit = () => {
      if (!sceneReady || !fontsReady || !minimumElapsed || leaveTimer) return;

      window.clearInterval(progressTimer);
      setProgress(100);

      leaveTimer = window.setTimeout(() => {
        window.sessionStorage.setItem(sessionKey, "1");
        setState("leaving");
        goneTimer = window.setTimeout(() => setState("gone"), 760);
      }, 160);
    };

    const onSceneReady = () => {
      sceneReady = true;
      beginExit();
    };

    window.addEventListener("wv:scene-ready", onSceneReady);

    const minimumTimer = window.setTimeout(() => {
      minimumElapsed = true;
      beginExit();
    }, 5000);

    const safetyTimer = window.setTimeout(() => {
      sceneReady = true;
      fontsReady = true;
      minimumElapsed = true;
      beginExit();
    }, 6800);

    if (document.fonts) {
      document.fonts.ready.then(() => {
        fontsReady = true;
        beginExit();
      });
    }

    return () => {
      window.removeEventListener("wv:scene-ready", onSceneReady);
      window.clearInterval(progressTimer);
      window.clearTimeout(minimumTimer);
      window.clearTimeout(safetyTimer);
      window.clearTimeout(leaveTimer);
      window.clearTimeout(goneTimer);
    };
  }, []);

  if (state === "gone") return null;

  return (
    <div
      className={`experience-loader experience-loader-minimal ${state === "leaving" ? "is-leaving" : ""}`}
      role="status"
      aria-live="polite"
      aria-label={`White Velvet laddar ${progress} procent`}
    >
      <div className="loader-velvet-field" aria-hidden="true">
        <span className="loader-velvet-fold loader-velvet-fold-a" />
        <span className="loader-velvet-fold loader-velvet-fold-b" />
        <span className="loader-velvet-glow" />
      </div>

      <div className="loader-minimal-brand">
        <div className="loader-minimal-mark" aria-hidden="true">WV</div>
        <div className="loader-minimal-name">WHITE VELVET</div>

        <div className="loader-minimal-progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${progress / 100})` }} />
        </div>

        <div className="loader-minimal-percent" aria-hidden="true">
          {progress}%
        </div>
      </div>
    </div>
  );
}
