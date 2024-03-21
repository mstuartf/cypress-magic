import { WidgetRootState } from "./store";
import { toCamelCase } from "../utils";

export const selectEventsSorted = (state: WidgetRootState) =>
  state.recording.eventIds
    .map((id) => state.recording.events[id])
    .sort((a, b) => a.timestamp - b.timestamp);

export const selectEventIdsSorted = (state: WidgetRootState) =>
  selectEventsSorted(state).map(({ id }) => id);

export const selectEvent = (id: string) => (state: WidgetRootState) =>
  state.recording.events[id];
export const selectRecordingInProgress = (state: WidgetRootState) =>
  state.recording.recordingInProgress;
export const selectIsRunning = (state: WidgetRootState) =>
  state.recording.isRunning;
export const selectIsRunningStep = (state: WidgetRootState) =>
  state.recording.isRunningStep;
export const selectIsRunningStepIncrementOnLoad = (state: WidgetRootState) =>
  state.recording.isRunningStepIncrementOnLoad;
export const selectHasRefreshed = (state: WidgetRootState) =>
  state.recording.hasRefreshed;
export const selectIsAddingAssertion = (state: WidgetRootState) =>
  state.recording.isAddingAssertion;
export const selectMockNetworkRequests = (state: WidgetRootState) =>
  state.recording.mockNetworkRequests;
export const selectFixtures = (state: WidgetRootState) =>
  Object.entries(state.recording.fixtures);
export const selectTestDescribe = (state: WidgetRootState) =>
  state.recording.testDescribe;
export const selectTestShould = (state: WidgetRootState) =>
  state.recording.testShould;
export const selectParseOptions = ({
  recording: { mockNetworkRequests, testDescribe },
}: WidgetRootState) => ({
  mockNetworkRequests,
  nestedFixtureFolder: toCamelCase(testDescribe as string),
});
export const selectRunOptions = ({
  recording: { mockNetworkRequests },
}: WidgetRootState) => ({
  mockNetworkRequests,
});
