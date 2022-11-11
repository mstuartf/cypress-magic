import { InitArgs, ParsedEvent, StorageEvent } from "../types";

const parseCookie = (cookie: string): { [key: string]: string } =>
  cookie.split("; ").reduce((prev, next) => {
    const [k, v] = next.split("=");
    return {
      ...prev,
      [k]: v,
    };
  }, {});

// no way to listen for changes, so instead check value against cached value whenever
// another event is saved
export const initCookieObserver = ({
  saveEvent,
  registerOnSaveEventCallback,
}: InitArgs) => {
  let lastCookie: string | undefined;

  const checkCookieChange = () => {
    let cookie = document.cookie;
    if (cookie !== lastCookie) {
      const event: StorageEvent = {
        type: "storage",
        timestamp: Date.now(),
        storageType: "cookie",
        value: parseCookie(cookie),
      };
      saveEvent(event);
      lastCookie = cookie;
    }
  };

  checkCookieChange();

  const onSaveEvent = (event: ParsedEvent) => {
    if (event.type !== "storage") {
      checkCookieChange();
    }
  };

  registerOnSaveEventCallback(onSaveEvent);
};
