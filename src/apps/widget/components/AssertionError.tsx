import React from "react";

const AssertionError = ({ message }: { message: string }) => (
  <div>
    <div className="cyw-flex cyw-items-start cyw-p-2 cyw-bg-zinc-800 cyw-text-red-300">
      <div className="cyw-break-keep cyw-mr-4 cyw-ml-6 cyw-text-xs">!</div>
      <div className="cyw-break-all cyw-font-semibold">AssertionError</div>
    </div>
    <div
      style={{ wordBreak: "break-word" }}
      className="cyw-bg-zinc-800 cyw-p-2 cyw-text-red-400 cyw-mt-0.5 cyw-break-words"
    >
      <div className="cyw-ml-6">{message}</div>
    </div>
  </div>
);

export default AssertionError;
