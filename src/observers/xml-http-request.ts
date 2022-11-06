import { InitArgs, ObfuscateFn } from "../types";

const parseBody = (body: any, obfuscate: ObfuscateFn) => {
  try {
    return obfuscate(JSON.parse(body));
  } catch {
    return null;
  }
};

export function initXMLHttpRequestObserver({
  saveEvent,
  obfuscate,
  registerOnCloseCallback,
}: InitArgs) {
  const _open = window.XMLHttpRequest.prototype.open;
  window.XMLHttpRequest.prototype.open = function () {
    // cache these so they are available in onreadystatechange
    this.__method = arguments[0].toUpperCase();
    this.__url = arguments[1];
    saveEvent({
      type: "request",
      timestamp: Date.now(),
      url: this.__url,
      method: this.__method,
      initiator: "xml",
    });
    return _open.apply(this, arguments);
  };

  const _send = window.XMLHttpRequest.prototype.send;
  window.XMLHttpRequest.prototype.send = function () {
    const _onreadystatechange = this.onreadystatechange;
    if (_onreadystatechange) {
      this.onreadystatechange = function () {
        if (this.readyState === 4) {
          saveEvent({
            type: "response",
            timestamp: Date.now(),
            url: this.__url,
            method: this.__method,
            status: this.status,
            body: parseBody(this.response, obfuscate),
          });
        }
        return _onreadystatechange.apply(this, arguments);
      };
    }
    return _send.apply(this, arguments);
  };

  const removePatch = () => {
    window.XMLHttpRequest.prototype.open = _open;
    window.XMLHttpRequest.prototype.send = _send;
  };

  registerOnCloseCallback(removePatch);
}
