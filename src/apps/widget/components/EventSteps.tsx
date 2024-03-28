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
  isResponseEvent,
} from "../utils";
import { parseSelector } from "../parser/parseSelector";
import { useSelector } from "react-redux";
import { selectIsRunning, selectIsRunningEventId } from "../redux/selectors";

const EventSteps = ({ event }: { event: ParsedEvent }) => {
  const isRunningEventId = useSelector(selectIsRunningEventId);
  const isRunning = useSelector(selectIsRunning);
  return (
    <>
      {getEventSteps(event).map(({ children }, i) => (
        <Step isRunning={isRunningEventId === event.id && !i && isRunning}>
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

const getEventSteps = (event: ParsedEvent): IStep[] => {
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
            <span>{parseSelector(event.target.domPath)}</span>
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
            <span>{parseSelector(event.target.domPath)}</span>
          </span>
        ),
      },
      {
        // todo: show more element details like cypress
        children: event.target.innerText ? (
          <Assertion
            value={parseSelector(event.target.domPath)}
            operator="to contain"
            comparator={event.target.innerText}
          />
        ) : (
          <Assertion
            value={parseSelector(event.target.domPath)}
            operator="to"
            comparator="exist"
          />
        ),
      },
    ];
  }

  if (isResponseEvent(event)) {
    return [
      {
        children: (
          <span>
            <DefaultLabel text="wait" />
            <span className="cyw-px-1 cyw-py-0.5 cyw-rounded cyw-bg-purple-700 cyw-text-white cyw-font-light">
              @{event.alias}
            </span>
          </span>
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
      // return `${getElementCy(event.target.domPath)}.select('${event.value}');`;
    } else if (event.target.tag === "INPUT" && event.target.type === "radio") {
      // return `${getElementCy(event.target.domPath)}.check();`;
    } else {
      return [
        {
          children: (
            <span>
              <DefaultLabel text="get" />
              <span>{parseSelector(event.target.domPath)}</span>
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

  return [];
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
}: {
  value: string;
  operator: string;
  comparator: string;
}) => (
  <span>
    <span className="cyw-break-keep cyw-mr-2">
      <span className="cyw-text-emerald-500">-</span>
      <span className="cyw-bg-emerald-500 cyw-text-gray-900 cyw-px-1 cyw-rounded">
        assert
      </span>
    </span>
    <span className="cyw-text-emerald-300 cyw-break-keep">expected&nbsp;</span>
    <span className="cyw-text-emerald-200">{value}&nbsp;</span>
    <span className="cyw-text-emerald-300 cyw-break-keep">
      {operator}&nbsp;
    </span>
    <span className="cyw-text-emerald-200">{comparator}</span>
  </span>
);
