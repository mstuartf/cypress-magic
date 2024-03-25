import { RootState } from "../apps/popup/redux/store";
import { initialState } from "../apps/popup/redux/slice";

export const readCache = async (
  callback: (value: RootState) => void
): Promise<void> =>
  chrome.storage.local.get("__seasmoke", ({ seasmoke }) =>
    callback(seasmoke || { root: { ...initialState } })
  );

export const updateCache = async (state: object) =>
  chrome.storage.local.set({
    __seasmoke: { ...state },
  });

export const inject = (tabId: number) =>
  chrome.scripting.executeScript({
    target: { tabId },
    files: ["static/js/content.js"],
    world: "MAIN",
  });

export const reloadTab = (tabId: number) => chrome.tabs.reload(tabId);
