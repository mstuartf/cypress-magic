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
          <div className="grid">
            <div className="h-10 flex items-center justify-center text-sm font-medium text-gray-900">
              Click on the element to assert...
            </div>
          </div>
        ) : (
          <div className="grid">
            <button
              onClick={() => {
                if (!isAddingAssertion) {
                  dispatch(setIsAddingAssertion(true));
                }
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
    el.className = "fixed top-0 left-0 bottom-0 bg-red-500 opacity-15";
    el.style.right = `${sideBarWith}px`;
    el.style.zIndex = "1000";
    window.document.body.appendChild(el);
  } else {
    document.getElementById(assertionOverlayId)?.remove();
  }
};
