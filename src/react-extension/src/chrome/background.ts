import { wrapStore } from "webext-redux";
import {
  createSlice,
  configureStore,
  combineReducers,
  createSelector,
} from "@reduxjs/toolkit";

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
  },
  reducers: {
    loginPending: (state) => {
      state.login.isLoading = true;
    },
    loginSuccess: (state, action) => {
      state.login.isLoading = false;
      state.info.email_address = action.payload.email_address;
      state.info.token = action.payload.token;
    },
  },
});

export const { loginPending, loginSuccess } = userSlice.actions;

export const selectIsLoggedIn = (state: RootState) => !!state.user.info.token;

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

export default {};
