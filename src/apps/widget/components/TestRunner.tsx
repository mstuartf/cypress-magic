import { useDispatch, useSelector } from "react-redux";
import {
  selectEvent,
  selectEventIdsSorted,
  selectIsRunningEventId,
  selectIsRunningResponses,
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
import { runAsync } from "../runner";
import {
  isNavigationEvent,
  isPageRefreshEvent,
  isRequestEvent,
  isResponseEvent,
} from "../utils";

const TestRunner = () => {
  const dispatch = useDispatch();
  const incrementOnLoad = useSelector(selectIsRunningStepIncrementOnLoad);
  const eventIds = useSelector(selectEventIdsSorted);
  const isRunningEventId = useSelector(selectIsRunningEventId)!;
  const event = useSelector(selectEvent(isRunningEventId));
  const runOptions = useSelector(selectRunOptions);
  const responses = useSelector(selectIsRunningResponses);
  const isMocked = useSelector(selectMockNetworkRequests);

  useEffect(() => {
    if (incrementOnLoad) {
      console.log(`updateRunStep for ${event.id}`);
      dispatch(updateRunStep());
    }
  }, []);

  useEffect(() => {
    if (incrementOnLoad) {
      return;
    }
    if (
      !isMocked &&
      !!event &&
      isResponseEvent(event) &&
      !responses.find(({ alias }) => alias === event.alias)
    ) {
      console.log(`Waiting for the network response for ${event.alias}...`);
      return;
    }
    if (isRunningEventId) {
      const timeout = isRequestEvent(event) || isResponseEvent(event) ? 0 : 500;
      setTimeout(() => {
        if (isNavigationEvent(event) || isPageRefreshEvent(event)) {
          dispatch(scheduleUpdateRunStep());
          runAsync(event, runOptions)
            .then(() => {
              console.log("navigating");
            })
            .catch((e: any) =>
              dispatch(setIsRunningError({ message: e.message }))
            );
        } else {
          runAsync(event, runOptions)
            .then(() => {
              console.log(`updateRunStep for ${event.id}`);
              dispatch(updateRunStep());
            })
            .catch((e: any) => {
              console.error(`setIsRunningError for ${event.id}`);
              dispatch(setIsRunningError({ message: e.message }));
            });
        }
      }, timeout);
    } else {
      dispatch(setIsRunning(false));
    }
  }, [event, incrementOnLoad, responses]);

  return null;
};

export default TestRunner;
