"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const GlobalThreeScene = dynamic(() => import("./GlobalThreeScene"), {
  ssr: false,
});

export default function DeferredThreeScene() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 120);
    return () => window.clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <div className="three-fallback three-deferred-fallback" aria-hidden="true" />;
  }

  return <GlobalThreeScene />;
}
