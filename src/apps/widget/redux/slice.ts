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
  setupComplete: boolean;
  isRunning: boolean;
  isRunningEventId?: string;
  // When running navigation events in test mode, we can't increment the step once
  // the event has run. Schedule it to increment on load using this prop.
  isRunningStepIncrementOnLoad: boolean;
  // Count aliases from scratch when running in test mode.
  isRunningAliasTracker: AliasTracker;
  // When running (un-mocked) in test mode, record responses here (so we know when to cy.wait).
  isRunningReturnedResponses: ResponseEvent[];
  isRunningError?: {
    title: string;
    message: string;
  };
  hasRefreshed: boolean;
  baseUrl?: string;
  isAddingAssertion: boolean;
  mockNetworkRequests: boolean;
  fixtures: { [name: string]: PickledBlob };
  testDescribe?: string;
  testShould?: string;
  testBeforeEach?: string;
  aliasTracker: AliasTracker;
  isAddingCommands: boolean;
  isAddingEventIds: string[];
}

const initialState: State = {
  eventIds: [],
  events: {},
  setupComplete: false,
  isRunning: false,
  isRunningEventId: undefined,
  isRunningStepIncrementOnLoad: false,
  hasRefreshed: false,
  baseUrl: undefined,
  isAddingAssertion: false,
  mockNetworkRequests: true,
  fixtures: {},
  aliasTracker: {},
  isRunningAliasTracker: {},
  isRunningReturnedResponses: [],
  isRunningError: undefined,
  isAddingCommands: false,
  isAddingEventIds: [],
};

export const recordingSlice = createSlice({
  name: "recording",
  initialState: readCache<State>("recording") || initialState,
  reducers: {
    startNewTest: (state) => {
      state.setupComplete = true;
      state.isAddingCommands = true;
      state.isAddingEventIds = [];
      state.eventIds = [];
      state.events = {};
      state.fixtures = {};
      state.aliasTracker = {};
      state.isRunning = false;
      state.isRunningEventId = undefined;
      state.isRunningAliasTracker = {};
      state.isRunningReturnedResponses = [];
      state.isRunningError = undefined;
    },
    cancelTest: (state) => {
      state.setupComplete = false;
    },
    setIsRunning: (state, action: PayloadAction<boolean>) => {
      state.isRunning = action.payload;
      if (action.payload) {
        state.isRunningEventId = state.eventIds[0];
        state.isRunningAliasTracker = {};
        state.isRunningReturnedResponses = [];
        state.isRunningError = undefined;
      }
    },
    removeAddedCommands: (state) => {
      state.eventIds = state.eventIds.filter(
        (id) => !state.isAddingEventIds.includes(id)
      );
      state.events = Object.entries(state.events)
        .filter(([id, event]) => !state.isAddingEventIds.includes(id))
        .reduce(
          (prev, [id, event]) => ({
            ...prev,
            [id]: { ...event },
          }),
          {}
        );
    },
    setIsAddingCommands: (state, action: PayloadAction<boolean>) => {
      state.isAddingCommands = action.payload;
      if (action.payload) {
        state.isAddingEventIds = [];
      }
    },
    setIsRunningError: (
      state,
      action: PayloadAction<{ message: string; title: string }>
    ) => {
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
      state.events[event.id] = { ...event };
      // always store the event ids in order
      state.eventIds = [...state.eventIds, event.id]
        .map((id) => state.events[id])
        .sort((a, b) => a.timestamp - b.timestamp)
        .map(({ id }) => id);

      if (state.isAddingCommands) {
        state.isAddingEventIds = [...state.isAddingEventIds, event.id]
          .map((id) => state.events[id])
          .sort((a, b) => a.timestamp - b.timestamp)
          .map(({ id }) => id);
      }

      if (event.type === "assertion") {
        state.isAddingAssertion = false;
      }
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      state.eventIds = [...state.eventIds].filter(
        (id) => id !== action.payload
      );
      state.isAddingEventIds = [...state.isAddingEventIds].filter(
        (id) => id !== action.payload
      );
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
        testBeforeEach?: string;
        testDescribe: string;
        testShould: string;
      }>
    ) => {
      state.baseUrl = action.payload.baseUrl;
      state.testDescribe = action.payload.testDescribe;
      state.testShould = action.payload.testShould;
      state.testBeforeEach = action.payload.testBeforeEach;
    },
    updateRunStep: (state) => {
      state.isRunningEventId =
        state.eventIds[state.eventIds.indexOf(state.isRunningEventId!) + 1];
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
  startNewTest,
  setIsAddingCommands,
  removeAddedCommands,
  cancelTest,
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
