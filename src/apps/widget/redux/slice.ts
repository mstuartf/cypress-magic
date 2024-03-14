import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ParsedEvent,
  RequestEvent,
  ResponseEvent,
  UserEvent,
} from "../../../plugin/types";
import { widgetId } from "../constants";

interface State {
  events: ParsedEvent[];
  recordingInProgress?: boolean;
  hasRefreshed: boolean;
  baseUrl?: string;
}

const initialState: State = {
  events: [],
  recordingInProgress: undefined,
  hasRefreshed: false,
  baseUrl: undefined,
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
    setBaseUrl: (state, action: PayloadAction<string | undefined>) => {
      state.baseUrl = action.payload;
    },
    saveEvent: (state, action: PayloadAction<ParsedEvent>) => {
      if ((action.payload as UserEvent).target?.domPath) {
        const inWidget = (action.payload as UserEvent).target?.domPath.find(
          ({ id }) => id === widgetId
        );
        if (inWidget) {
          return;
        }
      }
      if ((action.payload as RequestEvent | ResponseEvent).url) {
        if (
          state.baseUrl &&
          !(action.payload as RequestEvent | ResponseEvent).url.startsWith(
            state.baseUrl
          )
        ) {
          console.log(
            `skipping event ${
              (action.payload as RequestEvent | ResponseEvent).url
            }`
          );
          return;
        }
      }
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
  setBaseUrl,
} = rootSlice.actions;
