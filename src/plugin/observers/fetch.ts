import { InitArgs, RequestEvent, ResponseEvent, SaveFixture } from "../types";
import { AliasBuilder } from "../utils/aliases";
import { getBlobFileExtension, pickleBlob } from "../utils/pickleBlob";
import { v4 as uuidv4 } from "uuid";
import { getAbsoluteUrl } from "../utils/absoluteUrls";

const isRequestObj = (input: RequestInfo | URL): input is Request => {
  return (input as Request).method !== undefined;
};

const isURL = (input: string | URL): input is URL => {
  return (input as URL).hostname !== undefined;
};

const parseRequest = (
  input: RequestInfo | URL,
  init?: RequestInit
): Omit<RequestEvent, "id"> => {
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
    url: getAbsoluteUrl(url),
    method,
    initiator: "fetch",
  };
};

const parseResponse = (
  response: Response,
  method: string,
  buildAlias: AliasBuilder,
  saveFixture: SaveFixture
): Promise<Omit<ResponseEvent, "requestId">> => {
  return new Promise((resolve, reject) => {
    const { url, status } = response;
    const alias = buildAlias({ url, method, status });
    const event: Omit<ResponseEvent, "fixture" | "requestId"> = {
      type: "response",
      timestamp: Date.now(),
      method,
      url,
      status,
      alias,
    };
    if (status === 204) {
      resolve({
        ...event,
        fixture: null,
      });
      return;
    }
    response
      .clone()
      .blob()
      .then((blob) => {
        const extension = getBlobFileExtension(blob);
        pickleBlob(blob)
          .then((pickle) => {
            const fixture = `api${alias}.${extension}`;
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
  saveFixture,
  buildAlias,
}: InitArgs) {
  const { fetch: originalFetch } = window;

  window.fetch = async (...args) => {
    const id = uuidv4();
    const requestEvent = parseRequest(...args);
    saveEvent({ ...requestEvent, id });

    const response = await originalFetch(...args);

    const responseEvent = await parseResponse(
      response,
      requestEvent.method,
      buildAlias,
      saveFixture
    );
    saveEvent({ ...responseEvent, requestId: id });

    return response;
  };
}
