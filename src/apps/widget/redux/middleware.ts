import { saveEvent } from "./slice";
import { setCache } from "../cache";
import {
  isClickEvent,
  isNavigationEvent,
  isRefreshPageEvent,
  isRequestEvent,
  isRequestOrResponseEvent,
  isRequestTriggerEvent,
  isUrlChangeEvent,
  isUserEvent,
} from "../utils";
import { widgetId } from "../constants";
import { assertionOverlayId } from "../AddAssertion";
import {
  AssertionEvent,
  NavigationEvent,
  PageRefreshEvent,
  ParsedEvent,
  RequestEvent,
  UrlChangeEvent,
} from "../../../plugin/types";
import { getTargetProps } from "../../../plugin/observers/user";
import { WidgetMiddleware } from "./store";

export const cacheMiddleware: WidgetMiddleware =
  (store) => (next) => (action) => {
    next(action);
    setCache(store.getState());
  };

export const assertionMiddleware: WidgetMiddleware =
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

export const throttlerMiddleware: WidgetMiddleware =
  (store) => (next) => (action) => {
    if (action.type !== saveEvent.type) {
      next(action);
      return;
    }
    let event = action.payload;
    if (isRequestEvent(event)) {
      const events = [...(store.getState().recording.events as ParsedEvent[])];
      const trigger = events.reverse().find((e) => isRequestTriggerEvent(e))!;
      const newEvent: RequestEvent = {
        ...event,
        timestamp: trigger.timestamp - 1,
      };
      action.payload = newEvent;
    }
    next(action);
  };

export const navMiddleware: WidgetMiddleware =
  (store) => (next) => (action) => {
    if (action.type !== saveEvent.type) {
      next(action);
      return;
    }
    let event = action.payload;
    if (isNavigationEvent(event)) {
      const events = [...(store.getState().recording.events as ParsedEvent[])];
      const previousNavigationEvents = events.filter(
        (e): e is NavigationEvent | UrlChangeEvent =>
          isNavigationEvent(e) || isUrlChangeEvent(e)
      );
      if (previousNavigationEvents.length) {
        const lastEvent = previousNavigationEvents.reverse()[0];
        action.payload = {
          ...event,
          type: isRefreshPageEvent(event, lastEvent) ? "refresh" : "urlChange",
          timestamp: event.timestamp + 1, // move after trigger
        } as UrlChangeEvent | PageRefreshEvent;
      }
    }
    next(action);
  };

export const widgetClickMiddleware: WidgetMiddleware =
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

export const urlMatcherMiddleware: WidgetMiddleware =
  (store) => (next) => (action) => {
    if (action.type !== saveEvent.type) {
      next(action);
      return;
    }
    let event = action.payload;
    if (isRequestOrResponseEvent(event)) {
      const baseUrl = store.getState().recording.baseUrl;
      if (baseUrl && !event.url.startsWith(baseUrl)) {
        return;
      }
    }
    next(action);
  };

export const filterClicksMiddleware: WidgetMiddleware =
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
