import { SaveEvent, StorageEvent } from "./types";
import storageChanged from "storage-changed";
import { obfuscateObj } from "./obfuscate";

const localStorageSnapshotEvent: () => StorageEvent = () => ({
  type: "navigate",
  timestamp: Date.now(),
  domain: window.location.hostname,
  value: obfuscateObj({ ...localStorage }),
});

export const initializeStorage = (saveEvent: SaveEvent) => {
  storageChanged("local");
  window.addEventListener("storageChanged", () =>
    saveEvent(localStorageSnapshotEvent())
  );
  saveEvent(localStorageSnapshotEvent());
};
