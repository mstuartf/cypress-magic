import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AssertionEvent,
  ParsedEvent,
  RequestEvent,
  ResponseEvent,
  UserEvent,
} from "../../../plugin/types";
import { widgetId } from "../constants";
import { isClickEvent, isRequestOrResponseEvent, isUserEvent } from "../utils";
import { assertionOverlayId } from "../AddAssertion";

interface State {
  events: ParsedEvent[];
  recordingInProgress?: boolean;
  hasRefreshed: boolean;
  baseUrl?: string;
  isAddingAssertion: boolean;
}

const initialState: State = {
  events: [],
  recordingInProgress: undefined,
  hasRefreshed: false,
  baseUrl: undefined,
  isAddingAssertion: false,
};

export const rootSlice = createSlice({
  name: "root",
  initialState,
  reducers: {
    setRecordingInProgress: (state, action: PayloadAction<boolean>) => {
      state.recordingInProgress = action.payload;
      state.hasRefreshed = false;
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
} = rootSlice.actions;
