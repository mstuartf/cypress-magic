import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAddingAssertion } from "./redux/selectors";
import { setIsAddingAssertion } from "./redux/slice";

const AddAssertion = () => {
  const dispatch = useDispatch();
  const isAddingAssertion = useSelector(selectIsAddingAssertion);
  return (
    <div className="mb-6">
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
  );
};

export default AddAssertion;
