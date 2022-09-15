import { DiffDOM } from "diff-dom";
import { DiffEvent } from "./types";

export const initializeDomObserver = () => {
  // compare against an empty body on first load
  let oldDom: Node = document.createElement("body");
  let newDom: Node;
  let diff: object;

  const dd = new DiffDOM();

  const createDiffEvent: () => DiffEvent = () => {
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
