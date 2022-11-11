import { InitArgs } from "../types";

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
    (this as any).__url = arguments[1];
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
    if (_onreadystatechange) {
      this.onreadystatechange = function () {
        if (this.readyState === 4) {
          const url = (this as any).__url;
          const method = (this as any).__method;
          const status = this.status;
          const alias = buildAlias(url, method, status);
          const fixture = `${alias}.json`;
          saveEvent({
            type: "response",
            timestamp: Date.now(),
            url,
            method,
            status,
            alias,
            fixture,
          });
          try {
            saveFixture(fixture, JSON.parse(this.response));
          } catch (e) {
            // todo: non-json fixtures
          }
        }
        return _onreadystatechange.apply(this, arguments as any);
      };
    }
    return _send.apply(this, arguments as any);
  };

  const removePatch = () => {
    window.XMLHttpRequest.prototype.open = _open;
    window.XMLHttpRequest.prototype.send = _send;
  };

  registerOnCloseCallback(removePatch);
}
