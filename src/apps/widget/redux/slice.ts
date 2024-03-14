import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ParsedEvent } from "../../../plugin/types";

interface State {
  events: ParsedEvent[];
}

const initialState: State = {
  events: [],
};

export const rootSlice = createSlice({
  name: "root",
  initialState,
  reducers: {
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

export const { saveEvent, removeEvent } = rootSlice.actions;
