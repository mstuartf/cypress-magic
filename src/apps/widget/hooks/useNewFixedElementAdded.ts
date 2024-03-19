import { useMutateObserver } from "@rc-component/mutate-observer";
import { sideBarWith, widgetId } from "../constants";

export const useNewFixedElementAdded = () => {
  useMutateObserver(document.body, (mutations, observer) => {
    getFixedRightHTMLElements([
      ...mutations.flatMap(
        ({ addedNodes }) => Array.prototype.slice.call(addedNodes) as Node[]
      ),
      ...mutations.map(({ target }) => target),
    ]).forEach(([elem, right]) => {
      elem.style.setProperty("right", `${sideBarWith + right}px`, "important");
    });
  });
};

const getFixedRightHTMLElements = (nodes: Node[]): [HTMLElement, number][] => {
  return nodes
    .filter((node): node is Element => isElement(node))
    .filter((element): element is HTMLElement => isHTMLElement(element))
    .filter((element) => isHTMLElement(element))
    .filter((elem) => !document.getElementById(widgetId)!.contains(elem))
    .map((element) => isFixedRight(element))
    .filter(([element, right]) => right < sideBarWith);
};

export const isFixedRight = (element: HTMLElement): [HTMLElement, number] => {
  const elementRight = parseInt(
    window
      .getComputedStyle(element, null)
      .getPropertyValue("right")
      .replace("px", "")
  );
  return [element, elementRight];
};

const isElement = (node: Node): node is Element => {
  return (node as Element).tagName !== undefined;
};

const isHTMLElement = (element: Element): element is HTMLElement => {
  return (element as HTMLElement).accessKey !== undefined;
};
