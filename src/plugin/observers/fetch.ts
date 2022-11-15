import { InitArgs, RequestEvent, ResponseEvent, SaveFixture } from "../types";
import { AliasBuilder } from "../utils/aliases";
import { pickleBlob } from "../utils/pickleBlob";
import mimeDb from "mime-db";

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
    const event: Omit<ResponseEvent, "body" | "fixture"> = {
      type: "response",
      timestamp: Date.now(),
      method,
      url,
      status,
      alias,
    };
    response
      .clone()
      .blob()
      .then((blob) => {
        const { extensions } = mimeDb[blob.type];
        pickleBlob(blob)
          .then((pickle) => {
            const fixture = `api${alias}.${extensions![0]}`;
            saveFixture(fixture, pickle);
            resolve({ ...event, fixture });
          })
          .catch((e) => {
            console.log(e);
            console.log(response);
            resolve({ ...event, fixture: "error.json" });
          });
      })
      .catch((e) => {
        console.log(e);
        console.log(response);
        resolve({ ...event, fixture: "error.json" });
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
