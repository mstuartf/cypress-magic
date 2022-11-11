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
export const initCookieObserver = ({ saveEvent, saveFixture }: InitArgs) => {
  const fixture = "local-storage.json";
  const value = parseCookie(document.cookie);
  const event: StorageEvent = {
    type: "storage",
    timestamp: Date.now(),
    storageType: "cookie",
    fixture,
  };
  saveEvent(event);
  saveFixture(fixture, value);
};
