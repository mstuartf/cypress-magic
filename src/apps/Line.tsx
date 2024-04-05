import React from "react";

const Line = ({
  children,
  indent = 0,
}: {
  children: React.ReactNode;
  indent?: number;
}) => (
  <div className="cyw-mb-2 cyw-text-wrap cyw-break-all cyw-flex cyw-group">
    <p className="cyw-text-xs cyw-flex-grow">
      {Array.from({ length: indent }).map(() => (
        <span className="cyw-w-2 cyw-inline-block" />
      ))}
      {children}
    </p>
  </div>
);

export default Line;
