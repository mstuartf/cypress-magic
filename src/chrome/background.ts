import { store } from "../redux/store";
import { restoreCache } from "../redux/slice";
import { readCache, setBadgeText, updateCache } from "./utils";

chrome.runtime.onInstalled.addListener(() => {
  setBadgeText("OFF");
});

store.subscribe(async () => {
  await updateCache({ ...store.getState() });
});

readCache((state) => {
  store.dispatch(restoreCache(state.root));
});

export default {};
