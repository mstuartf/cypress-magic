import { useDispatch, useSelector } from "react-redux";
import {
  selectEvent,
  selectIsRunningEventId,
  selectIsRunningStepIncrementOnLoad,
  selectMockNetworkRequests,
  selectRunOptions,
} from "../redux/selectors";
import { useEffect } from "react";
import {
  scheduleUpdateRunStep,
  setIsRunning,
  setIsRunningError,
  updateRunStep,
} from "../redux/slice";
import { runEvent, timeout, withRetries } from "../runner";
import {
  isNavigationEvent,
  isPageRefreshEvent,
  isRequestEvent,
  isResponseEvent,
} from "../utils";
import { store } from "../redux/store";

const TestRunner = () => {
  const dispatch = useDispatch();
  const incrementOnLoad = useSelector(selectIsRunningStepIncrementOnLoad);
  const isRunningEventId = useSelector(selectIsRunningEventId)!;
  const event = useSelector(selectEvent(isRunningEventId));
  const runOptions = useSelector(selectRunOptions);
  const isMocked = useSelector(selectMockNetworkRequests);

  useEffect(() => {
    console.log("rendering");
    if (incrementOnLoad) {
      dispatch(updateRunStep());
    }
  }, []);

  useEffect(() => {
    if (incrementOnLoad) {
      return;
    }
    if (!isMocked && !!event && isResponseEvent(event)) {
      withRetries(() => {
        const responses = store.getState().recording.isRunningReturnedResponses;
        if (!responses.find(({ alias }) => alias === event.alias)) {
          throw Error(
            `Timed out retrying after ${timeout}ms: cy.wait() timed out waiting ${timeout}ms for the 1st request to the route: ${event.alias}. No request ever occurred.`
          );
        }
      })
        .then(() => dispatch(updateRunStep()))
        .catch((e: any) =>
          dispatch(
            setIsRunningError({ message: e.message, title: "CypressError" })
          )
        );
      return;
    }
    if (isRunningEventId) {
      const timeout = isRequestEvent(event) || isResponseEvent(event) ? 0 : 500;
      setTimeout(() => {
        if (isNavigationEvent(event) || isPageRefreshEvent(event)) {
          dispatch(scheduleUpdateRunStep());
          withRetries(() => runEvent(event, runOptions))
            .then(() => {})
            .catch((e: any) =>
              dispatch(
                setIsRunningError({
                  message: e.message,
                  title: "AssertionError",
                })
              )
            );
        } else {
          withRetries(() => runEvent(event, runOptions))
            .then(() => {
              dispatch(updateRunStep());
            })
            .catch((e: any) => {
              dispatch(
                setIsRunningError({
                  message: e.message,
                  title: "AssertionError",
                })
              );
            });
        }
      }, timeout);
    } else {
      dispatch(setIsRunning(false));
    }
  }, [event, incrementOnLoad]);

  return null;
};

export default TestRunner;
