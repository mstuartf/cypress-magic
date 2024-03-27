import { ReactComponent as Refresh } from "../../../zondicons/refresh.svg";
import { ReactComponent as Trash } from "../../../zondicons/trash.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  selectEvent,
  selectEventIdsSorted,
  selectIsRunning,
  selectIsRunningStep,
  selectRunError,
} from "../redux/selectors";
import { deleteEvent, updateEvent } from "../redux/slice";
import { isUserEvent } from "../utils";
import { parseSelectorPositionOnly } from "../parser/parseSelector";
import { getTargetProps } from "../../../plugin/observers/user";
import { isHTMLElement } from "../hooks/useNewFixedElementAdded";
import React from "react";
import EventSteps from "./EventSteps";
import AssertionError from "./AssertionError";

const Event = ({ id }: { id: string }) => {
  const dispatch = useDispatch();
  const event = useSelector(selectEvent(id));
  const runError = useSelector(selectRunError);
  const updateEventTarget = () => {
    if (isUserEvent(event)) {
      const targetEl = document.querySelector(
        parseSelectorPositionOnly(event.target.domPath)
      );
      if (targetEl && isHTMLElement(targetEl)) {
        dispatch(
          updateEvent({
            ...event,
            ...getTargetProps(targetEl),
          })
        );
      }
    }
  };
  const step = useSelector(selectIsRunningStep);
  const eventIds = useSelector(selectEventIdsSorted);
  const isRunning = useSelector(selectIsRunning);
  const highlight = isRunning && id === eventIds[step];
  return (
    <div
      key={event.timestamp}
      className="cyw-text-wrap cyw-break-all cyw-flex cyw-group"
    >
      <div
        className={`cyw-text-xs cyw-flex-grow ${highlight && "cyw-font-bold"}`}
      >
        <EventSteps event={event} />
        {runError && runError.event.id === event.id && (
          <AssertionError message={runError.message} />
        )}
      </div>
      {/*{isUserEvent(event) && (*/}
      {/*  <div className="cyw-invisible group-hover:cyw-visible cyw-flex cyw-items-center cyw-transition-all cyw-ml-1">*/}
      {/*    <button onClick={updateEventTarget} className="cyw-h-4 cyw-w-4">*/}
      {/*      <Refresh />*/}
      {/*    </button>*/}
      {/*  </div>*/}
      {/*)}*/}
      {/*<div className="cyw-invisible group-hover:cyw-visible cyw-flex cyw-items-center cyw-transition-all cyw-ml-1">*/}
      {/*  <button*/}
      {/*    className="cyw-h-4 cyw-w-4"*/}
      {/*    onClick={() => dispatch(deleteEvent(id))}*/}
      {/*  >*/}
      {/*    <Trash />*/}
      {/*  </button>*/}
      {/*</div>*/}
    </div>
  );
};

export default Event;
