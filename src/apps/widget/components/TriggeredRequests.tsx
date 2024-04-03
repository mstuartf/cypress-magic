import { useSelector } from "react-redux";
import {
  selectEvent,
  selectEventsSorted,
  selectIsRunningEventId,
} from "../redux/selectors";
import React from "react";
import { isRequestEvent } from "../utils";
import { RequestEvent } from "../../../plugin/types";
import TriggeredRequest from "./TriggeredRequest";

const TriggeredRequests = ({ id }: { id: string }) => {
  const event = useSelector(selectEvent(id));
  const isRunningEventId = useSelector(selectIsRunningEventId);
  const events = useSelector(selectEventsSorted);
  const triggeredRequests = events
    .filter((e): e is RequestEvent => isRequestEvent(e))
    .filter((e) => e.triggerId === event.id);

  if (!triggeredRequests.length || isRunningEventId === event.id) {
    return null;
  }

  return (
    <>
      {triggeredRequests.map((e) => (
        <TriggeredRequest event={e} key={event.id} />
      ))}
    </>
  );
};

export default TriggeredRequests;
