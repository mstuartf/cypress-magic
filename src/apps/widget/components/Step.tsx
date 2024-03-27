import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectEventIdsSorted } from "../redux/selectors";

const Step = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const eventIds = useSelector(selectEventIdsSorted);

  const [stepCount, setStepCount] = useState(0);
  useEffect(() => {
    let count = 1;
    const nodes = Array.prototype.slice.call(
      document.querySelectorAll(".event-step-count")
    ) as Node[];
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i] === ref.current) {
        break;
      }
      count += 1;
    }
    setStepCount(count);
  }, [
    // recalculate whenever the events list changes
    eventIds,
  ]);

  return (
    <div
      className="cyw-flex cyw-items-start cyw-p-2 hover:cyw-bg-gray-700 event-step-count"
      ref={ref}
    >
      <div className="cyw-break-keep cyw-mr-4 cyw-ml-6 cyw-text-gray-500 cyw-text-xs">
        {stepCount}
      </div>
      <div className="cyw-break-all cyw-font-semibold">{children}</div>
    </div>
  );
};

export default Step;
