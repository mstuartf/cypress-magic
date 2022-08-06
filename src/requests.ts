// Listens for API calls and responses

import { register } from "fetch-intercept";
import { obfuscateObj } from "./obfuscate";
import { RequestEvent, ResponseEvent, SaveEvent } from "./types";

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
  saveEvent: SaveEvent
) => void = (response, saveEvent) => {
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
        body: body ? obfuscateObj(body) : body,
      };
      saveEvent(res);
    });
};

export const initialiseRequests = (saveEvent: SaveEvent) => {
  register({
    request: function (url, config) {
      saveEvent(parseRequest(url, config));
      return [url, config];
    },

    response: function (response) {
      parseResponse(response, saveEvent);
      return response;
    },

    responseError: function (error) {
      return Promise.reject(error);
    },
  });
};
