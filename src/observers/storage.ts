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

const buildEvent: (snapshot: any) => StorageEvent = (snapshot) => ({
  type: "storage",
  timestamp: Date.now(),
  value: snapshot,
});

const snapshotManager = ({ saveEvent, obfuscate }: RequiredArgs) => {
  let prev: string = "";

  const save = () => {
    try {
      const snapshot = getSnapshot();
      const snapShotString = JSON.stringify(snapshot);
      if (snapShotString === prev) {
        return;
      }
      saveEvent(buildEvent(obfuscate(snapshot)));
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
  const { save } = snapshotManager({ saveEvent, obfuscate });
  save();
  storageChanged("local");
  window.addEventListener("localStorageChanged", save);
  registerOnCloseCallback(() => {
    window.removeEventListener("localStorageChanged", save);
  });
};
