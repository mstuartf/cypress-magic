import { DiffAction, DiffDOM } from "diff-dom";

// Cannot send DOM data raw as it may contain sensitive info.
// Obfuscating everything is useless as the data will not be useful for assertions.
// We want to obfuscate state data (if we do not obfuscate, sensitive data will be sent).
// But not hardcoded data (if we obfuscate this then make assertions on it, tests will always fail).
// Could track all state data (user input and api responses) and obfuscate these in DOM contents.
// But will be false positives if there is any overlap between state and hardcoded data, causing tests to fail.
// Also will be false negatives if state data is transformed before being added to DOM.
// There are also some issues around understanding what in the DOM is actually visible.

export const initializeDomObserver = () => {
  // compare against an empty body on first load
  let oldDom: Node = document.createElement("body");
  let newDom: Node;

  const dd = new DiffDOM();

  const checkDomDiff: () => string[] = () => {
    newDom = document.body.cloneNode(true);
    const actions: DiffAction[] = dd.diff(oldDom, newDom);

    oldDom = newDom;
    newDom = undefined;

    return actions
      .map(({ action }) => action)
      .filter((name) => ["addElement", "replaceElement"].includes(name));
  };

  return {
    checkDomDiff,
  };
};
