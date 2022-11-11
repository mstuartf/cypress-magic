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

// only need initial local storage state
export const initLocalStorageObserver = ({ saveEvent }: InitArgs) => {
  let lastValueStr: string | undefined;

  const checkStorageChange = () => {
    let nextValue = parseValue(localStorage);
    let nextValueStr = JSON.stringify(nextValue);
    if (nextValueStr !== lastValueStr) {
      const event: StorageEvent = {
        type: "storage",
        timestamp: Date.now(),
        storageType: "local",
        value: nextValue,
      };
      saveEvent(event);
      lastValueStr = nextValueStr;
    }
  };

  checkStorageChange();
};
