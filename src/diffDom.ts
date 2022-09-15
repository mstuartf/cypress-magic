import { DiffDOM } from "diff-dom";
import { DiffEvent } from "./types";

export const initializeDomObserver = () => {
  // compare against an empty body on first load
  let oldDom: Node = document.createElement("body");
  let newDom: Node;
  let diff: object[];

  const dd = new DiffDOM();

  const createDiffEvent: () => DiffEvent | null = () => {
    newDom = document.body.cloneNode(true);
    diff = dd.diff(oldDom, newDom);
    oldDom = newDom;
    newDom = undefined;

    if (!diff.length) {
      return null;
    }

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
