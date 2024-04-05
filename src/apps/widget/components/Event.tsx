import { ReactComponent as Trash } from "../../../zondicons/trash.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  selectEvent,
  selectEventIdsSorted,
  selectIsRunning,
  selectIsRunningEventId,
  selectRunError,
} from "../redux/selectors";
import { deleteEvent } from "../redux/slice";
import React from "react";
import EventSteps from "./EventSteps";
import AssertionError from "./AssertionError";
import TriggeredRequests from "./TriggeredRequests";
import Bordered from "./Bordered";

const Event = ({ id }: { id: string }) => {
  const dispatch = useDispatch();
  const event = useSelector(selectEvent(id));
  const runError = useSelector(selectRunError);
  const isRunning = useSelector(selectIsRunning);
  const isRunningEventId = useSelector(selectIsRunningEventId);
  const eventIds = useSelector(selectEventIdsSorted);
  const inProgressOrCompleteEventIds = eventIds.slice(
    0,
    isRunningEventId ? eventIds.indexOf(isRunningEventId) + 1 : 0
  );

  if (
    (isRunning || runError) &&
    !inProgressOrCompleteEventIds.includes(event.id)
  ) {
    return null;
  }

  return (
    <Bordered
      key={event.timestamp}
      className="cyw-text-wrap cyw-break-all cyw-flex cyw-group cyw-relative"
    >
      <div className="cyw-text-xs cyw-flex-grow">
        <EventSteps event={event} />
        {runError && isRunningEventId === event.id && (
          <AssertionError message={runError.message} />
        )}
        <TriggeredRequests id={event.id} />
      </div>
      <div className="cyw-invisible group-hover:cyw-visible cyw-flex cyw-items-center cyw-transition-all cyw-absolute cyw-left-0 cyw-p-2">
        <button
          className="cyw-h-4 cyw-w-4 cyw-text-white"
          onClick={() => dispatch(deleteEvent(id))}
        >
          <Trash fill="#94a3b8" width={12} />
        </button>
      </div>
    </Bordered>
  );
};

export default Event;
