import { PopupState } from "../apps/popup/redux/store";
import { initialBaseState } from "../apps/popup/redux/slice";

const cacheKey = "__seasmoke__";

export const readCache = async (): Promise<PopupState | undefined> => {
  return chrome.storage.local
    .get(cacheKey)
    .then((v) => v[cacheKey]) as unknown as PopupState | undefined;
};

export const updateCache = async (state: PopupState) =>
  chrome.storage.local.set({
    [cacheKey]: state,
  });

export const inject = (tabId: number) =>
  chrome.scripting.executeScript({
    target: { tabId },
    files: ["static/js/content.js"],
    world: "MAIN",
  });
