import { rectEquals } from './geometry';

/**
 * Observes an element's rectangle on screen (getBoundingClientRect)
 * This is useful to track elements on the screen and attach other elements
 * that might be in different layers, etc.
 */
export function observeElementRect(
  /** The element whose rect to observe */
  elementToObserve: HTMLElement | SVGElement,
  /** The callback which will be called when the rect changes */
  callback: CallbackFn
) {
  const observedData = observedElements.get(elementToObserve);

  if (observedData === undefined) {
    // add the element to the map of observed elements with its first callback
    // because this is the first time this element is observed
    observedElements.set(elementToObserve, { rect: {} as ClientRect, callbacks: [callback] });

    if (observedElements.size === 1) {
      // start the internal loop once at least 1 element is observed
      runLoop();
    }
  } else {
    // only add a callback for this element as it's already observed
    observedData.callbacks.push(callback);
  }

  return () => {
    const observedData = observedElements.get(elementToObserve);
    if (observedData === undefined) return;

    // start by removing the callback
    const index = observedData.callbacks.indexOf(callback);
    if (index > -1) {
      observedData.callbacks.splice(index, 1);
    }

    if (observedData.callbacks.length === 0) {
      // stop observing this element because there are no
      // callbacks registered for it anymore
      observedElements.delete(elementToObserve);

      if (observedElements.size === 0) {
        // stop the internal loop once no elements are observed anymore
        cancelAnimationFrame(rafId);
      }
    }
  };
}

// ========================================================================
// module internals

type CallbackFn = (rect: ClientRect) => void;

type ObservedData = {
  rect: ClientRect;
  callbacks: Array<CallbackFn>;
};

let rafId: number;
const observedElements: Map<HTMLElement | SVGElement, ObservedData> = new Map();

function runLoop() {
  const changedRectsData: Array<ObservedData> = [];

  // process all DOM reads first (getBoundingClientRect)
  observedElements.forEach((data, element) => {
    const newRect = element.getBoundingClientRect();

    // gather all the data for elements whose rects have changed
    if (!rectEquals(data.rect, newRect)) {
      data.rect = newRect;
      changedRectsData.push(data);
    }
  });

  // group DOM writes here after the DOM reads (getBoundingClientRect)
  // as DOM writes will most likely happen with the callbacks
  changedRectsData.forEach((data) => {
    data.callbacks.forEach((callback) => callback(data.rect));
  });

  rafId = requestAnimationFrame(runLoop);
}
// ========================================================================
