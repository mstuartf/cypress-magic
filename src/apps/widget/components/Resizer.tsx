import React, { useEffect, useState } from "react";
import { useWindowSize } from "../hooks/useWindowSize";
import { sideBarWith } from "../constants";
import {
  getFixedSetRightElements,
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

    // fixed right elements only need to be moved once (when they are added to the DOM)
    if (!lastInnerWidth) {
      getFixedSetRightElements().forEach(([elem, right]) => {
        elem.style.right = `${sideBarWith + right}px`;
      });
    }

    setFixedWidthElements(updatedWidthElements);
    setLastInnerWidth(innerWidth);
  }, [innerWidth]);

  useNewFixedElementAdded();
  const zIndex = useZIndexMonitor();

  return (
    <div
      className="cyw-fixed cyw-top-0 cyw-right-0 cyw-bottom-0 cyw-border-l-2 cyw-border-gray-500 cyw-bg-slate-50 cyw-px-4 cyw-py-6"
      style={{ width: `${sideBarWith}px`, zIndex }}
    >
      {children}
    </div>
  );
};
export default Resizer;
