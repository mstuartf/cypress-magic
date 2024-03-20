import { InitArgs, ResponseEvent } from "../types";
import { getBlobFileExtension, pickleBlob } from "../utils/pickleBlob";
import { getAbsoluteUrl } from "../utils/absoluteUrls";
import { generateEventId } from "../utils/generateEventId";

export function initXMLHttpRequestObserver({
  saveEvent,
  saveFixture,
  buildAlias,
}: InitArgs) {
  const _open = window.XMLHttpRequest.prototype.open;
  window.XMLHttpRequest.prototype.open = function () {
    // cache these so they are available in onreadystatechange
    (this as any).__method = arguments[0].toUpperCase();
    (this as any).__url = getAbsoluteUrl(arguments[1]);
    (this as any).__id = generateEventId();
    (this as any).__alias = buildAlias({
      url: (this as any).__url,
      method: (this as any).__method,
    });
    saveEvent({
      type: "request",
      timestamp: Date.now(),
      id: (this as any).__id,
      url: (this as any).__url,
      method: (this as any).__method,
      alias: (this as any).__alias,
      initiator: "xml",
    });
    return _open.apply(this, arguments as any);
  };

  const _send = window.XMLHttpRequest.prototype.send;
  window.XMLHttpRequest.prototype.send = function () {
    const _onreadystatechange = this.onreadystatechange;
    this.onreadystatechange = function () {
      if (this.readyState === 4) {
        const requestId = (this as any).__id;
        const url = (this as any).__url;
        const method = (this as any).__method;
        const alias = (this as any).__alias;
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
          const fixture = `${alias}.${extension}`;
          saveFixture(fixture, blob);
          saveEvent({ ...event, fixture });
        } catch (e) {
          console.log(url);
          console.log(this.getResponseHeader("Content-Type"));
          console.log(e);
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
