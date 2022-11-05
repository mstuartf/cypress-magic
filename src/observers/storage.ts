import { InitArgs, StorageEvent } from "../types";
import storageChanged from "storage-changed";
import { createErrorEvent } from "../utils/createErrorEvent";

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

const buildEvent: (
  snapshot: any,
  storageType: StorageEvent["storageType"]
) => StorageEvent = (snapshot, storageType) => ({
  type: "storage",
  timestamp: Date.now(),
  value: snapshot,
  storageType,
});

const snapshotManager = (
  storageType: StorageEvent["storageType"],
  { saveEvent, obfuscate }: RequiredArgs
) => {
  let prev: string = "";

  const save = () => {
    try {
      const snapshot = getSnapshot();
      const snapShotString = JSON.stringify(snapshot);
      if (snapShotString === prev) {
        return;
      }
      saveEvent(buildEvent(obfuscate(snapshot), storageType));
      prev = snapShotString;
    } catch (e) {
      saveEvent(createErrorEvent("storage", e));
    }
  };

  return { save };
};

type RequiredArgs = Pick<InitArgs, "saveEvent" | "obfuscate">;

export const initStorageObserver = ({
  registerOnCloseCallback,
  saveEvent,
  obfuscate,
}: InitArgs) => {
  const { save: saveLocalStorage } = snapshotManager("local", {
    saveEvent,
    obfuscate,
  });
  const { save: saveSessionStorage } = snapshotManager("session", {
    saveEvent,
    obfuscate,
  });
  saveLocalStorage();
  saveSessionStorage();
  storageChanged("local");
  storageChanged("session");
  window.addEventListener("localStorageChanged", saveLocalStorage);
  window.addEventListener("sessionStorageChanged", saveSessionStorage);
  registerOnCloseCallback(() => {
    window.removeEventListener("localStorageChanged", saveLocalStorage);
    window.removeEventListener("sessionStorageChanged", saveSessionStorage);
  });
};
