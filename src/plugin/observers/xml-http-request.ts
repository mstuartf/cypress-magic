import { InitArgs, ResponseEvent } from "../types";
import mimeDb from "mime-db";
import { pickleBlob } from "../utils/pickleBlob";
import { getAbsoluteUrl } from "../utils/absoluteUrls";

export function initXMLHttpRequestObserver({
  saveEvent,
  saveFixture,
  buildAlias,
  registerOnCloseCallback,
}: InitArgs) {
  const _open = window.XMLHttpRequest.prototype.open;
  window.XMLHttpRequest.prototype.open = function () {
    // cache these so they are available in onreadystatechange
    (this as any).__method = arguments[0].toUpperCase();
    (this as any).__url = getAbsoluteUrl(arguments[1]);
    saveEvent({
      type: "request",
      timestamp: Date.now(),
      url: (this as any).__url,
      method: (this as any).__method,
      initiator: "xml",
    });
    return _open.apply(this, arguments as any);
  };

  const _send = window.XMLHttpRequest.prototype.send;
  window.XMLHttpRequest.prototype.send = function () {
    const _onreadystatechange = this.onreadystatechange;
    this.onreadystatechange = function () {
      if (this.readyState === 4) {
        const url = (this as any).__url;
        const method = (this as any).__method;
        const status = this.status;
        const alias = buildAlias(url, method, status);
        const event: Omit<ResponseEvent, "body" | "fixture"> = {
          type: "response",
          timestamp: Date.now(),
          method,
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
          const blob = new Blob([this.response], { type: blobType });
          const { extensions } = mimeDb[blob.type];
          pickleBlob(blob)
            .then((pickle) => {
              const fixture = `api${alias}.${extensions![0]}`;
              saveFixture(fixture, pickle);
              saveEvent({ ...event, fixture });
            })
            .catch((e) => {
              console.log(url);
              console.log(this.getResponseHeader("Content-Type"));
              console.log(e);
              saveEvent({ ...event, fixture: "error.json" });
            });
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

  const removePatch = () => {
    window.XMLHttpRequest.prototype.open = _open;
    window.XMLHttpRequest.prototype.send = _send;
  };

  registerOnCloseCallback(removePatch);
}
