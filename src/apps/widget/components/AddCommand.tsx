import { setIsAddingCommands, setIsRunning } from "../redux/slice";
import Wand from "./Wand";
import React from "react";
import { useDispatch } from "react-redux";
import { Tooltip } from "react-tooltip";

const AddCommand = () => {
  const dispatch = useDispatch();
  return (
    <>
      <button
        data-tooltip-id="add-command-tooltip"
        data-tooltip-content="Add commands to test"
        onClick={() => {
          dispatch(setIsAddingCommands(true));
          dispatch(setIsRunning(true));
        }}
      >
        <Wand />
      </button>
      <Tooltip id="add-command-tooltip" className="cyw-text-xs" />
    </>
  );
};

export default AddCommand;
