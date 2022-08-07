import { DiffDOM } from "diff-dom";

export const initializeDomObserver = () => {
  let oldDom;
  let newDom;
  let diff;

  const dd = new DiffDOM();

  const createDiffEvent = () => {
    newDom = document.body.cloneNode(true);
    if (oldDom && newDom) {
      diff = dd.diff(oldDom, newDom);
    } else {
      diff = []; // todo: compare against an empty body on first load?
    }
    oldDom = newDom;
    newDom = undefined;

    return {
      type: "domDiff",
      timestamp: Date.now(),
      diff, // todo: don't send the whole (large) diff object?
    };
  };

  return {
    createDiffEvent,
  };
};
