import { useEffect, useCallback } from "react";

export const useFullScreen = (
  element: HTMLElement | null,
  onChange?: (isFullScreen: boolean) => void,
) => {
  const toggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement && element) {
      void element.requestFullscreen();
    } else if (document.exitFullscreen) {
      void document.exitFullscreen();
    }
  }, [element]);

  useEffect(() => {
    if (onChange) {
      const handleFullScreenChange = () => {
        onChange(!!document.fullscreenElement);
      };

      document.addEventListener("fullscreenchange", handleFullScreenChange);

      return () => {
        document.removeEventListener(
          "fullscreenchange",
          handleFullScreenChange,
        );
      };
    }
  }, [onChange]);

  return { toggleFullScreen };
};
