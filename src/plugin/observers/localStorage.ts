import { InitArgs, StorageEvent } from "../types";
import { parseStorageObject } from "../utils/parseStorageObject";

// only need initial local storage state
export const initLocalStorageObserver = ({
  saveEvent,
  saveFixture,
}: InitArgs) => {
  const fixture = "local-storage.json";
  const value = parseStorageObject(localStorage);
  const event: StorageEvent = {
    type: "storage",
    timestamp: Date.now(),
    storageType: "local",
    fixture,
  };
  saveEvent(event);
  saveFixture(fixture, value);
};
