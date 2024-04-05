import { InitArgs, ResponseEvent } from "../types";
import {
  aliasToFileName,
  getBlobFileExtension,
  pickleBlob,
  PickledBlob,
  unPickleBlob,
} from "../utils/pickleBlob";
import { getAbsoluteUrl } from "../utils/absoluteUrls";
import { generateEventId } from "../utils/generateEventId";

// should only record events to matching URLs
// should not make network calls when running test in mock mode
// should send {fixture: null} for 204s

interface PatchedXMLHttpRequest extends XMLHttpRequest {
  __meta: {
    url: string;
    method: string;
    id: string;
    alias: string;
  };
  // make these writeable for mocking
  readyState: number;
  status: number;
  statusText: string;
  responseText: string;
  response: any;
}

export function initXMLHttpRequestObserver({
  saveEvent,
  saveFixture,
  buildAlias,
  mockApiCalls,
  matchUrl,
  getMockedResponse,
}: InitArgs) {
  const _open = window.XMLHttpRequest.prototype.open;
  window.XMLHttpRequest.prototype.open = function () {
    const instance = this as PatchedXMLHttpRequest;
    const url = getAbsoluteUrl(arguments[1]);

    if (!matchUrl(url)) {
      return _open.apply(this, arguments as any);
    }

    // cache these so they are available in onreadystatechange
    instance.__meta = {
      method: arguments[0].toUpperCase(),
      id: generateEventId(),
      url,
      alias: buildAlias({
        url,
        method: arguments[0].toUpperCase(),
      }),
    };

    if (mockApiCalls()) {
      // do not trigger the actual network request
      return;
    }

    saveEvent({
      type: "request",
      timestamp: Date.now(),
      id: instance.__meta.id,
      url: instance.__meta.url,
      method: instance.__meta.method,
      alias: instance.__meta.alias,
      initiator: "XML",
    });

    return _open.apply(this, arguments as any);
  };

  const _send = window.XMLHttpRequest.prototype.send;
  window.XMLHttpRequest.prototype.send = function (...sendArgs) {
    const instance = this as PatchedXMLHttpRequest;
    const _onreadystatechange = this.onreadystatechange;
    const _onload = this.onload;

    const url = instance.__meta.url;
    if (!matchUrl(url)) {
      return _send.apply(this, sendArgs);
    }

    if (mockApiCalls()) {
      const mockedResponse = getMockedResponse(instance.__meta.alias);

      if (!mockedResponse) {
        throw Error(
          `could not find mocked response for ${instance.__meta.alias}`
        );
      }

      const { status, statusText, content } = mockedResponse;

      buildMockedResponse(content).then((jsonString) => {
        forceUpdateResponse(instance, status, statusText, jsonString);

        if (_onreadystatechange) {
          // todo event?
          _onreadystatechange.apply(this, [{} as Event]);
        }

        if (_onload) {
          _onload.apply(this, [{} as ProgressEvent]);
        }
      });

      return;
    }

    this.onreadystatechange = function (...onReadyStateChangeArgs) {
      if (this.readyState === 4) {
        const { method, id: requestId, alias } = instance.__meta;
        const status = this.status;
        const event: Omit<ResponseEvent, "body" | "fixture"> = {
          id: generateEventId(),
          type: "response",
          timestamp: Date.now(),
          method,
          requestId,
          url,
          status,
          alias,
          statusText: this.statusText,
        };
        try {
          if (status === 204) {
            saveEvent({ ...event, fixture: null });
            return;
          }
          const contentType =
            this.getResponseHeader("Content-Type") || "application/json";
          const blobType = contentType.split(";")[0]; // handle e.g. application/json; charset=utf-8
          // if the user has set this.responseType = 'json', then the response is auto-parsed and it needs to be stringified
          const res =
            this.responseType === "json"
              ? JSON.stringify(this.response)
              : this.response;
          const blob = new Blob([res], { type: blobType });
          const extension = getBlobFileExtension(blob);
          const fixture = `${aliasToFileName(alias)}.${extension}`;
          pickleBlob(blob).then((pickle) => {
            saveFixture(fixture, pickle);
            saveEvent({ ...event, fixture });
          });
        } catch (e) {
          saveEvent({ ...event, fixture: "error.json" });
        }
      }

      // if the app under test has defined this (which they likely would have)
      if (_onreadystatechange) {
        return _onreadystatechange.apply(this, onReadyStateChangeArgs);
      }
    };

    return _send.apply(this, sendArgs);
  };
}

// so far only supports json responses
async function buildMockedResponse(content: PickledBlob): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    unPickleBlob(content)
      .then((blob) => blob.text())
      .then((jsonString) => resolve(jsonString))
      .catch((error) => reject(error));
  });
}

const forceWriteableProps = [
  "response",
  "responseText",
  "readyState",
  "status",
  "statusText",
];
const forceUpdateResponse = (
  instance: PatchedXMLHttpRequest,
  status: number,
  statusText: string,
  responseText: string
) => {
  forceWriteableProps.forEach((p) =>
    Object.defineProperty(instance, p, { writable: true })
  );
  instance.readyState = 4;
  instance.response = JSON.parse(responseText);
  instance.responseText =
    instance.responseType !== "json" ? responseText : instance.response;
  instance.status = status;
  instance.statusText = statusText;
  forceWriteableProps.forEach((p) =>
    Object.defineProperty(instance, p, { writable: false })
  );
};
