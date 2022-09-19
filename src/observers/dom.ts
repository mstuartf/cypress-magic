import {
  AddElementAction,
  AnyNode,
  DiffAction,
  DiffDOM,
  ElementNode,
  ReplaceElementAction,
  TextNode,
} from "diff-dom";
import { InitArgs, OnSaveCallback } from "../types";

// Cannot send DOM data raw as it may contain sensitive info.
// Obfuscating everything is useless as the data will not be useful for assertions.
// We want to obfuscate state data (if we do not obfuscate, sensitive data will be sent).
// But not hardcoded data (if we obfuscate this then make assertions on it, tests will always fail).
// Could track all state data (user input and api responses) and obfuscate these in DOM contents.
// But will be false positives if there is any overlap between state and hardcoded data, causing tests to fail.
// Also will be false negatives if state data is transformed before being added to DOM.
// There are also some issues around understanding what in the DOM is actually visible.

export interface TextNodeWithRoute extends TextNode {
  route: number[];
}

function isAddAction(
  action: AddElementAction | ReplaceElementAction
): action is AddElementAction {
  return (action as AddElementAction).action === "addElement";
}

function isTextNode(node: ElementNode | TextNode): node is TextNode {
  return (node as TextNode).nodeName === "#text";
}

const extractTextNodes = (
  el: ElementNode | TextNode,
  route: number[]
): TextNodeWithRoute[] => {
  // if text return self
  if (isTextNode(el)) {
    return [
      {
        ...el,
        route,
      },
    ];
  }

  if (!el.childNodes || !el.childNodes.length) {
    return [];
  }

  return el.childNodes.reduce<TextNodeWithRoute[]>(
    (prev, next, i) => [...prev, ...extractTextNodes(next, [...route, i])],
    []
  );
};

const getNewTextNodes = (actions: DiffAction[]): TextNodeWithRoute[] => {
  return actions
    .filter((a): a is AddElementAction | ReplaceElementAction =>
      ["replaceElement", "addElement"].includes(a.action)
    )
    .reduce<Array<[AnyNode, number[]]>>(
      (prev, next) => [
        ...prev,
        [isAddAction(next) ? next.element : next.newValue, next.route],
      ],
      []
    )
    .reduce<TextNodeWithRoute[]>(
      (prev, [node, route]) => [...prev, ...extractTextNodes(node, route)],
      []
    );
};

export const initDomObserver = ({
  removeStateData,
  registerOnSave,
}: InitArgs) => {
  // compare against an empty body on first load
  let oldDom: Node = document.createElement("body");
  let newDom: Node;

  const dd = new DiffDOM();

  const calculateDiff = (): TextNodeWithRoute[] => {
    newDom = document.body.cloneNode(true);

    const textNodes: TextNodeWithRoute[] = getNewTextNodes(
      dd.diff(oldDom, newDom)
    )
      .filter(({ data }) => !!data.trim())
      .filter(({ data }) => data.length > 5)
      .map(({ data, ...rest }) => ({
        ...rest,
        data: removeStateData(data),
      }));

    oldDom = newDom;
    newDom = undefined;

    return textNodes;
  };

  const onSave: OnSaveCallback = (saveEventFn) => {
    const textNodes = calculateDiff();
    if (textNodes.length) {
      saveEventFn({
        type: "domDiff",
        timestamp: Date.now(),
        diff: textNodes,
      });
    }
  };

  registerOnSave(onSave);
};
