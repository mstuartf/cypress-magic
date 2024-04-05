import { useSelector } from "react-redux";
import {
  selectEventIdsSorted,
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

const EventList = () => {
  const eventIds = useSelector(selectEventIdsSorted);
  const testDescribe = useSelector(selectTestDescribe)!;
  const testShould = useSelector(selectTestShould)!;
  const ref = useScrollDownOnSizeIncrease();
  const runError = useSelector(selectRunError);
  const isRunning = useSelector(selectIsRunning);

  let borderClass: string;
  if (isRunning) {
    borderClass = "cyw-border-gray-900";
  } else if (runError) {
    borderClass = "cyw-border-red-300";
  } else if (false) {
    borderClass = "cyw-border-purple-500";
  } else {
    borderClass = "cyw-border-emerald-500";
  }

  return (
    <div
      ref={ref}
      className={`cyw-flex-grow cyw-overflow-scroll cyw-bg-gray-900 cyw-border-l-4 ${borderClass}`}
    >
      <div className="cyw-text-sm cyw-text-white cyw-ml-4 cyw-mb-2 cyw-mt-1">
        {testDescribe}
      </div>
      <div className="cyw-text-xs cyw-font-light cyw-ml-8 cyw-mb-2 cyw-flex cyw-items-center">
        {isRunning ? <Spin /> : runError ? <Cross /> : <Tick />}
        <span className="cyw-ml-2">{testShould}</span>
      </div>
      {eventIds.map((id) => (
        <Event id={id} key={id} />
      ))}
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
