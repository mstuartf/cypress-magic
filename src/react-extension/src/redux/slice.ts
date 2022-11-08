import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
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
