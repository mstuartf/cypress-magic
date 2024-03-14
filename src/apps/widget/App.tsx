import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectEvents } from "./redux/selectors";
import { ParsedEvent, UserEvent } from "../../plugin/types";
import { removeEvent, saveEvent } from "./redux/slice";
import initialize from "../../plugin/initialize";
import { toast, ToastContainer, ToastTransition } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CloseButtonProps } from "react-toastify/dist/components";
import { widgetId } from "../../widget";

const getEventId = (event: ParsedEvent) => `${event.type}-${event.timestamp}`;

const sideBarWith = 384;
const squashAppUnderTest = () => {
  const body = document.getElementsByTagName("body")[0];
  body.style.width = `${window.innerWidth - sideBarWith}px`;
  const widget = document.getElementById(widgetId)!;

  const fixedElements = Array.prototype.slice
    .call(document.body.getElementsByTagName("*"))
    .filter(
      (elem) =>
        window.getComputedStyle(elem, null).getPropertyValue("position") ==
        "fixed"
    )
    .filter((elem) => !widget.contains(elem));

  // Reduce width of fixed elements with no width explicitly set or whose width is the full viewport
  fixedElements
    .filter((elem) => {
      const elementWidth = window
        .getComputedStyle(elem, null)
        .getPropertyValue("width");
      return !elementWidth || elementWidth === `${window.innerWidth}px`;
    })
    .forEach(
      (elem) => (elem.style.width = `${window.innerWidth - sideBarWith}px`)
    );

  // Find all fixed elements pinned to the right of the screen and adjust their offset
  fixedElements
    .filter((elem) => {
      const elementRight = window
        .getComputedStyle(elem, null)
        .getPropertyValue("right");
      return elementRight === "0px";
    })
    .forEach((elem) => (elem.style.right = `${sideBarWith}px`));
};

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
    console.log("dispatching", event);
    dispatch(saveEvent(event));
  };

  useEffect(() => {
    squashAppUnderTest();
    initialize({
      saveEvent: saveEventCallback,
      saveFixture: () => {},
      buildAlias: () => "abc123",
      registerOnCloseCallback: () => {},
    });
  }, []);

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
    console.log("events", events);
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
    <div
      className="fixed top-0 right-0 bottom-0 border-2 border-red-500"
      style={{ width: `${sideBarWith}px` }}
    >
      <ToastContainer
        position="top-right"
        autoClose={false}
        closeOnClick={false}
      />
    </div>
  );
}

export default App;
