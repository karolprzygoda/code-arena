"use client";

import { useEffect } from "react";

const useSaveShortcut = (onSave: () => void) => {
  useEffect(() => {
    const handleSave = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        onSave();
      }
    };

    window.addEventListener("keydown", handleSave);
    return () => window.removeEventListener("keydown", handleSave);
  }, [onSave]);
};

export default useSaveShortcut;
