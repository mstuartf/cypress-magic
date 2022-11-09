import { RootState } from "../redux/store";
import { getInitialUserState } from "../redux/slice";

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
  chrome.storage.local.get("seasmoke", ({ seasmoke }) =>
    callback(seasmoke || { user: getInitialUserState() })
  );

export const updateCache = async (state: object) =>
  chrome.storage.local.set({
    seasmoke: { ...state },
  });

export const setBadgeText = async (text: string) =>
  chrome.action.setBadgeText({
    text,
  });
