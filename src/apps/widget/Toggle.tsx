import React from "react";

const Toggle = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) => (
  <div>
    <label className="cyw-inline-flex cyw-items-center cyw-cursor-pointer">
      <input
        type="checkbox"
        value=""
        className="cyw-sr-only cyw-peer"
        checked={checked}
        onChange={onChange}
      />
      <div className="cyw-relative cyw-w-9 cyw-h-5 cyw-bg-gray-200 peer-focus:cyw-outline-none peer-focus:cyw-ring-4 peer-focus:cyw-ring-blue-300 dark:peer-focus:cyw-ring-blue-800 cyw-rounded-full cyw-peer dark:cyw-bg-gray-700 peer-checked:after:cyw-translate-x-full rtl:peer-checked:after:-cyw-translate-x-full peer-checked:after:cyw-border-white after:cyw-content-[''] after:cyw-absolute after:cyw-top-[2px] after:cyw-start-[2px] after:cyw-bg-white after:cyw-border-gray-300 after:cyw-border after:cyw-rounded-full after:cyw-h-4 after:cyw-w-4 after:cyw-transition-all dark:cyw-border-gray-600 peer-checked:cyw-bg-blue-600"></div>
      <span className="cyw-ms-3 cyw-text-xs cyw-text-gray-900 dark:cyw-text-gray-300">
        {label}
      </span>
    </label>
  </div>
);

export default Toggle;
