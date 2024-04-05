import { PopupState } from "../apps/popup/redux/store";
import { BaseState, initialBaseState } from "../apps/popup/redux/slice";

const cacheKey = "__cypressMagic__";
const defaultState = { base: { ...initialBaseState } };

export const readCache = async (): Promise<PopupState> => {
  return chrome.storage.local
    .get(cacheKey)
    .then((v) => v[cacheKey])
    .then((v) => (!!v && isPopupState(v) ? v : defaultState));
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

export const isPopupState = (
  value: object | PopupState
): value is PopupState => {
  const possible = value as PopupState;
  return possible.base !== undefined && isBaseStateObject(possible.base);
};

export const isBaseStateObject = (
  value: object | BaseState
): value is BaseState => {
  const possible = value as BaseState;
  return (
    possible.injectOnTabs !== undefined && possible.cacheLoaded !== undefined
  );
};

export const activeTabNeedsRefresh = (
  oldState: BaseState,
  newState: BaseState
) => {
  if (
    oldState.activeTabId !== newState.activeTabId ||
    !oldState.activeTabId ||
    !newState.activeTabId
  ) {
    return false;
  }
  if (!oldState.injectOnTabs.includes(oldState.activeTabId)) {
    return false;
  }
  return !newState.injectOnTabs.includes(newState.activeTabId);
};
