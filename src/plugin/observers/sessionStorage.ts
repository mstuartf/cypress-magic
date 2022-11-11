import { InitArgs, StorageEvent } from "../types";
import { parseStorageObject } from "../utils/parseStorageObject";

// only need initial session storage state
export const initSessionStorageObserver = ({
  saveEvent,
  saveFixture,
}: InitArgs) => {
  const fixture = "session-storage.json";
  const value = parseStorageObject(sessionStorage);
  const event: StorageEvent = {
    type: "storage",
    timestamp: Date.now(),
    storageType: "session",
    fixture,
  };
  saveEvent(event);
  saveFixture(fixture, value);
};
