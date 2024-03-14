import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectEvents } from "./redux/selectors";
import { ParsedEvent, UserEvent } from "../../plugin/types";
import { removeEvent, saveEvent } from "./redux/slice";
import initialize from "../../plugin/initialize";
import { toast, ToastContainer, ToastTransition } from "react-toastify";
import { CloseButtonProps } from "react-toastify/dist/components";
import { useNewToast } from "./hooks/useNewToast";
import { sideBarWith } from "./constants";
import Resizer from "./Resizer";

const getEventId = (event: ParsedEvent) => `${event.type}-${event.timestamp}`;

function App() {
  const dispatch = useDispatch();

  const events = useSelector(selectEvents);
  const [localEvents, setLocalEvents] = useState<ParsedEvent[]>([]);

  const saveEventCallback = (event: ParsedEvent) => {
    if ((event as UserEvent).target?.domPath) {
      const inWidget = (event as UserEvent).target?.domPath.find(
        ({ id }) => id === "__widget__"
      );
      if (inWidget) {
        return;
      }
    }
    dispatch(saveEvent(event));
  };

  useEffect(() => {
    initialize({
      saveEvent: saveEventCallback,
      saveFixture: () => {},
      buildAlias: () => "abc123",
      registerOnCloseCallback: () => {},
    });
  }, []);

  useNewToast();

  const showToast = (
    event: ParsedEvent,
    transition: ToastTransition | undefined = undefined
  ) => {
    toast(
      <>
        <div>
          {event.type} {event.timestamp}
        </div>
      </>,
      {
        transition: transition,
        toastId:
          transition === undefined
            ? getEventId(event)
            : `${getEventId(event)}-2`,
        closeButton: ({ closeToast }: CloseButtonProps) => (
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
        ),
      }
    );
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
    <Resizer>
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
    </Resizer>
  );
}

const ScrollBtn = ({ direction }: { direction: "up" | "down" }) => (
  <button
    onClick={() => {
      const toastContainer = document.getElementById("my-toaster")!;
      if (toastContainer.children.length) {
        toastContainer.children[0].scrollBy(0, direction === "down" ? 80 : -80);
      }
    }}
  >
    {direction}
  </button>
);

export default App;
