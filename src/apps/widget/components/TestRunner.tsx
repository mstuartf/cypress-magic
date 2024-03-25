import { useDispatch, useSelector } from "react-redux";
import {
  selectEvent,
  selectEventIdsSorted,
  selectIsRunningResponses,
  selectIsRunningStep,
  selectIsRunningStepIncrementOnLoad,
  selectMockNetworkRequests,
  selectRunOptions,
} from "../redux/selectors";
import { useEffect, useState } from "react";
import {
  scheduleUpdateRunStep,
  setIsRunning,
  updateRunStep,
} from "../redux/slice";
import { run } from "../runner";
import {
  isNavigationEvent,
  isPageRefreshEvent,
  isRequestEvent,
  isResponseEvent,
} from "../utils";

const TestRunner = () => {
  const dispatch = useDispatch();
  const step = useSelector(selectIsRunningStep);
  const incrementOnLoad = useSelector(selectIsRunningStepIncrementOnLoad);
  const eventIds = useSelector(selectEventIdsSorted);
  const event = useSelector(selectEvent(eventIds[step]));
  const runOptions = useSelector(selectRunOptions);
  const responses = useSelector(selectIsRunningResponses);
  const isMocked = useSelector(selectMockNetworkRequests);

  useEffect(() => {
    if (incrementOnLoad) {
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
    if (step < eventIds.length) {
      const timeout = isRequestEvent(event) || isResponseEvent(event) ? 0 : 500;
      setTimeout(() => {
        if (isNavigationEvent(event) || isPageRefreshEvent(event)) {
          dispatch(scheduleUpdateRunStep());
          run(event, runOptions);
        } else {
          run(event, runOptions);
          dispatch(updateRunStep());
        }
      }, timeout);
    } else {
      dispatch(setIsRunning(false));
    }
  }, [event, incrementOnLoad, responses]);

  return null;
};

export default TestRunner;
