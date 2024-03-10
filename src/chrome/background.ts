import { store } from "../redux/store";
import { restoreCache } from "../redux/slice";
import { readCache, updateCache } from "./utils";

chrome.runtime.onInstalled.addListener(() => {});

store.subscribe(async () => {
  await updateCache({ ...store.getState() });
});

readCache((state) => {
  store.dispatch(restoreCache(state.root));
});

export default {};
