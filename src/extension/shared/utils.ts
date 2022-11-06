export const getState = async () => {
  const state = await chrome.storage.local.get(["seasmoke"]);
  return state.seasmoke || {};
};

export const updateState = async (props: any) => {
  const state = await getState();
  await chrome.storage.local.set({
    seasmoke: { ...state, ...props },
  });
};

export const getActiveTabId = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab.id;
};
