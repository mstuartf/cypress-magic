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
import Bordered from "./Bordered";

const EventList = () => {
  const eventIds = useSelector(selectEventIdsSorted);
  const testDescribe = useSelector(selectTestDescribe)!;
  const testShould = useSelector(selectTestShould)!;
  const ref = useScrollDownOnSizeIncrease();
  const runError = useSelector(selectRunError);
  const isRunning = useSelector(selectIsRunning);

  return (
    <div
      ref={ref}
      className={`cyw-flex-grow cyw-overflow-scroll cyw-bg-gray-900`}
    >
      <Bordered className="cyw-text-sm cyw-text-white cyw-pl-4 cyw-pb-2 cyw-pt-1">
        {testDescribe}
      </Bordered>
      <Bordered className="cyw-text-xs cyw-font-light cyw-pl-8 cyw-pb-2 cyw-flex cyw-items-center">
        {isRunning ? <Spin /> : runError ? <Cross /> : <Tick />}
        <span className="cyw-ml-2">{testShould}</span>
      </Bordered>
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
