import * as redux from "redux";
import { saveEvent, setBaseUrl, setRecordingInProgress } from "./slice";
import { setCache } from "../cache";
import {
  isClickEvent,
  isNavigationEvent,
  isRequestEvent,
  isRequestOrResponseEvent,
  isUserEvent,
} from "../utils";
import { widgetId } from "../constants";
import { assertionOverlayId } from "../AddAssertion";
import {
  AssertionEvent,
  ClickEvent,
  EventType,
  NavigationEvent,
  ParsedEvent,
  RequestEvent,
} from "../../../plugin/types";
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

export const throttlerMiddleware: redux.Middleware =
  (store) => (next) => (action) => {
    if (action.type !== saveEvent.type) {
      next(action);
      return;
    }
    let event = action.payload;
    if (isRequestEvent(event)) {
      const events = [...(store.getState().root.events as ParsedEvent[])];
      const lastUserEvent = events.reverse().find((e) => isUserEvent(e))!;
      const newEvent: RequestEvent = {
        ...event,
        timestamp: lastUserEvent.timestamp - 1,
      };
      action.payload = newEvent;
    }
    next(action);
  };

export const navMiddleware: redux.Middleware =
  (store) => (next) => (action) => {
    if (action.type !== saveEvent.type) {
      next(action);
      return;
    }
    let event = action.payload;
    if (isNavigationEvent(event)) {
      const events = [...(store.getState().root.events as ParsedEvent[])];
      const isFirstNavigationEvent = !events.find((e) => isNavigationEvent(e));
      if (!isFirstNavigationEvent) {
        const newEvent: NavigationEvent = {
          ...event,
          type: "urlChange",
          timestamp: event.timestamp + 1, // move after trigger
        };
        action.payload = newEvent;
      }
    }
    next(action);
  };

export const widgetClickMiddleware: redux.Middleware =
  (store) => (next) => (action) => {
    if (action.type !== saveEvent.type) {
      next(action);
      return;
    }
    let event = action.payload;
    if (
      isUserEvent(event) &&
      event.target.domPath.find(({ id }) => id === widgetId)
    ) {
      return;
    }
    next(action);
  };

export const urlMatcherMiddleware: redux.Middleware =
  (store) => (next) => (action) => {
    if (action.type !== saveEvent.type) {
      next(action);
      return;
    }
    let event = action.payload;
    if (
      isRequestOrResponseEvent(event) &&
      store.getState().root.baseUrl &&
      !event.url.startsWith(store.getState().root.baseUrl)
    ) {
      return;
    }
    next(action);
  };

export const filterClicksMiddleware: redux.Middleware =
  (store) => (next) => (action) => {
    if (action.type !== saveEvent.type) {
      next(action);
      return;
    }
    let event = action.payload;
    if (isClickEvent(event)) {
      if (event.target.tag === "SELECT") {
        // this should be handled by the change handler
        return;
      }

      if (event.target.isHidden) {
        // this click was triggered programmatically
        return;
      }

      if (event.target.tag === "INPUT" && event.target.type === "radio") {
        // this should be handled by the change handler
        return;
      }
    }
    next(action);
  };
