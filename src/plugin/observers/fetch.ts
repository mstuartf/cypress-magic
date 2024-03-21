import { InitArgs, RequestEvent, ResponseEvent, SaveFixture } from "../types";
import { AliasBuilder, buildRequestAlias } from "../utils/aliases";
import {
  aliasToFileName,
  getBlobFileExtension,
  pickleBlob,
  PickledBlob,
  unPickleBlob,
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
    const { url, status, statusText } = response;
    const event: Omit<ResponseEvent, "fixture" | "requestId"> = {
      id: generateEventId(),
      type: "response",
      timestamp: Date.now(),
      method,
      url,
      status,
      statusText,
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
        resolve({ ...event, fixture: "error.json" });
      });
  });
};

export function initFetchObserver({
  saveEvent,
  saveFixture,
  buildAlias,
  mockApiCalls,
  getMockedResponse,
}: InitArgs) {
  const { fetch: originalFetch } = window;

  window.fetch = async (input, init) => {
    const include = !isDataUrl(input);
    if (!include) {
      return originalFetch(input, init);
    }

    if (mockApiCalls()) {
      const alias = buildRequestAlias({
        url: parseUrl(input),
        method: init?.method || "GET",
      });
      const { status, statusText, content } = getMockedResponse(alias);
      return buildMockedResponse(status, statusText, content);
    }

    const id = generateEventId();
    const requestEvent = parseRequest(buildAlias, input, init);
    saveEvent({ ...requestEvent, id });
    const response = await originalFetch(input, init);
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

async function buildMockedResponse(
  status: number,
  statusText: string,
  content: PickledBlob
): Promise<Response> {
  return unPickleBlob(content).then((blob) => {
    const responseInit: ResponseInit = {
      status,
      statusText,
      headers: new Headers({
        "Content-Type": blob.type,
        "Content-Length": String(blob.size),
      }),
    };

    return new Response(blob, responseInit);
  });
}
