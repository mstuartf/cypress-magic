import { WidgetRootState } from "./store";
import { isResponseEvent, toCamelCase } from "../utils";
import { ResponseEvent } from "../../../plugin/types";

export const selectEventsSorted = (state: WidgetRootState) =>
  state.recording.eventIds.map((id) => state.recording.events[id]);

export const selectEventIdsSorted = (state: WidgetRootState) =>
  state.recording.eventIds;

export const selectEvent = (id: string) => (state: WidgetRootState) =>
  state.recording.events[id];
export const selectRecordingInProgress = (state: WidgetRootState) =>
  state.recording.recordingInProgress;
export const selectIsRunning = (state: WidgetRootState) =>
  state.recording.isRunning;
export const selectIsRunningStep = (state: WidgetRootState) =>
  state.recording.isRunningStep;
export const selectIsRunningEventId = (state: WidgetRootState) => {
  const { isRunningStep, eventIds } = state.recording;
  return eventIds[isRunningStep];
};
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
export const selectBaseUrl = ({ recording: { baseUrl } }: WidgetRootState) =>
  baseUrl;
export const selectIsRunningResponses = ({
  recording: { isRunningReturnedResponses },
}: WidgetRootState) => isRunningReturnedResponses;
export const selectMockNetworkInTests = ({
  recording: { mockNetworkRequests, isRunning },
}: WidgetRootState) => mockNetworkRequests && isRunning;
export const selectMockedResponse =
  (alias: string) =>
  ({ recording: { events, fixtures } }: WidgetRootState) => {
    const { status, statusText, fixture } = Object.values(events)
      .filter((event): event is ResponseEvent => isResponseEvent(event))
      .find(({ alias: _alias }) => alias === _alias)!;
    const content = fixtures[fixture!];
    return {
      status,
      statusText,
      content,
    };
  };
export const selectRunError = ({
  recording: { isRunningError },
}: WidgetRootState) => isRunningError;
