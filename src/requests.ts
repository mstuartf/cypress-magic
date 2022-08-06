// Listens for API calls and responses

import { register } from "fetch-intercept";
import { obfuscateObj } from "./obfuscate";
import { SaveEvent } from "./types";

const parseRequest = (url: string, init?: RequestInit) => ({
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
      saveEvent({
        type: "response",
        timestamp: Date.now(),
        url,
        method,
        status,
        body: body ? obfuscateObj(body) : body,
      });
    });
};

export const initialiseRequests = (saveEvent: SaveEvent) => {
  register({
    request: function (url, config) {
      // Modify the url or config here
      saveEvent(parseRequest(url, config));
      return [url, config];
    },

    response: function (response) {
      // Modify the reponse object
      parseResponse(response, saveEvent);
      return response;
    },

    responseError: function (error) {
      // Handle an fetch error
      return Promise.reject(error);
    },
  });
};
