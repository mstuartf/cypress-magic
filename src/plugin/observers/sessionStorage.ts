import { InitArgs, StorageEvent } from "../types";
import { parseStorageObject } from "../utils/parseStorageObject";
import { blobify, pickleBlob } from "../utils/pickleBlob";

// only need initial session storage state
export const initSessionStorageObserver = ({
  saveEvent,
  saveFixture,
}: InitArgs) => {
  const fixture = "storage/session.json";
  const value = parseStorageObject(sessionStorage);
  const event: StorageEvent = {
    type: "storage",
    timestamp: Date.now(),
    storageType: "session",
    fixture,
  };
  const blob = blobify(value);
  pickleBlob(blob).then((pickle) => {
    saveEvent(event);
    saveFixture(fixture, pickle);
  });
};
