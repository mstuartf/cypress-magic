import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ParsedEvent } from "../../../plugin/types";

interface State {
  events: ParsedEvent[];
  recordingInProgress?: boolean;
}

const initialState: State = {
  events: [],
  recordingInProgress: undefined,
};

export const rootSlice = createSlice({
  name: "root",
  initialState,
  reducers: {
    setRecordingInProgress: (state, action: PayloadAction<boolean>) => {
      state.recordingInProgress = action.payload;
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

export const { saveEvent, removeEvent, setRecordingInProgress } =
  rootSlice.actions;
