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
      className="cyw-text-xs cyw-bg-blue-500 hover:cyw-bg-blue-700 cyw-text-white cyw-font-bold cyw-py-2 cyw-px-4 cyw-rounded"
    >
      {isAddingAssertion ? "Cancel assertion" : "+ Add assertion"}
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
      "cyw-fixed cyw-top-0 cyw-left-0 cyw-bottom-0 cyw-bg-red-500 cyw-opacity-15 cyw-cursor-pointer";
    el.style.right = `${sideBarWith}px`;
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
