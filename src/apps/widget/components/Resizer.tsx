import React, { useEffect, useState } from "react";
import { useWindowSize } from "../hooks/useWindowSize";
import { sideBarWidth } from "../constants";
import {
  getFixedSetLeftElements,
  getFixedFullWidthElements,
  useNewFixedElementAdded,
} from "../hooks/useNewFixedElementAdded";
import { useZIndexMonitor } from "../hooks/useZIndexMonitor";

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
        : getFixedFullWidthElements(innerWidth);
    const widthChange =
      lastInnerWidth !== null ? innerWidth - lastInnerWidth : sideBarWidth * -1;

    // body and fixed width elements need to be resized everytime viewport changes
    const updatedWidthElements = widthElementsToUpdate.map(
      ([elem, oldWidth]) => {
        const newWidth = oldWidth + widthChange;
        elem.style.width = `${newWidth}px`;
        elem.style.left = `${sideBarWidth}px`;
        // todo: what if elem no longer exists?
        return [elem, newWidth] as [HTMLElement, number];
      }
    );
    const body = document.getElementsByTagName("body")[0];
    body.style.width = `${innerWidth - sideBarWidth}px`;
    body.style.marginLeft = `${sideBarWidth}px`;

    // fixed left elements only need to be moved once (when they are added to the DOM)
    if (!lastInnerWidth) {
      getFixedSetLeftElements().forEach(([elem, left]) => {
        elem.style.left = `${sideBarWidth + left}px`;
      });
    }

    setFixedWidthElements(updatedWidthElements);
    setLastInnerWidth(innerWidth);
  }, [innerWidth]);

  useNewFixedElementAdded();
  const zIndex = useZIndexMonitor();

  return (
    <div
      className="cyw-font-sans cyw-fixed cyw-top-0 cyw-left-0 cyw-bottom-0 cyw-px-4 cyw-py-6 cyw-text-slate-400"
      style={{ width: `${sideBarWidth}px`, zIndex, background: "#1b1e2e" }}
    >
      {children}
    </div>
  );
};
export default Resizer;
