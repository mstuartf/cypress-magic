import React from "react";
import Step from "./Step";
import { ParsedEvent } from "../../../plugin/types";
import { isClickEvent, isNavigationEvent } from "../utils";
import { parseSelector } from "../parser/parseSelector";

const EventSteps = ({ event }: { event: ParsedEvent }) => {
  return (
    <>
      {getEventSteps(event).map(({ label, children }) => (
        <Step label={label}>{children}</Step>
      ))}
    </>
  );
};

export default EventSteps;

interface IStep {
  label: string;
  children: React.ReactNode;
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

  return [
    {
      label: event.type,
      children: event.id,
    },
  ];
};
