import Alias from "./Alias";
import React from "react";
import { RequestEvent } from "../../../plugin/types";

const TriggeredRequest = ({ event }: { event: RequestEvent }) => (
  <div className="cyw-ml-14 cyw-mb-2 cyw-italic cyw-font-semibold">
    <div className="cyw-flex cyw-justify-between cyw-items-center">
      <div className="cyw-flex cyw-items-center">
        <div className="cyw-break-keep">(fetch)</div>
        <div className="cyw-mx-4 cyw-break-keep">
          {event.method.toUpperCase()}&nbsp;&nbsp;{event.status}
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
