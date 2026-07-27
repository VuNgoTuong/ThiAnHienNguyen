// Shared step-transition animation for the arrival/discovery/puzzle beats
// that make up IslandPage and FinalIslandPage.
export const fadeStep = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.25 },
}
