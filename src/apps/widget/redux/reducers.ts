import { combineReducers } from "@reduxjs/toolkit";
import { recordingSlice } from "./slice";

export const widgetRootReducer = combineReducers({
  [recordingSlice.name]: recordingSlice.reducer,
});
