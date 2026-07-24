/**
 * @fileoverview Number counting and element animations.
 */

/**
 * Animates a number counting up from 0 to the target value.
 * @param {HTMLElement} element 
 * @param {number} target 
 * @param {number} durationMs 
 */
export function countUp(element, target, durationMs = 800) {
  // Respect reduced motion (OS level or user toggle)
  if (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    document.body.classList.contains('reduced-motion')
  ) {
    element.textContent = Math.round(target);
    return;
  }

  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / durationMs, 1);
    
    // Ease out cubic
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(easeOut * target);
    
    element.textContent = current;

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  }

  window.requestAnimationFrame(step);
}

/**
 * Triggers layout reflow to ensure CSS transitions execute
 * when adding elements to DOM.
 */
export function triggerReflow(element) {
  void element.offsetWidth;
}
