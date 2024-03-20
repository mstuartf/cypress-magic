import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ParsedEvent } from "../../../plugin/types";
import { readCache } from "../cache";
import { isDblClickEvent } from "../utils";

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
      if (isDblClickEvent(event)) {
        // remove the two last events (the click events)
        const toRemove = state.eventIds.slice(-2);
        state.eventIds = [...state.eventIds].filter(
          (id) => !toRemove.includes(id)
        );
        toRemove.forEach((id) => delete state.events[id]);
      }
      state.eventIds = [...state.eventIds, event.id];
      state.events[event.id] = { ...event };
      if (event.type === "assertion") {
        state.isAddingAssertion = false;
      }
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      state.eventIds = [...state.eventIds].filter((id) => id != action.payload);
      delete state.events[action.payload];
    },
    updateEvent: (state, action: PayloadAction<ParsedEvent>) => {
      state.events[action.payload.id] = {
        ...state.events[action.payload.id],
        ...action.payload,
      };
    },
  },
});

export const {
  saveEvent,
  setRecordingInProgress,
  setHasRefreshed,
  setBaseUrl,
  setIsAddingAssertion,
  deleteEvent,
  updateEvent,
} = recordingSlice.actions;
