import "@testing-library/jest-dom/vitest";
import { beforeEach } from "vitest";

// jsdom does not implement scrolling; the store calls these on navigation.
window.scrollTo = () => {};
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

// The store persists to localStorage; clear it between tests so state
// (login, language) from one test never leaks into the next.
beforeEach(() => {
  try {
    localStorage.clear();
  } catch {
    /* localStorage may be unavailable in some CI runners */
  }
});
