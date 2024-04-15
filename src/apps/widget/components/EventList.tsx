import { useDispatch, useSelector } from "react-redux";
import {
  selectCanCancelAddingCommands,
  selectEventIdsSorted,
  selectIsAddingCommands,
  selectIsRunning,
  selectRunError,
  selectTestDescribe,
  selectTestShould,
} from "../redux/selectors";
import React from "react";
import Event from "./Event";
import Spin from "./Spin";
import Tick from "./Tick";
import Cross from "./Cross";
import Bordered from "./Bordered";
import Wand from "./Wand";
import {
  removeAddedCommands,
  setIsAddingCommands,
  setIsRunning,
} from "../redux/slice";
import RunTest from "./RunTest";
import AddAssertion from "./AddAssertion";
import AddCommand from "./AddCommand";
import { useAutoScroll } from "../hooks/useAutoScroll";

const EventList = () => {
  const dispatch = useDispatch();
  const eventIds = useSelector(selectEventIdsSorted);
  const testDescribe = useSelector(selectTestDescribe)!;
  const testShould = useSelector(selectTestShould)!;
  const ref = useAutoScroll();
  const runError = useSelector(selectRunError);
  const isRunning = useSelector(selectIsRunning);
  const isAddingCommands = useSelector(selectIsAddingCommands);
  const canCancelAddingCommands = useSelector(selectCanCancelAddingCommands);

  return (
    <div ref={ref} className={`cyw-flex-grow cyw-overflow-scroll`}>
      <Bordered className="cyw-text-sm cyw-text-white cyw-pl-4 cyw-pb-2 cyw-pt-1">
        {testDescribe}
      </Bordered>
      <Bordered className="cyw-text-xs cyw-font-light cyw-pl-8 cyw-pb-2 cyw-flex cyw-items-center cyw-justify-between">
        <div className="cyw-flex cyw-items-center">
          {isRunning ? (
            <Spin />
          ) : runError ? (
            <Cross />
          ) : isAddingCommands ? (
            <Wand />
          ) : (
            <Tick />
          )}
          <span className="cyw-ml-2">{testShould}</span>
        </div>
        {!isAddingCommands && !isRunning && RUNNER_ENABLED && (
          <div className="cyw-flex cyw-items-center cyw-gap-2">
            <RunTest />
            <AddCommand />
          </div>
        )}
      </Bordered>
      {eventIds.map((id) => (
        <Event id={id} key={id} />
      ))}
      {!isRunning && isAddingCommands && (
        <Bordered className="cyw-flex cyw-items-center cyw-justify-between cyw-pl-4 cyw-py-2">
          <div>
            {canCancelAddingCommands && (
              <button
                className="cyw-text-white cyw-text-xs cyw-font-light hover:cyw-underline focus:cyw-outline-none"
                onClick={() => {
                  dispatch(removeAddedCommands());
                  dispatch(setIsAddingCommands(false));
                  dispatch(setIsRunning(true));
                }}
              >
                Cancel
              </button>
            )}
          </div>
          {!runError && (
            <div className="cyw-flex cyw-items-center cyw-gap-2">
              <AddAssertion />
              <button
                className="cyw-bg-indigo-600 hover:cyw-bg-indigo-500 cyw-text-white cyw-text-xs cyw-px-4 cyw-py-2 cyw-rounded"
                onClick={() => {
                  dispatch(setIsAddingCommands(false));
                  if (RUNNER_ENABLED) {
                    dispatch(setIsRunning(true));
                  }
                }}
              >
                Save commands
              </button>
            </div>
          )}
        </Bordered>
      )}
    </div>
  );
};

export default EventList;

const RUNNER_ENABLED = false;
