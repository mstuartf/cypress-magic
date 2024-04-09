import React from "react";
import { useDispatch } from "react-redux";
import { setIsRunning } from "../redux/slice";
import { Tooltip } from "react-tooltip";
import Refresh from "../../shared/Refresh";

const RunTest = () => {
  const dispatch = useDispatch();
  return (
    <>
      <button
        data-tooltip-id="run-test-tooltip"
        data-tooltip-content="Run test"
        onClick={() => dispatch(setIsRunning(true))}
      >
        <Refresh />
      </button>
      <Tooltip id="run-test-tooltip" className="cyw-text-xs" />
    </>
  );
};

export default RunTest;
