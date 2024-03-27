import React from "react";

const Step = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="cyw-flex cyw-items-start cyw-p-2 hover:cyw-bg-gray-700">
      <div className="cyw-mr-4">1</div>
      <div className="cyw-break-keep cyw-text-slate-100 cyw-font-semibold cyw-mr-4">
        {label}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Step;
