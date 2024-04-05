import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAddingAssertion } from "../redux/selectors";
import { setIsAddingAssertion } from "../redux/slice";
import { sideBarWidth } from "../constants";
import { isHTMLElement } from "../hooks/useNewFixedElementAdded";

interface HighlightBox {
  width: number;
  height: number;
  left: number;
  top: number;
}

const AddAssertion = () => {
  const dispatch = useDispatch();
  const isAddingAssertion = useSelector(selectIsAddingAssertion);
  const [target, setTarget] = useState<HTMLElement | null>();
  return (
    <>
      <button
        onClick={() => dispatch(setIsAddingAssertion(!isAddingAssertion))}
        className="cyw-group cyw-flex cyw-items-center focus:cyw-outline-none"
      >
        <svg
          data-v-694f6e40=""
          height="1em"
          width="1em"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="cyw-fill-slate-300"
          style={{ minWidth: "16px", minHeight: "16px" }}
        >
          <path
            d="M8 4V12M12 8H4"
            stroke="#D0D2E0"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
        <span className="group-hover:cyw-underline cyw-text-xs cyw-text-white">
          {!isAddingAssertion ? "Assertion" : "Cancel"}
        </span>
      </button>
      {isAddingAssertion && (
        <div
          id={assertionOverlayId}
          className="cyw-fixed cyw-top-0 cyw-right-0 cyw-bottom-0 cyw-cursor-pointer"
          style={{ left: `${sideBarWidth}px`, zIndex: `${maxZIndex() + 2}` }}
          onMouseMove={(event) => {
            const elementUnderneath = getAssertedElement(
              event.clientX,
              event.clientY
            );
            if (
              elementUnderneath !== target &&
              elementUnderneath.id !== assertionHighlightId
            ) {
              setTarget(elementUnderneath);
            }
          }}
          onMouseLeave={() => setTarget(null)}
        />
      )}
      {!!target && isAddingAssertion && (
        <div
          id={assertionHighlightId}
          className="cyw-fixed cyw-outline cyw-outline-2 cyw-outline-offset-2 cyw-outline-yellow-500 cyw-rounded"
          style={{ ...getTargetBox(target), zIndex: `${maxZIndex() + 1}` }}
        />
      )}
    </>
  );
};

export default AddAssertion;

export const assertionOverlayId = "__assertionOverlay__";
export const assertionHighlightId = "__assertionHighlight__";

export const maxZIndex = (): number =>
  Array.from(document.querySelectorAll("body *"))
    .map((a) => parseFloat(window.getComputedStyle(a).zIndex))
    .filter((a) => !isNaN(a))
    .concat(1000)
    .sort((a, b) => a - b)
    .pop()!;

const getTargetBox = (el: HTMLElement): HighlightBox => {
  const { width, height, left, top } = el.getBoundingClientRect();
  return {
    width,
    height,
    left,
    top,
  };
};

export const getAssertedElement = (clientX: number, clientY: number) => {
  return document
    .elementsFromPoint(clientX, clientY)
    .filter((el) => ![assertionOverlayId, assertionHighlightId].includes(el.id))
    .filter((el): el is HTMLElement => isHTMLElement(el))[0];
};
