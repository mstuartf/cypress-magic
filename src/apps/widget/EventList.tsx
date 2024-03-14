import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectEvents } from "./redux/selectors";
import { ParsedEvent } from "../../plugin/types";
import { removeEvent } from "./redux/slice";
import { toast, ToastContainer } from "react-toastify";
import { useNewToast } from "./hooks/useNewToast";
import { toastHeight, toastMarginBottom } from "./constants";

const getEventId = (event: ParsedEvent) => `${event.type}-${event.timestamp}`;

function EventList() {
  const events = useSelector(selectEvents);
  const [localEvents, setLocalEvents] = useState<ParsedEvent[]>([]);

  useNewToast();

  const showToast = (event: ParsedEvent) => {
    toast(<ToastContents event={event} />, {
      toastId: getEventId(event),
      closeButton: () => <CloseToastButton event={event} />,
    });
  };

  useEffect(() => {
    if (events.length > localEvents.length) {
      for (let i = 0; i < events.length - localEvents.length; i++) {
        showToast(events[localEvents.length + i]);
      }
    } else if (events.length < localEvents.length) {
      const removed = localEvents.find(
        (e) => !events.find((p) => getEventId(e) === getEventId(p))
      );
      toast.dismiss(getEventId(removed!));
    }
    setLocalEvents(events);
  }, [events]);

  return (
    <>
      <div className="h-96 border">
        <ToastContainer
          containerId="my-toaster"
          position="top-right"
          autoClose={false}
          closeOnClick={false}
        />
      </div>
      <div className="pt-24">
        <ScrollBtn direction="up" />
        <ScrollBtn direction="down" />
      </div>
    </>
  );
}

const ScrollBtn = ({ direction }: { direction: "up" | "down" }) => (
  <button
    onClick={() => {
      const toastContainer = document.getElementById("my-toaster")!;
      if (toastContainer.children.length) {
        toastContainer.children[0].scrollBy(
          0,
          (toastHeight + toastMarginBottom) * (direction === "down" ? 1 : -1)
        );
      }
    }}
  >
    {direction}
  </button>
);

const ToastContents = ({ event }: { event: ParsedEvent }) => (
  <>
    <div>
      {event.type} {event.timestamp}
    </div>
  </>
);

const CloseToastButton = ({ event }: { event: ParsedEvent }) => {
  const dispatch = useDispatch();
  return (
    <button
      className="Toastify__close-button Toastify__close-button--light"
      type="button"
      aria-label="close"
      onClick={() => {
        dispatch(removeEvent(event));
      }}
    >
      <svg aria-hidden="true" viewBox="0 0 14 16">
        <path
          fillRule="evenodd"
          d="M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z"
        ></path>
      </svg>
    </button>
  );
};

export default EventList;
