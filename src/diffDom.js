import { DiffDOM } from "diff-dom";

export const initializeDomObserver = () => {
  // compare against an empty body on first load
  let oldDom = document.createElement("body");
  let newDom;
  let diff;

  const dd = new DiffDOM();

  const createDiffEvent = () => {
    newDom = document.body.cloneNode(true);
    diff = dd.diff(oldDom, newDom);
    oldDom = newDom;
    newDom = undefined;

    return {
      type: "domDiff",
      timestamp: Date.now(),
      domain: window.location.hostname,
      diff, // todo: don't send the whole (large) diff object?
    };
  };

  return {
    createDiffEvent,
  };
};
