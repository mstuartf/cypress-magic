import React from "react";
import Step from "./Step";
import { ParsedEvent } from "../../../plugin/types";
import {
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
    const { protocol, hostname, pathname, port, search } = event;
    return [
      {
        label: "visit",
        children: `${protocol}//${hostname}${
          port.length ? `:${port}` : ""
        }${pathname}${search}`,
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
    const {
      protocol,
      hostname,
      pathname,
      port,
      search,
      param,
      changed,
      added,
      removed,
    } = event;
    let sub = `${protocol}//${hostname}${
      port.length ? `:${port}` : ""
    }${pathname}${search}`;
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
        label: <div>-assert</div>,
        children: "expected",
        sub: <div>{sub}</div>,
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
