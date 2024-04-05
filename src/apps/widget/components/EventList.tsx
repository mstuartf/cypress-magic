import { useDispatch, useSelector } from "react-redux";
import {
  selectEventIdsSorted,
  selectIsAddingCommands,
  selectIsRunning,
  selectRunError,
  selectTestDescribe,
  selectTestShould,
} from "../redux/selectors";
import React, { useEffect, useRef, useState } from "react";
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

const EventList = () => {
  const dispatch = useDispatch();
  const eventIds = useSelector(selectEventIdsSorted);
  const testDescribe = useSelector(selectTestDescribe)!;
  const testShould = useSelector(selectTestShould)!;
  const ref = useScrollDownOnSizeIncrease();
  const runError = useSelector(selectRunError);
  const isRunning = useSelector(selectIsRunning);
  const isAddingCommands = useSelector(selectIsAddingCommands);

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
        {!isAddingCommands && !isRunning && (
          <div className="cyw-flex cyw-items-center cyw-gap-2">
            <RunTest />
            <button
              onClick={() => {
                dispatch(setIsAddingCommands(true));
                dispatch(setIsRunning(true));
              }}
            >
              <Wand />
            </button>
          </div>
        )}
      </Bordered>
      {eventIds.map((id) => (
        <Event id={id} key={id} />
      ))}
      {!isRunning && isAddingCommands && (
        <Bordered className="cyw-flex cyw-items-center cyw-justify-between cyw-pl-4 cyw-py-2">
          <button
            className="cyw-text-white cyw-text-xs cyw-font-light hover:cyw-underline"
            onClick={() => {
              dispatch(removeAddedCommands());
              dispatch(setIsAddingCommands(false));
              dispatch(setIsRunning(true));
            }}
          >
            Cancel
          </button>
          {!runError && (
            <div className="cyw-flex cyw-items-center cyw-gap-2">
              <AddAssertion />
              <button
                className="cyw-bg-indigo-600 hover:cyw-bg-indigo-500 cyw-text-white cyw-text-xs cyw-px-4 cyw-py-2 cyw-rounded"
                onClick={() => {
                  dispatch(setIsAddingCommands(false));
                  dispatch(setIsRunning(true));
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

export const useScrollDownOnSizeIncrease = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollHeight, setScrollHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const observer = new MutationObserver(() => {
        const newScrollHeight = ref.current?.scrollHeight || 0;
        if (!!ref.current && newScrollHeight > scrollHeight) {
          ref.current.scrollTop = ref.current.scrollHeight;
        }
        setScrollHeight(ref.current?.scrollHeight || 0);
      });
      observer.observe(ref.current, {
        characterData: true,
        childList: true,
        subtree: true,
        attributes: true,
      });
    }
  }, [ref]);

  return ref;
};
