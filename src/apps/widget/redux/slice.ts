import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ParsedEvent } from "../../../plugin/types";
import { readCache } from "../cache";

interface State {
  events: ParsedEvent[];
  recordingInProgress: boolean;
  hasRefreshed: boolean;
  baseUrl?: string;
  isAddingAssertion: boolean;
}

const initialState: State = {
  events: [],
  recordingInProgress: false,
  hasRefreshed: false,
  baseUrl: undefined,
  isAddingAssertion: false,
};

export const recordingSlice = createSlice({
  name: "recording",
  initialState: readCache<State>("recording") || initialState,
  reducers: {
    setRecordingInProgress: (state, action: PayloadAction<boolean>) => {
      state.recordingInProgress = action.payload;
      if (action.payload) {
        state.events = [];
      }
    },
    setIsAddingAssertion: (state, action: PayloadAction<boolean>) => {
      state.isAddingAssertion = action.payload;
    },
    setHasRefreshed: (state, action: PayloadAction<boolean>) => {
      state.hasRefreshed = action.payload;
    },
    setBaseUrl: (state, action: PayloadAction<string | undefined>) => {
      state.baseUrl = action.payload;
    },
    saveEvent: (state, action: PayloadAction<ParsedEvent>) => {
      let event = action.payload;
      state.events = [...state.events, event].sort(
        (a, b) => a.timestamp - b.timestamp
      );
      if (event.type === "assertion") {
        state.isAddingAssertion = false;
      }
    },
  },
});

export const {
  saveEvent,
  setRecordingInProgress,
  setHasRefreshed,
  setBaseUrl,
  setIsAddingAssertion,
} = recordingSlice.actions;
