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
      <div className="cyw-relative cyw-w-9 cyw-h-5 cyw-bg-slate-300 peer-focus:cyw-outline-none peer-focus:cyw-ring-2 peer-focus:cyw-ring-blue-300 cyw-rounded-full cyw-peer peer-checked:after:cyw-translate-x-full rtl:peer-checked:after:-cyw-translate-x-full peer-checked:after:cyw-border-white after:cyw-content-[''] after:cyw-absolute after:cyw-top-[2px] after:cyw-start-[2px] after:cyw-bg-white after:cyw-border-gray-300 after:cyw-border after:cyw-rounded-full after:cyw-h-4 after:cyw-w-4 after:cyw-transition-all peer-checked:cyw-bg-emerald-500"></div>
      <span className="cyw-ms-3 cyw-text-xs cyw-text-white">{label}</span>
    </label>
  </div>
);

export default Toggle;
