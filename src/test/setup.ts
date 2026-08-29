import "@testing-library/jest-dom/vitest";

// jsdom does not implement scrolling; the store calls these on navigation.
window.scrollTo = () => {};
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
