// The first event our service worker will listen for is runtime.onInstalled().
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
});

// https://stackoverflow.com/a/72607832
chrome.runtime.onInstalled.addListener(async () => {
  const scripts = [
    {
      id: "inject",
      js: ["inject.js"],
      matches: ["https://*/*"],
      runAt: "document_start",
      world: "MAIN",
    },
  ];
  const ids = scripts.map((s) => s.id);
  await chrome.scripting.unregisterContentScripts({ ids }).catch(() => {});
  await chrome.scripting.registerContentScripts(scripts).catch(() => {});
});

const login = ({ emailAddress }) =>
  new Promise((resolve) =>
    resolve({
      email_address: emailAddress,
      client_id: "b7483b7f-bb53-4190-b9c9-8f01dbd29590",
    })
  );

const getState = async () => {
  const state = await chrome.storage.local.get(["seasmoke"]);
  return state.seasmoke || {};
};

const updateState = async (props) => {
  const state = await getState();
  await chrome.storage.local.set({
    seasmoke: { ...state, ...props },
  });
};

const checkAuthStatus = () =>
  new Promise(async (resolve) => {
    const state = await getState();
    resolve(!!state.client_id);
  });

const getActiveTabId = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab.id;
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const { type, payload } = request;
  if (type === "set_badge") {
    getActiveTabId().then((tabId) => {
      chrome.action.setBadgeText({ tabId, text: payload });
    });
  }
  if (type === "login") {
    login(payload)
      .then(({ email_address, client_id }) => {
        updateState({ email_address, client_id }).then(() => {
          chrome.action.setPopup({ popup: "record.html" }).then(() => {
            sendResponse(true);
          });
        });
      })
      .catch((err) => console.log(err));
    return true;
  }
  if (type === "logout") {
    updateState({ email_address: null, client_id: null }).then(() => {
      getActiveTabId().then((tabId) => {
        chrome.action.setBadgeText({ tabId, text: "OFF" }).then(() => {
          chrome.action.setPopup({ popup: "login.html" }).then(() => {
            sendResponse(true);
          });
        });
      });
    });
    return true;
  }
});

// choose the right template on first load
checkAuthStatus().then((isLoggedIn) => {
  chrome.action.setPopup({ popup: isLoggedIn ? "record.html" : "login.html" });
});
