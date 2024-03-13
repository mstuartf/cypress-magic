import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ParsedEvent } from "../plugin/types";

interface State {
  isActive: boolean;
  cacheLoaded: boolean;
  events: ParsedEvent[];
}

const initialState: State = {
  isActive: false,
  cacheLoaded: false,
  events: [],
};

export const rootSlice = createSlice({
  name: "root",
  initialState,
  reducers: {
    restoreCache: (state, action) => {
      if (action.payload) {
        state.isActive = { ...action.payload.isActive };
      }
      state.cacheLoaded = true;
    },
    startRecording: (state) => {
      state.isActive = true;
      state.events = [];
    },
    stopRecording: (state) => {
      state.isActive = false;
    },
    saveEvent: (state, action: PayloadAction<ParsedEvent>) => {
      console.log(action.payload);
      state.events.push(action.payload);
    },
  },
});

export const { restoreCache, stopRecording, startRecording, saveEvent } =
  rootSlice.actions;
