"use client";

import { useEffect, useState } from "react";

type LoaderState = "visible" | "leaving" | "gone";

export default function ExperienceLoader() {
  const [state, setState] = useState<LoaderState>("visible");

  useEffect(() => {
    let sceneReady = Boolean((window as Window & { __wvSceneReady?: boolean }).__wvSceneReady);
    let fontsReady = !document.fonts;
    let minimumElapsed = false;
    let leaveTimer = 0;
    let goneTimer = 0;

    const beginExit = () => {
      if (!sceneReady || !fontsReady || !minimumElapsed || leaveTimer) return;
      leaveTimer = window.setTimeout(() => {
        setState("leaving");
        goneTimer = window.setTimeout(() => setState("gone"), 760);
      }, 90);
    };

    const onSceneReady = () => {
      sceneReady = true;
      beginExit();
    };

    window.addEventListener("wv:scene-ready", onSceneReady);

    const minimumTimer = window.setTimeout(() => {
      minimumElapsed = true;
      beginExit();
    }, 820);

    const safetyTimer = window.setTimeout(() => {
      sceneReady = true;
      fontsReady = true;
      minimumElapsed = true;
      beginExit();
    }, 2600);

    if (document.fonts) {
      document.fonts.ready.then(() => {
        fontsReady = true;
        beginExit();
      });
    }

    return () => {
      window.removeEventListener("wv:scene-ready", onSceneReady);
      window.clearTimeout(minimumTimer);
      window.clearTimeout(safetyTimer);
      window.clearTimeout(leaveTimer);
      window.clearTimeout(goneTimer);
    };
  }, []);

  if (state === "gone") return null;

  return (
    <div
      className={`experience-loader ${state === "leaving" ? "is-leaving" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="White Velvet laddar"
    >
      <div className="experience-loader-inner">
        <span className="experience-loader-mark">WV</span>
        <div className="experience-loader-rule" aria-hidden="true"><span /></div>
        <span className="experience-loader-caption">WHITE VELVET · VÄSTERÅS</span>
      </div>
    </div>
  );
}
