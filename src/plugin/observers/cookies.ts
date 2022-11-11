import { InitArgs, StorageEvent } from "../types";

const parseCookie = (cookie: string): { [key: string]: string } =>
  cookie.split("; ").reduce((prev, next) => {
    const [k, v] = next.split("=");
    return {
      ...prev,
      [k]: v,
    };
  }, {});

// only need initial cookie state
export const initCookieObserver = ({ saveEvent }: InitArgs) => {
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
};
