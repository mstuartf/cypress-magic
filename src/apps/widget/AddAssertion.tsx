import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAddingAssertion } from "./redux/selectors";
import { setIsAddingAssertion } from "./redux/slice";

const AddAssertion = () => {
  const dispatch = useDispatch();
  const isAddingAssertion = useSelector(selectIsAddingAssertion);
  return (
    <div className="grid mb-6">
      <button
        onClick={() => {
          if (!isAddingAssertion) {
            dispatch(setIsAddingAssertion(true));
          }
        }}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {isAddingAssertion
          ? "Click on the element to assert"
          : "+ Add assertion"}
      </button>
    </div>
  );
};

export default AddAssertion;
