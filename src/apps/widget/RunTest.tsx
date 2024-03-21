import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsRunning } from "./redux/selectors";
import { setIsRunning } from "./redux/slice";
import TestRunner from "./TestRunner";

const RunTest = () => {
  const dispatch = useDispatch();
  const isRunning = useSelector(selectIsRunning);
  return (
    <>
      <button
        onClick={() => dispatch(setIsRunning(!isRunning))}
        className="cyw-text-xs cyw-bg-blue-500 hover:cyw-bg-blue-700 cyw-text-white cyw-font-bold cyw-py-2 cyw-px-2 cyw-rounded"
      >
        {!isRunning ? "Run test" : "Cancel running"}
      </button>
      {isRunning && <TestRunner />}
    </>
  );
};

export default RunTest;
