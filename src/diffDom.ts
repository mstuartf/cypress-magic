import {
  AddElementAction,
  DiffAction,
  DiffDOM,
  ElementNode,
  ReplaceElementAction,
  TextNode,
} from "diff-dom";
import { DiffEvent } from "./types";
import { obfuscate } from "./obfuscate";

function isAddAction(
  action: AddElementAction | ReplaceElementAction
): action is AddElementAction {
  return (action as AddElementAction).action !== undefined;
}

function isTextNode(node: ElementNode | TextNode): node is TextNode {
  return (node as TextNode).nodeName === "#text";
}

const extractTextNodes = (el: ElementNode | TextNode): TextNode[] => {
  // if text return self
  if (isTextNode(el)) {
    return [el];
  }

  if (!el.childNodes || !el.childNodes.length) {
    return [];
  }

  return el.childNodes.reduce(
    (prev, next) => [...prev, ...extractTextNodes(next)],
    []
  );
};

const getNewTextNodes = (actions: DiffAction[]): TextNode[] => {
  return actions
    .filter((a): a is AddElementAction | ReplaceElementAction =>
      ["replaceElement", "addElement"].includes(a.action)
    )
    .reduce(
      (prev, next) => [
        ...prev,
        ...[isAddAction(next) ? next.element : next.newValue],
      ],
      []
    )
    .reduce((prev, next) => [...prev, ...extractTextNodes(next)], []);
};

export const initializeDomObserver = () => {
  // compare against an empty body on first load
  let oldDom: Node = document.createElement("body");
  let newDom: Node;

  const dd = new DiffDOM();

  const createDiffEvent: () => DiffEvent | null = () => {
    newDom = document.body.cloneNode(true);
    const actions: DiffAction[] = dd.diff(oldDom, newDom);

    oldDom = newDom;
    newDom = undefined;

    if (!actions.length) {
      return null;
    }

    const textNodes = getNewTextNodes(actions).map(({ data, ...rest }) => ({
      ...rest,
      data: obfuscate(data) as string, // todo when should this be obfuscated?
    }));

    return {
      type: "domDiff",
      timestamp: Date.now(),
      diff: textNodes,
    };
  };

  return {
    createDiffEvent,
  };
};
