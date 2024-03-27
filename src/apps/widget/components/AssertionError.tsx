import React from "react";

const AssertionError = ({ message }: { message: string }) => (
  <div>
    <div className="cyw-flex cyw-items-start cyw-p-2 cyw-bg-zinc-800 event-step-count cyw-text-red-300 cyw-border-l-2 cyw-border-red-300">
      <div className="cyw-break-keep cyw-mr-4 cyw-text-xs">!</div>
      <div className="cyw-break-all cyw-font-semibold">AssertionError</div>
    </div>
    <div
      style={{ wordBreak: "break-word" }}
      className="cyw-bg-zinc-800 cyw-p-2 cyw-text-red-400 cyw-border-l-2 cyw-border-red-300 cyw-mt-0.5 cyw-break-words"
    >
      {message}
    </div>
  </div>
);

export default AssertionError;
