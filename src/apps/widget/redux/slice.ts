import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ParsedEvent } from "../../../plugin/types";

interface State {
  events: ParsedEvent[];
  recordingInProgress?: boolean;
  hasRefreshed: boolean;
}

const initialState: State = {
  events: [],
  recordingInProgress: undefined,
  hasRefreshed: false,
};

export const rootSlice = createSlice({
  name: "root",
  initialState,
  reducers: {
    setRecordingInProgress: (state, action: PayloadAction<boolean>) => {
      state.recordingInProgress = action.payload;
      state.hasRefreshed = false;
    },
    setHasRefreshed: (state, action: PayloadAction<boolean>) => {
      state.hasRefreshed = action.payload;
    },
    saveEvent: (state, action: PayloadAction<ParsedEvent>) => {
      state.events.push(action.payload);
    },
    removeEvent: (state, action: PayloadAction<ParsedEvent>) => {
      state.events = [
        ...state.events.filter(
          ({ timestamp }) => timestamp != action.payload.timestamp
        ),
      ];
    },
  },
});

export const {
  saveEvent,
  removeEvent,
  setRecordingInProgress,
  setHasRefreshed,
} = rootSlice.actions;
