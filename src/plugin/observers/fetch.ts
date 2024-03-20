import { InitArgs, RequestEvent, ResponseEvent, SaveFixture } from "../types";
import { AliasBuilder } from "../utils/aliases";
import { getBlobFileExtension, pickleBlob } from "../utils/pickleBlob";
import { getAbsoluteUrl } from "../utils/absoluteUrls";
import { generateEventId } from "../utils/generateEventId";

const isRequestObj = (input: RequestInfo | URL): input is Request => {
  return (input as Request).method !== undefined;
};

const isURL = (input: string | URL): input is URL => {
  return (input as URL).hostname !== undefined;
};

const parseRequest = (
  buildAlias: AliasBuilder,
  input: RequestInfo | URL,
  init?: RequestInit
): Omit<RequestEvent, "id"> => {
  let url: string;
  let method: string;

  if (isRequestObj(input)) {
    url = input.url;
  } else if (isURL(input)) {
    url = input.toString();
  } else {
    url = input;
  }
  url = getAbsoluteUrl(url);
  method = init?.method || "GET";

  const alias = buildAlias({ url, method });

  return {
    type: "request",
    timestamp: Date.now(),
    url,
    method,
    alias,
    initiator: "fetch",
  };
};

const parseResponse = (
  response: Response,
  method: string,
  alias: string,
  saveFixture: SaveFixture
): Promise<Omit<ResponseEvent, "requestId">> => {
  return new Promise((resolve, reject) => {
    const { url, status } = response;
    const event: Omit<ResponseEvent, "fixture" | "requestId"> = {
      id: generateEventId(),
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
        const fixture = `${alias}.${extension}`;
        saveFixture(fixture, blob);
        resolve({ ...event, fixture });
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
    const id = generateEventId();
    const requestEvent = parseRequest(buildAlias, ...args);
    saveEvent({ ...requestEvent, id });

    const response = await originalFetch(...args);

    const responseEvent = await parseResponse(
      response,
      requestEvent.method,
      requestEvent.alias,
      saveFixture
    );
    saveEvent({ ...responseEvent, requestId: id });

    return response;
  };
}
