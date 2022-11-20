import { InitArgs, StorageEvent } from "../types";
import { blobify, pickleBlob } from "../utils/pickleBlob";

const parseCookie = (cookie: string): { [key: string]: string } =>
  cookie.split("; ").reduce((prev, next) => {
    const [k, v] = next.split("=");
    return {
      ...prev,
      [k]: v,
    };
  }, {});

// only need initial cookie state
export const initCookieObserver = ({
  saveEvent,
  saveFixture,
  buildAlias,
}: InitArgs) => {
  const alias = buildAlias({ type: "cookie" });
  const fixture = `storage/${alias}.json`;
  const value = parseCookie(document.cookie);
  const event: StorageEvent = {
    type: "storage",
    timestamp: Date.now(),
    storageType: "cookie",
    fixture,
  };
  const blob = blobify(value);
  pickleBlob(blob).then((pickle) => {
    saveEvent(event);
    saveFixture(fixture, pickle);
  });
};
