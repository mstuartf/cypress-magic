import { combineReducers } from "@reduxjs/toolkit";
import { rootSlice } from "./slice";

export const rootReducer = combineReducers({
  root: rootSlice.reducer,
});
