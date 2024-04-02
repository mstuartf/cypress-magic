import { ReactComponent as Trash } from "../../../zondicons/trash.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  selectEvent,
  selectEventIdsSorted,
  selectEventsSorted,
  selectIsRunning,
  selectIsRunningEventId,
  selectIsRunningStep,
  selectRunError,
} from "../redux/selectors";
import { deleteEvent } from "../redux/slice";
import React from "react";
import EventSteps from "./EventSteps";
import AssertionError from "./AssertionError";
import { isRequestEvent } from "../utils";
import { RequestEvent } from "../../../plugin/types";
import Alias from "./Alias";
import TriggeredRequest from "./TriggeredRequest";

const Event = ({ id }: { id: string }) => {
  const dispatch = useDispatch();
  const event = useSelector(selectEvent(id));
  const runError = useSelector(selectRunError);
  const isRunning = useSelector(selectIsRunning);
  const step = useSelector(selectIsRunningStep);
  const isRunningEventId = useSelector(selectIsRunningEventId);
  const inProgressOrCompleteEventIds = useSelector(selectEventIdsSorted).slice(
    0,
    step + 1
  );
  const events = useSelector(selectEventsSorted);
  const triggeredRequests = events
    .filter((e): e is RequestEvent => isRequestEvent(e))
    .filter((e) => e.triggerId === event.id);
  return (
    <div
      key={event.timestamp}
      className="cyw-text-wrap cyw-break-all cyw-flex cyw-group cyw-relative"
    >
      <div className="cyw-text-xs cyw-flex-grow">
        {((!isRunning && !runError) ||
          inProgressOrCompleteEventIds.includes(event.id)) && (
          <>
            <EventSteps event={event} />
            {runError && runError.event.id === event.id && (
              <AssertionError message={runError.message} />
            )}
            {!!triggeredRequests.length && isRunningEventId !== event.id && (
              <>
                {triggeredRequests.map((e) => (
                  <TriggeredRequest event={e} key={event.id} />
                ))}
              </>
            )}
          </>
        )}
      </div>
      <div className="cyw-invisible group-hover:cyw-visible cyw-flex cyw-items-center cyw-transition-all cyw-absolute cyw-left-0 cyw-p-2">
        <button
          className="cyw-h-4 cyw-w-4 cyw-text-white"
          onClick={() => dispatch(deleteEvent(id))}
        >
          <Trash fill="#94a3b8" width={12} />
        </button>
      </div>
    </div>
  );
};

export default Event;
