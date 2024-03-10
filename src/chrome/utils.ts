import { RootState } from "../redux/store";

export const getActiveTabId = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab.id!;
};

export const sendMsgToContent = async (msg: any) => {
  const tabId = await getActiveTabId();
  await chrome.tabs.sendMessage(tabId, msg);
};

export const readCache = async (
  callback: (value: RootState) => void
): Promise<void> =>
  chrome.storage.local.get("seasmoke", ({ seasmoke }) => callback(seasmoke));

export const updateCache = async (state: object) =>
  chrome.storage.local.set({
    seasmoke: { ...state },
  });

export const setBadgeText = async (text: "ON" | "OFF") =>
  chrome.action.setBadgeText({
    text,
  });
