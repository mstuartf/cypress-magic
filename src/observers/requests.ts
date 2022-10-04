// Listens for API calls and responses

import { register } from "fetch-intercept";
import {
  InitArgs,
  PerformanceResourceEvent,
  RequestEvent,
  ResponseEvent,
} from "../types";

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
  res: Response & { request: Request },
  args: RequiredArgs
) => void = (response, { saveEvent, obfuscate }) => {
  const {
    request: { url, method },
    status,
  } = response;
  response
    .clone()
    .json()
    .then((body) => {
      const res: ResponseEvent = {
        type: "response",
        timestamp: Date.now(),
        url,
        method,
        status,
        body: body ? obfuscate(body) : body,
      };
      saveEvent(res);
    })
    .catch(() => {
      const res: ResponseEvent = {
        type: "response",
        timestamp: Date.now(),
        url,
        method,
        status,
        body: null,
      };
      saveEvent(res);
    });
};

type RequiredArgs = Pick<InitArgs, "saveEvent" | "obfuscate">;

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

export const initRequestsObserver = ({ saveEvent, obfuscate }: InitArgs) => {
  let first = true;
  register({
    request: function (url, config) {
      saveEvent(parseRequest(url, config));
      if (first) {
        // This is the first request we have been able to intercept but not necessarily the first request made by the app.
        // Send a history of requests already made so we can detect this on the backend.
        saveEvent(getInitialPerformanceData());
        first = false;
      }
      return [url, config];
    },

    response: function (response) {
      parseResponse(response, { saveEvent, obfuscate });
      return response;
    },

    responseError: function (error) {
      return Promise.reject(error);
    },
  });
};
