import { InitArgs, ObfuscateFn, RequestEvent, ResponseEvent } from "../types";

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
    method = init ? init.method : "GET";
  } else {
    url = input;
    method = init ? init.method : "GET";
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
  obfuscate: ObfuscateFn
): Promise<ResponseEvent> => {
  return new Promise((resolve, reject) => {
    const { url, status } = response;
    const shared: Omit<ResponseEvent, "body"> = {
      type: "response",
      timestamp: Date.now(),
      method,
      url,
      status,
    };
    response
      .clone()
      .json()
      .then((body) => resolve({ ...shared, body: obfuscate(body) }))
      .catch(() => resolve({ ...shared, body: null }));
  });
};

export function initFetchObserver({
  saveEvent,
  obfuscate,
  registerOnCloseCallback,
}: InitArgs) {
  const { fetch: originalFetch } = window;
  window.fetch = async (...args) => {
    const requestEvent = parseRequest(...args);
    saveEvent(requestEvent);

    const response = await originalFetch(...args);

    const responseEvent = await parseResponse(
      response,
      requestEvent.method,
      obfuscate
    );
    saveEvent(responseEvent);

    return response;
  };

  const removePatch = () => {
    window.fetch = originalFetch;
  };

  registerOnCloseCallback(removePatch);
}
