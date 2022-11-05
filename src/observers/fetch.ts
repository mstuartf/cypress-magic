// Listens for API calls and responses

import { register } from "fetch-intercept";
import {
  InitArgs,
  PerformanceResourceEvent,
  RequestEvent,
  ResponseEvent,
} from "../types";
import { createErrorEvent } from "../utils/createErrorEvent";

const parseRequest: (url: string, init?: RequestInit) => RequestEvent = (
  url,
  init
) => ({
  type: "request",
  timestamp: Date.now(),
  url,
  method: init ? init.method : "GET",
});

const parseResponse: (
  res: Response & { request: Request }
) => Promise<ResponseEvent> = (response) => {
  return new Promise((resolve, reject) => {
    const {
      request: { url, method },
      status,
    } = response;
    const shared: Omit<ResponseEvent, "body"> = {
      type: "response",
      timestamp: Date.now(),
      url,
      method,
      status,
    };
    response
      .clone()
      .json()
      .then((body) => resolve({ ...shared, body }))
      .catch(() => resolve({ ...shared, body: null }));
  });
};

const getInitialPerformanceData = (): PerformanceResourceEvent => {
  const entries = window.performance.getEntriesByType(
    "resource"
  ) as PerformanceResourceTiming[];
  return {
    type: "performance",
    timestamp: Date.now(),
    resources: entries.map(({ name, initiatorType }) => ({
      name,
      initiatorType,
    })),
  };
};

export const initFetchObserver = ({
  saveEvent,
  obfuscate,
  registerOnCloseCallback,
}: InitArgs) => {
  let first = true;
  const unregister = register({
    request: function (url, config) {
      try {
        saveEvent(parseRequest(url, config));
        if (first) {
          // This is the first request we have been able to intercept but not necessarily the first request made by the app.
          // Send a history of requests already made so we can detect this on the backend.
          saveEvent(getInitialPerformanceData());
          first = false;
        }
      } catch (e) {
        saveEvent(createErrorEvent("request", e));
      }
      return [url, config];
    },

    response: function (response) {
      try {
        parseResponse(response)
          .then(({ body, ...rest }) => {
            saveEvent({
              ...rest,
              body: body ? obfuscate(body) : body,
            });
          })
          .catch((e) => saveEvent(createErrorEvent("response", e)));
      } catch (e) {
        saveEvent(createErrorEvent("response", e));
      }
      return response;
    },
  });
  registerOnCloseCallback(unregister);
};
