import { useState, useEffect } from "react";

/**
 * Hook to detect if the current device supports touch events
 * @returns {boolean} true if device is touch-capable
 */
export default function useTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsTouchDevice(
        "ontouchstart" in window || navigator.maxTouchPoints > 0
      );
    }
  }, []);

  return isTouchDevice;
}
