import React from "react";
import Step from "./Step";
import { ParsedEvent } from "../../../plugin/types";
import {
  buildFullUrl,
  isClickEvent,
  isNavigationEvent,
  isQueryParamChangeEvent,
} from "../utils";
import { parseSelector } from "../parser/parseSelector";

const EventSteps = ({ event }: { event: ParsedEvent }) => {
  return (
    <>
      {getEventSteps(event).map(({ label, children, sub }) => (
        <Step label={label} sub={sub}>
          {children}
        </Step>
      ))}
    </>
  );
};

export default EventSteps;

interface IStep {
  label: React.ReactNode;
  children: React.ReactNode;
  sub?: React.ReactNode;
}

const getEventSteps = (event: ParsedEvent): IStep[] => {
  if (isNavigationEvent(event)) {
    return [
      {
        label: "visit",
        children: buildFullUrl(event),
      },
    ];
  }

  if (isClickEvent(event)) {
    return [
      {
        label: "get",
        children: parseSelector(event.target.domPath),
      },
      {
        label: "-click",
        children: null,
      },
    ];
  }

  if (isQueryParamChangeEvent(event)) {
    const { param, changed, added, removed } = event;
    let sub = buildFullUrl(event);
    if (changed) {
      sub += ` to include ${param}=${changed}`;
    } else if (added) {
      sub += ` to include ${param}=${added}`;
    } else {
      sub += ` not to include ${param}=${removed}`;
    }
    return [
      {
        label: "url",
        children: null,
      },
      {
        label: (
          <div>
            <span className="cyw-text-emerald-500">-</span>
            <span className="cyw-bg-emerald-500 cyw-text-gray-900 cyw-px-1 cyw-rounded">
              assert
            </span>
          </div>
        ),
        children: (
          <span className="cyw-text-emerald-300 cyw-font-semibold">
            expected
          </span>
        ),
        sub: (
          <span className="cyw-text-emerald-300 cyw-font-semibold">{sub}</span>
        ),
      },
    ];
  }

  return [
    {
      label: event.type,
      children: event.id,
    },
  ];
};
