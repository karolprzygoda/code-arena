import { useCallback, useEffect, useState } from "react";

export const useUndo = (itemToUndoSetter: (value: string) => void) => {
  const [, setHistory] = useState<string[]>([""]);

  const handleUndo = useCallback(
    (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "z") {
        setHistory((prevHistory) => {
          if (prevHistory.length > 1) {
            const newHistory = [...prevHistory];
            newHistory.pop();
            itemToUndoSetter(newHistory[newHistory.length - 1]);
            return newHistory;
          }
          return prevHistory;
        });
      }
    },
    [itemToUndoSetter],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleUndo);
    return () => {
      window.removeEventListener("keydown", handleUndo);
    };
  }, [handleUndo]);

  const addToHistory = (newItem: string) => {
    setHistory((prevHistory) => {
      if (prevHistory[prevHistory.length - 1] !== newItem) {
        return [...prevHistory, newItem];
      }
      return prevHistory;
    });
  };

  return { addToHistory };
};
