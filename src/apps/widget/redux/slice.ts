import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ParsedEvent, RequestEvent } from "../../../plugin/types";
import { readCache } from "../cache";
import { isDblClickEvent, isResponseEvent } from "../utils";
import { AliasTracker } from "../../../plugin/utils/aliases";

interface State {
  eventIds: string[];
  events: { [id: string]: ParsedEvent };
  recordingInProgress: boolean;
  isRunning: boolean;
  isRunningStep: number;
  // When running navigation events in test mode, we can't increment the step once
  // the event has run. Schedule it to increment on load using this prop.
  isRunningStepIncrementOnLoad: boolean;
  hasRefreshed: boolean;
  baseUrl?: string;
  isAddingAssertion: boolean;
  mockNetworkRequests: boolean;
  fixtures: { [name: string]: Blob };
  testDescribe?: string;
  testShould?: string;
  aliasTracker: AliasTracker;
}

const initialState: State = {
  eventIds: [],
  events: {},
  recordingInProgress: false,
  isRunning: false,
  isRunningStep: 0,
  isRunningStepIncrementOnLoad: false,
  hasRefreshed: false,
  baseUrl: undefined,
  isAddingAssertion: false,
  mockNetworkRequests: false,
  fixtures: {},
  aliasTracker: {},
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
        state.fixtures = {};
        state.isRunning = false;
        state.isRunningStep = 0;
      }
    },
    setIsRunning: (state, action: PayloadAction<boolean>) => {
      state.isRunning = action.payload;
      state.isRunningStep = 0;
    },
    setIsAddingAssertion: (state, action: PayloadAction<boolean>) => {
      state.isAddingAssertion = action.payload;
    },
    setHasRefreshed: (state, action: PayloadAction<boolean>) => {
      state.hasRefreshed = action.payload;
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
      if (isResponseEvent(event)) {
        state.events[event.requestId] = {
          ...(state.events[event.requestId] as RequestEvent),
          fixture: event.fixture || undefined,
          status: event.status,
        };
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
    setMockNetworkRequests: (state, action: PayloadAction<boolean>) => {
      state.mockNetworkRequests = action.payload;
    },
    saveFixture: (
      state,
      action: PayloadAction<{ name: string; value: Blob }>
    ) => {
      state.fixtures[action.payload.name] = action.payload.value;
    },
    setupTest: (
      state,
      action: PayloadAction<{
        baseUrl?: string;
        testDescribe: string;
        testShould: string;
      }>
    ) => {
      state.baseUrl = action.payload.baseUrl;
      state.testDescribe = action.payload.testDescribe;
      state.testShould = action.payload.testShould;
    },
    updateRunStep: (state) => {
      state.isRunningStep = state.isRunningStep + 1;
      state.isRunningStepIncrementOnLoad = false;
    },
    scheduleUpdateRunStep: (state) => {
      state.isRunningStepIncrementOnLoad = true;
    },
    updateAliasTracker: (state, action: PayloadAction<AliasTracker>) => {
      state.aliasTracker = { ...action.payload };
    },
  },
});

export const {
  saveEvent,
  setRecordingInProgress,
  setHasRefreshed,
  setIsAddingAssertion,
  deleteEvent,
  updateEvent,
  setMockNetworkRequests,
  saveFixture,
  setupTest,
  setIsRunning,
  updateRunStep,
  scheduleUpdateRunStep,
  updateAliasTracker,
} = recordingSlice.actions;
