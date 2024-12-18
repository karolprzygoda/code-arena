import { useCallback, useEffect, useState } from "react";

export const useUndo = (itemToUndoSetter: (value: string) => void) => {
  const [, setHistory] = useState<string[]>([""]);

  const undo = useCallback(
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

  const handleUndo = () => {
    setHistory((prevHistory) => {
      if (prevHistory.length > 1) {
        const newHistory = [...prevHistory];
        newHistory.pop();
        itemToUndoSetter(newHistory[newHistory.length - 1]);
        return newHistory;
      }
      return prevHistory;
    });
  };

  useEffect(() => {
    window.addEventListener("keydown", undo);
    return () => {
      window.removeEventListener("keydown", undo);
    };
  }, [undo]);

  const addToHistory = (newItem: string) => {
    setHistory((prevHistory) => {
      if (prevHistory[prevHistory.length - 1] !== newItem) {
        return [...prevHistory, newItem];
      }
      return prevHistory;
    });
  };

  return { addToHistory, handleUndo };
};
