import { SaveEvent, StorageEvent } from "./types";
import storageChanged from "storage-changed";
import { obfuscateObj } from "./obfuscate";

const getSnapshot = () =>
  Object.entries(localStorage)
    .filter(([, v]) => typeof v !== "function")
    .reduce((prev, [k, v]) => {
      let val: any;
      try {
        val = JSON.parse(v);
      } catch (e) {
        val = v;
      }
      return {
        ...prev,
        [k]: val,
      };
    }, {});

const buildEvent: (snapshot: any) => StorageEvent = (snapshot) => ({
  type: "storage",
  timestamp: Date.now(),
  domain: window.location.hostname,
  value: obfuscateObj(snapshot),
});

const snapshotManager = (saveEventFn: SaveEvent) => {
  let prev: string = "";

  const save = () => {
    const snapshot = getSnapshot();
    const snapShotString = JSON.stringify(snapshot);
    if (snapShotString === prev) {
      return;
    }
    saveEventFn(buildEvent(snapshot));
    prev = snapShotString;
  };

  return { save };
};

export const initializeStorage = (saveEvent: SaveEvent) => {
  const { save } = snapshotManager(saveEvent);
  storageChanged("local");
  window.addEventListener("localStorageChanged", save);
  save();
};
