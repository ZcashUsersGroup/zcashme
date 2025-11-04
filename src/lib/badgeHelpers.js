/**
 * Shared utilities for badge components
 */

/**
 * Generates CSS classes for expandable badge text with smooth transitions
 * @param {boolean} open - Whether the badge is currently open/expanded
 * @param {number} maxWidth - Maximum width in pixels or CSS units (default: 80px)
 * @returns {string} Tailwind classes for the expandable text element
 */
export function getExpandableTextClasses(open, maxWidth = 80) {
  return `overflow-hidden inline-block transition-all duration-300 ease-in-out whitespace-nowrap ${
    open
      ? `max-w-[${maxWidth}px] opacity-100`
      : `max-w-0 opacity-0 group-hover:max-w-[${maxWidth}px] group-hover:opacity-100`
  }`;
}

/**
 * Base classes for badge container elements
 */
export const badgeBaseClasses =
  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold tracking-wide select-none whitespace-nowrap align-middle";

/**
 * Common badge container classes with hover transitions
 */
export const badgeContainerClasses =
  "group inline-flex items-center justify-center rounded-full border text-xs font-medium transition-all duration-300 shadow-sm";

/**
 * Handles touch start event for badge expansion on touch devices
 * @param {Function} setOpen - State setter function
 * @param {boolean} isTouchDevice - Whether device is touch-capable
 * @returns {Function} Event handler function
 */
export function createTouchHandler(setOpen, isTouchDevice) {
  return (e) => {
    e.stopPropagation();
    if (isTouchDevice) {
      setOpen((prev) => !prev);
    }
  };
}
