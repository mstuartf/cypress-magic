import { InitArgs, StorageEvent } from "../types";
import { parseStorageObject } from "../utils/parseStorageObject";
import { blobify, pickleBlob } from "../utils/pickleBlob";

// only need initial local storage state
export const initLocalStorageObserver = ({
  saveEvent,
  saveFixture,
}: InitArgs) => {
  const fixture = "storage/local.json";
  const value = parseStorageObject(localStorage);
  const event: StorageEvent = {
    type: "storage",
    timestamp: Date.now(),
    storageType: "local",
    fixture,
  };
  const blob = blobify(value);
  pickleBlob(blob).then((pickle) => {
    saveEvent(event);
    saveFixture(fixture, pickle);
  });
};
