import { InitArgs, StorageEvent } from "../types";

const parseValue = (value: object) =>
  Object.entries(value)
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

// only need initial session storage state
export const initSessionStorageObserver = ({ saveEvent }: InitArgs) => {
  let lastValueStr: string | undefined;

  const checkStorageChange = () => {
    let nextValue = parseValue(sessionStorage);
    let nextValueStr = JSON.stringify(nextValue);
    if (nextValueStr !== lastValueStr) {
      const event: StorageEvent = {
        type: "storage",
        timestamp: Date.now(),
        storageType: "session",
        value: nextValue,
      };
      saveEvent(event);
      lastValueStr = nextValueStr;
    }
  };

  checkStorageChange();
};
