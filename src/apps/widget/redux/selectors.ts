import { WidgetRootState } from "./store";
import { isNavigationEvent, isResponseEvent, toCamelCase } from "../utils";
import { ResponseEvent } from "../../../plugin/types";

export const selectEventsSorted = (state: WidgetRootState) =>
  state.recording.eventIds.map((id) => state.recording.events[id]);

export const selectEventIdsSorted = (state: WidgetRootState) =>
  state.recording.eventIds;

export const selectEvent = (id: string) => (state: WidgetRootState) =>
  state.recording.events[id];

export const selectFirstNavEvent = ({
  recording: { events, eventIds },
}: WidgetRootState) => {
  return eventIds
    .map((id) => events[id])
    .find((event) => isNavigationEvent(event));
};

export const selectMissedRequests = ({
  recording: { missedRequests },
}: WidgetRootState) => missedRequests;

export const selectSetupComplete = (state: WidgetRootState) =>
  state.recording.setupComplete;
export const selectIsRunning = (state: WidgetRootState) =>
  state.recording.isRunning;
export const selectIsRunningEventId = (state: WidgetRootState) =>
  state.recording.isRunningEventId;
export const selectIsRunningStepIncrementOnLoad = (state: WidgetRootState) =>
  state.recording.isRunningStepIncrementOnLoad;
export const selectHasRefreshed = (state: WidgetRootState) =>
  state.recording.hasRefreshed;
export const selectIsAddingAssertion = (state: WidgetRootState) =>
  state.recording.isAddingAssertion;
export const selectIsSelectingAssertion = (state: WidgetRootState) =>
  state.recording.isSelectingAssertion;
export const selectMockNetworkRequests = (state: WidgetRootState) =>
  state.recording.mockNetworkRequests;
export const selectFixtures = (state: WidgetRootState) =>
  Object.entries(state.recording.fixtures);
export const selectTestDescribe = (state: WidgetRootState) =>
  state.recording.testDescribe;
export const selectTestFileName = (state: WidgetRootState) => {
  const { mockNetworkRequests, testDescribe } = state.recording;
  return `${toCamelCase(testDescribe!)}${mockNetworkRequests ? "Stubbed" : ""}`;
};
export const selectTestFolderName = (state: WidgetRootState) => {
  const { testDescribe } = state.recording;
  return `${toCamelCase(testDescribe!)}`;
};
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
export const selectIsAddingCommands = ({
  recording: { isAddingCommands },
}: WidgetRootState) => isAddingCommands;
export const selectIsAddingEventIds = ({
  recording: { isAddingEventIds },
}: WidgetRootState) => isAddingEventIds;
export const selectCanCancelAddingCommands = ({
  recording: { eventIds, isAddingEventIds },
}: WidgetRootState) => eventIds.length > isAddingEventIds.length;
export const selectBeforeEach = ({
  recording: { testBeforeEach },
}: WidgetRootState) => testBeforeEach;
