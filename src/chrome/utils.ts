import { RootState } from "../apps/popup/redux/store";

export const getActiveTabId = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab.id!;
};

export const readCache = async (
  callback: (value: RootState) => void
): Promise<void> =>
  chrome.storage.local.get("seasmoke", ({ seasmoke }) => callback(seasmoke));

export const updateCache = async (state: object) =>
  chrome.storage.local.set({
    seasmoke: { ...state },
  });
