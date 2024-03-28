import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAddingAssertion } from "../redux/selectors";
import { setIsAddingAssertion } from "../redux/slice";
import { sideBarWith, widgetId } from "../constants";

const AddAssertion = () => {
  const dispatch = useDispatch();
  const isAddingAssertion = useSelector(selectIsAddingAssertion);

  // needs to be added at the root level
  useEffect(() => {
    showOrHideOverlay(isAddingAssertion);
  }, [isAddingAssertion]);

  return (
    <button
      onClick={() => dispatch(setIsAddingAssertion(!isAddingAssertion))}
      className=""
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
    </button>
  );
};

export default AddAssertion;

export const assertionOverlayId = "__assertionOverlay__";

const showOrHideOverlay = (show: boolean) => {
  if (show) {
    const el = window.document.createElement("div");
    el.id = assertionOverlayId;
    el.className =
      "cyw-fixed cyw-top-0 cyw-right-0 cyw-bottom-0 cyw-bg-red-500 cyw-opacity-15 cyw-cursor-pointer";
    el.style.left = `${sideBarWith}px`;
    el.style.zIndex = `${maxZIndex() + 1}`;
    document.getElementById(widgetId)!.appendChild(el);
  } else {
    document.getElementById(assertionOverlayId)?.remove();
  }
};

export const maxZIndex = (): number =>
  Array.from(document.querySelectorAll("body *"))
    .map((a) => parseFloat(window.getComputedStyle(a).zIndex))
    .filter((a) => !isNaN(a))
    .concat(1000)
    .sort((a, b) => a - b)
    .pop()!;
