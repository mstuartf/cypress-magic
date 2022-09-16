// Listens for API calls and responses

import { register } from "fetch-intercept";
import { InitArgs, RequestEvent, ResponseEvent, SaveEvent } from "./types";

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
    });
};

type RequiredArgs = Pick<InitArgs, "saveEvent" | "obfuscate">;

export const initialiseRequests = ({ saveEvent, obfuscate }: RequiredArgs) => {
  register({
    request: function (url, config) {
      saveEvent(parseRequest(url, config));
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
