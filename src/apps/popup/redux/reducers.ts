import { combineReducers } from "@reduxjs/toolkit";
import { baseSlice } from "./slice";

export const rootReducer = combineReducers({
  base: baseSlice.reducer,
});
