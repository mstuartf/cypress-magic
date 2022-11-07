const BASE_URL = "https://api.seasmoke.io";

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

export const getSessionTestFileRequest = async (sessionId: string) => {
  const response = await fetch(
    `${BASE_URL}/events/session/${sessionId}/test-file`
  );
  const body = await response.json();
  return body;
};

export const setDisabledState = (
  elements: Array<HTMLElement & { disabled: boolean }>,
  isLoading: boolean
) => {
  elements.forEach((el) => {
    el.disabled = isLoading;
  });
};
