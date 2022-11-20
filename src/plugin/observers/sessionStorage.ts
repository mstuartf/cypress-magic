import { InitArgs, StorageEvent } from "../types";
import { parseStorageObject } from "../utils/parseStorageObject";
import { blobify, pickleBlob } from "../utils/pickleBlob";

// only need initial session storage state
export const initSessionStorageObserver = ({
  saveEvent,
  saveFixture,
  buildAlias,
}: InitArgs) => {
  const alias = buildAlias({ type: "session" });
  const fixture = `storage/${alias}.json`;
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
