import { InitArgs, ResponseEvent } from "../types";
import {
  aliasToFileName,
  getBlobFileExtension,
  pickleBlob,
} from "../utils/pickleBlob";
import { getAbsoluteUrl } from "../utils/absoluteUrls";
import { generateEventId } from "../utils/generateEventId";

// should only record events to matching URLs

interface PatchedXMLHttpRequest extends XMLHttpRequest {
  __meta: {
    url: string;
    method: string;
    id: string;
    alias: string;
  };
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
    const url = getAbsoluteUrl(arguments[1]);

    if (matchUrl(url)) {
      const instance = this as PatchedXMLHttpRequest;
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
      saveEvent({
        type: "request",
        timestamp: Date.now(),
        id: instance.__meta.id,
        url: instance.__meta.url,
        method: instance.__meta.method,
        alias: instance.__meta.alias,
        initiator: "xml",
      });
    }

    return _open.apply(this, arguments as any);
  };

  const _send = window.XMLHttpRequest.prototype.send;
  window.XMLHttpRequest.prototype.send = function () {
    const instance = this as PatchedXMLHttpRequest;
    const _onreadystatechange = this.onreadystatechange;
    this.onreadystatechange = function () {
      const url = instance.__meta.url;

      if (this.readyState === 4 && matchUrl(url)) {
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

      if (_onreadystatechange) {
        return _onreadystatechange.apply(this, arguments as any);
      }
    };
    return _send.apply(this, arguments as any);
  };
}
