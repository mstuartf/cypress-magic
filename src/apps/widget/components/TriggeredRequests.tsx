import { useSelector } from "react-redux";
import {
  selectEvent,
  selectEventsSorted,
  selectIsRunningEventId,
} from "../redux/selectors";
import React, { useState } from "react";
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
  const [isOpen, setIsOpen] = useState(false);

  if (!triggeredRequests.length || isRunningEventId === event.id) {
    return null;
  }

  return (
    <div className="">
      <button
        className="cyw-ml-8 cyw-uppercase cyw-flex cyw-items-center cyw-mb-2 cyw-text-xs cyw-font-light"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          width="8"
          height="8"
          viewBox="0 0 8 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="collapsible-indicator"
          style={{ transform: `rotate(${isOpen ? 0 : -90}deg)` }}
        >
          <path
            d="M1 2.5L4 5.5L7 2.5"
            stroke="#434861"
            className="icon-dark"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
        <span className="cyw-ml-2">Requests ({triggeredRequests.length})</span>
      </button>
      {isOpen &&
        triggeredRequests.map((e) => (
          <TriggeredRequest event={e} key={event.id} />
        ))}
    </div>
  );
};

export default TriggeredRequests;
