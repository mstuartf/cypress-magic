// The first event our service worker will listen for is runtime.onInstalled().
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
});

const getActiveTabId = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab.id;
};

chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  const { action, data } = request;
  if (action === "set_badge") {
    const tabId = await getActiveTabId();
    await chrome.action.setBadgeText({ tabId, text: data });
  }
});
