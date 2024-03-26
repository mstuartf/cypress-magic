import { useMutateObserver } from "@rc-component/mutate-observer";
import { sideBarWith, widgetId } from "../constants";

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
    filterFixedSetRightHTMLElements(elements).forEach(([elem, right]) => {
      elem.style.setProperty("right", `${sideBarWith + right}px`, "important");
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

export const getFixedSetRightElements = (): [HTMLElement, number][] =>
  filterFixedSetRightHTMLElements(
    Array.prototype.slice.call(document.body.getElementsByTagName("*"))
  );

export const filterFixedSetRightHTMLElements = (
  elements: Element[]
): [HTMLElement, number][] => {
  return elements
    .filter((element): element is HTMLElement => isHTMLElement(element))
    .filter((elem) => isNotInWidget(elem))
    .filter((elem) => isPositionFixed(elem))
    .filter((elem) => isSetRight(elem))
    .map((element) => getFixedRight(element))
    .filter(([element, right]) => right < sideBarWith);
};

export const isPositionFixed = (element: HTMLElement): boolean => {
  return (
    window.getComputedStyle(element, null).getPropertyValue("position") ===
    "fixed"
  );
};

export const isSetRight = (element: HTMLElement): boolean => {
  return element.style.right !== "";
};

export const isNotInWidget = (element: HTMLElement): boolean => {
  return !document.getElementById(widgetId)!.contains(element);
};

export const getFixedRight = (element: HTMLElement): [HTMLElement, number] => {
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

export const isHTMLElement = (element: Element): element is HTMLElement => {
  return (element as HTMLElement).accessKey !== undefined;
};
