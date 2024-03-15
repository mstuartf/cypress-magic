import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
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
      if (isUserEvent(event)) {
        const inWidget = event.target.domPath.find(({ id }) => id === widgetId);
        if (inWidget) {
          if (
            isClickEvent(event) &&
            event.target.domPath.length &&
            event.target.domPath[event.target.domPath.length - 1].id ===
              assertionOverlayId
          ) {
            const elementUnderneath = document.elementsFromPoint(
              event.offsetX,
              event.offsetY
            )[1];
            // todo: build click event on this element
            console.log(elementUnderneath);
            state.isAddingAssertion = false;
          } else {
            return;
          }
        }
      }
      if (isRequestOrResponseEvent(event)) {
        if (state.baseUrl && !event.url.startsWith(state.baseUrl)) {
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
