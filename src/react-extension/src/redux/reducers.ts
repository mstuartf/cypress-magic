import { combineReducers } from "@reduxjs/toolkit";
import { userSlice } from "./slice";

export const rootReducer = combineReducers({
  user: userSlice.reducer,
});
