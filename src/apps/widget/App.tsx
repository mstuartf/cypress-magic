import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectEvents } from "./redux/selectors";
import { ParsedEvent, UserEvent } from "../../plugin/types";
import { removeEvent, saveEvent } from "./redux/slice";
import initialize from "../../plugin/initialize";
import { toast, ToastContainer, ToastTransition } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CloseButtonProps } from "react-toastify/dist/components";
import { widgetId } from "../../widget";
import { useWindowSize } from "./hooks/useWindowSize";
import { useMutateObserver } from "@rc-component/mutate-observer";
import { useNewToast } from "./hooks/useNewToast";

const getEventId = (event: ParsedEvent) => `${event.type}-${event.timestamp}`;

const sideBarWith = 384;

const getFixedElements = (): HTMLElement[] =>
  Array.prototype.slice
    .call(document.body.getElementsByTagName("*"))
    .filter(
      (elem) =>
        window.getComputedStyle(elem, null).getPropertyValue("position") ==
        "fixed"
    )
    .filter((elem) => !document.getElementById(widgetId)!.contains(elem));

const getFixedWidthElements = (innerWidth: number): [HTMLElement, number][] =>
  getFixedElements()
    .filter((elem) => {
      const elementWidth = window
        .getComputedStyle(elem, null)
        .getPropertyValue("width");
      return !elementWidth || elementWidth === `${innerWidth}px`;
    })
    .map((elem) => {
      const elementWidth = window
        .getComputedStyle(elem, null)
        .getPropertyValue("width");
      return [
        elem,
        elementWidth ? parseInt(elementWidth.replace("px", "")) : innerWidth,
      ];
    });

const getFixedRightElements = (): [HTMLElement, number][] =>
  getFixedElements()
    .filter((elem) => {
      const elementRight = window
        .getComputedStyle(elem, null)
        .getPropertyValue("right");
      return elementRight === "0px";
    })
    .map((elem) => [elem, 0]);

function App() {
  const dispatch = useDispatch();

  const events = useSelector(selectEvents);
  const [localEvents, setLocalEvents] = useState<ParsedEvent[]>([]);

  const [fixedWidthElements, setFixedWidthElements] = useState<
    [HTMLElement, number][] | null
  >(null);
  const [lastInnerWidth, setLastInnerWidth] = useState<number | null>(null);

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

  const [innerWidth] = useWindowSize();
  useEffect(() => {
    if (!innerWidth) return;
    const widthElementsToUpdate =
      fixedWidthElements !== null
        ? fixedWidthElements
        : getFixedWidthElements(innerWidth);
    const widthChange =
      lastInnerWidth !== null ? innerWidth - lastInnerWidth : sideBarWith * -1;

    // body and fixed width elements need to be resized everytime viewport changes
    const updatedWidthElements = widthElementsToUpdate.map(
      ([elem, oldWidth]) => {
        const newWidth = oldWidth + widthChange;
        console.log("width", elem, oldWidth, newWidth);
        elem.style.width = `${newWidth}px`;
        // todo: what if elem no longer exists?
        return [elem, newWidth] as [HTMLElement, number];
      }
    );
    const body = document.getElementsByTagName("body")[0];
    body.style.width = `${innerWidth - sideBarWith}px`;

    // fixed right elements only need to be moved once
    // todo: what about when new fixed right elements are added
    if (!lastInnerWidth) {
      getFixedRightElements().forEach(([elem, oldRight]) => {
        elem.style.right = `${sideBarWith}px`;
      });
    }

    setFixedWidthElements(updatedWidthElements);
    setLastInnerWidth(innerWidth);
  }, [innerWidth]);

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
      className="fixed top-0 right-0 bottom-0 border-2 border-red-500 bg-white"
      style={{ width: `${sideBarWith}px` }}
    >
      <ToastContainer
        containerId="my-toaster"
        position="top-right"
        autoClose={false}
        closeOnClick={false}
      />
    </div>
  );
}

export default App;
