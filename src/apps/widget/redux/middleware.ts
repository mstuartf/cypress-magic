import { saveEvent } from "./slice";
import { setCache } from "../cache";
import {
  isClickEvent,
  isNavigationEvent,
  isRequestEvent,
  isRequestOrResponseEvent,
  isRequestTriggerEvent,
  isUserEvent,
} from "../utils";
import { widgetId } from "../constants";
import {
  assertionOverlayId,
  getAssertedElement,
} from "../components/AddAssertion";
import {
  AssertionEvent,
  NavigationEvent,
  RequestEvent,
} from "../../../plugin/types";
import { getTargetProps } from "../../../plugin/observers/user";
import { WidgetMiddleware } from "./store";
import { selectEventsSorted } from "./selectors";

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
      return;
      // const elementUnderneath = getAssertedElement(
      //   event.clientX,
      //   event.clientY
      // );
      //
      // const newEvent: AssertionEvent = {
      //   id: event.id,
      //   type: "assertion",
      //   timestamp: Date.now(),
      //   ...getTargetProps(elementUnderneath),
      //   clientX: event.clientX,
      //   clientY: event.clientY,
      //   href: (elementUnderneath as HTMLAnchorElement).href,
      // };
      // action.payload = newEvent;
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
      const events = [...selectEventsSorted(store.getState())];
      const trigger = events.reverse().find((e) => isRequestTriggerEvent(e))!;
      const newEvent: RequestEvent = {
        ...event,
        timestamp: trigger.timestamp - 1,
        triggerId: trigger.id,
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
      const events = [...selectEventsSorted(store.getState())];
      const previousNavigationEvents = events.filter(
        (e): e is NavigationEvent => isNavigationEvent(e)
      );
      if (previousNavigationEvents.length) {
        action.payload.type = "refresh";
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
