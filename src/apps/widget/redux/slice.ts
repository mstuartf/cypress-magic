import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ParsedEvent } from "../../../plugin/types";
import { readCache } from "../cache";

interface State {
  eventIds: string[];
  events: { [id: string]: ParsedEvent };
  recordingInProgress: boolean;
  hasRefreshed: boolean;
  baseUrl?: string;
  isAddingAssertion: boolean;
}

const initialState: State = {
  eventIds: [],
  events: {},
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
        state.eventIds = [];
        state.events = {};
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
      state.eventIds = [...state.eventIds, event.id];
      state.events[event.id] = { ...event };
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
