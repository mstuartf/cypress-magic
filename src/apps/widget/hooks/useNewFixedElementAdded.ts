import { useMutateObserver } from "@rc-component/mutate-observer";
import { sideBarWidth, widgetId } from "../constants";

export const useNewFixedElementAdded = () => {
  useMutateObserver(document.body, (mutations, observer) => {
    const nodes = [
      ...mutations.flatMap(
        ({ addedNodes }) => Array.prototype.slice.call(addedNodes) as Node[]
      ),
      ...mutations.map(({ target }) => target),
    ];
    const elements: Element[] = nodes.filter((node): node is Element =>
      isElement(node)
    );
    filterFixedSetLeftHTMLElements(elements).forEach(([elem, left]) => {
      elem.style.setProperty("left", `${sideBarWidth + left}px`, "important");
    });
  });
};

export const getFixedFullWidthElements = (
  innerWidth: number
): [HTMLElement, number][] =>
  Array.prototype.slice
    .call(document.body.getElementsByTagName("*"))
    .filter((elem) => isNotInWidget(elem))
    .filter((elem) => isPositionFixed(elem))
    .filter((elem) => {
      const elementWidth = window
        .getComputedStyle(elem, null)
        .getPropertyValue("width");
      return !elementWidth || elementWidth === `${innerWidth}px`;
    })
    .map((elem) => {
      const elementWidth = window
        .getComputedStyle(elem, null)
        .getPropertyValue("width");
      return [
        elem,
        elementWidth ? parseInt(elementWidth.replace("px", "")) : innerWidth,
      ];
    });

export const getFixedSetLeftElements = (): [HTMLElement, number][] =>
  filterFixedSetLeftHTMLElements(
    Array.prototype.slice.call(document.body.getElementsByTagName("*"))
  );

export const filterFixedSetLeftHTMLElements = (
  elements: Element[]
): [HTMLElement, number][] => {
  return elements
    .filter((element): element is HTMLElement => isHTMLElement(element))
    .filter((elem) => isNotInWidget(elem))
    .filter((elem) => isPositionFixed(elem))
    .filter((elem) => isSetLeft(elem))
    .map((element) => getFixedLeft(element))
    .filter(([element, left]) => left < sideBarWidth);
};

export const isPositionFixed = (element: HTMLElement): boolean => {
  return (
    window.getComputedStyle(element, null).getPropertyValue("position") ===
    "fixed"
  );
};

export const isSetLeft = (element: HTMLElement): boolean => {
  return element.style.left !== "";
};

export const isNotInWidget = (element: HTMLElement): boolean => {
  return !document.getElementById(widgetId)!.contains(element);
};

export const getFixedLeft = (element: HTMLElement): [HTMLElement, number] => {
  const elementLeft = parseInt(
    window
      .getComputedStyle(element, null)
      .getPropertyValue("left")
      .replace("px", "")
  );
  return [element, elementLeft];
};

export const isElement = (node: Node): node is Element => {
  return (node as Element).tagName !== undefined;
};

export const isHTMLElement = (element: Element): element is HTMLElement => {
  return (element as HTMLElement).accessKey !== undefined;
};
