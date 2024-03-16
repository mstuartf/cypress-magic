import React, { useEffect, useState } from "react";
import { useWindowSize } from "./hooks/useWindowSize";
import { sideBarWith, widgetId } from "./constants";

const Resizer = ({ children }: { children: React.ReactNode }) => {
  const [fixedWidthElements, setFixedWidthElements] = useState<
    [HTMLElement, number][] | null
  >(null);
  const [lastInnerWidth, setLastInnerWidth] = useState<number | null>(null);
  const [innerWidth] = useWindowSize();
  useEffect(() => {
    if (!innerWidth) return;
    const widthElementsToUpdate =
      fixedWidthElements !== null
        ? fixedWidthElements
        : getFixedWidthElements(innerWidth);
    const widthChange =
      lastInnerWidth !== null ? innerWidth - lastInnerWidth : sideBarWith * -1;

    // body and fixed width elements need to be resized everytime viewport changes
    const updatedWidthElements = widthElementsToUpdate.map(
      ([elem, oldWidth]) => {
        const newWidth = oldWidth + widthChange;
        elem.style.width = `${newWidth}px`;
        // todo: what if elem no longer exists?
        return [elem, newWidth] as [HTMLElement, number];
      }
    );
    const body = document.getElementsByTagName("body")[0];
    body.style.width = `${innerWidth - sideBarWith}px`;

    // fixed right elements only need to be moved once
    // todo: what about when new fixed right elements are added
    if (!lastInnerWidth) {
      getFixedRightElements().forEach(([elem, oldRight]) => {
        elem.style.right = `${sideBarWith}px`;
      });
    }

    setFixedWidthElements(updatedWidthElements);
    setLastInnerWidth(innerWidth);
  }, [innerWidth]);
  return (
    <div
      className="fixed top-0 right-0 bottom-0 border-l-2 border-gray-500 bg-slate-50 px-4 py-6"
      style={{ width: `${sideBarWith}px` }}
    >
      {children}
    </div>
  );
};

const getFixedElements = (): HTMLElement[] =>
  Array.prototype.slice
    .call(document.body.getElementsByTagName("*"))
    .filter(
      (elem) =>
        window.getComputedStyle(elem, null).getPropertyValue("position") ==
        "fixed"
    )
    .filter((elem) => !document.getElementById(widgetId)!.contains(elem));

const getFixedWidthElements = (innerWidth: number): [HTMLElement, number][] =>
  getFixedElements()
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

const getFixedRightElements = (): [HTMLElement, number][] =>
  getFixedElements()
    .filter((elem) => {
      const elementRight = window
        .getComputedStyle(elem, null)
        .getPropertyValue("right");
      return elementRight === "0px";
    })
    .map((elem) => [elem, 0]);

export default Resizer;
