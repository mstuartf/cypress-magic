import { SaveEvent, StorageEvent } from "./types";
import storageChanged from "storage-changed";
import { obfuscateObj } from "./obfuscate";

const localStorageSnapshotEvent: () => StorageEvent = () => ({
  type: "storage",
  timestamp: Date.now(),
  domain: window.location.hostname,
  value: obfuscateObj(
    Object.entries(localStorage)
      .filter(([, v]) => typeof v !== "function")
      .reduce(
        (prev, [k, v]) => ({
          ...prev,
          [k]: v,
        }),
        {}
      )
  ),
});

export const initializeStorage = (saveEvent: SaveEvent) => {
  storageChanged("local");
  window.addEventListener("storageChanged", () =>
    saveEvent(localStorageSnapshotEvent())
  );
  saveEvent(localStorageSnapshotEvent());
};
