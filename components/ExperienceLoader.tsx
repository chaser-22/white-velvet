"use client";

import { useEffect, useState } from "react";

type LoaderState = "visible" | "leaving" | "gone";

export default function ExperienceLoader() {
  const [state, setState] = useState<LoaderState>("visible");

  useEffect(() => {
    const sessionKey = "wv:intro-seen";
    if (window.sessionStorage.getItem(sessionKey) === "1") {
      setState("gone");
      return;
    }

    let sceneReady = Boolean((window as Window & { __wvSceneReady?: boolean }).__wvSceneReady);
    let fontsReady = !document.fonts;
    let minimumElapsed = false;
    let leaveTimer = 0;
    let goneTimer = 0;

    const beginExit = () => {
      if (!sceneReady || !fontsReady || !minimumElapsed || leaveTimer) return;
      leaveTimer = window.setTimeout(() => {
        window.sessionStorage.setItem(sessionKey, "1");
        setState("leaving");
        goneTimer = window.setTimeout(() => setState("gone"), 980);
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
    }, 3000);

    const safetyTimer = window.setTimeout(() => {
      sceneReady = true;
      fontsReady = true;
      minimumElapsed = true;
      beginExit();
    }, 5600);

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
      <div className="experience-loader-fabric" aria-hidden="true">
        <span className="loader-fold loader-fold-a" />
        <span className="loader-fold loader-fold-b" />
        <span className="loader-fold loader-fold-c" />
        <span className="loader-light-sweep" />
      </div>

      <div className="loader-material-window" aria-hidden="true">
        <span className="loader-material loader-material-matte" />
        <span className="loader-material loader-material-restored" />
        <span className="loader-restoration-line" />
      </div>

      <div className="experience-loader-inner">
        <div className="experience-loader-emblem" aria-hidden="true">
          <span className="loader-orbit loader-orbit-a" />
          <span className="loader-orbit loader-orbit-b" />
          <span className="experience-loader-mark">WV</span>
        </div>
        <p className="experience-loader-kicker">MATERIALVÅRD · VÄSTERÅS</p>
        <div className="experience-loader-rule" aria-hidden="true"><span /></div>
        <div className="experience-loader-status">
          <span>WHITE VELVET</span>
          <span className="loader-status-word">FÖRBEREDER YTAN</span>
        </div>
      </div>
    </div>
  );
}
