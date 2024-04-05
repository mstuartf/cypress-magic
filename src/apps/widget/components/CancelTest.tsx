import Cross from "./Cross";
import React from "react";
import { useDispatch } from "react-redux";
import { cancelTest } from "../redux/slice";
import { Tooltip } from "react-tooltip";

const CancelTest = () => {
  const dispatch = useDispatch();
  const onCancel = () => dispatch(cancelTest());
  return (
    <>
      <button
        data-tooltip-id="cancel-test-tooltip"
        data-tooltip-content="Discard test"
        onClick={onCancel}
        className="focus:cyw-outline-none"
      >
        <Cross />
      </button>
      <Tooltip id="cancel-test-tooltip" className="cyw-text-xs" />
    </>
  );
};

export default CancelTest;
