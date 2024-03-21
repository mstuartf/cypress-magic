import { InitArgs, RequestEvent, ResponseEvent, SaveFixture } from "../types";
import { AliasBuilder } from "../utils/aliases";
import {
  aliasToFileName,
  getBlobFileExtension,
  pickleBlob,
} from "../utils/pickleBlob";
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
  const url = getAbsoluteUrl(parseUrl(input));
  const method = init?.method || "GET";
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
        const fixture = `${aliasToFileName(alias)}.${extension}`;
        pickleBlob(blob).then((pickle) => {
          saveFixture(fixture, pickle);
          resolve({ ...event, fixture });
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

  window.fetch = async (input, init) => {
    const include = !isDataUrl(input);
    const id = generateEventId();
    const requestEvent = parseRequest(buildAlias, input, init);

    if (include) {
      saveEvent({ ...requestEvent, id });
    }

    const response = await originalFetch(input, init);

    if (include) {
      const responseEvent = await parseResponse(
        response,
        requestEvent.method,
        requestEvent.alias,
        saveFixture
      );
      saveEvent({ ...responseEvent, requestId: id });
    }

    return response;
  };
}

const parseUrl = (input: RequestInfo | URL) => {
  if (isRequestObj(input)) {
    return input.url;
  } else if (isURL(input)) {
    return input.toString();
  } else {
    return input;
  }
};

const isDataUrl = (input: RequestInfo | URL): boolean => {
  const url = parseUrl(input);
  return url.startsWith("data:");
};
