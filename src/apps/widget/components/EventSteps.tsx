import React from "react";
import Step from "./Step";
import { ParsedEvent } from "../../../plugin/types";
import {
  buildFullUrl,
  isAssertionEvent,
  isChangeEvent,
  isClickEvent,
  isNavigationEvent,
  isPageRefreshEvent,
  isQueryParamChangeEvent,
  isRequestEvent,
  isResponseEvent,
} from "../utils";
import { useSelector } from "react-redux";
import {
  selectEventIdsSorted,
  selectIsRunning,
  selectIsRunningEventId,
  selectRunError,
} from "../redux/selectors";
import Alias from "./Alias";
import { parseSelector } from "../parser/parseSelector";

const EventSteps = ({ event }: { event: ParsedEvent }) => {
  const isRunningEventId = useSelector(selectIsRunningEventId);
  const runError = useSelector(selectRunError);
  const isRunning = useSelector(selectIsRunning);
  const eventIds = useSelector(selectEventIdsSorted);
  const completeEventIds = eventIds.slice(
    0,
    isRunningEventId ? eventIds.indexOf(isRunningEventId) : 0
  );
  // only show the first step until completed (as this is the one that can fail)
  const allSteps = getEventSteps(
    event,
    !!runError && event.id === isRunningEventId
  );
  const stepsToShow =
    completeEventIds.includes(event.id) || !isRunning
      ? allSteps
      : allSteps.slice(0, 1);
  return (
    <>
      {stepsToShow.map(({ children }, i) => (
        <Step isRunning={isRunningEventId === event.id && isRunning}>
          {children}
        </Step>
      ))}
    </>
  );
};

export default EventSteps;

interface IStep {
  children: React.ReactNode;
}

const getEventSteps = (event: ParsedEvent, error: boolean): IStep[] => {
  if (isNavigationEvent(event)) {
    return [
      {
        children: (
          <span>
            <DefaultLabel text="visit" />
            <span>{buildFullUrl(event)}</span>
          </span>
        ),
      },
    ];
  }

  if (isClickEvent(event)) {
    return [
      {
        children: (
          <span>
            <DefaultLabel text="get" />
            <span>{parseSelector(event.target)}</span>
          </span>
        ),
      },
      {
        children: <DefaultLabel text="-click" />,
      },
    ];
  }

  if (isQueryParamChangeEvent(event)) {
    const { param, changed, added, removed } = event;
    let operator;
    let comparator;
    if (changed) {
      operator = `to include`;
      comparator = `${param}=${changed}`;
    } else if (added) {
      operator = `to include`;
      comparator = `${param}=${added}`;
    } else {
      operator = `not to include`;
      comparator = `${param}=${removed}`;
    }
    return [
      {
        children: <DefaultLabel text="url" />,
      },
      {
        children: (
          <Assertion
            value={buildFullUrl(event)}
            operator={operator}
            comparator={comparator}
            success={!error}
          />
        ),
      },
    ];
  }

  if (isAssertionEvent(event)) {
    return [
      {
        children: (
          <span>
            <DefaultLabel text="get" />
            <span>
              {parseSelector(event.target, {
                ignoreInnerText: !!event.target.innerText,
              })}
            </span>
          </span>
        ),
      },
      {
        // todo: show more element details like cypress
        children: event.target.innerText ? (
          <Assertion
            value={parseSelector(event.target, { ignoreInnerText: true })}
            operator="to contain"
            comparator={event.target.innerText}
            success={!error}
          />
        ) : (
          <Assertion
            value={parseSelector(event.target)}
            operator="to"
            comparator="exist"
            success={!error}
          />
        ),
      },
    ];
  }

  if (isResponseEvent(event)) {
    return [
      {
        children: (
          <div className="cyw-flex cyw-items-start">
            <DefaultLabel text="wait" />
            <Alias text={`@${event.alias}`} />
          </div>
        ),
      },
    ];
  }
  if (isPageRefreshEvent(event)) {
    return [
      {
        children: <DefaultLabel text="reload" />,
      },
    ];
  }

  if (isChangeEvent(event)) {
    if (event.target.tag === "SELECT") {
      return [
        {
          children: (
            <span>
              <DefaultLabel text="get" />
              <span>{parseSelector(event.target)}</span>
            </span>
          ),
        },
        {
          children: (
            <span>
              <DefaultLabel text="-select" />
              <span>{event.value}</span>
            </span>
          ),
        },
      ];
    } else if (event.target.tag === "INPUT" && event.target.type === "radio") {
      return [
        {
          children: (
            <span>
              <DefaultLabel text="get" />
              <span>{parseSelector(event.target)}</span>
            </span>
          ),
        },
        {
          children: <DefaultLabel text="-check" />,
        },
      ];
    } else if (
      event.target.tag === "INPUT" &&
      event.target.type === "checkbox"
    ) {
      return [
        {
          children: (
            <span>
              <DefaultLabel text="get" />
              <span>{parseSelector(event.target)}</span>
            </span>
          ),
        },
        {
          children: (
            <DefaultLabel
              text={`-${event.target.checked ? "check" : "uncheck"}`}
            />
          ),
        },
      ];
    } else {
      return [
        {
          children: (
            <span>
              <DefaultLabel text="get" />
              <span>{parseSelector(event.target)}</span>
            </span>
          ),
        },
        {
          children: <DefaultLabel text="-clear" />,
        },
        {
          children: (
            <span>
              <DefaultLabel text="-type" />
              <span>{event.value}</span>
            </span>
          ),
        },
      ];
    }
  }

  if (isRequestEvent(event)) {
    return [];
  }

  return [
    {
      children: event.type,
    },
  ];
};

const DefaultLabel = ({ text }: { text: string }) => (
  <span className="cyw-break-keep cyw-text-slate-100 cyw-font-semibold cyw-mr-4">
    {text}
  </span>
);

const Assertion = ({
  value,
  operator,
  comparator,
  success,
}: {
  value: string;
  operator: string;
  comparator: string;
  success: boolean;
}) => (
  <span>
    <span className="cyw-break-keep cyw-mr-2">
      <span className={success ? `cyw-text-emerald-500` : `cyw-text-red-500`}>
        -
      </span>
      <span
        className={`${
          success ? "cyw-bg-emerald-500" : "cyw-bg-red-500"
        } cyw-text-gray-900 cyw-px-1 cyw-rounded`}
      >
        assert
      </span>
    </span>
    <span
      className={`${
        success ? "cyw-text-emerald-300" : "cyw-text-red-300"
      } cyw-break-keep`}
    >
      expected&nbsp;
    </span>
    <span
      className={`${success ? "cyw-text-emerald-200" : "cyw-text-red-200"}`}
    >
      {value}&nbsp;
    </span>
    <span
      className={`${
        success ? "cyw-text-emerald-300" : "cyw-text-red-300"
      } cyw-break-keep`}
    >
      {operator}&nbsp;
    </span>
    <span className={success ? "cyw-text-emerald-200" : "cyw-text-red-200"}>
      {comparator}
    </span>
  </span>
);
