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
      if ((event as UserEvent).target?.domPath) {
        const inWidget = (event as UserEvent).target?.domPath.find(
          ({ id }) => id === widgetId
        );
        if (inWidget) {
          return;
        }
        if (event.type === "click" && state.isAddingAssertion) {
          event = {
            ...event,
            type: "assertion",
          };
          state.isAddingAssertion = false;
        }
      }
      if ((event as RequestEvent | ResponseEvent).url) {
        if (
          state.baseUrl &&
          !(event as RequestEvent | ResponseEvent).url.startsWith(state.baseUrl)
        ) {
          return;
        }
      }
      state.events.push(event);
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
  setIsAddingAssertion,
} = rootSlice.actions;
