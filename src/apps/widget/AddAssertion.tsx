import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAddingAssertion } from "./redux/selectors";
import { setIsAddingAssertion } from "./redux/slice";
import { sideBarWith } from "./constants";

const AddAssertion = () => {
  const dispatch = useDispatch();
  const isAddingAssertion = useSelector(selectIsAddingAssertion);

  // needs to be added at the root level
  useEffect(() => {
    showOrHideOverlay(isAddingAssertion);
  }, [isAddingAssertion]);

  return (
    <>
      <div>
        {isAddingAssertion ? (
          <div className="cyw-grid">
            <div className="cyw-h-10 cyw-flex cyw-items-center cyw-justify-center cyw-text-sm cyw-font-medium cyw-text-gray-900">
              Click on the element to assert...
            </div>
          </div>
        ) : (
          <div className="cyw-grid">
            <button
              onClick={() => {
                if (!isAddingAssertion) {
                  dispatch(setIsAddingAssertion(true));
                }
              }}
              className="cyw-bg-blue-500 hover:cyw-bg-blue-700 cyw-text-white cyw-font-bold cyw-py-2 cyw-px-4 cyw-rounded"
            >
              + Add assertion
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default AddAssertion;

export const assertionOverlayId = "__assertionOverlay__";

const showOrHideOverlay = (show: boolean) => {
  if (show) {
    const el = window.document.createElement("div");
    el.id = assertionOverlayId;
    el.className =
      "cyw-fixed cyw-top-0 cyw-left-0 cyw-bottom-0 cyw-bg-red-500 cyw-opacity-15";
    el.style.right = `${sideBarWith}px`;
    el.style.zIndex = "1000";
    window.document.body.appendChild(el);
  } else {
    document.getElementById(assertionOverlayId)?.remove();
  }
};
