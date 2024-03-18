import { useMutateObserver } from "@rc-component/mutate-observer";
import { sideBarWith, widgetId } from "../constants";

export const useNewFixedElementAdded = () => {
  useMutateObserver(document.body, (mutations, observer) => {
    getFixedRightHTMLElements([
      ...mutations.flatMap(
        ({ addedNodes }) => Array.prototype.slice.call(addedNodes) as Node[]
      ),
      ...mutations.map(({ target }) => target),
    ]).forEach((elem) => {
      elem.style.setProperty("right", `${sideBarWith}px`, "important");
    });
  });
};

const getFixedRightHTMLElements = (nodes: Node[]): HTMLElement[] => {
  return nodes
    .filter((node): node is Element => isElement(node))
    .filter((element): element is HTMLElement => isHTMLElement(element))
    .filter((element) => isHTMLElement(element))
    .filter((elem) => !document.getElementById(widgetId)!.contains(elem))
    .filter((element) => isFixedRight(element)) as HTMLElement[];
};

const isFixedRight = (element: HTMLElement): boolean => {
  const elementRight = window
    .getComputedStyle(element, null)
    .getPropertyValue("right");
  return elementRight === "0px";
};

const isElement = (node: Node): node is Element => {
  return (node as Element).tagName !== undefined;
};

const isHTMLElement = (element: Element): element is HTMLElement => {
  return (element as HTMLElement).accessKey !== undefined;
};
