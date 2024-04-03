import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ParsedEvent,
  RequestEvent,
  ResponseEvent,
} from "../../../plugin/types";
import { readCache } from "../cache";
import { isDblClickEvent, isResponseEvent } from "../utils";
import { AliasTracker } from "../../../plugin/utils/aliases";
import { PickledBlob } from "../../../plugin/utils/pickleBlob";

interface State {
  eventIds: string[];
  events: { [id: string]: ParsedEvent };
  recordingInProgress: boolean;
  isRunning: boolean;
  isRunningStep: number;
  // When running navigation events in test mode, we can't increment the step once
  // the event has run. Schedule it to increment on load using this prop.
  isRunningStepIncrementOnLoad: boolean;
  // Count aliases from scratch when running in test mode.
  isRunningAliasTracker: AliasTracker;
  // When running (un-mocked) in test mode, record responses here (so we know when to cy.wait).
  isRunningReturnedResponses: ResponseEvent[];
  isRunningError?: {
    message: string;
  };
  hasRefreshed: boolean;
  baseUrl?: string;
  isAddingAssertion: boolean;
  mockNetworkRequests: boolean;
  fixtures: { [name: string]: PickledBlob };
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
  isRunningAliasTracker: {},
  isRunningReturnedResponses: [],
  isRunningError: undefined,
};

export const recordingSlice = createSlice({
  name: "recording",
  initialState: readCache<State>("recording") || initialState,
  reducers: {
    setRecordingInProgress: (state, action: PayloadAction<boolean>) => {
      state.recordingInProgress = action.payload;
      state.eventIds = [];
      state.events = {};
      state.fixtures = {};
      state.aliasTracker = {};
      state.isRunning = false;
      state.isRunningStep = 0;
      state.isRunningAliasTracker = {};
      state.isRunningReturnedResponses = [];
      state.isRunningError = undefined;
    },
    setIsRunning: (state, action: PayloadAction<boolean>) => {
      state.isRunning = action.payload;
      if (action.payload) {
        state.isRunningStep = 0;
        state.isRunningAliasTracker = {};
        state.isRunningReturnedResponses = [];
        state.isRunningError = undefined;
      }
    },
    setIsRunningError: (state, action: PayloadAction<{ message: string }>) => {
      state.isRunning = false;
      state.isRunningError = { ...action.payload };
    },
    saveIsRunningResponse: (
      state,
      { payload }: PayloadAction<ResponseEvent>
    ) => {
      state.isRunningReturnedResponses = [
        ...state.isRunningReturnedResponses,
        payload,
      ];
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
      // todo: delete from aliasTracker?
    },
    setMockNetworkRequests: (state, action: PayloadAction<boolean>) => {
      state.mockNetworkRequests = action.payload;
    },
    saveFixture: (
      state,
      {
        payload: { name, pickle },
      }: PayloadAction<{ name: string; pickle: PickledBlob }>
    ) => {
      state.fixtures[name] = pickle;
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
    updateIsRunningAliasTracker: (
      state,
      action: PayloadAction<AliasTracker>
    ) => {
      state.isRunningAliasTracker = { ...action.payload };
    },
  },
});

export const {
  saveEvent,
  setRecordingInProgress,
  setHasRefreshed,
  setIsAddingAssertion,
  deleteEvent,
  setMockNetworkRequests,
  saveFixture,
  setupTest,
  setIsRunning,
  updateRunStep,
  scheduleUpdateRunStep,
  updateAliasTracker,
  updateIsRunningAliasTracker,
  saveIsRunningResponse,
  setIsRunningError,
} = recordingSlice.actions;
