import Alias from "./Alias";
import React from "react";
import { RequestEvent } from "../../../plugin/types";

const TriggeredRequest = ({ event }: { event: RequestEvent }) => (
  <div className="cyw-ml-14 cyw-mb-2 cyw-italic cyw-font-semibold">
    <div className="cyw-flex cyw-justify-between cyw-items-center">
      <div className="cyw-flex cyw-items-center">
        <div>(fetch)</div>
        <div className="cyw-ml-4">
          {event.method}&nbsp;&nbsp;{event.status}
        </div>
      </div>
      <div>
        <Alias text={event.alias} />
      </div>
    </div>
    <div className="cyw-mt-0.5">{event.url}</div>
  </div>
);

export default TriggeredRequest;
