import { InitArgs, RequestEvent, ResponseEvent, SaveFixture } from "../types";
import { AliasBuilder } from "../utils/aliases";

const isRequestObj = (input: RequestInfo | URL): input is Request => {
  return (input as Request).method !== undefined;
};

const isURL = (input: string | URL): input is URL => {
  return (input as URL).hostname !== undefined;
};

const parseRequest = (
  input: RequestInfo | URL,
  init?: RequestInit
): RequestEvent => {
  let url: string;
  let method: string;

  if (isRequestObj(input)) {
    url = input.url;
    method = input.method;
  } else if (isURL(input)) {
    url = input.toString();
    method = init ? init.method! : "GET";
  } else {
    url = input;
    method = init ? init.method! : "GET";
  }

  return {
    type: "request",
    timestamp: Date.now(),
    url,
    method,
    initiator: "fetch",
  };
};

const parseResponse = (
  response: Response,
  method: string,
  buildAlias: AliasBuilder,
  saveFixture: SaveFixture
): Promise<ResponseEvent> => {
  return new Promise((resolve, reject) => {
    const { url, status } = response;
    const alias = buildAlias(url, method, status);
    const fixture = `${alias}.json`;
    const event: Omit<ResponseEvent, "body"> = {
      type: "response",
      timestamp: Date.now(),
      method,
      url,
      status,
      alias,
      fixture,
    };
    response
      .clone()
      .json()
      .then((body) => {
        saveFixture(fixture, body);
        resolve(event);
      })
      .catch(() => {
        // todo: non-json fixtures?
        resolve(event);
      });
  });
};

export function initFetchObserver({
  saveEvent,
  registerOnCloseCallback,
  saveFixture,
  buildAlias,
}: InitArgs) {
  const { fetch: originalFetch } = window;

  window.fetch = async (...args) => {
    const requestEvent = parseRequest(...args);
    saveEvent(requestEvent);

    const response = await originalFetch(...args);

    const responseEvent = await parseResponse(
      response,
      requestEvent.method,
      buildAlias,
      saveFixture
    );
    saveEvent(responseEvent);

    return response;
  };

  const removePatch = () => {
    window.fetch = originalFetch;
  };

  registerOnCloseCallback(removePatch);
}
