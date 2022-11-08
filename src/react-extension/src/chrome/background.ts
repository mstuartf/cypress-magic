import { wrapStore } from "webext-redux";
import { combineReducers, configureStore, createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    login: {
      isLoading: false,
    },
    info: {
      email_address: null,
      token: null,
    },
    cacheLoaded: false,
  },
  reducers: {
    restoreCache: (state, action) => {
      console.log("restoreCache", action.payload);
      if (action.payload) {
        state.login = { ...action.payload.login };
        state.info = { ...action.payload.info };
      }
      state.cacheLoaded = true;
    },
    loginPending: (state) => {
      state.login.isLoading = true;
    },
    loginSuccess: (state, action) => {
      state.login.isLoading = false;
      state.info.token = action.payload.token;
    },
    logout: (state) => {
      state.info = {
        email_address: null,
        token: null,
      };
    },
  },
});

export const { loginPending, loginSuccess, restoreCache, logout } =
  userSlice.actions;

export const selectIsLoggedIn = (state: RootState) => !!state.user.info.token;
export const selectCacheLoaded = (state: RootState) => state.user.cacheLoaded;
export const selectEmailAddress = (state: RootState) =>
  state.user.info.email_address;

const rootReducer = combineReducers({
  user: userSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: rootReducer,
});

wrapStore(store);

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
});

store.subscribe(async () => {
  await chrome.storage.local.set({
    seasmoke: { ...store.getState() },
  });
});

export const loadCache = async () => {
  console.log("dispatching loadCache");
  const state = await chrome.storage.local.get(["seasmoke"]);
  store.dispatch(restoreCache(state.seasmoke.user || null));
};

loadCache();

export default {};
