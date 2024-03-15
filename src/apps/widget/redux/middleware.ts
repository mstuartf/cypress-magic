import * as redux from "redux";
import { saveEvent, setBaseUrl, setRecordingInProgress } from "./slice";
import { setCache } from "../cache";
import { isClickEvent, isRequestOrResponseEvent, isUserEvent } from "../utils";
import { widgetId } from "../constants";
import { assertionOverlayId } from "../AddAssertion";
import { AssertionEvent, ClickEvent } from "../../../plugin/types";
import { getTargetProps } from "../../../plugin/observers/user";

export const cacheMiddleware: redux.Middleware =
  (store) => (next) => (action) => {
    if (action.type == setRecordingInProgress.type) {
      setCache("recordingInProgress", action.payload);
    }
    if (action.type == setBaseUrl.type) {
      setCache("baseUrl", action.payload);
    }
    next(action);
  };

export const assertionMiddleware: redux.Middleware =
  (store) => (next) => (action) => {
    if (action.type !== saveEvent.type) {
      next(action);
      return;
    }
    let event = action.payload;
    if (
      isClickEvent(event) &&
      event.target.domPath.length &&
      event.target.domPath[event.target.domPath.length - 1].id ===
        assertionOverlayId
    ) {
      const elementUnderneath = document.elementsFromPoint(
        event.clientX,
        event.clientY
      )[1] as HTMLElement;

      const newEvent: AssertionEvent = {
        type: "assertion",
        timestamp: Date.now(),
        ...getTargetProps(elementUnderneath),
        clientX: event.clientX,
        clientY: event.clientY,
        href: (elementUnderneath as HTMLAnchorElement).href,
      };
      action.payload = newEvent;
    }
    next(action);
  };
